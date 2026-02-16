# Tempo — Testing Guide

Use this to verify the main workflow, auto features, security, and Google sign-in.

---

## Automated tests (Vitest)

Run unit tests:

```bash
npm run test
```

Watch mode: `npm run test:watch`

**What’s tested**

- **Notification rules** (`src/lib/notification-rules.test.ts`): When we create 80% vs 100% hour notifications, client status (good / warning / exceeded), percent-used rounding. Covers “on track” (under 80%), “approaching” (80–99%), and “not on track” (100%+).
- Helpers are in `src/lib/notification-rules.ts` and are used by the dashboard and notifications check API.

Adding more tests: put `*.test.ts` or `*.spec.ts` next to your code or in a `__tests__` folder; Vitest will pick them up.

---

## 1. Main user workflow

**Goal:** Sign up → Add client → Log time → Generate invoice → Send email → Client views portal.

1. **Sign up**
   - Go to `/signup`. Create account with email + password (or use Google below).
   - You should land on `/dashboard`.

2. **Add a client**
   - Dashboard → **Clients** → **Add Client**.
   - Fill: Name, Email, Monthly hours (e.g. 20), Monthly fee (e.g. 1200), Overage rate (e.g. 50), Billing day (1–28).
   - Save. Card appears with hours 0/20 and “On track”.

3. **Log time**
   - **Time Tracking** → select the client, enter description, click **Start Timer** → wait or **Stop Timer**.
   - Or **Manual Entry**: client, date, hours (e.g. 2.5), description → **Add**.
   - **Time Entries** list shows the entry. Use pencil to **Edit**, trash to **Delete**.

4. **Generate invoice**
   - **Invoices** → **Generate Invoice** → pick client and billing period (e.g. current month) → **Generate**.
   - Invoice appears with base fee + overage (if any). Use **Mark Paid** / **Mark Unpaid**, **Download** (PDF/view), **Send email** (envelope icon).

5. **Send invoice by email**
   - On an invoice row, click the **Mail** icon.
   - Requires `RESEND_API_KEY` (and optional `RESEND_FROM`). Client receives the invoice HTML by email.
   - If Resend is not configured, you get a “Email is not configured” toast.

6. **Client portal**
   - **Clients** → client card menu → **Copy Portal Link** (or **View Portal**).
   - Open link in incognito or another browser (no login). Client sees: hours used, time entries, next billing date, invoice history, **View / Download** per invoice.

7. **Dashboard & analytics**
   - **Dashboard**: MRR, hours used/remaining, projected overage, client retainer bars (80%/100% badges), recent time entries.
   - **Analytics**: Total revenue, MRR, charts, per-client (avg hours 3 mo, overage months, total revenue).

8. **Notifications**
   - When a client hits 80% or 100% of hours, or when you generate an invoice, an in-app notification is created.
   - Open the **bell** in the top bar: list of notifications, **Mark all read**, click to go to link (e.g. Clients or Invoices).
   - 80%/100% notifications are created when you load the Dashboard (POST `/api/notifications/check` runs).

---

## 2. Auto functionalities

**Invoice generation on billing day**

- Cron: `GET /api/cron/generate-invoices` with `Authorization: Bearer <CRON_SECRET>` or `?secret=<CRON_SECRET>`.
- Run once per day (e.g. 00:05 UTC). It creates invoices for clients whose `billing_day` equals today’s date (1–28).
- **Check:** Set a client’s billing day to today’s date, call the cron (with correct secret), then **Invoices** → invoice for that client and current month should exist.
- Env: `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.

**Notifications**

- **Invoice generated:** Created when you POST create an invoice (manual or cron).
- **80% / 100% hours:** Created when you open the Dashboard (notifications check runs). Ensure the notifications table exists (run `supabase/migrations/20250215000000_notifications.sql` in Supabase).

---

## 3. User creation & security

**User creation**

- **Email signup:** `/signup` → name, email, password. Supabase creates the auth user; we upsert into `users` (id, email, name).
- **Google sign-in:** See section 4. After OAuth redirect, auth callback runs and we upsert `users` with `id`, `email`, and name from `user_metadata.full_name` or email prefix.

**Security checks**

- **Auth:** All dashboard and API routes (except public ones) require a logged-in user. Middleware redirects unauthenticated users to `/login`.
- **Data scope:** APIs filter by `user_id` (from `supabase.auth.getUser()`), so users only see their own clients, time entries, invoices, notifications.
- **Portal:** Client data is loaded by `portal_uuid` only; no auth. Only that client’s hours, entries, and invoices are returned.
- **Cron:** Protected by `CRON_SECRET`; uses service role so it can create invoices for any user. Keep `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` secret and server-only.
- **Validation:** Client create validates monthly_hours > 0, fee/rate ≥ 0, billing_day 1–28. Invoice create validates `billing_period` YYYY-MM and duplicate period.

**Suggested manual checks**

- Log in as User A, create client and invoice. Log in as User B; you should not see A’s clients or invoices.
- Open a client portal link; only that client’s data should appear.

---

## 4. Google sign-in (create account with Google)

**Setup (Supabase)**

1. In Supabase Dashboard: **Authentication** → **Providers** → **Google** → Enable.
2. Add your OAuth Client ID and Secret (from Google Cloud Console).
3. In **Authentication** → **URL Configuration**, set **Site URL** and **Redirect URLs** to include your app (e.g. `https://yourapp.com`, `https://yourapp.com/auth/callback`).
4. In Google Cloud Console, add the redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback` (from Supabase Google provider page).

**Flow**

1. User clicks **Continue with Google** on `/login` or `/signup`.
2. Redirect to Google → user signs in → redirect to Supabase → redirect to your app `/auth/callback?code=...`.
3. Callback exchanges `code` for session and upserts `users` (id, email, name from `user_metadata.full_name` or email).
4. Redirect to `/dashboard`.

**Test**

1. Open `/login` or `/signup`.
2. Click **Continue with Google**.
3. Sign in with a Google account that has not been used before (to test “create account”).
4. You should land on `/dashboard` and your profile (sidebar / avatar dropdown) should show the Google name and email.
5. Create a client and log time; they should be stored under your user and visible only to you.

**If it fails**

- “Auth failed” or redirect to `/login?error=auth_failed`: usually wrong redirect URL in Supabase or Google, or code exchange failed. Check Supabase Auth logs.
- User not in `users` table: check auth callback and RLS so the upsert can run (callback uses the same Supabase client that has the new session, so `auth.uid()` should be set).

---

## Quick checklist

- [ ] Sign up (email) → dashboard.
- [ ] Add client → see card with 0 hours.
- [ ] Log time (timer or manual) → see entry; edit/delete.
- [ ] Generate invoice → see row; mark paid/unpaid; download; send email (if Resend configured).
- [ ] Copy portal link → open in incognito → see hours, entries, invoices, view/download.
- [ ] Dashboard: stats and client bars; bell shows notifications after 80%/100% or invoice generated.
- [ ] Cron: call with secret → invoice created for client with billing_day = today.
- [ ] Google: Continue with Google → dashboard, profile correct.
- [ ] Second user cannot see first user’s data.
