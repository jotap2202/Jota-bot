/**
 * Cuál de las dos landings sirve la home.
 *
 * Hay dos versiones vivas al mismo tiempo, a propósito:
 *
 *   Landing 1  la original. Oscura, dorada, tono de agencia boutique.
 *   Landing 2  corporativa. Fondo claro, navy, estructura de SaaS B2B.
 *
 * No es que una reemplace a la otra: la idea es poder compararlas con tráfico
 * real y quedarse con la que convierta, sin tener que rehacer nada.
 *
 * Cómo se elige:
 *
 *   `/`    sirve la que diga LANDING_ACTIVA (por defecto la 1)
 *   `/v1`  siempre la 1, para mirarla cuando la home sirve la otra
 *   `/v2`  siempre la 2
 *
 * `/v1` y `/v2` son `noindex`. Dos URLs con el mismo contenido comercial es
 * contenido duplicado: Google elegiría una por su cuenta y podría quedarse con
 * la de preview en vez de con la home.
 *
 * Para cambiar cuál se sirve en producción alcanza con mover LANDING_ACTIVA en
 * Vercel y volver a deployar. No hay que tocar código ni borrar la otra.
 */

export type VersionLanding = 1 | 2;

export function landingActiva(): VersionLanding {
  return process.env.LANDING_ACTIVA?.trim() === "2" ? 2 : 1;
}
