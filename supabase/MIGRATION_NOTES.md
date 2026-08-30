# Asentli — expenses/budgets migration (for the backend/DB owner)

The mobile app now records **manual expenses** and a **monthly budget**, keyed
by the **Clerk user id** (auth lives in Clerk, not Supabase Auth).

## What to run

1. **Apply the migration** `migrations/0001_expenses_budgets.sql`
   - SQL Editor: paste and run, **or**
   - CLI: `supabase db push`
   - Creates `public.expenses` and `public.budgets`, enables RLS, adds
     owner-only policies. Idempotent (`if not exists` / `drop policy if exists`).
   - Does **not** touch `usuario`, `compra`, `transaccion`, `billetera`,
     `cashback`, `producto`, etc.

2. **Enable the Clerk → Supabase integration** (one-time, ~3 min):
   - **Clerk Dashboard → Configure → Integrations → Supabase → Activate.**
     Copy the **Clerk domain** it shows
     (for the current dev instance: `helped-tick-1718.clerk.accounts.dev`).
     This makes Clerk session tokens include `"role": "authenticated"`.
   - **Supabase Dashboard → Authentication → Sign In / Providers →
     Third-Party Auth → Add provider → Clerk**, paste that domain.
     - CLI equivalent in `supabase/config.toml`:
       ```toml
       [auth.third_party.clerk]
       enabled = true
       domain  = "helped-tick-1718.clerk.accounts.dev"
       ```

Without step 2, every request from the app returns 401 and the screens stay
empty.

## How rows are scoped to a user

- Every row carries `user_id text` = Clerk's `user.id` (e.g. `user_2abc…`).
- The app sends the Clerk session token as the Supabase access token, so
  inside Postgres `auth.jwt() ->> 'sub'` is that same id.
- RLS policies (`… using ((select auth.jwt() ->> 'sub') = user_id)`) do the
  real enforcement; the app also filters/sets `user_id` explicitly.

## Quick verification (after both steps)

```sql
-- should exist with RLS enabled
select relname, relrowsecurity from pg_class
where relname in ('expenses','budgets');

-- policies present
select tablename, policyname, cmd from pg_policies
where tablename in ('expenses','budgets') order by 1,3;
```

Then in the app: sign in → add an expense → it should appear on Home /
Statistics / Purchase History. In Supabase Table Editor you'll see the row
with your Clerk `user_id`.

## Naming note

These tables use English snake_case (`expenses`, `spent_at`) while the rest of
the schema is Spanish (`compra`, `fecha_compra`). If the team prefers
`gasto` / `presupuesto`, say so and we'll rename before there's data.
