# RUNBOOK

Procedimientos operativos. Cada uno dice qué hace, cuándo se corre y cómo se
revierte.

---

## ⚠️ ACCIÓN REQUERIDA ANTES DEL PRÓXIMO DEPLOY — baseline de migraciones

**Si no hacés esto, el próximo deploy a producción falla.** No pierde datos: la
migración se niega a correr y el deploy queda en rojo. Pero hay que hacerlo una
sola vez, y hay que hacerlo antes.

### Por qué

Hasta ahora el build corría `prisma db push`: cada deploy aplicaba el schema
directo contra la base, sin migración versionada, sin confirmar y sin backup.
Un cambio que borrara una columna borraba los datos, en silencio y en
producción.

Ahora el build corre `prisma migrate deploy`. La base de producción ya tiene
las 30 tablas creadas por `db push`, así que Prisma la ve como "una base con
cosas adentro y ninguna migración registrada" y se planta (error `P3005`). Hay
que decirle, una vez, que la migración inicial ya está aplicada.

### El comando

Desde tu máquina, con la `DATABASE_URL` **de producción**:

```bash
cd jota-agency
DATABASE_URL="<la de produccion>" npx prisma migrate resolve --applied 0_init
```

No toca ni una tabla: solo escribe una fila en `_prisma_migrations` diciendo
que `0_init` ya está aplicada.

### Verificar que quedó bien

```bash
DATABASE_URL="<la de produccion>" npx prisma migrate status
```

Tiene que decir `Database schema is up to date!`.

Y para confirmar que el schema real coincide con el del repo:

```bash
DATABASE_URL="<la de produccion>" npx prisma migrate diff \
  --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --exit-code
```

`No difference detected.` es lo que tiene que salir. Si sale una diferencia,
**no deployees** — avisá antes, porque significa que la base de producción tiene
algo que el schema del repo no refleja.

### Lo mismo para staging

La base de staging arranca vacía, así que no necesita baseline: el primer
`prisma migrate deploy` crea las 30 tablas desde `0_init` y listo.

### Rollback

Si algo sale mal y querés volver al comportamiento anterior:

```bash
# en jota-agency/package.json
"build": "prisma generate && prisma db push && next build"
```

Volvés al riesgo de antes, pero deployea. Neon tiene restauración
point-in-time si hiciera falta recuperar datos.

---

## Cómo se verificó la migración inicial

No se dio por buena porque el archivo se generó. Se probó, contra un Postgres
16 real:

| Prueba | Resultado |
|---|---|
| `prisma migrate deploy` sobre una base vacía | Aplica `0_init` sin errores |
| Drift entre la base migrada y `schema.prisma` | `No difference detected.` |
| Base hecha con `db push` vs. base hecha con la migración | `No difference detected.` — **por eso el baseline de producción es seguro** |
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
