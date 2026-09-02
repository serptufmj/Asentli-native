# Asentli — expenses/budgets setup (for the backend/DB owner)

The mobile app records **manual expenses** and a **monthly budget**, keyed by
the **Clerk user id** (auth lives in Clerk, not Supabase Auth).

---

## About the `ERROR: 42P07: relation "usuario" already exists`

**That error does not come from `expenses_budgets.sql`.** That script creates
**only** `public.expenses` and `public.budgets` (both with
`create table if not exists`) and touches nothing else — the word `usuario`
appears in it exactly once, inside a comment.

The `usuario` table is **yours** — it was already in the project before any of
this work (columns: `id_usuario, nombre, apellido, correo, telefono,
contrasena, estado, fecha_registro`). It must not be touched.

The error means something replayed a script that does
`create table ... usuario` — almost certainly **`supabase db push` / `supabase
migration up` replaying your own initial migration** because it isn't marked as
applied in the remote migration history.

---

## How to run it (pick ONE)

### Option A — SQL Editor (simplest, recommended)

1. Open **Supabase Dashboard → SQL Editor → New query**.
2. Paste the **entire** contents of `supabase/expenses_budgets.sql`.
3. **Run.** It's idempotent — safe to run again if needed.

That's it. Don't use the CLI for this file.

### Option B — Supabase CLI

Only if your existing schema is already tracked in `supabase/migrations/`.
If `usuario`/`compra`/etc. were created in the dashboard (not via migrations),
first tell the CLI they're already there so it doesn't try to recreate them:

```bash
# mark every existing migration as already applied
supabase migration list                     # see local vs remote
supabase migration repair --status applied <version>   # for each existing one

# then move expenses_budgets.sql into supabase/migrations/ with a timestamp name
# e.g. 20260829180000_expenses_budgets.sql, and:
supabase db push
```

If you're not sure, **use Option A.**

---

## Then: enable the Clerk → Supabase integration (one-time, ~3 min)

Without this, every request from the app returns 401 and the screens stay empty.

1. **Clerk Dashboard → Configure → Integrations → Supabase → Activate.**
   Copy the **Clerk domain** it shows
   (current dev instance: `helped-tick-1718.clerk.accounts.dev`).
   This makes Clerk session tokens include `"role": "authenticated"`.
2. **Supabase Dashboard → Authentication → Sign In / Providers →
   Third-Party Auth → Add provider → Clerk**, paste that domain.
   - CLI equivalent in `supabase/config.toml`:
     ```toml
     [auth.third_party.clerk]
     enabled = true
     domain  = "helped-tick-1718.clerk.accounts.dev"
     ```

---

## How rows are scoped to a user

- Every row carries `user_id text` = Clerk's `user.id` (e.g. `user_2abc…`).
- The app sends the Clerk session token as the Supabase access token, so inside
  Postgres `auth.jwt() ->> 'sub'` is that same id.
- RLS policies (`… using ((select auth.jwt() ->> 'sub') = user_id)`) enforce it;
  the app also filters/sets `user_id` explicitly.

## Verify (after both steps)

```sql
select relname, relrowsecurity from pg_class
where relname in ('expenses','budgets');           -- 2 rows, rowsecurity = true

select tablename, policyname, cmd from pg_policies
where tablename in ('expenses','budgets') order by 1,3;   -- 7 policies
```

Then in the app: sign in → add an expense → it appears on Home / Statistics /
Purchase History, and shows in the Supabase Table Editor with your Clerk `user_id`.

## Naming note

These tables use English snake_case (`expenses`, `spent_at`) while the rest of
the schema is Spanish (`compra`, `fecha_compra`). If the team prefers
`gasto` / `presupuesto`, say so and we'll rename before there's data.
