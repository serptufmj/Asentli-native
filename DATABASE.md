# DATABASE.md — El esquema de datos de Asentli

La base de datos vive en **Supabase** (un PostgreSQL en la nube). Este documento
lista **todas las tablas** y explica qué guarda cada una.

Índice:

1. Cómo leer este documento
2. Cómo está la autenticación (sin Supabase Auth)
3. Tablas **nuevas** (creadas por nosotros): `expenses`, `budgets`
4. Tablas **heredadas** (del compañero): panorama
5. Consulta SQL para obtener el esquema real
6. Políticas de RLS activas
7. Convención de nombres

---

## 1. Cómo leer este documento

Hay **dos grupos** de tablas:

- **Nuevas** — `expenses` y `budgets`. Las creamos nosotros con el archivo
  `supabase/expenses_budgets.sql`. Acá están **documentadas al 100%** porque
  tenemos el SQL.

- **Heredadas** — `usuario`, `compra`, `billetera`, etc. Las creó el compañero
  **antes** de este trabajo, directamente en el panel de Supabase. **Su SQL no
  está en este repositorio.** Documentamos lo que se sabe y, en la sección 5,
  hay una consulta para sacar el esquema real y completar esta doc.

> Concepto rápido — **tabla**: una "hoja" con filas y columnas.
> **columna**: un dato de cada fila (ej. `amount`).
> **fila / registro**: una entrada (ej. un gasto concreto).
> **clave primaria (PK)**: la columna que identifica de forma única cada fila.
> **clave foránea (FK)**: una columna que apunta a la PK de otra tabla (así se
> "relacionan" las tablas).

---

## 2. Cómo está la autenticación (importante)

- **No usamos Supabase Auth.** No existe (ni se toca) el esquema `auth` de
  Supabase para nuestros usuarios.
- El login es de **Clerk**. Ver `ARCHITECTURE.md`.
- El vínculo entre un usuario y sus datos es la columna **`user_id text`** en las
  tablas nuevas, que guarda el id de Clerk (ej. `"user_2abc123XYZ"`).
- Dentro de PostgreSQL, ese mismo id se lee del token con
  `auth.jwt() ->> 'sub'` (ver `ARCHITECTURE.md`, sección 5).

⚠️ Ojo con la confusión: la tabla heredada **`usuario`** tiene su propio
`id_usuario` **numérico** y **no** está conectada a Clerk. Son dos mundos
distintos: `usuario.id_usuario` (viejo, numérico) vs. `expenses.user_id` (nuevo,
texto de Clerk).

---

## 3. Tablas nuevas

Fuente: `supabase/expenses_budgets.sql`. Este script es **idempotente** (se puede
correr varias veces sin romper nada: usa `create table if not exists`, etc.).

### 3.1 `expenses` — cada gasto manual que registra la familia

Qué guarda: una fila por cada gasto que el usuario carga con el botón "+" →
pantalla **Add Expense**.

| Columna | Tipo | Qué es |
|---|---|---|
| `id` | `uuid` (PK) | Identificador único de la fila. Se genera solo (`gen_random_uuid()`) |
| `user_id` | `text` | Id del usuario de Clerk. Es quien "posee" el gasto |
| `amount` | `numeric(12,2)` | Monto. Debe ser **mayor a 0** (`check (amount > 0)`) |
| `category` | `text` | Categoría. Solo puede ser: `'food'`, `'dairy'`, `'meat'` o `'other'` (`check`). Coincide con `src/constants/categories.js` |
| `merchant` | `text` (opcional) | Nombre de la tienda/comercio, texto libre. Ej: "Súper Selectos" |
| `spent_at` | `timestamptz` | Fecha y hora del gasto. Por defecto: el momento de crearlo (`now()`) |
| `source` | `text` | Origen del dato. Hoy siempre `'manual'`. Puede ser `'receipt'` (`check`) — reservado para un futuro escaneo de tickets |
| `note` | `text` (opcional) | Nota libre del usuario |
| `created_at` | `timestamptz` | Cuándo se creó la fila. Por defecto `now()` |

**Índice:** `expenses_user_spent_idx` sobre `(user_id, spent_at desc)`.

