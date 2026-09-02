# SCREENS.md — Catálogo de pantallas y navegación

Todas las pantallas de la app móvil, qué muestran, de dónde sacan los datos, y
cómo se llega de una a otra.

Índice:

1. Cómo funciona la navegación
2. Leyenda de origen de datos
3. Mapa de navegación (diagrama)
4. Pantallas de autenticación (fuera de sesión)
5. Pantallas principales (barra inferior)
6. Pantallas secundarias
7. Tabla resumen: pantalla → origen de datos
8. Componentes compartidos
9. La landing web (repo aparte)
10. Pantallas heredadas / sin usar

---

## 1. Cómo funciona la navegación

- No hay librería de navegación. Todo se decide en **`App.js`** con `useState`.
- **Fuera de sesión**: `AuthFlow` alterna entre `welcome`, `signin`, `signup`,
  `forgot` con una variable de estado.
- **Dentro de sesión**: `MainApp` mantiene una **pila** (`stack`) de pantallas.
  `go('card')` apila una pantalla; `back()` la desapila.
- Cada pantalla recibe **funciones por props** para moverse: `onBack`,
  `onNavigate`, `onSaved`, `onOpenStore`, etc.
- La **barra inferior** (`BottomNav`) siempre tiene las mismas 4 pestañas:
  **Home, Statistics, Basket, Profile**.

Detalle técnico en `ARCHITECTURE.md`, sección 9.

---

## 2. Leyenda de origen de datos

| Símbolo | Significa |
|---|---|
| 🟢 **Supabase** | Los datos vienen de la base de datos (tablas `expenses` / `budgets`) |
| 🔵 **Clerk** | Los datos vienen del usuario logueado (nombre, correo, sesión, "aceptó términos") |
| 🟠 **Hardcodeado** | Los datos están **escritos a mano en el código**. No son reales todavía |
| 🟢+🟠 | Mezcla: parte real, parte de ejemplo |

---

## 3. Mapa de navegación (diagrama)

### Fuera de sesión

```
                 ┌──────────────┐
                 │ SplashScreen │  (mientras Clerk carga la sesión guardada)
                 └──────┬───────┘
                        ▼
                 ┌──────────────┐
                 │ WelcomeScreen│
                 └──┬────────┬──┘
              Sign up│        │Sign in
                     ▼        ▼
          ┌──────────────┐  ┌──────────────┐
          │ SignUpScreen │  │ LoginScreen  │
          │  (form →     │  └──┬────────┬──┘
          │   código)    │     │        │ "Forgot password?"
          └──────┬───────┘     │        ▼
                 │      "Sign  │   ┌─────────────────────┐
                 │       up"◄──┘   │ ForgotPasswordScreen│
                 │                 │  (correo → código   │
                 │                 │   → nueva contraseña)│
                 │                 └─────────┬───────────┘
                 │                           │ ← volver
                 ▼                           ▼
        ┌───────────────────────────────────────────┐
        │  Sesión iniciada en Clerk                  │
        └───────────────────┬───────────────────────┘
                            ▼
                   ¿aceptó términos?
                    │no            │sí
                    ▼              │
             ┌──────────────┐      │
             │ TermsScreen  │──────┤ (al aceptar)
             └──────────────┘      ▼
                            ┌──────────────┐
                            │  HomeScreen  │
                            └──────────────┘
```

### Dentro de sesión

```
                         ╔═══════════ BottomNav (en casi todas) ═══════════╗
                         ║   Home  ·  Statistics  ·  Basket  ·  Profile    ║
                         ╚════════════════════════════════════════════════╝

  HomeScreen ──"+"──────────────▶ AddExpenseScreen ──(guardar)──▶ HomeScreen
     │  ├─ "AI Assistant" ──────▶ AIAssistantScreen
     │  ├─ "My Card" ───────────▶ CardScreen
     │  ├─ tarjeta presupuesto ─▶ BudgetDetailsScreen
     │  ├─ "Affiliated Stores" ─▶ AffiliatedBusinessesScreen
     │  ├─ banner "Oferta" ─────▶ AvailableOffersScreen
     │  └─ campana 🔔 ──────────▶ NotificationsScreen

  CardScreen
     ├─ "Pay basket" ───────────▶ BasketScreen
     ├─ "Compare prices" ───────▶ PriceComparerScreen
     ├─ "Cashback" ─────────────▶ RewardsScreen
     └─ "See all" movimientos ──▶ PurchaseHistoryScreen

  StatisticsScreen
     ├─ "View purchase history" ▶ PurchaseHistoryScreen
     └─ "See your cashback" ────▶ RewardsScreen

  BudgetDetailsScreen ──"Edit/Set Budget"──▶ EditBudgetScreen ──(guardar)──▶ BudgetDetailsScreen

  BasketScreen
     ├─ ícono carrito ─────────▶ ShoppingStoreScreen
     ├─ "Price comparator" ────▶ PriceComparerScreen
     └─ "Weekly goal" ─────────▶ BudgetDetailsScreen

  AffiliatedBusinessesScreen ──(tocar un comercio)──▶ DiscountsOffersScreen
  AvailableOffersScreen ───────(tocar una oferta)───▶ DiscountsOffersScreen
  PriceComparerScreen ─────────"Open store"─────────▶ ShoppingStoreScreen
  RewardsScreen ───────────────"Browse the store"──▶ ShoppingStoreScreen
  DiscountsOffersScreen ───────"View more"──────────▶ AvailableOffersScreen
  AIAssistantScreen ───────────"Ver la comparación"▶ PriceComparerScreen

  Casi todas las pantallas secundarias:  campana 🔔 ──▶ NotificationsScreen
  ProfileScreen ──"Sign out"──▶ (cierra sesión en Clerk → vuelve a WelcomeScreen)
```

