import type { Metadata } from "next";
import { ServirLanding } from "@/components/ServirLanding";

/**
 * Landing 2, siempre, sin importar qué sirva la home.
 *
 * noindex por la misma razón que /v1: mismo contenido comercial que `/`.
 */
export const metadata: Metadata = {
  title: "Landing 2 — JOTA agency",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function V2() {
  return <ServirLanding version={2} />;
}
