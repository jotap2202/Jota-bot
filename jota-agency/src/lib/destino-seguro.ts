/**
 * Valida a dónde se puede mandar a alguien después del login.
 *
 * El chequeo obvio —"que empiece con /"— no alcanza: `//evil.com` lo cumple, y
 * el navegador lo resuelve como URL absoluta a otro dominio. Eso es un open
 * redirect, y sirve para phishing: la víctima abre un link de jotaagency.org,
 * se loguea en el sitio real, y termina en el del atacante creyendo que sigue
 * en JOTA. `/\evil.com` es la misma trampa — algunos navegadores normalizan la
 * barra invertida a `//`.
 *
 * Devuelve la ruta si es segura, o null. Quien llama decide el default.
 */
export function destinoSeguro(valor: string | null | undefined): string | null {
  if (typeof valor !== "string" || !valor) return null;
  if (!valor.startsWith("/")) return null;
  if (valor.startsWith("//") || valor.startsWith("/\\")) return null;
  return valor;
}