---

## 4. Pantallas de autenticación (fuera de sesión)

### `SplashScreen.js` — 🔵 Clerk
- **Muestra:** logo de Asentli + spinner.
- **Cuándo:** al abrir la app en frío, mientras Clerk restaura la sesión
  guardada. Desaparece sola.

### `WelcomeScreen.js` — 🟠 Hardcodeado
- **Muestra:** logo, "ASENTLI / FINTECH FAMILIAR", botones **Sign up** y
  **Sign in**.
- **Datos:** ninguno.

### `SignUpScreen.js` — 🔵 Clerk
- **Muestra:** formulario correo + contraseña; luego pantalla para el **código de
  6 dígitos** que Clerk manda por correo. Botón **"Continuar con Google"**.
- **Qué hace:** `signUp.create()` → `prepareEmailAddressVerification()` →
  `attemptEmailAddressVerification()` → activa la sesión.
- **Errores:** se traducen a español en `src/lib/clerkErrors.js`.

### `LoginScreen.js` — 🔵 Clerk
- **Muestra:** correo + contraseña, link "Forgot password?", botón Google.
- **Qué hace:** `signIn.create({ identifier, password })` → activa sesión.

### `ForgotPasswordScreen.js` — 🔵 Clerk
- **Muestra:** paso 1 pide el correo; paso 2 pide el código + la nueva
  contraseña.
- **Qué hace:** `signIn.create({ strategy: 'reset_password_email_code' })` →
  `attemptFirstFactor()`. Al terminar, queda logueado con la contraseña nueva.

### `TermsScreen.js` — 🔵 Clerk
- **Muestra:** términos y condiciones + checkbox "acepto".
- **Qué hace:** al aceptar, guarda en el usuario de Clerk
  `unsafeMetadata.acceptedTerms = true`. Por eso solo aparece **una vez**.
- **Datos:** el texto de los términos está 🟠 hardcodeado.

---

## 5. Pantallas principales (barra inferior)

### `HomeScreen.js` — 🟢+🟠
- **Muestra:**
  - Tarjeta "Household budget": total gastado en el mes + gráfico de 4 barras
    semanales → **🟢 Supabase** (`useMonthExpenses`, `useBudget`).
  - Botones "AI Assistant" y "My Card".
  - "Affiliated Stores" con una tienda de ejemplo (Súper Selectos) → **🟠**.
  - Banner "Oferta del día" → **🟠**.
- **Navega a:** addExpense (botón "+"), ai, card, budgetDetails, affiliated,
  availableOffers, notifications.

### `StatisticsScreen.js` — 🟢
- **Muestra:** selector Weekly/Monthly/Yearly; total gastado; **dona** de gasto
  por categoría (dibujada con `react-native-svg`); leyenda con %; texto
  "gastaste $X más/menos que el período anterior"; tips.
- **Datos:** `usePeriodExpenses(period)` — trae el período actual y el anterior
  para comparar. Cálculos en `src/lib/expenseMath.js`.
- **Navega a:** purchaseHistory, rewards.

### `BasketScreen.js` — 🟠 Hardcodeado
- **Muestra:** buscador, chips de categoría, lista de productos con precios,
  comparador de precios entre 2 tiendas, meta semanal.
- **Datos:** todo escrito a mano (`SECTIONS`, `COMPARATOR`).
- **Navega a:** shoppingStore, priceComparer, budgetDetails.

### `ProfileScreen.js` — 🔵 Clerk + 🟠
- **Muestra:** nombre y correo del usuario (**🔵** `useUser`); menús "Account",
  "Security & support" (**🟠** listas fijas, no funcionales); switch Face ID
  (**🟠**, no hace nada); botón **Sign out**.
- **Qué hace:** "Sign out" → `signOut()` de Clerk → la app vuelve a Welcome.

