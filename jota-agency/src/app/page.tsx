import { ServirLanding } from "@/components/ServirLanding";

/**
 * La home sirve la landing que indique LANDING_ACTIVA (ver
 * src/lib/landing-activa.ts). Para mirar la otra sin cambiar nada están
 * /v1 y /v2.
 */
export default async function Home() {
  return <ServirLanding />;
}
