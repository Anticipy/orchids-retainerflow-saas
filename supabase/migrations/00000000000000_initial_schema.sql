-- Tempo: initial schema (run this first in Supabase SQL Editor)
-- Then run 20250215000000_notifications.sql

-- Users (mirrors auth.users; upserted on signup/OAuth)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  subscription_tier text not null default 'free',
  stripe_account_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own row"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own row"
  on public.users for update
  using (auth.uid() = id);

create policy "Service and insert on signup"
  on public.users for insert
  with check (true);

-- Clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  monthly_hours numeric not null check (monthly_hours > 0),
  monthly_fee numeric not null check (monthly_fee >= 0),
  overage_rate numeric not null check (overage_rate >= 0),
  billing_day int not null default 1 check (billing_day >= 1 and billing_day <= 28),
  status text not null default 'active' check (status in ('active', 'archived')),
  portal_uuid uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_user_id on public.clients(user_id);
create index if not exists clients_portal_uuid on public.clients(portal_uuid);

alter table public.clients enable row level security;

create policy "Users can manage own clients"
  on public.clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Time entries
create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  date date not null,
  hours numeric not null check (hours >= 0),
  description text,
  is_running boolean not null default false,
  started_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists time_entries_user_id on public.time_entries(user_id);
create index if not exists time_entries_client_id_date on public.time_entries(client_id, date);

alter table public.time_entries enable row level security;

create policy "Users can manage own time entries"
  on public.time_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  billing_period text not null,
  base_fee numeric not null,
  overage_hours numeric not null default 0,
  overage_amount numeric not null default 0,
  total_amount numeric not null,
  status text not null default 'unpaid' check (status in ('unpaid', 'paid')),
  due_date date,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(client_id, billing_period)
);

create index if not exists invoices_user_id on public.invoices(user_id);
create index if not exists invoices_client_id on public.invoices(client_id);

alter table public.invoices enable row level security;

create policy "Users can manage own invoices"
  on public.invoices for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Invoice line items
create table if not exists public.invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  date date not null,
  description text,
  hours numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists invoice_line_items_invoice_id on public.invoice_line_items(invoice_id);

alter table public.invoice_line_items enable row level security;

create policy "Users can manage line items of own invoices"
  on public.invoice_line_items for all
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id and i.user_id = auth.uid()
    )
  );
