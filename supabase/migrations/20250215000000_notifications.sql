-- Notifications table for in-app alerts (80% hours, 100% hours, invoice generated)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('hours_80', 'hours_100', 'invoice_generated')),
  title text not null,
  body text,
  link text,
  client_id uuid references public.clients(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_created_at on public.notifications(user_id, created_at desc);
create index if not exists notifications_user_id_read_at on public.notifications(user_id, read_at) where read_at is null;

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications (mark read)"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can insert own notifications (via API)"
  on public.notifications for insert
  with check (auth.uid() = user_id);
