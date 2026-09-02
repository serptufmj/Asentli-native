# Asentli

> **Qué es Asentli:** una app de finanzas familiares para El Salvador que aparta
> automáticamente el dinero de la canasta básica y ayuda a la familia a controlar
> el gasto en comida frente a la inflación.

Este documento es la **visión general**. Los detalles están repartidos:

| Archivo | Para qué |
|---|---|
| `README.md` (este) | Qué es, con qué está hecho, cómo correrlo |
| `ARCHITECTURE.md` | Cómo se conectan Clerk y Supabase entre sí |
| `DATABASE.md` | Todas las tablas de la base de datos |
| `SETUP_TEAM.md` | Guía paso a paso para configurar el entorno desde cero |
| `SCREENS.md` | Catálogo de pantallas y mapa de navegación |
| `CHANGELOG.md` | Qué se construyó y en qué orden |

---

## 1. Los dos proyectos de un vistazo

Asentli son **dos proyectos separados**, en **dos carpetas distintas** y **dos
repositorios Git distintos**:

| Proyecto | Carpeta | Repo Git | Estado |
|---|---|---|---|
| **App móvil** | `C:\Users\rodri\Desktop\asentli-native\asentli` | `asentli-native` | Activo. Es lo que estamos desarrollando |
| **Landing web** | `C:\Users\rodri\Desktop\Asentli\Asentli\Asentli` | `Asentli` (otro) | Muy básica. Página de presentación + un login de mentira |

> **App móvil** = la aplicación que se instala en el teléfono.
> **Landing web** = la página de internet que se abre en el navegador para
> presentar el producto (todavía no hace nada real).

**Toda esta documentación vive en el repo de la app móvil.** La landing web se
menciona donde corresponde, pero el foco es la app.

---

## 2. Stack tecnológico (y por qué cada pieza)

> **Stack** = el conjunto de herramientas y librerías con las que está hecho el
> proyecto.

### App móvil

- **React Native** — librería para escribir apps de teléfono (Android y iOS) con
  el mismo lenguaje que una web (JavaScript). En vez de `<div>` usás `<View>`, en
  vez de `<p>` usás `<Text>`. Un solo código para los dos sistemas operativos.

- **Expo** (versión 57) — una capa encima de React Native que te evita instalar
  Android Studio / Xcode para empezar. Trae un servidor de desarrollo y una app
  llamada **Expo Go** que corre tu código en el teléfono real al instante.
  ⚠️ Expo 57 es reciente y cambió mucho respecto a versiones anteriores; la doc
  oficial exacta es <https://docs.expo.dev/versions/v57.0.0/>.

- **Clerk** (`@clerk/clerk-expo`) — servicio de **usuarios y login**. Se encarga
  de registro, inicio de sesión, verificación por correo, "olvidé mi contraseña"
  y login con Google. No guardamos contraseñas nosotros: las guarda Clerk.
  Ver `ARCHITECTURE.md`.

- **Supabase** (`@supabase/supabase-js`) — nuestra **base de datos** (una base de
  datos PostgreSQL en la nube, con una API lista para usar).
  ⚠️ En este proyecto Supabase se usa **solo como base de datos**, NO para el
  login. El login es 100% de Clerk. Ver `ARCHITECTURE.md`.

- **react-query** (`@tanstack/react-query`) — librería para **traer datos del
  servidor y mantenerlos frescos**. En vez de escribir a mano "mostrá cargando /
  pedí los datos / guardá el resultado / si falla reintentá", react-query lo hace
  por vos con un `hook`. También guarda en memoria (caché) lo ya pedido para no
  volver a pedirlo. Nuestros hooks están en `src/hooks/useExpenseData.js`.

  > **hook** = una función de React cuyo nombre empieza con `use...`. Sirve para
  > "engancharte" a funcionalidades de React (estado, datos, etc.) desde un
  > componente.

