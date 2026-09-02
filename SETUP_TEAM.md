# SETUP_TEAM.md — Configurar el entorno desde cero

Guía para que **cualquier persona nueva** (o vos de nuevo dentro de un mes) deje
la app móvil andando en su computadora, incluida la configuración de Clerk y
Supabase que ya hicimos juntos.

Índice:

1. Para quién es esta guía
2. Cuentas y accesos
3. Paso 1 — Clonar y `npm install`
4. Paso 2 — El archivo `.env`
5. Paso 3 — Configuración Clerk + Supabase (la que ya hicimos)
6. Paso 4 — Google Sign-In en Clerk
7. Paso 5 — Arrancar y probar
8. Errores comunes y solución
9. Checklist final

---

## 1. Para quién es esta guía

Para alguien que:

- Ya tiene **Node.js 18+** y **Git** instalados.
- Tiene un teléfono con la app **Expo Go** (Play Store / App Store).
- Va a trabajar en la **app móvil** (para la landing web, ver `README.md` §5).

No hace falta saber SQL ni haber usado Clerk/Supabase antes.

---

## 2. Cuentas y accesos

| Servicio | Para qué | Cómo conseguir acceso |
|---|---|---|
| **Repositorio Git** | El código | Pedir a un miembro del equipo que te agregue al repo `asentli-native` |
| **Clerk** (<https://dashboard.clerk.com>) | Login/usuarios | Pedir al dueño del proyecto Clerk de Asentli que te invite (Clerk Dashboard → arriba a la derecha → **Members** → Invite). Rol "Admin" o "Developer" |
| **Supabase** (<https://supabase.com/dashboard>) | Base de datos | Pedir al dueño que te invite al proyecto (Supabase Dashboard → proyecto → **Settings → Team → Invite**) |

Con solo mirar los dashboards ya podés copiar las 3 claves del paso 2. Para
**hacer** el paso 3 necesitás rol de admin en ambos.

---

## 3. Paso 1 — Clonar y `npm install`

```bash
# Cloná el repo (usá la URL que te pase el equipo)
git clone <url-del-repo-asentli-native>
cd asentli-native/asentli

npm install
```

> **¿Por qué `npm install` a veces se queja?** El proyecto trae un archivo
> `.npmrc` con `legacy-peer-deps=true`. Eso le dice a npm "no falles si dos
> librerías piden versiones distintas de una tercera". Es **intencional** y npm
> lo respeta solo. Si clonaste bien, no tenés que hacer nada.
> Si igual falla, probá: `npm install --legacy-peer-deps`.

Para la landing web (opcional, otro repo):

```bash
git clone <url-del-repo-Asentli-landing>
cd Asentli   # ...puede haber varias carpetas Asentli anidadas; entrá hasta la
             # que tiene package.json y vite.config.js
npm install
```

---

## 4. Paso 2 — El archivo `.env`

> **`.env`** = un archivo de texto con claves de configuración. **No se sube a
> Git** (está en `.gitignore`) porque tiene valores privados. Cada persona arma
> el suyo copiando la plantilla `.env.example`.

```bash
# En la carpeta asentli/
copy .env.example .env      # Windows
# cp .env.example .env      # Mac/Linux
```

Abrí `.env` y completá **estas 3 variables** (sin comillas, sin espacios):

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_...
```

### De dónde sale cada valor

| Variable | Dónde encontrarla (ruta exacta de menús) |
|---|---|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | **Clerk Dashboard** → elegí el proyecto Asentli → menú izquierdo **Configure** → **API Keys** → copiá **"Publishable key"** (empieza con `pk_test_`) |
| `EXPO_PUBLIC_SUPABASE_URL` | **Supabase Dashboard** → proyecto Asentli → **Settings** (engranaje) → **API** → sección **Project URL** |
| `EXPO_PUBLIC_SUPABASE_KEY` | **Supabase Dashboard** → mismo lugar → **API** → sección **Project API keys** → la clave **pública / publishable** (NO la `service_role`, esa es secreta y nunca va en la app) |

> **`EXPO_PUBLIC_`** es un prefijo obligatorio de Expo: solo las variables con ese
> prefijo llegan al código de la app. Se incrustan **al compilar**, así que cada
> vez que edités `.env` tenés que reiniciar con `npx expo start -c` (paso 5).

⚠️ Nunca pongas en la app la **service_role key** de Supabase ni la
**Secret key** de Clerk. Esas dan acceso total y se filtrarían dentro del
paquete de la app.

---

## 5. Paso 3 — Configuración Clerk + Supabase (la que ya hicimos)

Esto es **de una sola vez por proyecto** (ya está hecho para el proyecto actual).
Documentado para poder rehacerlo si se crea un proyecto nuevo, o para entender
qué pasa si algo se rompe.

El objetivo: que **Supabase confíe en los tokens que emite Clerk**. Sin esto, la
app se loguea bien pero **todas las consultas a la base fallan con 401** y las
pantallas de gastos quedan vacías. (Contexto en `ARCHITECTURE.md` §4.)

Fuente original: `supabase/MIGRATION_NOTES.md`.

### 3.1 — Crear las tablas `expenses` y `budgets`

1. Abrí **Supabase Dashboard → SQL Editor → New query**.
2. Abrí el archivo `supabase/expenses_budgets.sql` del repo y **copiá todo su
   contenido**.
3. Pegalo en el editor y apretá **Run** (botón abajo a la derecha).
4. Debería decir "Success". El script es idempotente: si lo corrés de nuevo, no
   rompe nada.

> ⚠️ **NO uses `supabase db push` ni la CLI de Supabase para este archivo.** Puede
> intentar recrear las tablas heredadas (`usuario`, `compra`...) y tirar el error
> `42P07` (ver sección 8). Usá siempre el **SQL Editor** para este script.

Verificá que quedó bien (pegá y Run):

```sql
select relname, relrowsecurity from pg_class
where relname in ('expenses','budgets');           -- 2 filas, ambas true

select tablename, policyname, cmd from pg_policies
where tablename in ('expenses','budgets') order by 1,3;   -- 7 filas
```

### 3.2 — Activar la integración Clerk → Supabase

En **Clerk**:

1. **Clerk Dashboard** → proyecto Asentli.
2. Menú izquierdo **Configure** → **Integrations**.
3. Buscá **Supabase** en la lista → **Activate** (o "Configure" / "Enable").
4. Clerk te muestra un **"Clerk domain"** tipo
   `helped-tick-1718.clerk.accounts.dev`. **Copiálo**, lo necesitás en 3.3.

> Qué hace esto por debajo: hace que los tokens (JWT) que Clerk emite incluyan
> el campo `"role": "authenticated"`, que es lo que Supabase espera para tratar
> al usuario como "logueado".

### 3.3 — Registrar Clerk como "Third-Party Auth" en Supabase

> **Third-Party Auth** = "autenticación de un tercero". Le decís a Supabase:
> "vas a recibir tokens emitidos por este otro servicio (Clerk); confiá en
> ellos".

En **Supabase**:

1. **Supabase Dashboard** → proyecto Asentli.
2. Menú izquierdo **Authentication**.
3. **Sign In / Providers** (en algunas versiones: **Providers**).
4. Bajá hasta **Third-Party Auth** → **Add provider** → elegí **Clerk**.
5. En el campo **domain** pegá el Clerk domain que copiaste en 3.2
   (`helped-tick-1718.clerk.accounts.dev`).
6. **Save**.

Equivalente por CLI (si el equipo usa `supabase/config.toml`):

```toml
[auth.third_party.clerk]
enabled = true
domain  = "helped-tick-1718.clerk.accounts.dev"
```

### Resumen de los 3 sub-pasos

```
3.1  Supabase SQL Editor  →  correr expenses_budgets.sql   (crea tablas + RLS)
3.2  Clerk   → Configure → Integrations → Supabase → Activate  (copiar domain)
3.3  Supabase → Authentication → Sign In/Providers → Third-Party Auth → Clerk
     → pegar el domain
```

---

## 6. Paso 4 — Google Sign-In en Clerk

El botón "Continuar con Google" (`src/components/GoogleButton.js` +
`src/hooks/useGoogleAuth.js`) usa el flujo **SSO** de Clerk.

Para que funcione:

1. **Clerk Dashboard** → **Configure** → **SSO Connections** (o
   **User & Authentication → Social Connections** según la versión).
2. Activá **Google**.
3. Para desarrollo, Clerk ofrece credenciales de prueba propias ("development
   shared credentials") — alcanza para Expo Go.
4. Para producción hay que poner un Client ID / Secret de Google Cloud propios.
   (Pendiente; anotado en `CHANGELOG.md`.)

No hace falta tocar `.env` para esto: el login con Google va todo por Clerk.

---

## 7. Paso 5 — Arrancar y probar

```bash
cd asentli-native/asentli
npx expo start -c
```

- El `-c` limpia la caché del bundler (necesario después de tocar `.env`).
- Escaneá el **QR** con la cámara (iOS) o desde **Expo Go** (Android).
- El teléfono y la compu deben estar en la **misma red WiFi**.

### Prueba de que todo está conectado

1. En la app: **Sign up** con un correo → te llega un **código de 6 dígitos** →
   verificá.
2. Aceptá los **términos** (pantalla que aparece una sola vez).
3. Tocá el botón **"+"** → **Add Expense** → poné un monto, elegí categoría →
   **Save**.
4. Volvé a **Home**: el gasto debería aparecer en el gráfico y el total.
5. En **Supabase Dashboard → Table Editor → `expenses`**: debería estar la fila,
   con tu `user_id` de Clerk (empieza con `user_`).

Si el paso 4 o 5 falla y las pantallas quedan vacías → casi seguro falta el
**paso 3.2 o 3.3**. Ver sección 8.

---

## 8. Errores comunes y solución

### `ERROR: 42P07: relation "usuario" already exists`

- **Qué significa:** PostgreSQL intentó **crear** una tabla (`usuario`) que ya
  existe.
- **Qué NO lo causa:** el archivo `supabase/expenses_budgets.sql`. Ese script
  solo crea `expenses` y `budgets`, y con `if not exists`. La palabra `usuario`
  aparece ahí una sola vez, en un comentario.
- **Qué lo causa:** correr la **CLI de Supabase** (`supabase db push` /
  `supabase migration up`) que re-ejecuta una migración vieja que crea las tablas
  heredadas, porque esa migración no figura como "aplicada" en el historial
  remoto.
- **Solución:**
  1. Para crear nuestras tablas, usá **siempre el SQL Editor** (paso 3.1), no la
     CLI.
  2. Si necesitás la CLI para otra cosa: marcá las migraciones existentes como
     ya aplicadas antes de hacer `push`:
     ```bash
     supabase migration list
     supabase migration repair --status applied <version>   # por cada una
     ```
  3. La tabla `usuario` **no se toca**. Ver `DATABASE.md` §4.

### Error `401` / las pantallas de gastos quedan vacías

- **Causa:** falta la integración Clerk↔Supabase o el Third-Party Auth
  (pasos 3.2 y 3.3). Supabase recibe el token de Clerk pero no confía en él y
  rechaza todo.
- **Solución:** hacé 3.2 y 3.3. Después, en la app: cerrá sesión y volvé a
  entrar (para obtener un token nuevo con `"role": "authenticated"`).

### `Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (o `..._SUPABASE_...`) al arrancar

- **Causa:** no existe `.env`, o le falta esa variable, o tiene el valor de
  ejemplo (`pk_test_xxx`).
- **Solución:** completá `.env` (paso 2) y reiniciá con `npx expo start -c`.

### "Cambié el `.env` y la app sigue igual"

- **Causa:** las variables `EXPO_PUBLIC_` se incrustan al compilar; el bundler
  tiene la versión vieja en caché.
- **Solución:** cortá el servidor (Ctrl+C) y arrancá con `npx expo start -c`.

### `npm install` falla con `ERESOLVE` / conflictos de peer dependencies

- **Causa:** dos librerías piden versiones distintas de una tercera.
- **Solución:** ya está resuelto por el `.npmrc` (`legacy-peer-deps=true`). Si
  aun así falla, corré `npm install --legacy-peer-deps` explícitamente.

### El QR carga pero la app tira "Network request failed"

- **Causa habitual:** el teléfono y la computadora no están en la misma red, o
  la red bloquea la conexión.
- **Solución:** misma WiFi; si no, probá `npx expo start --tunnel` (más lento
  pero funciona a través de internet).

### Login con Google no abre nada / se queda colgado

- **Causa:** Google no está activado en Clerk (paso 4), o cerraste el navegador
  emergente antes de terminar.
- **Solución:** activá Google en Clerk → SSO Connections. Reintentá sin cerrar
  la ventana del navegador.

---

## 9. Checklist final "entorno listo"

- [ ] `git clone` hecho y estás dentro de `asentli-native/asentli`
- [ ] `npm install` terminó sin errores
- [ ] Existe `.env` con las **3** variables completas (valores reales, no `xxx`)
- [ ] (una vez por proyecto) `expenses_budgets.sql` corrido en el SQL Editor →
      `expenses` y `budgets` existen con RLS y 7 políticas
- [ ] (una vez por proyecto) Clerk → integración Supabase activada
- [ ] (una vez por proyecto) Supabase → Third-Party Auth → Clerk con el domain
- [ ] `npx expo start -c` levanta y el QR abre la app en Expo Go
- [ ] Podés registrarte, aceptar términos, agregar un gasto y verlo en Home
- [ ] La fila del gasto aparece en Supabase → Table Editor → `expenses`
