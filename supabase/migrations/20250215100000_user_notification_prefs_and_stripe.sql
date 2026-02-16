-- User notification preferences and Stripe-related columns (for webhook/checkout)
-- Run after initial_schema. Safe to run if some columns already exist (ignore errors for those).

alter table public.users
  add column if not exists stripe_customer_id text,
  add column if not exists subscription_status text default 'active',
  add column if not exists notify_email_80 boolean not null default true,
  add column if not exists notify_email_100 boolean not null default true,
  add column if not exists notify_email_invoice boolean not null default true;
