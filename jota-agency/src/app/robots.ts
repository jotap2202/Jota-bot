import type { MetadataRoute } from "next";
import { SITIO_URL } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // "/ceo" faltaba: el CEO Command Center —leads, conversaciones y datos de
      // los clientes— estaba permitido para los crawlers. Nunca fue accesible
      // sin sesión, así que no había fuga de datos, pero sus URLs sí podían
      // terminar indexadas como páginas de error o de login.
      disallow: ["/panel", "/ceo", "/acceder", "/diagnostico", "/api/"],
    },
    sitemap: `${SITIO_URL}/sitemap.xml`,
    host: SITIO_URL,
  };
}