- **react-native-svg** — para dibujar gráficos (la dona de gastos en
  Statistics). React Native no trae SVG de fábrica.

- **expo-linear-gradient**, **expo-secure-store**, **expo-web-browser**,
  **expo-auth-session**, **expo-crypto** — piezas de Expo que usa Clerk por
  debajo: degradados de color en las pantallas, guardar el token de sesión de
  forma segura en el teléfono, y abrir el navegador para el login con Google.

- **@react-native-community/datetimepicker** — el selector de fecha nativo, usado
  en "Agregar gasto".

### Landing web

- **React** + **Vite** — Vite es el "bundler" (empaquetador) y servidor de
  desarrollo para web. Equivale a lo que Expo hace para móvil.
- **react-router-dom** — navegación entre páginas web por URL (`/` y `/login`).

### Heredado / sin usar (se puede ignorar)

- **firebase** — figura en `package.json` y en `src/screens/registro.js`, pero
  **ya no se usa**: Clerk lo reemplazó. `registro.js` ni siquiera compila
  (importa `../config/firebase`, archivo que no existe). Ver sección 6.

---

## 3. Estructura de carpetas

```
asentli/
├── App.js                  # Punto de entrada. Providers + navegación + "auth gate"
├── index.js                # Registra App.js con Expo (no se toca)
├── app.json                # Config de Expo (nombre, ícono, plugins)
├── .env                    # Claves reales (NO se sube a Git)
├── .env.example            # Plantilla de .env (sí se sube)
├── .npmrc                  # legacy-peer-deps=true (ver SETUP_TEAM.md)
│
├── assets/                 # Imágenes: logo, íconos de la app, PNGs de pantallas
│
├── src/
│   ├── screens/            # Una pantalla = un archivo. Ej: HomeScreen.js
│   │
│   ├── components/         # Piezas de UI reutilizables entre pantallas:
│   │   ├── ScreenHeader.js #   encabezado (flecha atrás + título + campana)
│   │   ├── BottomNav.js    #   barra inferior de 4 pestañas
│   │   ├── Fab.js          #   botón flotante "+"
│   │   ├── EmptyState.js   #   mensaje "todavía no hay datos"
│   │   ├── GoogleButton.js #   botón "Continuar con Google"
│   │   └── ui.js           #   SearchBar, Chips, ProgressBar, PillButton, Thumb...
│   │
│   ├── lib/                # Código de "infraestructura", sin UI:
│   │   ├── supabase.js     #   crea el cliente de Supabase con el token de Clerk
│   │   ├── queryClient.js  #   configura react-query
│   │   ├── clerkErrors.js  #   traduce errores de Clerk a mensajes en español
│   │   ├── dates.js        #   helpers de fechas y formato de dinero ($1,234.56)
│   │   └── expenseMath.js  #   sumar gastos, agrupar por categoría, etc.
│   │
│   ├── hooks/              # Hooks propios:
│   │   ├── useExpenseData.js  # leer/escribir gastos y presupuesto en Supabase
│   │   └── useGoogleAuth.js   # login con Google vía Clerk
│   │
│   ├── constants/
│   │   └── categories.js   # las 4 categorías de gasto (food, dairy, meat, other)
│   │
│   └── theme/
│       └── colors.js       # todos los colores de la app en un solo lugar
│
└── supabase/
    ├── expenses_budgets.sql  # el SQL que crea las tablas expenses y budgets
    └── MIGRATION_NOTES.md    # notas para quien administra la base de datos
```

> Nota: existen `src/screens/registro.js`, `src/screens/walletdetails.js` y
> `src/screens/LandingPage.js` que son restos de versiones viejas y **no se usan**
> (no están importados en `App.js`). Ver sección 6.

---

## 4. Correr la app móvil desde cero

Guía rápida. La versión completa (con las cuentas y la config de Clerk/Supabase)
está en `SETUP_TEAM.md`.

### Requisitos

