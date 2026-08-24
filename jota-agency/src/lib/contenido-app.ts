import type { Idioma } from "./contenido";

/**
 * Textos de /app — la página que explica la aplicación y la instala.
 *
 * Vive aparte de contenido.ts porque no es contenido de las landings: es una
 * página de producto, y mezclarla haría crecer un archivo que ya es grande.
 */

export type ContenidoApp = {
  titulo: string;
  bajada: string;
  paraQuien: { titulo: string; texto: string };
  quePuedo: { titulo: string; items: { t: string; d: string }[] };
  instalar: {
    titulo: string;
    boton: string;
    instalando: string;
    yaInstalada: string;
    yaInstaladaDesc: string;
    noDisponible: string;
    noDisponibleDesc: string;
  };
  manual: {
    titulo: string;
    plataformas: { nombre: string; pasos: string[] }[];
  };
  requisito: { titulo: string; texto: string; cta: string };
  limites: { titulo: string; items: string[] };
  volver: string;
};

export const APP_T: Record<Idioma, ContenidoApp> = {
  es: {
    titulo: "La app de JOTA",
    bajada:
      "El panel del agente, en tu pantalla de inicio. Mirás las conversaciones que están pasando ahora, respondés vos cuando hace falta, y ves qué leads entraron — sin abrir la computadora.",
    paraQuien: {
      titulo: "Para quién es",
      texto:
        "Para vos y para tu equipo, que operan el sistema. No es una app para los clientes finales: ellos hablan con el agente por el chat del sitio, por formulario o por email, sin instalar nada.",
    },
    quePuedo: {
      titulo: "Qué podés hacer desde el celular",
      items: [
        { t: "Ver las conversaciones en vivo", d: "Cada consulta que entra, con lo que respondió el agente y por qué." },
        { t: "Tomar el control de un hilo", d: "Responder vos, pausar la IA en esa conversación, o pasársela a alguien del equipo." },
        { t: "Revisar los leads", d: "Quién entró, con qué puntaje y con qué razones detrás de ese puntaje." },
        { t: "Aprobar respuestas", d: "En modo supervisado, revisás lo que el agente quiere contestar antes de que salga." },
        { t: "Ver el estado del sistema", d: "Qué está funcionando y qué está roto, con la consecuencia de cada cosa." },
      ],
    },
    instalar: {
      titulo: "Instalar",
      boton: "Instalar la app",
      instalando: "Abriendo el instalador…",
      yaInstalada: "Ya la tenés instalada",
      yaInstaladaDesc: "Estás usando la app ahora mismo. Buscá el ícono de JOTA en tu pantalla de inicio.",
      noDisponible: "Tu navegador no ofrece instalación automática",
      noDisponibleDesc: "Se instala igual, a mano. Abajo están los pasos para tu dispositivo.",
    },
    manual: {
      titulo: "Instalarla a mano",
      plataformas: [
        {
          nombre: "iPhone y iPad (Safari)",
          pasos: [
            "Abrí esta página en Safari — desde Chrome en iPhone no se puede.",
            "Tocá el botón de compartir, el cuadrado con la flecha hacia arriba.",
            "Bajá hasta «Agregar a pantalla de inicio».",
            "Tocá «Agregar».",
          ],
        },
        {
          nombre: "Android (Chrome)",
          pasos: [
            "Tocá el menú de tres puntos, arriba a la derecha.",
            "Elegí «Instalar aplicación» o «Agregar a pantalla de inicio».",
            "Confirmá.",
          ],
        },
        {
          nombre: "Computadora (Chrome o Edge)",
          pasos: [
            "Mirá el final de la barra de direcciones: hay un ícono de instalar.",
            "Si no aparece, andá al menú de tres puntos y buscá «Instalar».",
            "Queda como una aplicación más, con su ventana propia.",
          ],
        },
      ],
    },
    requisito: {
      titulo: "Necesitás una cuenta con acceso",
      texto:
        "La app abre directamente en el panel, que muestra leads y conversaciones de negocios reales. Si tu email no está autorizado, vas a ver la pantalla de acceso y nada más.",
      cta: "Entrar",
    },
    limites: {
      titulo: "Lo que conviene saber",
      items: [
        "No guarda datos en el dispositivo. El panel muestra información de clientes, y dejar copias en el teléfono sería una filtración si se pierde o se comparte. Sin conexión te avisa, no te muestra una versión vieja.",
        "Todavía no manda notificaciones al celular. Los avisos de lead caliente llegan por email.",
        "No está en App Store ni en Google Play, y no hace falta: se instala desde el navegador en un par de toques.",
        "Se actualiza sola. No hay nada que descargar de vuelta cuando sacamos una versión nueva.",
      ],
    },
    volver: "Volver al sitio",
  },

  en: {
    titulo: "The JOTA app",
    bajada:
      "The agent dashboard, on your home screen. See the conversations happening right now, step in when you need to, and check which leads came in — without opening a computer.",
    paraQuien: {
      titulo: "Who it's for",
      texto:
        "For you and your team, the people operating the system. It is not an app for your end customers: they talk to the agent through the chat on your site, a form or email, without installing anything.",
    },
    quePuedo: {
      titulo: "What you can do from your phone",
      items: [
        { t: "Watch conversations live", d: "Every inquiry as it comes in, with what the agent replied and why." },
        { t: "Take over a thread", d: "Reply yourself, pause the AI on that conversation, or hand it to someone on the team." },
        { t: "Review leads", d: "Who came in, with what score, and the reasons behind that score." },
        { t: "Approve replies", d: "In supervised mode, you review what the agent wants to say before it goes out." },
        { t: "Check system health", d: "What's working and what's broken, with the consequence of each." },
      ],
    },
    instalar: {
      titulo: "Install",
      boton: "Install the app",
      instalando: "Opening the installer…",
      yaInstalada: "You already have it installed",
      yaInstaladaDesc: "You're using the app right now. Look for the JOTA icon on your home screen.",
      noDisponible: "Your browser doesn't offer automatic installation",
      noDisponibleDesc: "It installs anyway, by hand. The steps for your device are below.",
    },
    manual: {
      titulo: "Install it manually",
      plataformas: [
        {
          nombre: "iPhone and iPad (Safari)",
          pasos: [
            "Open this page in Safari — it can't be done from Chrome on iPhone.",
            "Tap the share button, the square with the arrow pointing up.",
            "Scroll down to \"Add to Home Screen\".",
            "Tap \"Add\".",
          ],
        },
        {
          nombre: "Android (Chrome)",
          pasos: [
            "Tap the three-dot menu, top right.",
            "Choose \"Install app\" or \"Add to Home screen\".",
            "Confirm.",
          ],
        },
        {
          nombre: "Desktop (Chrome or Edge)",
          pasos: [
            "Look at the end of the address bar: there's an install icon.",
            "If it isn't there, open the three-dot menu and look for \"Install\".",
            "It becomes a regular application, with its own window.",
          ],
        },
      ],
    },
    requisito: {
      titulo: "You need an account with access",
      texto:
        "The app opens straight into the dashboard, which shows leads and conversations from real businesses. If your email isn't authorised, you'll see the sign-in screen and nothing else.",
      cta: "Sign in",
    },
    limites: {
      titulo: "Worth knowing",
      items: [
        "It stores no data on the device. The dashboard shows customer information, and leaving copies on a phone would be a leak if it's lost or shared. Offline it tells you so, instead of showing you a stale version.",
        "It doesn't send push notifications yet. Hot lead alerts arrive by email.",
        "It's not on the App Store or Google Play, and it doesn't need to be: it installs from the browser in a couple of taps.",
        "It updates itself. There's nothing to download again when we ship a new version.",
      ],
    },
    volver: "Back to the site",
  },
};