> **índice** = una "tabla de contenidos" interna que hace rápidas las búsquedas.
> Este acelera "traé los gastos de tal usuario ordenados por fecha", que es
> justo lo que hacen las pantallas Home, Statistics e Historial.

**Relaciones:** ninguna FK. Se relaciona con "el usuario" solo por el texto de
`user_id` (que apunta a Clerk, no a otra tabla de Supabase).

**Quién la lee/escribe:** `src/hooks/useExpenseData.js`
(`useExpensesInRange`, `useMonthExpenses`, `usePeriodExpenses`,
`useRecentExpenses`, `useAddExpense`).

---

### 3.2 `budgets` — el presupuesto mensual de cada familia

Qué guarda: **una sola fila por usuario** con cuánto piensa gastar por mes. Se
edita en la pantalla **Edit Budget**.

| Columna | Tipo | Qué es |
|---|---|---|
| `user_id` | `text` (**PK**) | Id del usuario de Clerk. Es la clave primaria: por eso solo puede haber **una** fila por usuario |
| `monthly_total` | `numeric(12,2)` | Presupuesto mensual. Debe ser **0 o más** (`check (monthly_total >= 0)`). Por defecto `0` |
| `updated_at` | `timestamptz` | Última vez que se cambió. Por defecto `now()` |

**Por qué `user_id` es la PK:** garantiza "1 usuario = 1 presupuesto" sin
necesidad de lógica extra. Guardar se hace con `upsert` (`insert` o `update`
según exista o no la fila) — ver `useSetBudget` en `useExpenseData.js`.

**Relaciones:** ninguna FK, igual que `expenses`.

---

## 4. Tablas heredadas (del compañero) — panorama

⚠️ **El esquema exacto de estas tablas NO está en el repo.** Lo de abajo es el
propósito **probable** según el nombre y el tipo de app. Para las columnas y
relaciones **reales**, correr la consulta de la sección 5.

De `usuario` sí se conocen las columnas, porque están citadas en
`supabase/MIGRATION_NOTES.md`.

### `usuario` — usuarios del modelo viejo (pre-Clerk)

| Columna | Comentario |
|---|---|
| `id_usuario` | PK numérica |
| `nombre` | |
| `apellido` | |
| `correo` | |
| `telefono` | |
| `contrasena` | Contraseña del sistema viejo. **Con Clerk ya no se usa para login** |
| `estado` | Probablemente activo/inactivo |
| `fecha_registro` | |

> Esta tabla quedó del sistema anterior. Hoy la app **no la lee ni la escribe**.
> No se debe borrar sin acordarlo con el equipo (ver `MIGRATION_NOTES.md`).

### Resto de tablas heredadas (propósito probable)

| Tabla | Probablemente guarda | Se relacionaría con |
|---|---|---|
| `comercio` | Tiendas / supermercados afiliados | `compra`, `producto` |
| `producto` | Catálogo de productos de la canasta básica | `detalle_compra`, `lista_compra` |
| `compra` | Cabecera de una compra (fecha, total, usuario, comercio) | `usuario`, `comercio`, `detalle_compra` |
| `detalle_compra` | Renglones de cada compra (producto, cantidad, precio) | `compra`, `producto` |
| `lista_compra` | Listas de compra armadas por el usuario | `usuario`, `producto` |
| `billetera` | Saldo / "Family Wallet" del usuario | `usuario`, `transaccion` |
| `transaccion` | Movimientos de la billetera (ingresos, pagos) | `billetera` |
| `cashback` | Devoluciones acumuladas por comprar en afiliados | `usuario`, `comercio`, `compra` |
| `direccion` | Direcciones del usuario | `usuario` |

**Diagrama de relaciones probable** (a confirmar con la sección 5):

```
                 usuario (id_usuario)
                 /   |    |     \        \
                /    |    |      \        \
        direccion  billetera  compra   lista_compra  cashback
                     |          |  \        |
                transaccion     |   detalle_compra
                                |        |
                            comercio  producto
```

