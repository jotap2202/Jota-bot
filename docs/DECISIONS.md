# DECISIONS.md

Decisiones de arquitectura y producto, con su razón. Una entrada por decisión.
Las que están `PENDIENTE` bloquean trabajo: necesitan respuesta del dueño.

---

## D-006 — Supabase + RLS vs. Neon + Prisma · **PENDIENTE**

**Fecha:** 2026-08-20 · **Bloquea:** Día 1 Bloque 3

El master plan pide crear un proyecto Supabase con `organizations`,
`memberships`, `business_profiles` y RLS.

**Recomendación técnica: no migrar.** Mantener Neon + Prisma. El equivalente
funcional ya existe (`Tenant` = organizations + business_profile,
`TenantMember` = memberships), migrar 30 tablas es el rewrite que el propio
plan prohíbe, y se perderían 109 pruebas de aislamiento que hoy pasan. RLS es
de Postgres, no de Supabase: se puede agregar sobre Neon si se quiere defensa
en profundidad.

**Concesión:** el aislamiento actual es de aplicación (`paraTenant()`). Está
probado, pero un `where` mal escrito lo saltea. RLS como segunda red queda
propuesto para el Día 4, no como migración del Día 1.

**Análisis completo:** `docs/AUDITORIA-D1.md` §11.

---

## D-007 — Proveedor de voz · **PENDIENTE**

**Fecha:** 2026-08-20 · **Bloquea:** Día 3 Bloque 3

No hay nada de telefonía en el repo. Opciones: Vapi, Retell, o Twilio con
modelo propio. Decide costo, latencia y cuánto trabajo es el Día 3.

---

## D-005 — Migraciones versionadas en vez de `prisma db push`

**Fecha:** 2026-08-20 · **Estado:** aceptada, sin implementar (ticket D1-A)

El build de producción corre `prisma db push`, que aplica el schema sin
migración versionada y sin confirmar. Un cambio que borre una columna borra los
datos. La regla 10 del plan exige migraciones versionadas. Se pasa a
`prisma migrate deploy`.

---

## D-004 — Orquestador propio en vez de n8n

**Fecha:** 2026-08-04 · **Estado:** implementada

n8n no aísla tenants a nivel credencial, y el pedido lo prohíbe explícitamente.
Los 20 workflows existen como módulos en `src/lib/agente/`. n8n queda como capa
opcional de conectores vía webhook firmado. Detalle en
`docs/agente-24-7/ARQUITECTURA.md` §2.

---

## D-003 — Búsqueda de conocimiento léxica, no vectorial

**Fecha:** 2026-08-04 · **Estado:** implementada, con límite conocido

Anthropic no ofrece embeddings; sumar otro proveedor agregaba dependencia,
costo y un secreto más que rotar. Funciona hasta ~500 fragmentos por cliente.
Camino de upgrade a pgvector documentado.

---

## D-002 — El service worker no cachea datos

**Fecha:** 2026-08-04 · **Estado:** implementada

El panel muestra leads y conversaciones de varios negocios. Cachear respuestas
dejaría esos datos en el disco del dispositivo, visibles después de cerrar
sesión. Va a la red siempre; sin conexión muestra una pantalla que lo explica.

---

## D-001 — El acceso al panel falla cerrado

**Fecha:** 2026-08-04 · **Estado:** implementada

Sin `ADMIN_EMAILS` en producción no entra nadie. Antes, sin esa variable, el
sistema le daba acceso de administrador a la primera cuenta registrada: un
error de configuración terminaba en un desconocido viendo los datos de todos
los clientes.
