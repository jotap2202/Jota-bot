# RUNBOOK

Procedimientos operativos. Cada uno dice qué hace, cuándo se corre y cómo se
revierte.

---

## Migraciones en el deploy — no hay que hacer nada a mano

**No requiere ninguna acción tuya.** El deploy se encarga solo. Esta sección
explica qué hace y cuándo puede detenerse a propósito.

### Qué cambió y por qué

El build corría `prisma db push`: cada deploy aplicaba el schema directo contra
la base, sin migración versionada, sin confirmar y sin backup. Un cambio que
borrara una columna borraba los datos, en silencio y en producción.

Ahora el build corre `node prisma/desplegar.mjs`, que aplica las migraciones
versionadas y resuelve solo el único caso que necesitaba intervención humana.

### El caso del baseline

La base de producción se construyó con `db push`: tiene las 30 tablas pero
ninguna fila en `_prisma_migrations`. Prisma ve una base con cosas adentro y
sin historial, y se planta con `P3005`.

Antes eso obligaba a correr `prisma migrate resolve --applied 0_init` a mano.
Ahora el script lo detecta y lo hace, **pero no a ciegas**: primero compara el
esquema real de la base contra el del repositorio, y solo registra la migración
si son idénticos.

Esto no es el `db push` de antes con otro nombre. Aquel era peligroso porque
**modificaba el esquema** sin preguntar. Este, en el camino del baseline, lo
único que escribe es una fila en `_prisma_migrations`. Es imposible que pierda
un dato.

### Los cuatro caminos, todos probados contra un PostgreSQL 16 real

| Situación | Qué hace | Verificado |
|---|---|---|
| Base vacía (staging el primer día) | Crea las 30 tablas desde `0_init` | ✅ |
| Base ya migrada | `No pending migrations to apply` | ✅ |
| Base de `db push` sin historial (**producción hoy**) | Verifica, baseliniza, deploya | ✅ |
| Base que **no coincide** con el repo | **Se niega y rompe el deploy** (exit 1) | ✅ |

### Si el deploy se detiene por drift

Vas a ver `La base de producción NO coincide con el esquema del repositorio`,
seguido de las diferencias exactas. **Eso es el script funcionando bien**, no
fallando: significa que la base tiene algo que el código no refleja.
Baselinizar igual dejaría esa diferencia enterrada y la próxima migración se
escribiría sobre una realidad equivocada.

Cuando pase, mirá las diferencias que imprime y decidí: o el repo tiene que
reflejar ese cambio, o hay que revertirlo en la base.

### Correrlo a mano (opcional)

```bash
cd jota-agency
DATABASE_URL="<la que sea>" npm run db:desplegar
```

### Rollback

Si hiciera falta volver atrás:

```bash
# en jota-agency/package.json
"build": "prisma generate && prisma migrate deploy && next build"
```

Eso deja el comportamiento estándar de Prisma, sin el baseline automático — y
el deploy fallaría con P3005 hasta correr `migrate resolve` a mano. Neon tiene
restauración point-in-time si hiciera falta recuperar datos.

---

## Cómo se verificó la migración inicial

No se dio por buena porque el archivo se generó. Se probó, contra un Postgres
16 real:

| Prueba | Resultado |
|---|---|
| `prisma migrate deploy` sobre una base vacía | Aplica `0_init` sin errores |
| Drift entre la base migrada y `schema.prisma` | `No difference detected.` |
| Base hecha con `db push` vs. base hecha con la migración | `No difference detected.` — **por eso el baseline automático es seguro** |
| `npm run test:agente-db` contra la base migrada | 109/109 |

La tercera fila es la importante: prueba que la migración reproduce exactamente
el schema que `db push` viene creando en producción.

---

## Correr las pruebas

```bash
cd jota-agency

# No necesitan base ni claves de API — las que corre el CI
npm test              # fórmulas, dinero y lead scoring
npm run test:acceso   # rutas públicas/privadas y open redirect
npm run test:agente   # el motor del agente, 161 casos
npm run test:secretos # que ninguna clave llegue al navegador

# Necesita Postgres descartable (TRUNCA las tablas al terminar)
DATABASE_URL="<base descartable>" npm run test:agente-db

# Gastan tokens de Anthropic — antes de un release, no en cada commit
npm run test:agente-real   # ~US$0,17
npm run test:e2e           # ~US$0,15, el flujo completo
```

**Nunca** apuntar `test:agente-db` ni `test:e2e` a la base de producción:
truncan tablas y crean negocios de prueba.

### Postgres local para probar

```bash
pg_ctlcluster 16 main start
su postgres -c "psql -c \"ALTER USER postgres PASSWORD 'local';\" -c 'CREATE DATABASE jota_dev;'"
export DATABASE_URL="postgresql://postgres:local@localhost:5432/jota_dev"
npx prisma migrate deploy
```

---

## Levantar el proyecto en local

```bash
cd jota-agency
npm install
cp .env.example .env      # completar los valores
npx prisma migrate deploy # crea las tablas
npm run preview:seed      # usuario demo + negocio de demostración
npm run dev
```

Entrar por `http://localhost:3000/acceder` con `demo@jotaagency.local` /
`JotaDemo2026!`. Ese email tiene que estar en `ADMIN_EMAILS`.

---

## Qué mirar cuando algo se rompe en producción

1. **`/ceo/agent/health`** — es el primer lugar. Dice qué está roto y qué deja
   de funcionar por eso.
2. **Cola de errores (DLQ)** — `WorkflowEvent` con `tipo: "dlq"`. Son consultas
   o acciones que necesitan una persona.
3. **Consultas fuera de SLA** — el health check las cuenta. Es exactamente lo
   que el servicio promete que no pasa.
4. **Logs de Vercel** — el cron corre cada 15 minutos contra
   `/api/agente/cron`.

Los síntomas más comunes y su causa están en
`docs/agente-24-7/INSTALACION.md` § Problemas comunes.
