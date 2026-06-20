# Jota Bot

Plataforma de **grid trading** para criptomonedas. Crea bots de rejilla, hace backtest de estrategias, monitoriza tu cartera en tiempo real y escanea oportunidades de arbitraje entre exchanges.

> Por defecto funciona en **modo simulación (paper trading)** — sin dinero real y sin riesgo. La conexión a un exchange real (Binance) se configura desde *Settings* y las credenciales se guardan **cifradas con AES-256-GCM**.

## Características

- 🔐 **Autenticación** propia (email + contraseña, sesiones JWT en cookie httpOnly, hashing bcrypt)
- 📊 **Dashboard** con equity total, PNL realizado/no realizado, exposición por par y curva de equity
- 🤖 **Bots grid** — crear, arrancar, pausar y eliminar; cálculo de niveles, fills y PNL por un motor propio
- 🧪 **Backtest** — simula una estrategia sobre el histórico (retorno, APR, max drawdown, nº de trades)
- 📈 **Market** — precios en tiempo real con sparklines
- ⇄ **Arbitrage** — escáner de spreads entre exchanges
- 🌐 **Multi-idioma** ES/EN
- 🔒 **Credenciales cifradas** (AES-256-GCM) — el secret nunca se muestra en texto plano

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Prisma** + **SQLite** (cambiable a PostgreSQL en producción)
- **jose** (JWT) + **bcryptjs** (passwords) + **recharts** (gráficos)

## Puesta en marcha

```bash
npm install
cp .env.example .env          # y editá los secretos
npx prisma db push            # crea la base de datos
npm run dev                   # http://localhost:3000
```

Entrá con **"Probar demo"** para generar una cuenta de prueba con bots de ejemplo, o creá tu propia cuenta.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a la base de datos (SQLite por defecto) |
| `JWT_SECRET` | Secreto para firmar sesiones. `openssl rand -hex 32` |
| `ENCRYPTION_KEY` | Clave AES-256-GCM (64 hex). `openssl rand -hex 32` |

## Arquitectura

```
src/
  app/
    login, register          → autenticación
    dashboard/               → app (overview, bots, backtest, market, arbitrage, settings)
    api/                     → auth, bots, portfolio, market, backtest, arbitrage, credentials
  lib/
    engine.ts                → motor de grid (simulación)
    prices.ts                → modelo de precios (reemplazable por un feed real)
    bots.ts                  → estado de bots y cartera
    crypto.ts                → cifrado AES-256-GCM
    auth.ts                  → sesiones JWT
  components/                → UI (charts, sidebar, etc.)
```

### Cómo pasar a trading real

El motor (`src/lib/engine.ts`) y el modelo de precios (`src/lib/prices.ts`) están aislados a propósito. Para operar en real:

1. Implementá un adaptador de exchange (p. ej. con [ccxt](https://github.com/ccxt/ccxt)) que reemplace `priceAt`/`currentPrice` con precios reales y ejecute órdenes.
2. Añadí un worker/cron que avance los bots `running` y persista fills en la tabla `Trade`.
3. Descifrá las credenciales del usuario (`lib/crypto.ts`) solo en memoria al colocar órdenes.

> ⚠️ Operar en real implica riesgo financiero. Usá API keys con permisos de **solo lectura + futuros**, **nunca retiros**, y restringí por IP en el exchange.

## Licencia

Propietario. Todos los derechos reservados.
