create extension if not exists "pgcrypto";

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'backlog' check (status in ('backlog', 'active', 'done')),
  position integer not null default 0,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_user_id_idx on public.customers (user_id);
create index projects_user_id_idx on public.projects (user_id);
create index projects_customer_id_idx on public.projects (customer_id);
create index projects_status_position_idx on public.projects (status, position);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger customers_set_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.customers enable row level security;
alter table public.projects enable row level security;

create policy "Customers are visible to owners"
on public.customers
for select
using (auth.uid() = user_id);

create policy "Customers are insertable by owners"
on public.customers
for insert
with check (auth.uid() = user_id);

create policy "Customers are updatable by owners"
on public.customers
for update
using (auth.uid() = user_id);

create policy "Customers are deletable by owners"
on public.customers
for delete
using (auth.uid() = user_id);

create policy "Projects are visible to owners"
on public.projects
for select
using (auth.uid() = user_id);

create policy "Projects are insertable by owners"
on public.projects
for insert
with check (auth.uid() = user_id);

create policy "Projects are updatable by owners"
on public.projects
for update
using (auth.uid() = user_id);

create policy "Projects are deletable by owners"
on public.projects
for delete
using (auth.uid() = user_id);
