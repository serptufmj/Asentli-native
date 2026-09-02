-- ============================================================================
-- Asentli — expenses + budgets  (manual expense tracking, Clerk-authenticated)
-- ============================================================================
-- HOW TO RUN: paste this whole file into the Supabase SQL Editor and press Run.
--             Do NOT run it through `supabase db push` unless your existing
--             schema (usuario, compra, billetera, ...) is already recorded in
--             migration history — see supabase/MIGRATION_NOTES.md.
--
-- WHAT THIS CREATES:  exactly two tables — public.expenses and public.budgets.
-- WHAT THIS TOUCHES:  nothing else. It does NOT create, alter or drop
--                     `usuario`, `compra`, `transaccion`, `billetera`,
--                     `cashback`, `comercio`, `producto`, `detalle_compra`,
--                     `lista_compra` or `direccion`.
--
-- Safe to run more than once: every statement is guarded
-- (`create table if not exists`, `create index if not exists`,
--  `drop policy if exists` before each `create policy`).
--
-- Auth model: the app sends the Clerk session token as the Supabase access
-- token, so inside Postgres `auth.jwt() ->> 'sub'` is the Clerk user id.
-- Requires the Clerk <-> Supabase third-party auth integration (MIGRATION_NOTES).
-- ============================================================================

-- ------------------------------------------------------------------ expenses
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

-- ------------------------------------------------------------------- budgets
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

-- ------------------------------------------------------------------- verify
-- (optional) run this after: should return 2 rows, both with rowsecurity = true
--   select relname, relrowsecurity
--   from pg_class where relname in ('expenses','budgets');
