# KNOWN_ISSUES.md

Problemas conocidos, sin maquillar. Severidad: Critical / High / Medium / Low.

Última actualización: 2026-08-20 (auditoría D1.1)

---

## High

### ~~KI-013 — Acción requerida: baseline de migraciones~~ · RESUELTO
El build requería que alguien corriera `prisma migrate resolve --applied
0_init` a mano contra producción antes del próximo deploy, o el deploy fallaba
con `P3005`. **Resuelto:** `prisma/desplegar.mjs` lo detecta y lo hace solo,
pero solo después de verificar que el esquema real de la base coincide
exactamente con el del repositorio. Si no coincide, se niega y rompe el deploy
con las diferencias impresas. Los cuatro caminos —base vacía, ya migrada, de
`db push`, y con drift— están probados contra un PostgreSQL 16 real.
**Ya no requiere ninguna acción del dueño.**

### ~~KI-001 — `prisma db push` corre en el build de producción~~ · RESUELTO
El build era `prisma generate && prisma db push && next build`: cada deploy
aplicaba el schema sin migración versionada, sin confirmar y sin backup.
**Resuelto en D1-A**: el build usa `prisma migrate deploy` y existe la
migración `0_init`. Se verificó contra un Postgres real que la base creada por
`db push` y la creada por la migración son idénticas, y que las 109 pruebas de
integración pasan contra la base migrada. Queda KI-013 como paso operativo.

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
