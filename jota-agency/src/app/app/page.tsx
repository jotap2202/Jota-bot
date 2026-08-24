import type { Metadata } from "next";
import { InstalarApp } from "@/components/InstalarApp";
import { idiomaActual } from "@/lib/idioma-servidor";

/**
 * /app — explica la aplicación y la instala.
 *
 * Es indexable, a diferencia de /panel o /ceo: no muestra ningún dato, solo
 * explica qué es la app y cómo ponerla en la pantalla de inicio. Es, además,
 * la segunda página con contenido propio del sitio.
 */
export const metadata: Metadata = {
  title: "La app de JOTA — el panel en tu pantalla de inicio",
  description:
    "Instalá el panel de JOTA en el celular: conversaciones en vivo, leads y estado del agente. Se instala desde el navegador, sin pasar por ninguna tienda.",
  alternates: { canonical: "/app" },
};

export default async function PaginaApp() {
  return <InstalarApp langInicial={await idiomaActual()} />;
}
