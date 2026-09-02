# ARCHITECTURE.md — Cómo se conectan las piezas

Este documento explica **cómo viajan los datos** en la app móvil de Asentli y,
sobre todo, **cómo se hablan Clerk y Supabase entre sí**.

Índice:

1. La idea en una frase
2. Diagrama del flujo de datos
3. Quién hace qué: Clerk vs. Supabase
4. El puente entre los dos: el token de Clerk como llave de Supabase
5. Qué es un JWT y qué es `auth.jwt() ->> 'sub'`
6. Qué es RLS (Row Level Security)
7. Cómo se conecta el `user_id` de Clerk con las filas de Supabase
8. El arranque de la app (`RootGate` en `App.js`)
9. Navegación sin librería
10. La landing web: por qué hoy está desconectada
11. Errores típicos que nacen de esta arquitectura

---

## 1. La idea en una frase

**Clerk sabe _quién sos_. Supabase guarda _tus datos_. La app le muestra a Clerk
tu identidad y usa esa misma identidad para pedirle a Supabase solo _tus_ filas.**

---

## 2. Diagrama del flujo de datos

Ejemplo: abrís la pantalla Home y querés ver tus gastos del mes.

```
┌─────────────────────────────────────────────────────────────────────┐
│  TU TELÉFONO (la app)                                                │
│                                                                     │
│   HomeScreen.js                                                      │
│      │  usa el hook useMonthExpenses()                               │
│      ▼                                                               │
│   src/hooks/useExpenseData.js                                        │
│      │  "necesito los gastos del usuario X entre fecha A y fecha B"  │
│      ▼                                                               │
│   src/lib/supabase.js  (el "cliente" de Supabase)                    │
│      │                                                               │
│      │  1. Antes de cada request le pide a Clerk el token de sesión: │
│      │        clerk.session.getToken()                               │
│      ▼                                                               │
└──────┼──────────────────────────────────────────────────────────────┘
       │
       │  2. Manda el request a Supabase con el token de Clerk
       │     en la cabecera  Authorization: Bearer <token>
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SUPABASE (PostgreSQL en la nube)                                    │
│                                                                     │
│   3. Supabase abre el token y lee quién es el usuario:              │
│         auth.jwt() ->> 'sub'   ==   "user_2abc123..."  (id de Clerk)│
│                                                                     │
│   4. La regla RLS de la tabla `expenses` dice:                      │
│         "devolvé solo las filas donde user_id = ese id"             │
│                                                                     │
│   5. Devuelve SOLO tus gastos (nunca los de otra familia)           │
└──────┼──────────────────────────────────────────────────────────────┘
       │
       │  6. Los datos vuelven a la app
       ▼
   react-query los guarda en caché  ──▶  HomeScreen los dibuja
```

**Clerk nunca toca la base de datos. Supabase nunca maneja contraseñas.** Lo
único que comparten es el **token** (paso 1 → 3).

---

## 3. Quién hace qué: Clerk vs. Supabase

| | **Clerk** | **Supabase** |
|---|---|---|
| Rol en Asentli | Usuarios y login | Base de datos |
| Guarda | Correos, contraseñas (hasheadas), sesiones, "aceptó términos" | Gastos, presupuestos, y las tablas heredadas |
| La app le pide | "registrame", "logueame", "mandá código", "cambiá contraseña" | "traé mis gastos", "guardá este gasto", "actualizá mi presupuesto" |
| Código relacionado | `App.js` (`ClerkProvider`), pantallas de auth, `src/hooks/useGoogleAuth.js`, `src/lib/clerkErrors.js` | `src/lib/supabase.js`, `src/hooks/useExpenseData.js`, carpeta `supabase/` |

### ¿Por qué no se solapan?

Supabase **también** trae un sistema de login propio ("Supabase Auth"). **En este
proyecto NO lo usamos.** Elegimos Clerk para el login porque:

- Trae de fábrica verificación por correo, "olvidé mi contraseña" y login con
  Google, con pantallas y correos ya hechos.
- Maneja la sesión en el teléfono de forma segura (`expo-secure-store`).

Y usamos Supabase **solo** por la base de datos porque:

- Ya existía un esquema hecho por el compañero (tablas `usuario`, `compra`,
  `billetera`, etc. — ver `DATABASE.md`).
- Da una API REST automática sobre PostgreSQL, sin escribir un backend.

Entonces: **una sola fuente de verdad para "quién sos" (Clerk)** y **una sola
fuente de verdad para "tus datos" (Supabase)**. No hay dos tablas de usuarios
compitiendo.

---

## 4. El puente entre los dos: el token de Clerk como llave de Supabase

Todo el "pegamento" está en **`src/lib/supabase.js`**:

