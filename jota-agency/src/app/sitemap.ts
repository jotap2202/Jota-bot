import type { MetadataRoute } from "next";
import { SITIO_URL } from "@/lib/sitio";

/**
 * Sitemap.
 *
 * Solo lleva lo que queremos que Google indexe. Hoy eso es una sola página: la
 * landing. No es un olvido — es lo que hay:
 *
 *   /panel, /ceo, /acceder → privadas, con robots noindex
 *   /diagnostico           → pública pero con noindex a propósito: el contenido
 *                            real está detrás del registro, así que indexarla
 *                            solo lleva gente a un formulario vacío
 *
 * Un sitemap que lista URLs no indexables le manda señales contradictorias a
 * Google: la URL está en el sitemap ("indexame") y en robots ("no me indexes").
 * Cuando existan páginas por rubro o casos de estudio, se suman acá.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITIO_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      // /app sí es indexable: explica qué es la aplicación y cómo instalarla,
      // sin mostrar ningún dato. Es la segunda página con contenido propio.
      url: `${SITIO_URL}/app`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
