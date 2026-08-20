# KNOWN_ISSUES.md

Problemas conocidos, sin maquillar. Severidad: Critical / High / Medium / Low.

Última actualización: 2026-08-20 (auditoría D1.1)

---

## High

### KI-001 — `prisma db push` corre en el build de producción
El build es `prisma generate && prisma db push && next build`. Cada deploy
aplica el schema a la base de `DATABASE_URL`, sin migración versionada, sin
confirmar y sin backup previo. Un cambio que elimine una columna elimina los
datos.
**Ticket:** D1-A · **Rollback:** restaurar backup de Neon (point-in-time).

### KI-002 — Un solo entorno: staging y producción comparten base
No existe entorno de staging separado. Probar contra producción es hoy el
único camino.
**Ticket:** D1-B.

### KI-003 — Emails no salen del dominio propio
El dominio no está verificado en Resend. Sin verificar, Resend solo permite
enviar desde `onboarding@resend.dev` y solo a la casilla dueña de la cuenta.
Con `RESEND_API_KEY` ausente los emails quedan marcados como *simulados* — se
ven en el panel y no salen. El panel lo dice, no miente sobre el envío.
**Depende de:** acción del dueño en Resend.

---

## Medium

### KI-004 — Sin `middleware.ts`: las rutas privadas no cierran por defecto
La autorización se resuelve por página/route server-side. Es correcto donde
está aplicado, pero una ruta privada nueva queda abierta si alguien olvida el
guard.
**Ticket:** D1-F.

### KI-005 — El aislamiento entre negocios es de aplicación, no de base
`paraTenant()` es la única puerta y hay 109 pruebas que lo verifican, pero un
`where` escrito a mano en código nuevo lo saltea. RLS de Postgres sería una
segunda red.
**Decisión:** D-006.

### KI-006 — El panel corta en 500 leads, sin paginación
Tope duro. Con un cliente de volumen alto, deja de mostrar leads reales.

### KI-007 — La disponibilidad del calendario es local
Sale de los horarios del negocio menos las citas de nuestra base. Si el dueño
se anota algo en su Google Calendar, el agente no lo ve y puede ofrecer un
horario ocupado. La interfaz `ProveedorCalendario` está lista para enchufarlo.

### KI-008 — El tag `pre-platform-backup` no subió al remoto
Creado localmente el 2026-08-20; el push falla con desconexión tras 4
reintentos. **Mitigación:** `origin/main` apunta al mismo commit (`19d4ac7`),
así que el punto de retorno existe igual en GitHub. Reintentar el push del tag.

---

## Low

### KI-009 — Rate limit en memoria
En serverless cada instancia tiene el suyo. Frena abuso repetido, no un ataque
distribuido.

### KI-010 — La búsqueda de conocimiento es léxica
Funciona bien hasta ~500 fragmentos por cliente. Ver D-003.

### KI-011 — Dos paradigmas de estilos conviviendo
`AuthForm.tsx` usa clases de Tailwind; `Landing.tsx` usa clases custom de
`globals.css` más estilos inline.

### KI-012 — `bcryptjs` en versiones distintas entre apps
jota-agency usa 2.x, el proyecto raíz 3.x. Sin impacto de seguridad.