1. **Node.js** 18 o más nuevo (`node --version` para comprobar).
2. La app **Expo Go** instalada en tu teléfono (Play Store / App Store).
3. El teléfono y la computadora en la **misma red WiFi**.

### Pasos

```bash
# 1. Pararse en la carpeta del proyecto
cd C:\Users\rodri\Desktop\asentli-native\asentli

# 2. Instalar dependencias
npm install
#    (El proyecto tiene un .npmrc con legacy-peer-deps=true para que npm no
#     falle por conflictos de versiones entre librerías. Es intencional.)

# 3. Crear el archivo .env
copy .env.example .env
#    Luego abrí .env y pegá las 3 claves reales (ver SETUP_TEAM.md, paso 2).
```

`.env` tiene que quedar así (con valores reales, no `xxx`):

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_...
```

> **¿Qué es `EXPO_PUBLIC_`?** Es un prefijo obligatorio de Expo. Solo las
> variables que empiezan con `EXPO_PUBLIC_` quedan disponibles dentro del código
> de la app. Se "incrustan" al compilar, así que **si cambiás el `.env` tenés que
> reiniciar** el servidor (paso 4) con la opción `-c`.

```bash
# 4. Arrancar el servidor de desarrollo, limpiando la caché
npx expo start -c
```

Se abre una página con un **código QR**. Escaneálo con la cámara del teléfono
(iOS) o desde la app Expo Go (Android). La app se carga en el teléfono y se
recarga sola cada vez que guardás un archivo.

> El `-c` borra la caché del "bundler" (el programa que junta todo tu código en
> un solo archivo que el teléfono puede leer). Usalo siempre que cambies `.env` o
> veas comportamiento raro.

---

## 5. Correr la landing web desde cero

```bash
cd C:\Users\rodri\Desktop\Asentli\Asentli\Asentli
npm install
npm run dev
```

Abre un servidor local (normalmente <http://localhost:5173>). No necesita `.env`
ni cuentas: hoy la landing no se conecta a nada. Ver `ARCHITECTURE.md`, sección
"La landing web".

---

## 6. Código heredado que se puede ignorar

Restos de cuando la app usaba Firebase para el login, antes de pasar a Clerk:

| Archivo / paquete | Qué es | Por qué se puede ignorar |
|---|---|---|
| `firebase` (en `package.json`) | SDK de Firebase | Ya no se importa desde ningún archivo vivo |
| `src/screens/registro.js` | Pantalla de registro con Firebase | **No compila** (importa `../config/firebase`, que no existe). No está en `App.js` |
| `src/screens/walletdetails.js` | Pantalla vieja de "detalle de billetera" | No está importada en `App.js`. Además su función se llama `HomeScreen` por error |
| `src/screens/LandingPage.js` | — | Archivo **vacío** |

No los borramos todavía para no romper nada por accidente, pero **no forman parte
de la app**. Ver `CHANGELOG.md`, Etapa 3.

---

## 7. Glosario rápido

| Término | En una línea |
|---|---|
| **Expo** | Herramienta que corre tu código React Native en el teléfono sin instalar Android Studio |
| **bundler** | Programa que junta todos tus archivos `.js` en uno solo que el teléfono puede ejecutar |
| **componente** | Una función que devuelve un pedazo de interfaz (una pantalla, un botón, una tarjeta) |
| **hook** | Función `use...` de React para usar estado, datos o efectos dentro de un componente |
| **provider** | Componente que "envuelve" a toda la app para darle acceso a algo (Clerk, react-query) |
| **endpoint** | Una URL del servidor a la que le pedís o le mandás datos |
| **JWT / token** | Un texto largo y firmado que prueba "soy tal usuario". Clerk lo genera; Supabase lo lee. Ver `ARCHITECTURE.md` |
| **RLS** | Reglas dentro de la base de datos que deciden qué filas puede ver cada usuario. Ver `ARCHITECTURE.md` |
| **caché** | Copia en memoria de datos ya pedidos, para no volver a pedirlos |
