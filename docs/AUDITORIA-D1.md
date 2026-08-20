# Auditoría D1.1 — sin modificaciones

Fecha: 2026-08-20 · Commit auditado: `19d4ac7` · Tag de retorno: `pre-platform-backup`
**Cero archivos modificados en esta auditoría.**

---

## Titular

El master plan está escrito como si JOTA fuera una landing a la que hay que
agregarle una plataforma. **No lo es.** El repo ya contiene una plataforma
multiempresa construida y probada: 30 tablas, ~5.900 líneas de motor de agente,
widget embebible, leads con score explicable, booking, follow-up, handoff,
health y onboarding — con 361 pruebas en verde, incluidas 109 de aislamiento
entre negocios contra Postgres real.

Buena parte del Día 2 y del Día 3 ya está hecha. El plan de 5 días sigue siendo
correcto como *objetivo*; lo que cambia es el punto de partida y, por lo tanto,
el orden. Aplicando la regla 3 del prompt maestro ("preferir el cambio mínimo
seguro para producción") y la instrucción explícita de no proponer rewrites,
este documento re-mapea el plan contra lo que existe.

---

## 1. Stack y versiones

Son **tres aplicaciones Next.js en un mismo repositorio**, con deploys
separados en Vercel y bases distintas según el caso.

| App | Carpeta | Qué es | Next | Base |
|---|---|---|---|---|
| **jota-agency** | `jota-agency/` | La web comercial + la plataforma del agente 24/7. **Es el proyecto del plan.** | 15.1.6 | Postgres (Neon) vía Prisma 6 |
| **jota-panel** | `jota-panel/` | Panel de leads de una sola persona, deploy aparte, login con una contraseña. Solo lee. | 15.1.6 | La **misma** base que jota-agency |
| **mi-trading-bot** | raíz `/` | Plataforma de grid trading de cripto. Proyecto separado, no se toca. | 16.2.9 | Prisma propio |

Común: React 19, TypeScript estricto, Tailwind v4, Prisma 6, deploy en Vercel.

> Ojo con `AGENTS.md`: la advertencia sobre "este no es el Next.js que conocés"
> aplica al proyecto raíz (Next 16). `jota-agency` es Next 15 App Router
> estándar.

## 2. Mapa de rutas — `jota-agency`

**Público (marketing):**
- `/` — landing comercial
- `/diagnostico` — gancho de conversión: el usuario describe su negocio y J genera un diagnóstico con IA. `noindex`, con canonical propio.
- `/acceder`, `/acceder/estado` — login/registro. `noindex`.

**Privado (producto) — todo detrás de sesión + `esAdmin()`:**
- `/ceo` — CEO Command Center: revenue, goals, tasks, pipeline, leads, clients, campaigns, marketing, insights, reports, settings
- `/ceo/agent` — **la plataforma del agente**: Overview, Inbox (+ detalle), Leads, Knowledge, Settings, Health, Businesses
- `/panel`, `/panel/prospectos` — panel de leads heredado

**APIs:**
- `/api/agente/chat` · `/form` · `/email` · `/widget` · `/cron` — los 5 canales del agente
- `/api/auth/[...nextauth]` · `/api/registro` · `/api/perfil`
- `/api/diagnostico` · `/api/panel/export`

## 3. Deploy actual

Vercel, root directory `jota-agency`. El build corre
`prisma generate && prisma db push && next build` — **el schema se aplica solo
en cada deploy, contra la base que tenga `DATABASE_URL`**. Es cómodo y es el
riesgo más grande del repo hoy (ver §8).

Cron configurado en `vercel.json`: `/api/agente/cron` cada 15 minutos
(seguimientos, recuperación, salud).

CI en GitHub Actions: lint + tipos + build para `jota-agency` y `jota-panel`,
en cada push a `main` y `claude/**`. El bot de trading queda fuera a propósito.

## 4. Auth y control de acceso

NextAuth v5 (beta.25), estrategia JWT, adapter de Prisma. Dos proveedores:
Google (se registra solo si sus credenciales están cargadas) y email+contraseña
con bcrypt.

El control de acceso al panel es `esAdmin()` en `src/lib/admin.ts`, y **falla
cerrado**: sin `ADMIN_EMAILS` en producción no entra nadie. En desarrollo entra
un email por defecto. `allowDangerousEmailAccountLinking` está explícitamente
desactivado, con el razonamiento documentado en el código.

**No hay `middleware.ts`.** La autorización se resuelve por página/route
server-side, que es correcto, pero significa que agregar una ruta privada nueva
sin acordarse del guard la deja abierta. Es un riesgo de proceso, no un agujero
actual.

## 5. Base de datos — 30 modelos

**Del negocio JOTA (14):** `User`, `Account`, `Session`, `VerificationToken`,
`Diagnostico`, `Prospecto`, `Cliente`, `Ingreso`, `Gasto`, `Objetivo`,
`Campania`, `TareaCeo`, `Notificacion`, `Actividad`.

**De la plataforma multiempresa (16):** `Tenant`, `TenantIntegration`,
`TenantMember`, `Contact`, `Conversation`, `Message`, `Lead`, `Appointment`,
`KnowledgeSource`, `KnowledgeChunk`, `FollowUp`, `EmailOutbox`, `Suppression`,
`ApprovalRequest`, `WorkflowEvent`, `AuditLog`.

Las 16 llevan `tenantId` y todos sus índices arrancan por `tenantId`. El acceso
pasa por un único helper, `paraTenant()` — ninguna herramienta del agente
construye un `where` a mano.

## 6. Variables de entorno esperadas (13)

Obligatorias: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAILS`, `ANTHROPIC_API_KEY`.
Para funcionar completo: `APP_ENCRYPTION_KEY`, `RESEND_API_KEY`, `CRON_SECRET`, `SITIO_URL`.
Opcionales: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AGENTE_MODELO`.
Solo para probar: `ALLOW_REAL_EMAIL_TEST`, `TEST_EMAIL_RECIPIENT` — **no deben quedar en producción.**

En el repo solo existe `.env.example`, sin secretos. `.env*` está en
`.gitignore`. Hay una prueba dedicada (`npm run test:secretos`) que verifica
que ninguna clave llegue al bundle del navegador.

## 7. Dependencias obsoletas o riesgosas

| Dependencia | Nota |
|---|---|
| `next-auth@5.0.0-beta.25` | Beta en producción. Es la vía normal para NextAuth v5 hoy, pero es una beta: fijala exacta y no la actualices durante los 5 días. |
| `bcryptjs@^2.4.3` | jota-agency usa la 2.x; el proyecto raíz ya usa la 3.x. Inconsistencia menor, sin impacto de seguridad. |
| `@anthropic-ai/sdk@^0.68.0` | Al día. |
| Tres `package-lock.json` | Uno por app. Correcto, pero `npm install` en la carpeta equivocada rompe cosas de forma confusa. |

Nada crítico ni con CVE conocido.

## 8. Riesgos de migración — ordenados por gravedad

1. **`prisma db push` en el build de producción.** Cada deploy aplica el schema
   a la base apuntada por `DATABASE_URL`, sin migración versionada y sin
   preguntar. Un cambio de schema que borre una columna borra los datos. El
   plan pide "migrations versionadas" (regla 10) y hoy **no las hay**. Esto es
   lo primero a arreglar.
2. **jota-panel comparte base con jota-agency.** Cualquier cambio de schema
   puede romper el panel sin que su CI lo note, porque el panel no administra
   el schema.
3. **Un solo entorno.** No hay staging separado: la misma `DATABASE_URL` local
   y en producción, según dice el comentario del propio `schema.prisma`. El
   plan exige staging separado desde el Día 1.
4. **Sin `middleware.ts`.** Cada ruta privada nueva depende de que alguien se
   acuerde del guard.
5. **Rate limit en memoria.** En serverless cada instancia tiene el suyo.

## 9. Qué conservar de la landing

**Conservar entero:** identidad visual (dorado sobre verde oscuro), `Landing.tsx`
con su sistema de diseño en `globals.css`, el flujo de `/diagnostico` con IA en
streaming (es el mejor gancho que tiene el sitio hoy), el bilingüe ES/EN de
`contenido.ts`, el favicon y las imágenes responsivas.

**Cambiar solo el contenido:** promesa central, jerarquía de la oferta, FAQ,
"how it works". Son ediciones de `contenido.ts` y de secciones de `Landing.tsx`,
no un rediseño.

**Ya resuelto en rondas anteriores, no volver a tocar:** testimonios inventados
(eliminados), canonicals de rutas privadas, `robots.txt`.

---

## 10. El plan contra la realidad

`✅ hecho` · `🟡 parcial` · `❌ falta`

| Punto del checklist maestro | Estado | Dónde está / qué falta |
|---|---|---|
| Landing conservada | ✅ | `src/app/page.tsx`, `Landing.tsx` |
| Oferta "Revenue Engine" clara | ❌ | Reposicionamiento de contenido |
| CTA demo/audit | 🟡 | Existe `/diagnostico`, con otra oferta |
| App/admin autenticado | ✅ | `/ceo` + `esAdmin()`, falla cerrado |
| Multi-tenant | ✅ | 16 tablas con `tenantId`, `paraTenant()`, 109 tests de aislamiento |
| RLS a nivel base | ❌ | El aislamiento es de aplicación, no de Postgres — **ver §11** |
| Clients CRUD | ✅ | `/ceo/agent/businesses` |
| Website AI agent | ✅ | `orquestador.ts` + `agente.ts` + `prompt.ts` |
| Knowledge | ✅ | `KnowledgeSource`/`Chunk`, `/ceo/agent/knowledge` |
| Widget embebible | ✅ | `/api/agente/widget`, Shadow DOM, una línea de instalación |
| Conversations | ✅ | `Conversation`/`Message`, Live Inbox |
| Lead capture | ✅ | `intake.ts` — guarda **antes** de procesar |
| Lead scoring explicable | ✅ | `puntaje.ts`, guarda las razones |
| CRM pipeline | 🟡 | Estados existen; falta mapear a New→Contacted→Qualified→Booked→Won→Lost |
| Calendar booking | 🟡 | `agenda.ts` con disponibilidad real, **pero solo local**. Sin Google Calendar. |
| Confirmations | ✅ | `email.ts` + `plantillas.ts` |
| Follow-up + stop conditions | ✅ | `seguimientos.ts` |
| **Voice AI** | ❌ | **No existe nada.** Cero código de telefonía. |
| Human handoff | ✅ | `handoff.ts` |
| Integration health | ✅ | `salud.ts`, `/ceo/agent/health` |
| Automation logs + DLQ | ✅ | `WorkflowEvent`, `AuditLog`, `eventos.ts` |
| Client onboarding | 🟡 | `onboarding.ts` funciona y falla cerrado; falta el wizard de 10 pasos |
| Analytics funnel | 🟡 | `metricas.ts` tiene los números; falta la vista de embudo |
| **SEO panel** | ❌ | No existe |
| Search Console | ❌ | Sin conectar |
| robots/canonical/noindex | ✅ | `robots.ts`, canonicals corregidos |
| **sitemap.xml** | ❌ | **No existe** — hay `robots.ts` pero no `sitemap.ts` |
| Core Web Vitals | ❌ | Sin medir |
| Weekly reporting | 🟡 | Datos sí, reporte armado no |
| Security red team | 🟡 | 4 rondas de auditoría hechas; falta la pasada formal del plan |
| Backups/rollback | 🟡 | Tag creado hoy; **falta migrations versionadas** |
| Release checklist | ❌ | — |
| Demo script | ❌ | — |
| Pricing / scope / SOP | 🟡 | `NUEVO-CLIENTE.md` cubre la parte operativa |
| 50 prospectos | 🟡 | Hay 24 negocios de Maui cargados en `Prospecto` |
| Primer outreach | ❌ | — |

**Cuenta:** 16 hechos · 10 parciales · 9 faltantes.

---

## 11. La decisión que hay que tomar hoy: Supabase + RLS

El plan pide, en el Día 1 Bloque 3, crear un proyecto Supabase con
`organizations`, `memberships`, `business_profiles` y RLS activado.

**Recomendación: no migrar a Supabase. Mantener Neon + Prisma y agregar RLS de
Postgres sobre el schema que ya existe si querés defensa en profundidad.**

Motivos concretos:

1. **Ya existe el equivalente funcional.** `Tenant` es `organizations`,
   `TenantMember` es `memberships`, y el `Tenant` mismo es el
   `business_profile`. Crear tablas nuevas con nombres en inglés duplicaría el
   modelo, no lo mejoraría.
2. **Migrar 30 tablas es el rewrite que el plan prohíbe.** Regla 3: el cambio
   mínimo seguro para producción. Migrar el data layer completo a mitad de un
   sprint de 5 días, con Voice y SEO todavía sin empezar, es la forma más
   rápida de terminar el Día 5 sin nada demostrable.
3. **Se tirarían 109 pruebas de aislamiento que hoy pasan.** Son la evidencia
   de que el multi-tenant funciona. El propio plan dice "no continúes si un
   test cross-tenant falla" — hoy ninguno falla.
4. **Supabase no es requisito de RLS.** RLS es de Postgres. Neon lo soporta. Si
   querés el aislamiento también a nivel base, se puede agregar sobre el schema
   actual sin cambiar de proveedor.

**Lo que sí concedo del punto:** el aislamiento hoy es de aplicación. Es
correcto y está probado, pero un `where` mal escrito en código nuevo lo saltea.
RLS sería una segunda red. Lo dejo propuesto como ticket opcional del Día 4
(bloque de seguridad), no como migración del Día 1.

Necesito tu decisión antes de seguir. Está registrada en `docs/DECISIONS.md`.

---

## 12. Tickets concretos para hoy

Reordenados: lo que el plan pide para el Día 1 y que **todavía no existe**.

| # | Ticket | Por qué ahora | Estimado |
|---|---|---|---|
| **D1-A** | Migraciones versionadas: sacar `prisma db push` del build, pasar a `prisma migrate deploy` | Riesgo #1 del repo. Cada deploy hoy puede perder datos. Regla 10 del plan. | 60-90 min |
| **D1-B** | Entorno de staging separado, con su propia base | El plan lo exige desde el Día 1 y hoy no existe | 45-60 min |
| **D1-C** | `sitemap.ts` + verificar `noindex` en las rutas nuevas | Falta y es barato | 30 min |
| **D1-D** | Reposicionar la landing a "Revenue Engine" + FAQ + how it works | Bloque 5 del Día 1, es el que te deja vender | 90 min |
| **D1-E** | Eventos de conversión instrumentados | Bloque 6 del Día 1 | 45 min |
| **D1-F** | `middleware.ts` que cierre por defecto las rutas privadas | Cierra el riesgo #4 antes de agregar rutas nuevas | 30 min |

Lo que el plan pone en el Día 1 y **ya está hecho**: separación
marketing/aplicación, auth, rutas protegidas, health endpoint, multi-tenant,
Clients CRUD, robots, canonicals.

Lo que hay que **mover hacia adelante** porque no existe y es grande: Voice AI
(Día 3) y SEO panel (Día 4) son los dos bloques sin ninguna base construida.
Google Calendar real (Día 3) es medio bloque.

---

## 13. Lo que necesito de vos

1. **Decisión sobre Supabase** (§11).
2. **Credenciales**, cargadas por vos en Vercel — nunca pegadas acá:
   `RESEND_API_KEY` con el dominio verificado, y una `DATABASE_URL` nueva para
   staging.
3. **El nicho** para el Día 5, porque define el negocio demo del Día 2.
4. **Proveedor de voz** para el Día 3: Vapi, Retell o Twilio + modelo propio.
   No hay nada elegido ni instalado.
