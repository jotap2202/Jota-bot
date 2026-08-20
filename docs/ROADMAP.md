# ROADMAP — Master Plan 5 días, re-mapeado

Base: el master plan operativo v2, corregido contra la auditoría
`docs/AUDITORIA-D1.md`. El plan original asume que JOTA es una landing; en
realidad la plataforma multiempresa ya está construida y probada. Lo que sigue
es el mismo objetivo con el orden corregido.

**Regla que no se negocia:** un ticket por vez. Se ejecuta, se verifica, y
recién ahí el siguiente. Compilar no es "terminado".

---

## Qué cambia respecto del plan original

| | Plan original | Re-mapeado | Por qué |
|---|---|---|---|
| Día 1 Bloque 3 | Crear Supabase + RLS | **Migraciones versionadas + staging** | El multi-tenant ya existe y está probado. El riesgo real es `prisma db push` en el build. Ver D-006. |
| Día 2 completo | Construir agente, knowledge, widget, leads | **Cargar el primer negocio REAL + eval suite** | Todo eso ya está construido. Lo que falta es dejar de probar con negocios de demo. |
| Día 3 | Calendar + follow-up + voice + onboarding | **Google Calendar real + Voice (desde cero)** | Follow-up ya está hecho. Voice no existe: es el bloque más grande de los 5 días. |
| Día 4 | Igual | Igual | SEO panel y funnel no existen. Sin cambios. |
| Día 5 | Igual | Igual | Sin cambios. |

**Capacidad liberada:** el Día 2 casi entero. Se usa para llevar el sistema a
datos reales y para absorber Voice, que está subestimado en el plan original.

---

## DÍA 1 — Fundación real

Meta: que se pueda desplegar sin miedo a perder datos, y que la landing venda
la oferta correcta.

- [x] **D1-0** Backup: tag `pre-platform-backup` ✅ *(local; el push falla — KI-008)*
- [x] **D1-1** Auditoría sin editar (PROMPT D1.1) ✅ `docs/AUDITORIA-D1.md`
- [x] **D1-2** Documentos de control ✅ ROADMAP / DECISIONS / KNOWN_ISSUES
- [ ] **D1-A** Migraciones versionadas — sacar `prisma db push` del build → `prisma migrate deploy` · **High** · 60-90 min
- [ ] **D1-B** Staging separado con base propia · **High** · 45-60 min
- [ ] **D1-F** `middleware.ts` que cierre por defecto las rutas privadas · 30 min
- [ ] **D1-C** `sitemap.ts` + verificar `noindex` · 30 min
- [ ] **D1-D** Reposicionar landing: Revenue Engine + how it works + FAQ · 90 min
- [ ] **D1-E** Instrumentar eventos de conversión · 45 min

**Gate:** staging desplegado y separado de producción · un deploy no puede
perder datos · landing vende la oferta clara · rutas privadas cierran por
defecto · sitemap existe.

**Ya cumplido del Día 1 original:** separación marketing/app, auth, rutas
protegidas, health endpoint, multi-tenant, Clients CRUD, robots, canonicals.

---

## DÍA 2 — De demo a real

Meta: dejar de probar contra negocios de mentira. Un negocio real cargado,
respondiendo de verdad, con la suite de evaluación que exige el plan.

- [ ] **D2-A** Verificar el dominio en Resend y confirmar envío real *(requiere acción del dueño — KI-003)*
- [ ] **D2-B** Cargar el **primer negocio real** con el flujo de `NUEVO-CLIENTE.md`, sin tocar código
- [ ] **D2-C** Suite de evaluación: 40+ casos con expected outcome, clasificados Critical/High/Medium/Low
- [ ] **D2-D** Corregir todo Critical/High de alucinación, fuga entre tenants, consejo inseguro, PII o captura de lead rota
- [ ] **D2-E** Probar el widget en una página HTML externa, en celular
- [ ] **D2-F** Mapear los estados de `Lead` al pipeline New → Contacted → Qualified → Booked → Won → Lost
- [ ] **D2-G** Separar datos DEMO de producción de forma visible en el panel

