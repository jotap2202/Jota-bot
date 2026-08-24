/**
 * Qué se sirve sin sesión. Todo lo que no esté acá la pide.
 *
 * Vive aparte de `middleware.ts` para poder probarse sin levantar el runtime
 * de Next: una lista de rutas públicas es exactamente el tipo de cosa que hay
 * que poder verificar en una prueba, no en producción.
 */

/**
 * Cada entrada matchea la ruta exacta o cualquier subruta:
 * `/acceder` cubre `/acceder/estado`, pero NO cubre `/accederotracosa`.
 */
export const RUTAS_PUBLICAS = [
  "/", // landing
  "/v1", // landing 1 forzada — para comparar sin cambiar la home
  "/v2", // landing 2 forzada
  "/app", // explica e instala la PWA — no muestra ningún dato
  "/acceder", // login y registro (+ /acceder/estado)
  "/diagnostico", // el gancho comercial: la página es pública, el gate está adentro

  "/api/auth", // NextAuth
  "/api/registro", // alta de cuenta
  "/api/diagnostico", // lo llama /diagnostico

  // Los canales de entrada del agente son públicos A PROPÓSITO: el widget los
  // llama desde el sitio del cliente, donde no hay ninguna sesión de JOTA.
  // No quedan sin proteger — cada uno tiene su propia autenticación, que el
  // middleware no puede hacer por ellos:
  //   chat/form/widget → clave pública del tenant + rate limit por clave e IP
  //   email            → HMAC del proveedor
  //   cron             → CRON_SECRET
  // Y todos solo pueden CREAR mensajes en un tenant; ninguno lee nada.
  "/api/agente",
] as const;

export function esRutaPublica(ruta: string): boolean {
  return RUTAS_PUBLICAS.some((p) => ruta === p || ruta.startsWith(`${p}/`));
}
