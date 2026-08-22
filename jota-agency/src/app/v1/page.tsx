import type { Metadata } from "next";
import { ServirLanding } from "@/components/ServirLanding";

/**
 * Landing 1, siempre, sin importar qué sirva la home.
 *
 * noindex: es el mismo contenido comercial que `/`. Dejarla indexable sería
 * contenido duplicado, y Google podría quedarse con esta URL en vez de con la
 * home. El canonical apunta a `/` por el mismo motivo.
 */
export const metadata: Metadata = {
  title: "Landing 1 — JOTA agency",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function V1() {
  return <ServirLanding version={1} />;
}
