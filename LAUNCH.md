# Tempo — Launch Checklist

Use this list to confirm the product is ready for use and sale.

## User stories (implemented)

- **Clients:** Create (name, email, monthly hours, fee, overage rate, billing day 1–28), edit, archive, dashboard with status and 80%/100% indicators.
- **Time:** Start/stop timer, manual entries, edit/delete entries, totals per client, hours remaining.
- **Monthly reset:** Hours are scoped by month (no rollover); history preserved.
- **Invoices:** Generate (base + overage, line items), mark paid/unpaid, filter by client, PDF/view for you and client portal.
- **Client portal:** UUID link, view-only (hours, entries, invoices, download), no login.
- **Analytics:** MRR, hours committed/used/remaining, projected overage, per-client (avg hours 3 mo, overage frequency, total revenue).
- **Auth:** Sign up, sign in, forgot password (email reset link), set new password.
- **Payments:** Stripe checkout for Pro/Business; manual “mark paid” for invoices.

## Environment variables

See **SETUP.md** for where to get each value and how to configure Google sign-in and the database.

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required.
- `SUPABASE_SERVICE_ROLE_KEY` — required for cron and client portal.
- `CRON_SECRET` — required for cron endpoint (choose a long random secret; set locally and in production).
- `RESEND_API_KEY` — for sending invoices by email (optional).
- `RESEND_FROM` — optional; default `Tempo <onboarding@resend.dev>`.
- Stripe keys and webhook secret — for billing (optional if you leave Stripe for later).

## Auto-generate invoices (cron)

To create invoices automatically on each client’s billing day:

1. Set `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` in your environment.
2. Call daily (e.g. 00:05 UTC) with either:
   - Header: `Authorization: Bearer <CRON_SECRET>`, or
   - Query: `?secret=<CRON_SECRET>`

   Example: `GET https://yourapp.com/api/cron/generate-invoices?secret=YOUR_CRON_SECRET`

3. **Vercel:** In `vercel.json` add:

   ```json
   {
     "crons": [{
       "path": "/api/cron/generate-invoices",
       "schedule": "5 0 * * *"
     }]
   }
   ```

   Then in Vercel project settings, add a cron secret and use it as the Bearer token (e.g. via env `CRON_SECRET` and a small script or serverless that adds the header).

4. **Other:** Use GitHub Actions, cron job, or any scheduler to send the same GET request with `Authorization: Bearer <CRON_SECRET>` once per day.

## Notifications & email

- **In-app notifications:** Table `notifications`; run `supabase/migrations/20250215000000_notifications.sql` in Supabase SQL editor. Alerts for 80% hours, 100% hours, and invoice generated. Bell icon in dashboard header.
- **Send invoice by email:** Resend. Set `RESEND_API_KEY`; optional `RESEND_FROM` (default `Tempo <onboarding@resend.dev>`). Use the Mail icon on an invoice row.

## Optional later

- Stripe Connect / auto-charge clients.
- Email notifications (e.g. send email on 80%/100% in addition to in-app).

## Pre-launch checks

- [ ] Supabase Auth email templates updated (password reset, confirm signup) and redirect URLs allowlisted.
- [ ] Stripe webhook URL and events configured; subscription tiers and limits match (free 1, pro 10, business unlimited).
- [ ] Cron runs daily and `CRON_SECRET` is kept secret and only used for the cron endpoint.
