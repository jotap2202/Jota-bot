import { auth } from "@/auth";
import { Landing } from "@/components/Landing";
import { Landing2 } from "@/components/Landing2";
import { googleConfigurado } from "@/lib/config-auth";
import { idiomaActual } from "@/lib/idioma-servidor";
import { faltaEmpresa } from "@/lib/perfil";
import { landingActiva, type VersionLanding } from "@/lib/landing-activa";

/**
 * Resuelve los datos que necesitan las dos landings y renderiza la que toque.
 *
 * Vive acá y no en cada página para que `/`, `/v1` y `/v2` no tengan tres
 * copias de la misma carga de sesión — que es como empiezan a divergir.
 */
export async function ServirLanding({ version }: { version?: VersionLanding }) {
  const session = await auth();
  const email = session?.user?.email ?? null;

  const props = {
    userEmail: email,
    google: googleConfigurado(),
    faltaEmpresa: await faltaEmpresa(email),
    langInicial: await idiomaActual(),
  };

  const cual = version ?? landingActiva();
  return cual === 2 ? <Landing2 {...props} /> : <Landing {...props} />;
}
