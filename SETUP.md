# Tempo — Setup Guide

Use this guide to get your own Supabase project, database, Google sign-in, and env vars ready. Values in `.env.local` are **yours** — you must create a Supabase project and get real keys; the repo does not include real secrets.

---

## 1. Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account).
2. **New project**: Create a new project (name, password for the DB, region).
3. In **Project Settings → API** you’ll need:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret; used for cron and portal only).

---

## 2. Enable Google sign-in (fix “Unsupported provider: provider is not enabled”)

Google auth is configured **in Supabase**, not via a separate Google env var in Next.js.

### In Supabase

1. In the Supabase dashboard: **Authentication → Providers**.
2. Find **Google** and turn it **ON**.
3. Supabase will show:
   - **Redirect URL** to use in Google Cloud (e.g. `https://<project-ref>.supabase.co/auth/v1/callback`).
   - Fields for **Client ID** and **Client Secret**.

### In Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
3. Application type: **Web application**.
4. **Authorized redirect URIs**: add the **exact** redirect URL from Supabase (the one shown in Supabase when you enable Google).
5. Create the client and copy **Client ID** and **Client Secret**.
6. Paste them into Supabase **Authentication → Providers → Google** and save.

After this, “Continue with Google” will work; no extra env vars are needed in `.env.local` for Google.

---

## 3. Database setup

The app expects these tables: `users`, `clients`, `time_entries`, `invoices`, `invoice_line_items`, `notifications`.

### Option A: Run migrations in order (recommended)

1. In Supabase: **SQL Editor**.
2. Run the first migration (creates core tables and RLS):
   - Open `supabase/migrations/00000000000000_initial_schema.sql`, copy its contents, paste into the SQL Editor, run.
3. Run the second migration (notifications):
   - Open `supabase/migrations/20250215000000_notifications.sql`, copy its contents, paste into the SQL Editor, run.
4. Run the third migration (user prefs + Stripe columns):
   - Open `supabase/migrations/20250215100000_user_notification_prefs_and_stripe.sql`, copy its contents, paste into the SQL Editor, run.

### Option B: Supabase CLI (if you use it)

From the project root:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### Verify

- In Supabase **Table Editor** you should see: `users`, `clients`, `time_entries`, `invoices`, `invoice_line_items`, `notifications`.
- Sign up or sign in (email or Google); a row should appear in `users` (created by the app on first login/signup).

---

## 4. Environment variables

Use **your own** values. Nothing in the repo is “real” for your production.

| Variable | Where to get it | Used for |
|----------|-----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | App ↔ Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same | Browser/auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Same (service_role key) | Cron, portal API (server-only) |
| `CRON_SECRET` | You invent it (long random string) | Securing `/api/cron/generate-invoices` |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys | Sending invoices by email |
| `RESEND_FROM` | Optional; e.g. `Tempo <onboarding@resend.dev>` | From address for emails. **After you have a domain:** Verify the domain at [resend.com/domains](https://resend.com/domains), then set `RESEND_FROM` to an address on that domain (e.g. `invoices@yourdomain.com`) so you can send to any recipient; until then, Resend only allows sending to your own email. |
| Stripe keys & webhook secret | [Stripe Dashboard](https://dashboard.stripe.com) | Billing (optional at first) |

- **Local:** Put these in `.env.local` (and add `.env.local` to `.gitignore` — it usually is).
- **Production (e.g. Vercel):** Set the same variables in the host’s environment (e.g. Vercel → Project → Settings → Environment Variables).

You do **not** need a separate “Google” env var in Next.js; Google is configured only in Supabase and Google Cloud as above.

---

## 5. CRON_SECRET — where to set it

- **Locally:** Set `CRON_SECRET` in `.env.local` if you want to test the cron endpoint (e.g. `curl "http://localhost:3000/api/cron/generate-invoices" -H "Authorization: Bearer YOUR_SECRET"`).
- **After deployment:** Set `CRON_SECRET` in your production environment (e.g. Vercel project env vars). Your scheduler (Vercel Cron, GitHub Actions, or external cron) must send this same secret (e.g. `Authorization: Bearer <CRON_SECRET>` or `?secret=<CRON_SECRET>`). See **LAUNCH.md** for how to call the cron and how to configure Vercel Cron.

---

## 6. Quick checklist

- [ ] Supabase project created; URL and anon + service_role keys in env.
- [ ] Google provider enabled in Supabase; OAuth client created in Google Cloud; redirect URI and Client ID/Secret set in Supabase.
- [ ] Both SQL migrations run in Supabase (initial schema + notifications).
- [ ] `.env.local` has real Supabase keys and a `CRON_SECRET`; add Resend and Stripe when you need them.
- [ ] After deployment, set the same env vars (including `CRON_SECRET`) in production and configure the cron job.

For launch checks (auth redirect URLs, Stripe webhook, cron), see **LAUNCH.md**.