---

## 6. Pantallas secundarias

### `CardScreen.js` — 🟢+🟠
- **Muestra:** tarjeta de débito visual (número, titular, vencimiento → **🟠**);
  "Available Balance" = presupuesto − gastado (**🟢**); ingresos = $0 (**🟠**);
  gastos del mes (**🟢**); "Basic Basket Progress" 75% (**🟠**); "Recent
  Movements" = últimos 5 gastos reales (**🟢** `useRecentExpenses(5)`).
- **Navega a:** basket, priceComparer, rewards, purchaseHistory.

### `AIAssistantScreen.js` — 🟠 Hardcodeado
- **Muestra:** burbuja de saludo, "Predicción de gastos semanales" (gráfico de
  barras fijo), un mensaje del "asistente", input de chat (no envía nada).
- **Datos:** todo de ejemplo. No hay IA conectada.
- **Navega a:** priceComparer.

### `AddExpenseScreen.js` — 🟢 Supabase (escritura)
- **Muestra:** monto, selector de categoría (las 4 de `categories.js`), tienda
  (con sugerencias de `KNOWN_MERCHANTS`), fecha (selector nativo), nota.
- **Qué hace:** `useAddExpense()` → `insert` en la tabla `expenses` con tu
  `user_id` de Clerk. Al guardar, vuelve a Home.

### `EditBudgetScreen.js` — 🟢 Supabase (lectura + escritura)
- **Muestra:** un campo para el presupuesto mensual, precargado con el valor
  actual.
- **Qué hace:** `useBudget()` para leer, `useSetBudget()` para guardar (`upsert`
  en `budgets`). Al guardar, va a Budget Details.

### `BudgetDetailsScreen.js` — 🟢 Supabase
- **Muestra:** presupuesto disponible (total − gastado), asignado vs. restante,
  y el desglose por categoría con barras de progreso.
- **Datos:** `useBudget` + `useMonthExpenses`; cálculo `budgetBreakdown` en
  `expenseMath.js`.
- **Navega a:** editBudget.

### `PurchaseHistoryScreen.js` — 🟢 Supabase
- **Muestra:** buscador + lista de gastos agrupados por "Hoy / Ayer / Última
  semana / Antes".
- **Datos:** `useRecentExpenses(50)`; agrupado con `groupByRelativeDate`.

### `NotificationsScreen.js` — 🟠 Hardcodeado
- **Muestra:** lista de notificaciones de ejemplo agrupadas por fecha.
- **Datos:** array `GROUPS` fijo en el código.

### `AffiliatedBusinessesScreen.js` — 🟠 Hardcodeado
- **Muestra:** buscador, toggle Lista/Mapa (el mapa es un placeholder), lista de
  5 comercios con su % de cashback.
- **Datos:** array `BUSINESSES` fijo.
- **Navega a:** discountsOffers.

### `RewardsScreen.js` — 🟠 Hardcodeado
- **Muestra:** cashback total disponible ($5.30), historial de cashback, tarjeta
  "seguí comprando".
- **Datos:** todo fijo (`HISTORY`).
- **Navega a:** shoppingStore.

### `AvailableOffersScreen.js` — 🟠 Hardcodeado
- **Muestra:** chips de categoría + tarjetas de ofertas por tienda.
- **Datos:** array `OFFERS` fijo.
- **Navega a:** discountsOffers.

### `PriceComparerScreen.js` — 🟠 Hardcodeado
- **Muestra:** un producto (aceite) y su precio en 3 tiendas, con "mejor precio"
  y una recomendación.
- **Datos:** `PRODUCT` y `STORES` fijos.
- **Navega a:** shoppingStore.

### `ShoppingStoreScreen.js` — 🟠 Hardcodeado
- **Muestra:** buscador, categorías, grilla de "productos recomendados" con botón
  "Add" (no agrega nada real).
- **Datos:** array `PRODUCTS` fijo.

### `DiscountsOffersScreen.js` — 🟠 Hardcodeado
- **Muestra:** hero "Save More with Asentli" + lista de cupones por tienda con
  botón "Use".
- **Datos:** array `COUPONS` fijo.
- **Navega a:** availableOffers.

### `PlaceholderScreen.js` — 🟠
- **Muestra:** "🚧 Esta pantalla está en construcción".
- **Uso:** comodín reutilizable. Hoy `App.js` no lo usa en ninguna ruta, pero
  está listo por si se agrega una pestaña nueva sin pantalla.

---

## 7. Tabla resumen: pantalla → origen de datos

