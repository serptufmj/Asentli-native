-- Asentli — manual expense tracking (Clerk-authenticated, no Supabase Auth)
--
-- These two tables are INTENTIONALLY separate from the existing
-- compra / transaccion / billetera / cashback model:
--   * they are keyed by the Clerk user id (text), not usuario.id_usuario (int)
--   * expenses allow a free-text merchant and a spending category
--   * manual entry only for now; `source` is ready for a future receipt/OCR flow
-- Converging them with `compra` is a later decision for the team.
--
-- Auth model: the mobile app sends the Clerk session token as the Supabase
-- access token. Inside Postgres, `auth.jwt() ->> 'sub'` is the Clerk user id.
-- Requires the Clerk <-> Supabase third-party auth integration to be enabled
-- (see MIGRATION_NOTES / the message that came with this file).

-- ============================================================ expenses
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,                                   -- Clerk user id ("user_xxx")
  amount      numeric(12,2) not null check (amount > 0),
  category    text not null check (category in ('food','dairy','meat','other')),
  merchant    text,                                            -- store / comercio, free text
  spent_at    timestamptz not null default now(),              -- expense date (defaults to now)
  source      text not null default 'manual' check (source in ('manual','receipt')),
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists expenses_user_spent_idx
  on public.expenses (user_id, spent_at desc);

alter table public.expenses enable row level security;

grant select, insert, update, delete on public.expenses to authenticated;

drop policy if exists expenses_select_own on public.expenses;
create policy expenses_select_own on public.expenses
  for select to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists expenses_insert_own on public.expenses;
create policy expenses_insert_own on public.expenses
  for insert to authenticated
  with check ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists expenses_update_own on public.expenses;
create policy expenses_update_own on public.expenses
  for update to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists expenses_delete_own on public.expenses;
create policy expenses_delete_own on public.expenses
  for delete to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);

-- ============================================================ budgets
create table if not exists public.budgets (
  user_id       text primary key,                              -- Clerk user id
  monthly_total numeric(12,2) not null default 0 check (monthly_total >= 0),
  updated_at    timestamptz not null default now()
);

alter table public.budgets enable row level security;

grant select, insert, update, delete on public.budgets to authenticated;

drop policy if exists budgets_select_own on public.budgets;
create policy budgets_select_own on public.budgets
  for select to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists budgets_insert_own on public.budgets;
create policy budgets_insert_own on public.budgets
  for insert to authenticated
  with check ((select auth.jwt() ->> 'sub') = user_id);

drop policy if exists budgets_update_own on public.budgets;
create policy budgets_update_own on public.budgets
  for update to authenticated
  using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);