**Gate:** un negocio real activo · el widget funciona fuera de JOTA y desde el
celular · 40+ evals corridos sin Critical/High abiertos · los emails salen de
verdad · lo demo está marcado como demo.

---

## DÍA 3 — Booking real y Voice

Meta: el bloque más pesado. Voice no existe todavía.

- [ ] **D3-A** Google Calendar real detrás de `ProveedorCalendario` — free/busy antes de ofrecer horarios (KI-007)
- [ ] **D3-B** Idempotencia y prueba de doble reserva contra el calendario real
- [ ] **D3-C** Simular Calendar caído → verificar fallback humano
- [ ] **D3-D** **Voice AI** — depende de D-007 (Vapi / Retell / Twilio). Reusa business rules y knowledge del chat, sin duplicar lógica
- [ ] **D3-E** 10 llamadas de prueba: normal, ruido, interrupción, desconocido, humano, booking, fallo de proveedor
- [ ] **D3-F** Wizard de onboarding de 10 pasos sobre `onboarding.ts`
- [ ] **D3-G** Probar crear un tenant nuevo de cero sin tocar el repo

**Gate:** chat → lead → disponibilidad real → booking → confirmación funciona ·
voice califica, reserva y deriva · un cliente nuevo se configura sin código.

**Ya cumplido del Día 3 original:** follow-up con stop conditions, integration
health, automation events con DLQ.

---

## DÍA 4 — Observabilidad y seguridad

- [ ] **D4-A** Funnel analytics: visitor → CTA → lead → qualified → booked → won, con "insufficient data" cuando no haya muestra
- [ ] **D4-B** Panel SEO en `/admin/seo`: checks por URL + adapter de Search Console + CWV
- [ ] **D4-C** Weekly report por tenant, con datos reales o marcados DEMO
- [ ] **D4-D** Security red team formal: cross-tenant, secretos, webhooks, rate limits, XSS, prompt injection, PII en logs
- [ ] **D4-E** *(opcional, según D-006)* RLS de Postgres como segunda red
- [ ] **D4-F** Performance y QA mobile: LCP ≤2.5s, INP <200ms, CLS <0.1
- [ ] **D4-G** Paginación del panel de leads (KI-006)

**Gate:** funnel, SEO panel y reportes con datos honestos · cero Critical/High
de seguridad · demo estable en celular.

---

## DÍA 5 — Release y venta

- [ ] **D5-A** Congelar features. Release audit con tabla PASS/FAIL
- [ ] **D5-B** `SALES_DEMO.md` — demo de 8 minutos con talk track y plan B
- [ ] **D5-C** `OFFER.md` + `CLIENT_SCOPE.md` — Launch / Growth / Revenue OS, sin ROI garantizado
- [ ] **D5-D** `CLIENT_ONBOARDING.md` — SOP de 48-72h con QA de 20 casos
- [ ] **D5-E** Elegir UN nicho · lista de 50 empresas · priorizar 20
- [ ] **D5-F** Outreach a los primeros 20 · follow-up día 2 y día 5 · todo en el CRM

**Gate final:** vender sin mentir, demostrar sin trucos, onboardear sin tocar
código, y detectar fallos sin que avise el cliente.

---

## Bloqueantes que dependen del dueño

| # | Qué | Bloquea |
|---|---|---|
| 1 | Decisión Supabase vs Neon (D-006) | D1-B, D4-E |
| 2 | Dominio verificado en Resend | D2-A y todo el envío real |
| 3 | `DATABASE_URL` de staging | D1-B |
| 4 | Proveedor de voz (D-007) | D3-D, todo el Día 3 tarde |
| 5 | El nicho | D2-B (define el negocio demo) y D5-E |

---

## Fase 2 — explícitamente fuera de estos 5 días

Stripe metered billing · dominios white-label · marketplace/templates · visual
workflow builder · app móvil nativa · crawler SEO tipo Ahrefs · infraestructura
de outbound propia · plataforma de ads · RBAC avanzado · prompts críticos
editables por el cliente · 100+ integraciones · modelos de atribución.