```js
import { createClient } from '@supabase/supabase-js';
import { getClerkInstance } from '@clerk/clerk-expo';

const clerk = getClerkInstance();

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,      // Supabase NO maneja la sesión...
    autoRefreshToken: false,    // ...eso lo hace Clerk
    detectSessionInUrl: false,
  },
  accessToken: async () => {
    // Antes de CADA request, Supabase llama a esta función
    // y usa lo que devuelva como token.
    try {
      return (await clerk.session?.getToken()) ?? null;
    } catch {
      return null;
    }
  },
});
```

La clave es la opción **`accessToken`**: en vez de que Supabase use su propio
token de login, le decimos "cada vez que vayas a hablar con el servidor, pedile
el token a Clerk". Así el token de Clerk viaja en cada consulta.

Para que Supabase **acepte** ese token de Clerk, hay que hacer una configuración
de una sola vez en los dos dashboards (integración Clerk ↔ Supabase + registrar
Clerk como "Third-Party Auth"). Está documentada paso a paso en `SETUP_TEAM.md`,
paso 3. **Si ese paso falta, todas las consultas devuelven error 401** (ver
sección 11).

---

## 5. Qué es un JWT y qué es `auth.jwt() ->> 'sub'`

> **JWT** (JSON Web Token) = un texto largo, dividido en 3 partes por puntos, que
> contiene datos del usuario **y una firma**. La firma permite a quien lo recibe
> verificar que nadie lo alteró. Es como un carnet plastificado: cualquiera puede
> leer lo que dice, pero no puede falsificarlo sin el sello.

Un token de Clerk, por dentro, tiene un contenido parecido a esto:

```json
{
  "sub": "user_2abc123XYZ",      // "subject": el id del usuario en Clerk
  "role": "authenticated",        // lo agrega la integración Clerk↔Supabase
  "exp": 1730000000               // cuándo vence
}
```

Cuando Supabase recibe ese token, dentro de PostgreSQL puede leer sus campos con
la función `auth.jwt()`. La expresión:

```sql
auth.jwt() ->> 'sub'
```

significa **"del token, dame el campo `sub` como texto"** → es decir, el id del
usuario de Clerk (`"user_2abc123XYZ"`).

`->>` es el operador de PostgreSQL para "sacar este campo de un JSON como texto".

Ese valor es la pieza con la que se arma toda la seguridad (sección 6 y 7).

---

## 6. Qué es RLS (Row Level Security)

> **Traducción:** "seguridad a nivel de fila".

### La analogía

Imaginá una **planilla de Excel gigante y compartida** con los gastos de **todas
las familias** que usan Asentli. Sin protección, cualquiera que se conecte podría
leer la planilla entera.

RLS es como poner un **portero en cada tabla** que, antes de mostrarte cualquier
fila, se pregunta: _"¿esta fila es de esta persona?"_. Si no lo es, esa fila
**no existe** para vos: no la ves, no la podés modificar ni borrar.

Lo importante: **ese portero vive dentro de la base de datos**, no en la app. Aun
si alguien salteara la app y hablara directo con Supabase con el token de otra
persona, seguiría viendo solo las filas de esa persona.

### Cómo se ve en la práctica

En `supabase/expenses_budgets.sql`, para la tabla `expenses`:

```sql
alter table public.expenses enable row level security;   -- "activá el portero"

create policy expenses_select_own on public.expenses
  for select to authenticated                            -- al leer...
  using ((select auth.jwt() ->> 'sub') = user_id);       -- ...solo filas MÍAS
```

Traducido: _"un usuario autenticado solo puede **leer** (`select`) las filas de
`expenses` cuyo `user_id` sea igual al `sub` de su token"_.

Hay una política parecida para insertar, actualizar y borrar. Todas están
listadas en `DATABASE.md`, sección 6.

### Por qué lo usamos

- **Sin RLS**, la clave pública de Supabase (`EXPO_PUBLIC_SUPABASE_KEY`, que va
  dentro de la app y cualquiera puede extraer) daría acceso a **toda** la tabla.
- **Con RLS**, esa misma clave solo sirve para ver **tus propios datos**, porque
  el filtro lo pone la base de datos según tu token.

---

## 7. Cómo se conecta el `user_id` de Clerk con las filas de Supabase

Es una convención simple, no hay magia:

1. Cada fila de `expenses` y `budgets` tiene una columna **`user_id` de tipo
   `text`**.
2. Cuando la app **guarda** un gasto, escribe ahí el id del usuario de Clerk:

   ```js
   // src/hooks/useExpenseData.js  (useAddExpense)
   const { userId } = useAuth();            // "user_2abc123XYZ", viene de Clerk
   await supabase.from('expenses').insert({
     user_id: userId,                       // <-- se guarda tal cual
     amount, category, merchant, spent_at, note, source: 'manual',
   });
   ```

3. Cuando la app **lee**, filtra por ese mismo id: `.eq('user_id', userId)`.
4. Y **además**, la RLS obliga a que ese `user_id` coincida con el token (por si
   la app se equivoca o alguien la evita).

