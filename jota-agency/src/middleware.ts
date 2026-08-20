import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { destinoSeguro } from "@/lib/destino-seguro";
import { esRutaPublica } from "@/lib/rutas-publicas";

/**
 * Cierra por defecto.
 *
 * Hasta acá cada página y cada route se protegía sola, llamando a `auth()` y a
 * `esAdmin()`. Eso funciona y sigue funcionando — pero depende de que quien
 * agregue una ruta privada nueva se acuerde del guard. Una ruta sin guard no
 * falla: queda abierta, y no hay forma de notarlo mirando el diff de esa ruta.
 *
 * Este middleware invierte el default: todo pide sesión, salvo lo que esté
 * explícitamente en la lista de abajo. Agregar una ruta privada nueva no
 * requiere acordarse de nada; olvidarse de agregar una PÚBLICA rompe fuerte y
 * en la primera visita, que es la forma correcta de fallar.
 *
 * IMPORTANTE — esto NO reemplaza los guards que ya existen:
 *
 *   - Acá se verifica que haya una sesión válida, nada más. NO se verifica que
 *     esa persona sea administradora: eso lo sigue haciendo `esAdmin()` dentro
 *     de cada página, que es donde puede consultar la base.
 *   - Tener sesión ≠ poder ver el panel. Cualquiera puede registrarse en el
 *     sitio; solo los emails de ADMIN_EMAILS entran a /ceo.
 *
 * Es una segunda red, no la primera.
 */

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (esRutaPublica(pathname)) return NextResponse.next();

  const secret = process.env.AUTH_SECRET;
  const esApi = pathname.startsWith("/api/");

  // Sin secreto no se puede verificar nada. Antes que dejar pasar, se cierra:
  // es un error de configuración y tiene que doler en la primera visita, no
  // aparecer como un acceso indebido tres semanas después.
  if (!secret) {
    console.error(
      "[middleware] AUTH_SECRET no está configurada: no se puede verificar la sesión. " +
        "Todas las rutas privadas quedan cerradas hasta que se defina.",
    );
    return rechazar(req, esApi);
  }

  // NextAuth prefija la cookie con `__Secure-` cuando la URL es https. Se
  // prueban las dos formas para que funcione igual detrás del proxy de Vercel
  // y en localhost, sin depender de adivinar el entorno.
  const token =
    (await getToken({ req, secret, secureCookie: true })) ??
    (await getToken({ req, secret, secureCookie: false }));

  if (!token) return rechazar(req, esApi);

  return NextResponse.next();
}

function rechazar(req: NextRequest, esApi: boolean) {
  // Una API que responde con un redirect a HTML es un modo de falla horrible:
  // el cliente recibe 200 y una página de login donde esperaba JSON.
  if (esApi) {
    return NextResponse.json(
      { error: "no_autenticado", mensaje: "Esta ruta necesita sesión." },
      { status: 401 },
    );
  }

  const { pathname, search } = req.nextUrl;
  const login = new URL("/acceder", req.url);
  const destino = destinoSeguro(pathname + search);
  if (destino) login.searchParams.set("next", destino);
  return NextResponse.redirect(login);
}

export const config = {
  // Se excluyen los assets de Next y cualquier archivo con extensión
  // (sw.js, manifest.webmanifest, robots.txt, sitemap.xml, los íconos).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
