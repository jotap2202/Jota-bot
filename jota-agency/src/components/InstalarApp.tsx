"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { APP_T } from "@/lib/contenido-app";
import { IDIOMA_POR_DEFECTO, type Idioma } from "@/lib/contenido";

/**
 * La página /app: explica la aplicación y la instala.
 *
 * CÓMO SE INSTALA UNA PWA, QUE NO ES OBVIO
 *
 * No es un archivo que se baja. El navegador la instala solo si la página
 * cumple tres condiciones: HTTPS, un manifiesto válido y un service worker con
 * handler de fetch. Las tres están; lo que cambia es cómo se dispara.
 *
 *   Chrome / Edge   disparan `beforeinstallprompt`. Se captura el evento y se
 *                   guarda para poder mostrar un botón propio en vez del
 *                   cartel del navegador, que aparece cuando quiere.
 *   Safari / iOS    NO tienen API de instalación. No hay forma de mostrar un
 *                   botón que funcione: hay que guiar a la persona por
 *                   Compartir → Agregar a pantalla de inicio. Fingir un botón
 *                   que no hace nada sería peor que no tenerlo.
 *   Firefox         no instala PWA en escritorio.
 *
 * Por eso la página muestra el botón cuando el navegador lo permite, y los
 * pasos a mano SIEMPRE — son el único camino para iPhone, que es la mitad de
 * los teléfonos.
 */

/** El evento no está en lib.dom: Chrome lo define, el estándar todavía no. */
type EventoInstalar = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Estado = "esperando" | "disponible" | "instalando" | "instalada" | "sin-soporte";

const Check = () => (
  <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true" className="ap-chk">
    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function InstalarApp({ langInicial = IDIOMA_POR_DEFECTO }: { langInicial?: Idioma }) {
  const t = APP_T[langInicial];
  const [estado, setEstado] = useState<Estado>("esperando");
  const [evento, setEvento] = useState<EventoInstalar | null>(null);

  useEffect(() => {
    // Si ya corre como app instalada, no tiene sentido ofrecer instalarla.
    const yaEsApp =
      window.matchMedia("(display-mode: standalone)").matches ||
      // Safari en iOS no soporta display-mode y usa esta propiedad propia.
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (yaEsApp) {
      setEstado("instalada");
      return;
    }

    const alDisparar = (e: Event) => {
      // Sin esto Chrome muestra su propio cartel, en el momento que él decida.
      e.preventDefault();
      setEvento(e as EventoInstalar);
      setEstado("disponible");
    };
    window.addEventListener("beforeinstallprompt", alDisparar);

    const alInstalar = () => setEstado("instalada");
    window.addEventListener("appinstalled", alInstalar);

    // El evento se dispara enseguida o no se dispara nunca. Si a los 2,5s no
    // llegó, este navegador no instala solo y hay que mostrar los pasos a mano
    // en vez de dejar a la persona esperando un botón que no va a aparecer.
    const t0 = setTimeout(() => setEstado((e) => (e === "esperando" ? "sin-soporte" : e)), 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", alDisparar);
      window.removeEventListener("appinstalled", alInstalar);
      clearTimeout(t0);
    };
  }, []);

  async function instalar() {
    if (!evento) return;
    setEstado("instalando");
    try {
      await evento.prompt();
      const { outcome } = await evento.userChoice;
      // El evento se consume: si dice que no, no se puede volver a usar el
      // mismo. Se vuelve a los pasos manuales en vez de dejar un botón muerto.
      setEvento(null);
      setEstado(outcome === "accepted" ? "instalada" : "sin-soporte");
    } catch {
      setEvento(null);
      setEstado("sin-soporte");
    }
  }

  return (
    <div className="ap">
      <header className="ap-cab">
        <Link href="/" className="ap-logo">
          <span className="ap-badge" aria-hidden>J</span>
          <span>JOTA <b>agency</b></span>
        </Link>
        <Link href="/" className="ap-volver">{t.volver}</Link>
      </header>

      <main className="ap-main">
        <section className="ap-hero">
          <h1>{t.titulo}</h1>
          <p className="ap-bajada">{t.bajada}</p>

          {/* --- Estado de instalación --- */}
          <div className="ap-caja" aria-live="polite">
            {estado === "instalada" ? (
              <>
                <p className="ap-ok"><Check />{t.instalar.yaInstalada}</p>
                <p className="ap-caja-d">{t.instalar.yaInstaladaDesc}</p>
              </>
            ) : estado === "disponible" || estado === "instalando" ? (
              <>
                <button type="button" className="ap-btn" onClick={instalar} disabled={estado === "instalando"}>
                  {estado === "instalando" ? t.instalar.instalando : t.instalar.boton}
                </button>
                <p className="ap-caja-d">{t.paraQuien.texto}</p>
              </>
            ) : estado === "esperando" ? (
              <p className="ap-caja-d">…</p>
            ) : (
              <>
                <p className="ap-titulillo">{t.instalar.noDisponible}</p>
                <p className="ap-caja-d">{t.instalar.noDisponibleDesc}</p>
              </>
            )}
          </div>
        </section>

        <section className="ap-sec">
          <h2>{t.paraQuien.titulo}</h2>
          <p>{t.paraQuien.texto}</p>
        </section>

        <section className="ap-sec">
          <h2>{t.quePuedo.titulo}</h2>
          <ul className="ap-lista">
            {t.quePuedo.items.map((x, i) => (
              <li key={i}><Check /><div><b>{x.t}</b><span>{x.d}</span></div></li>
            ))}
          </ul>
        </section>

        <section className="ap-sec">
          <h2>{t.manual.titulo}</h2>
          <div className="ap-plats">
            {t.manual.plataformas.map((p, i) => (
              <div key={i} className="ap-plat">
                <h3>{p.nombre}</h3>
                <ol>{p.pasos.map((s, j) => (<li key={j}>{s}</li>))}</ol>
              </div>
            ))}
          </div>
        </section>

        <section className="ap-sec ap-aviso">
          <h2>{t.requisito.titulo}</h2>
          <p>{t.requisito.texto}</p>
          <a href="/acceder" className="ap-btn ap-btn-2">{t.requisito.cta}</a>
        </section>

        <section className="ap-sec">
          <h2>{t.limites.titulo}</h2>
          <ul className="ap-limites">
            {t.limites.items.map((x, i) => (<li key={i}>{x}</li>))}
          </ul>
        </section>
      </main>
    </div>
  );
}