> **Detalle:** no hay una clave foránea (`foreign key`) de `expenses.user_id`
> hacia una tabla de usuarios, porque los usuarios **no viven en Supabase**,
> viven en Clerk. `user_id` es simplemente el texto del id de Clerk.
> Esto es distinto de la tabla heredada `usuario`, que tiene su propio
> `id_usuario` numérico y no está conectada a Clerk. Ver `DATABASE.md`.

---

## 8. El arranque de la app (`RootGate` en `App.js`)

`App.js` decide qué mostrar según el estado de la sesión de Clerk. La función se
llama `RootGate` ("la puerta de entrada"):

```
¿Clerk todavía está cargando la sesión guardada?
      │
      ├─ SÍ  ──▶  <SplashScreen/>   (logo + spinner)
      │
      └─ NO
           │
           ¿Hay sesión iniciada?
                 │
                 ├─ NO  ──▶  <AuthFlow/>
                 │             welcome → signin / signup / forgot
                 │
                 └─ SÍ
                      │
                      ¿El usuario ya aceptó los términos?
                      (se guarda en Clerk: user.unsafeMetadata.acceptedTerms)
                            │
                            ├─ NO  ──▶  <TermsScreen/>  (una sola vez)
                            │
                            └─ SÍ  ──▶  <MainApp/>  (la app de verdad)
```

- `useAuth()` y `useUser()` son hooks de Clerk. Devuelven `isLoaded`,
  `isSignedIn`, `user`, etc.
- "Aceptó términos" se guarda en **Clerk**, no en Supabase, en el campo
  `unsafeMetadata` del usuario (`src/screens/TermsScreen.js`). Así se recuerda en
  todos los dispositivos y para siempre.

  > `unsafeMetadata` = un espacio libre que Clerk da para guardar datos del
  > usuario que la **app** puede escribir. Se llama "unsafe" solo porque el
  > cliente puede modificarlo (no porque sea peligroso); para un checkbox de
  > términos está bien.

---

## 9. Navegación sin librería

La app **no usa** React Navigation ni Expo Router. La navegación es "casera",
hecha con `useState` dentro de `App.js`:

```js
// MainApp mantiene una "pila" (stack) de pantallas visitadas
const [stack, setStack] = useState(['home']);
const screen = stack[stack.length - 1];   // la pantalla actual = la última

const go = (key) => { /* agrega 'key' a la pila, o vuelve a ella si ya estaba */ };
const back = () => { /* quita la última de la pila */ };
```

Cada pantalla recibe funciones por props (`onNavigate`, `onBack`, `onSaved`...) y
las llama para moverse. El mapa completo de qué pantalla lleva a cuál está en
`SCREENS.md`.

> **Ventaja:** simple, cero configuración.
> **Desventaja:** no hay URLs, ni animaciones de transición, ni botón "atrás" del
> sistema Android integrado. Si la app crece, conviene migrar a una librería de
> navegación. Anotado en `CHANGELOG.md` como pendiente.

---

## 10. La landing web: por qué hoy está desconectada

La landing (`C:\Users\rodri\Desktop\Asentli\Asentli\Asentli`) es un proyecto
React + Vite **independiente** con dos páginas:

- **`Landing.jsx`** — página de presentación (hero, "cómo funciona",
  beneficios). El botón "Sign up now" solo navega a `/login`.
- **`Login.jsx`** — un formulario de correo + contraseña que **valida el formato
  y hace `console.log("Login exitoso")`**. No llama a Clerk, no llama a Supabase,
  no crea ninguna sesión.

O sea: la landing **no comparte** ni usuarios ni datos con la app móvil. Es una
maqueta visual. Cuando se quiera conectarla de verdad, lo lógico sería usar
`@clerk/clerk-react` (la versión web de Clerk) y el mismo proyecto de Clerk que
la app, para que un usuario sea el mismo en los dos lados. Anotado como pendiente
en `CHANGELOG.md`.

---

## 11. Errores típicos que nacen de esta arquitectura

| Síntoma | Causa | Solución |
|---|---|---|
| Las pantallas Home / Statistics / Historial se quedan **vacías** o dan **error 401** | Falta la integración Clerk ↔ Supabase / Third-Party Auth. Supabase recibe el token de Clerk pero no confía en él | `SETUP_TEAM.md`, paso 3 (3.2 y 3.3) |
| `Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` al arrancar | No existe `.env`, o falta esa variable | Copiar `.env.example` → `.env` y completar. Reiniciar con `npx expo start -c` |
| Cambié un valor del `.env` y la app sigue igual | Las variables `EXPO_PUBLIC_` se incrustan al compilar | Reiniciar el bundler con `-c` |
| `ERROR: 42P07: relation "usuario" already exists` al correr SQL | Se replicó una migración que recrea tablas heredadas | `SETUP_TEAM.md`, sección "Errores comunes". No usar `supabase db push` para `expenses_budgets.sql` |
| Guardo un gasto y no aparece | Puede que la RLS de `insert` rechace la fila si `user_id` no coincide con el token | Verificar que el usuario esté logueado; revisar políticas en `DATABASE.md` |