| Pantalla | Origen | Hook / fuente |
|---|---|---|
| SplashScreen | 🔵 Clerk | `useAuth` (estado de sesión) |
| WelcomeScreen | 🟠 | — |
| SignUpScreen | 🔵 Clerk | `useSignUp` |
| LoginScreen | 🔵 Clerk | `useSignIn` |
| ForgotPasswordScreen | 🔵 Clerk | `useSignIn` (reset) |
| TermsScreen | 🔵 Clerk | `user.update(unsafeMetadata)` |
| HomeScreen | 🟢+🟠 | `useMonthExpenses`, `useBudget` |
| StatisticsScreen | 🟢 | `usePeriodExpenses` |
| BasketScreen | 🟠 | — |
| ProfileScreen | 🔵+🟠 | `useUser`, `useAuth` |
| CardScreen | 🟢+🟠 | `useBudget`, `useMonthExpenses`, `useRecentExpenses` |
| AIAssistantScreen | 🟠 | — |
| AddExpenseScreen | 🟢 (escribe) | `useAddExpense` |
| EditBudgetScreen | 🟢 | `useBudget`, `useSetBudget` |
| BudgetDetailsScreen | 🟢 | `useBudget`, `useMonthExpenses` |
| PurchaseHistoryScreen | 🟢 | `useRecentExpenses(50)` |
| NotificationsScreen | 🟠 | — |
| AffiliatedBusinessesScreen | 🟠 | — |
| RewardsScreen | 🟠 | — |
| AvailableOffersScreen | 🟠 | — |
| PriceComparerScreen | 🟠 | — |
| ShoppingStoreScreen | 🟠 | — |
| DiscountsOffersScreen | 🟠 | — |
| PlaceholderScreen | 🟠 | — |

> Resumen: **7 pantallas** ya leen/escriben datos reales de Supabase. El resto de
> la app es diseño con datos de ejemplo, listo para conectarse.

---

## 8. Componentes compartidos

En `src/components/`:

| Componente | Qué es |
|---|---|
| `ScreenHeader.js` | Encabezado: flecha atrás (opcional) + título + campana 🔔 (opcional) o un slot libre a la derecha |
| `BottomNav.js` | La barra inferior de 4 pestañas. `active` marca la actual; `onNavigate(screenKey)` cambia de pantalla |
| `Fab.js` | Botón flotante redondo "+" (abajo a la derecha), usado en Home para "Add expense" |
| `EmptyState.js` | Bloque "todavía no hay datos" con ícono, título y subtítulo. Usado en las pantallas 🟢 cuando no hay gastos |
| `GoogleButton.js` | Botón "Continuar con Google". Usado en Login y Sign up |
| `ui.js` | Varios en un archivo: `SearchBar`, `Chips` (píldoras horizontales), `ProgressBar`, `SectionHeader`, `PillButton`, `Thumb` (miniatura con ícono), `ViewMore` |

Otros lugares de apoyo:

| Archivo | Qué es |
|---|---|
| `src/theme/colors.js` | Todos los colores de la app con nombre (`primary`, `bottleGreen`, `catFood`...) |
| `src/constants/categories.js` | Las 4 categorías de gasto: `key`, `label`, `color`, `icon`. Fuente única de verdad (coincide con el `CHECK` de la tabla `expenses`) |
| `src/lib/dates.js` | Helpers de fecha y `formatMoney()` (formatea `1234.5` → `$1,234.50`) |
| `src/lib/expenseMath.js` | Sumar gastos, agrupar por categoría, datos de la dona, comparación entre períodos |

---

## 9. La landing web (repo aparte)

Proyecto **separado** en `C:\Users\rodri\Desktop\Asentli\Asentli\Asentli`
(React + Vite). Navegación por URL con `react-router-dom`.

| Ruta | Archivo | Muestra | Datos |
|---|---|---|---|
| `/` | `src/Landing.jsx` | Página de presentación: navbar, hero con botón "Sign up now", "Current challenge / The Asentli solution", "Your path to financial control" (3 pasos), "Benefits", footer | 🟠 todo hardcodeado (estilos inline) |
| `/login` | `src/Login.jsx` | Formulario correo + contraseña | 🟠 valida el formato y hace `console.log("Login exitoso")`. **No** usa Clerk ni Supabase |

`src/App.jsx` define las rutas; `src/main.jsx` monta la app. No hay conexión con
la app móvil (ver `ARCHITECTURE.md`, sección 10).

---

## 10. Pantallas heredadas / sin usar

No están importadas en `App.js`. Restos de versiones anteriores:

| Archivo | Qué era | Estado |
|---|---|---|
| `src/screens/registro.js` | Registro con **Firebase** | No compila (importa `../config/firebase`, que no existe). Reemplazado por `SignUpScreen.js` |
| `src/screens/walletdetails.js` | "Detalle de billetera" | Sin usar. Su función se llama `HomeScreen` por error de copiado |
| `src/screens/LandingPage.js` | — | Archivo vacío |

Ver `README.md`, sección 6, y `CHANGELOG.md`, Etapa 3.
