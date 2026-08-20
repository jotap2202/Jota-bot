# TEST_REPORT

## Evaluación conversacional — **todavía no corrida**

La suite existe y está lista: `jota-agency/pruebas/evals.ts`, 44 casos con
resultado esperado y severidad.

**No la pude correr**, porque necesita `ANTHROPIC_API_KEY` y en el entorno donde
se escribió no hay ninguna. Sin clave el agente deriva todo al equipo por
diseño, así que una corrida daría un reporte lleno de fallos que no dicen nada
sobre el comportamiento real. El runner se niega a arrancar en ese caso en vez
de producir un número que no significa nada.

**Corré esto y el archivo se reescribe solo con los resultados reales:**

```bash
cd jota-agency
ANTHROPIC_API_KEY=... DATABASE_URL="<base descartable>" npm run evals
```

Cuesta unos **US$1,20** en tokens (44 llamadas al modelo) y tarda unos minutos.
El negocio de prueba se crea y se borra solo.

> ⚠️ `DATABASE_URL` tiene que apuntar a una base **descartable**. La suite crea
> un negocio ficticio y lo elimina al terminar. Nunca a producción.

Sale con código 1 si queda algún fallo Critical o High, así que sirve como
gate: el plan dice no pasar al Día 3 con fallos Critical/High abiertos.

---

## Qué cubren los 44 casos

| Categoría | Casos | Qué verifica |
|---|---|---|
| FAQ correcta | 5 | Que responda bien lo que sí está cargado |
| No sabe | 4 | Que diga que no sabe y derive, en vez de improvisar |
| Precio | 4 | Que no invente precios — el negocio de prueba no carga ninguno |
| Horario | 3 | Que no diga que abre cuando está cerrado |
| Fuera de zona / alcance | 3 | Que no acepte trabajo comercial, ni en Hana, ni solar |
| Pide humano | 3 | Que derive, y que no mienta diciendo que es una persona |
| Agresión | 2 | Que no responda la agresión, y que un reclamo real derive |
| Spam | 3 | Que se filtre |
| Inyección de prompt | 6 | Que no filtre el prompt, no acepte instrucciones falsas, no hable de otros negocios, no revele modelo ni clave |
| Idioma | 3 | Castellano, inglés con hawaiano, francés |
| Datos incompletos | 4 | Que "hi" o "roof" no terminen en una respuesta inventada |
| Lead | 4 | Que capture los buenos y no fuerce los tibios |
| Acción falsa | 3 | Que no diga "ya te agendé" ni "ya te mandé el mail" si no pasó |

### Severidades

- **Critical** — le cuesta plata o credibilidad al cliente: inventar un precio,
  ceder a una inyección, prometer algo que el negocio no hace, afirmar una
  acción que no ocurrió.
- **High** — pierde un lead o deja mal parado al negocio.
- **Medium** — respuesta pobre pero no dañina.
- **Low** — matiz de tono.

### Cómo leer los resultados

Esto mide comportamiento de un modelo, que es probabilístico: dos corridas
pueden no dar igual. Un fallo aislado de severidad Low puede ser ruido. Un
Critical que se repite entre corridas es un bug de guardrail y hay que
arreglarlo antes de mostrarle el sistema a un cliente.

---

## Suites que sí corrieron

Última verificación: 2026-08-20, contra PostgreSQL 16 local.

| Suite | Resultado | Necesita |
|---|---|---|
| `npm test` | ✅ 20/20 | nada |
| `npm run test:acceso` | ✅ 40/40 | nada |
| `npm run test:agente` | ✅ 161/161 | nada |
| `npm run test:secretos` | ✅ 34/34 | nada |
| `npm run test:agente-db` | ✅ 109/109 | Postgres descartable |
| `npm run evals` | ⏳ sin correr | Postgres + `ANTHROPIC_API_KEY` |
| `npm run test:agente-real` | ⏳ sin correr | Postgres + `ANTHROPIC_API_KEY` |
| `npm run test:e2e` | ⏳ sin correr | Postgres + `ANTHROPIC_API_KEY` |
| `npm run test:email-real` | ⏳ sin correr | `RESEND_API_KEY` + dominio verificado |

Las tres últimas dieron verde el 2026-08-04, antes de los cambios de estos
cinco días (ver `.ai-review/test-e2e-2026-08-04.log`). **Eso no cuenta como
verificación de hoy**: hay que volver a correrlas antes del release del Día 5.

### Verificación de la migración inicial

| Prueba | Resultado |
|---|---|
| `prisma migrate deploy` sobre base vacía | ✅ aplica `0_init` |
| Drift entre base migrada y `schema.prisma` | ✅ `No difference detected.` |
| Base de `db push` vs. base de la migración | ✅ `No difference detected.` |
| `test:agente-db` contra la base migrada | ✅ 109/109 |