> Ninguna de estas tablas está conectada a Clerk ni a `expenses`/`budgets`. Si
> algún día se quiere unificar (que un gasto manual sea también una `compra`),
> es una decisión pendiente del equipo — ver `MIGRATION_NOTES.md` ("Naming
> note") y `CHANGELOG.md` (pendientes).

---

## 5. Consulta SQL para obtener el esquema real

Pegá esto en **Supabase Dashboard → SQL Editor → New query → Run**. Completá con
el resultado las tablas de la sección 4.

### 5.1 Todas las tablas y sus columnas

```sql
select
  c.table_name,
  c.ordinal_position as nro,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default
from information_schema.columns c
where c.table_schema = 'public'
order by c.table_name, c.ordinal_position;
```

### 5.2 Claves primarias y foráneas (cómo se relacionan las tablas)

```sql
select
  tc.table_name,
  tc.constraint_type,                 -- PRIMARY KEY o FOREIGN KEY
  kcu.column_name,
  ccu.table_name  as referencia_tabla,
  ccu.column_name as referencia_columna
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
 and tc.table_schema   = kcu.table_schema
left join information_schema.constraint_column_usage ccu
  on tc.constraint_name = ccu.constraint_name
 and tc.table_schema   = ccu.table_schema
where tc.table_schema = 'public'
  and tc.constraint_type in ('PRIMARY KEY', 'FOREIGN KEY')
order by tc.table_name, tc.constraint_type;
```

### 5.3 Qué tablas tienen RLS activada

```sql
select relname as tabla, relrowsecurity as rls_activada
from pg_class
where relnamespace = 'public'::regnamespace
  and relkind = 'r'
order by relname;
```

### 5.4 Todas las políticas de RLS

```sql
select tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd;
```

---

## 6. Políticas de RLS activas

Ver `ARCHITECTURE.md`, sección 6, para qué es RLS.

### 6.1 En las tablas nuevas (sabemos que están activas)

`supabase/expenses_budgets.sql` activa RLS en `expenses` y `budgets` y crea
**7 políticas**. Todas usan la misma regla base:
`(select auth.jwt() ->> 'sub') = user_id`
→ _"solo si el usuario del token es el dueño de la fila"_.

| Tabla | Política | Acción | Qué protege |
|---|---|---|---|
| `expenses` | `expenses_select_own` | `SELECT` (leer) | No podés ver gastos de otra familia |
| `expenses` | `expenses_insert_own` | `INSERT` (crear) | Solo podés crear gastos con **tu** `user_id` |
| `expenses` | `expenses_update_own` | `UPDATE` (editar) | Solo podés editar tus gastos |
| `expenses` | `expenses_delete_own` | `DELETE` (borrar) | Solo podés borrar tus gastos |
| `budgets` | `budgets_select_own` | `SELECT` | Solo ves tu presupuesto |
| `budgets` | `budgets_insert_own` | `INSERT` | Solo creás tu propio presupuesto |
| `budgets` | `budgets_update_own` | `UPDATE` | Solo editás tu presupuesto |

> `budgets` no tiene política de `DELETE`: la app nunca borra un presupuesto,
> solo lo actualiza (`upsert`).

Además, el script hace `grant select, insert, update, delete ... to authenticated`
→ le da esos permisos base al rol `authenticated` (los usuarios logueados), y la
RLS los recorta a "solo lo tuyo".

**Verificar que están bien:**

```sql
-- Deben salir 2 filas, ambas con rowsecurity = true
select relname, relrowsecurity from pg_class
where relname in ('expenses','budgets');

-- Deben salir 7 filas
select tablename, policyname, cmd from pg_policies
where tablename in ('expenses','budgets') order by 1,3;
```

### 6.2 En las tablas heredadas (desconocido)

No sabemos si `usuario`, `compra`, etc. tienen RLS. **Revisalo** con las
consultas 5.3 y 5.4.

⚠️ Si esas tablas **no** tienen RLS y tienen datos reales, la clave pública de
Supabase (que viaja dentro de la app) podría leerlas enteras. Vale la pena
confirmarlo con el equipo aunque la app actual no las use.

---

## 7. Convención de nombres

- **Tablas nuevas:** inglés y `snake_case` → `expenses`, `budgets`, `spent_at`,
  `monthly_total`.
- **Tablas heredadas:** español → `compra`, `fecha_compra`, `id_usuario`.

Es una inconsistencia conocida. Si el equipo prefiere unificar (por ejemplo
`gasto` / `presupuesto`), conviene hacerlo **antes** de que haya datos de
usuarios reales. Está anotado en `supabase/MIGRATION_NOTES.md` y en
`CHANGELOG.md`.
