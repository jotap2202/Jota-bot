"use client";

import { useEffect, useState } from "react";
import { COOKIE_IDIOMA, EMAIL_CONTACTO, IDIOMA_POR_DEFECTO, T, type Idioma } from "@/lib/contenido";
import { T2 } from "@/lib/contenido2";
import { AuthGate, DiagChat } from "@/components/Landing";
import { CompletarEmpresa } from "@/components/CompletarEmpresa";
import { EVENTOS, medir } from "@/lib/eventos-conversion";

/**
 * Landing 2 — la versión corporativa.
 *
 * Convive con la 1; ninguna reemplaza a la otra. Ver src/lib/landing-activa.ts.
 *
 * DECISIONES DE DISEÑO, y por qué:
 *
 * 1. Fondo claro. La 1 es oscura y dorada, que lee como agencia creativa. El
 *    software que las empresas compran es claro y de alto contraste. Es el
 *    cambio que más mueve la percepción, más que cualquier copy.
 *
 * 2. IBM Plex Sans para todo, sin la tipografía display de la 1. Es la
 *    tipografía corporativa de IBM y ya está cargada por el layout: cambia el
 *    registro por completo sin sumar una sola petición de red.
 *
 * 3. El dorado de JOTA se conserva, pero como acento sobre claro, en un tono
 *    más profundo para que pase contraste AA. La marca sigue siendo
 *    reconocible; lo que cambia es el registro.
 *
 * 4. Sin logos de clientes ni testimonios. No hay clientes todavía, y una
 *    página empresarial que los inventa se cae en la primera pregunta. La
 *    autoridad se construye acá con lo verificable: el mecanismo explicado con
 *    precisión, cómo se tratan los datos, y una sección entera dedicada a lo
 *    que el sistema NO hace.
 *
 * 5. El bloque de conversión es el MISMO componente que usa la Landing 1
 *    (AuthGate / DiagChat). Si el mecanismo difiriera, comparar la conversión
 *    de las dos no mediría el diseño: mediría dos formularios distintos. Va
 *    sobre fondo oscuro, que además es un patrón habitual de cierre en sitios
 *    corporativos.
 */

const mailto = (asunto: string) => `mailto:${EMAIL_CONTACTO}?subject=${encodeURIComponent(asunto)}`;

const Check = () => (
  <svg className="l2-chk" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Flecha = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" style={{ flex: "none" }}>
    <path d="M4 10h11M11 5.5L15.5 10 11 14.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cruz = () => (
  <svg className="l2-cruz" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
    <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function Landing2({
  userEmail,
  google = true,
  faltaEmpresa = false,
  langInicial = IDIOMA_POR_DEFECTO,
}: { userEmail?: string | null; google?: boolean; faltaEmpresa?: boolean; langInicial?: Idioma }) {
  const [lang, setLang] = useState<Idioma>(langInicial);
  const t = T2[lang];
  const td = T[lang].diag; // los textos del bloque de diagnóstico se comparten

  useEffect(() => {
    document.documentElement.lang = lang;
    document.cookie = `${COOKIE_IDIOMA}=${lang}; path=/; max-age=31536000; samesite=lax`;
  }, [lang]);

  // Aparición al hacer scroll. Con prefers-reduced-motion se muestra todo de
  // entrada en vez de no mostrarse nunca — el error que tenía la Landing 1 con
  // los contadores.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".l2-rev:not(.on)"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((e) => e.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("on");
        io.unobserve(e.target);
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [lang]);

  return (
    <div className="l2">
      <a href="#contenido" className="l2-skip">{T[lang].skip}</a>

      {/* ---------------- BARRA SUPERIOR ---------------- */}
      <div className="l2-barra">
        <div className="l2-wrap l2-barra-in">
          <span>{t.barra.nota}</span>
          <a href={mailto(T[lang].asuntoMail)}>{t.barra.contacto} <Flecha /></a>
        </div>
      </div>

      {/* ---------------- NAV ---------------- */}
      <header className="l2-nav">
        <div className="l2-wrap l2-nav-in">
          <a href="#contenido" className="l2-logo">
            <span className="l2-badge" aria-hidden>J</span>
            <span>JOTA <b>agency</b></span>
          </a>
          <nav className="l2-links" aria-label="Principal">
            <a href="#sistema">{t.nav.sistema}</a>
            <a href="#proceso">{t.nav.proceso}</a>
            <a href="#seguridad">{t.nav.seguridad}</a>
            <a href="#faq">{t.nav.faq}</a>
          </nav>
          <div className="l2-nav-acc">
            <div className="l2-idioma" role="group" aria-label="Idioma">
              {(["es", "en"] as Idioma[]).map((l) => (
                <button key={l} type="button" aria-pressed={lang === l}
                  aria-label={l === "es" ? "Español" : "English"} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="/acceder" className="l2-entrar">{t.nav.entrar}</a>
            <a href="#cierre" className="l2-btn l2-btn-sm"
              onClick={() => medir(EVENTOS.CTA_CLICK, { lugar: "l2_nav" })}>{t.nav.cta}</a>
          </div>
        </div>
      </header>

      <main id="contenido">
        {/* ---------------- HERO ---------------- */}
        <section className="l2-hero">
          <div className="l2-wrap">
            <p className="l2-eyebrow l2-rev">{t.hero.eyebrow}</p>
            <h1 className="l2-rev">
              {t.hero.titulo}<br />
              <span className="l2-oro">{t.hero.resaltado}</span>
            </h1>
            <p className="l2-lead l2-rev">{t.hero.sub}</p>
            <div className="l2-cta-fila l2-rev">
              <a href="#cierre" className="l2-btn"
                onClick={() => medir(EVENTOS.CTA_CLICK, { lugar: "l2_hero" })}>
                {t.hero.cta} <Flecha />
              </a>
              <a href="#sistema" className="l2-btn-2"
                onClick={() => medir(EVENTOS.CTA_CLICK, { lugar: "l2_hero_secundario" })}>
                {t.hero.cta2}
              </a>
            </div>
            <p className="l2-pie-cta l2-rev">{t.hero.pie}</p>
          </div>

          {/* Franja de confianza: hechos verificables del producto, no logos. */}
          <div className="l2-confianza">
            <div className="l2-wrap l2-confianza-in">
              {t.confianza.map((c, i) => (
                <div key={`${lang}-cf-${i}`} className="l2-cf">
                  <Check /><span>{c.texto}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- PROBLEMA ---------------- */}
        <section className="l2-sec" id="problema">
          <div className="l2-wrap">
            <div className="l2-cab l2-rev">
              <p className="l2-cap">{t.problema.cap}</p>
              <h2>{t.problema.titulo}</h2>
              <p className="l2-sub">{t.problema.texto}</p>
            </div>
            <div className="l2-grid4">
              {t.problema.puntos.map((p, i) => (
                <div key={`${lang}-pb-${i}`} className="l2-card l2-rev">
                  <h3>{p.titulo}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
            <p className="l2-fuente l2-rev">{t.problema.fuente}</p>
          </div>
        </section>

        {/* ---------------- EL SISTEMA ---------------- */}
        <section className="l2-sec l2-alt" id="sistema">
          <div className="l2-wrap">
            <div className="l2-cab l2-rev">
              <p className="l2-cap">{t.sistema.cap}</p>
              <h2>{t.sistema.titulo}</h2>
              <p className="l2-sub">{t.sistema.sub}</p>
            </div>
            <div className="l2-piezas">
              {t.sistema.piezas.map((p, i) => (
                <div key={`${lang}-sis-${i}`} className="l2-pieza l2-rev">
                  <div className="l2-pieza-n" aria-hidden>{String(i + 1).padStart(2, "0")}</div>
                  <div className="l2-pieza-t">
                    <h3>{p.nombre}</h3>
                    <p className="l2-pieza-d">{p.desc}</p>
                  </div>
                  <p className="l2-pieza-det">{p.detalle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- IMPLEMENTACIÓN ---------------- */}
        <section className="l2-sec" id="proceso">
          <div className="l2-wrap">
            <div className="l2-cab l2-rev">
              <p className="l2-cap">{t.proceso.cap}</p>
              <h2>{t.proceso.titulo}</h2>
              <p className="l2-sub">{t.proceso.sub}</p>
            </div>
            <ol className="l2-pasos">
              {t.proceso.pasos.map((p, i) => (
                <li key={`${lang}-ps-${i}`} className="l2-paso l2-rev">
                  <div className="l2-paso-n" aria-hidden>{p.n}</div>
                  <div>
                    <h3>{p.titulo}</h3>
                    <p>{p.desc}</p>
                    <span className="l2-quien">{p.quien}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- SEGURIDAD ---------------- */}
        <section className="l2-sec l2-alt" id="seguridad">
          <div className="l2-wrap">
            <div className="l2-cab l2-rev">
              <p className="l2-cap">{t.seguridad.cap}</p>
              <h2>{t.seguridad.titulo}</h2>
              <p className="l2-sub">{t.seguridad.sub}</p>
            </div>
            <div className="l2-grid3">
              {t.seguridad.items.map((s, i) => (
                <div key={`${lang}-sg-${i}`} className="l2-card l2-rev">
                  <h3><Check />{s.titulo}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- QUÉ NO HACE ---------------- */}
        <section className="l2-sec" id="limites">
          <div className="l2-wrap l2-angosto">
            <div className="l2-cab l2-rev">
              <p className="l2-cap">{t.limites.cap}</p>
              <h2>{t.limites.titulo}</h2>
              <p className="l2-sub">{t.limites.sub}</p>
            </div>
            <ul className="l2-limites">
              {t.limites.items.map((x, i) => (
                <li key={`${lang}-lm-${i}`} className="l2-rev"><Cruz /><span>{x}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- INTEGRACIONES ---------------- */}
        <section className="l2-sec l2-alt" id="integraciones">
          <div className="l2-wrap">
            <div className="l2-cab l2-rev">
              <p className="l2-cap">{t.integraciones.cap}</p>
              <h2>{t.integraciones.titulo}</h2>
            </div>
            <div className="l2-integra">
              {t.integraciones.items.map((x, i) => (
                <div key={`${lang}-in-${i}`} className={`l2-int l2-rev${x.estado === "pronto" ? " pronto" : ""}`}>
                  <span>{x.nombre}</span>
                  <span className="l2-tag">{x.estado === "listo" ? t.integraciones.listo : t.integraciones.pronto}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- QUÉ INCLUYE ---------------- */}
        <section className="l2-sec" id="incluye">
          <div className="l2-wrap">
            <div className="l2-cab l2-rev">
              <p className="l2-cap">{t.incluye.cap}</p>
              <h2>{t.incluye.titulo}</h2>
              <p className="l2-sub">{t.incluye.sub}</p>
            </div>
            <div className="l2-grid3">
              {t.incluye.columnas.map((c, i) => (
                <div key={`${lang}-ic-${i}`} className="l2-card l2-rev">
                  <h3>{c.titulo}</h3>
                  <ul className="l2-lista">
                    {c.items.map((x, j) => (<li key={j}><Check /><span>{x}</span></li>))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="l2-fuente l2-rev">{t.incluye.nota}</p>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="l2-sec l2-alt" id="faq">
          <div className="l2-wrap l2-angosto">
            <div className="l2-cab l2-rev">
              <p className="l2-cap">{t.faq.cap}</p>
              <h2>{t.faq.titulo}</h2>
            </div>
            <div className="l2-faq">
              {/* <details> nativo: accesible con teclado y lector de pantalla sin
                  JS, y funciona aunque falle la hidratación. */}
              {t.faq.items.map((f, i) => (
                <details key={`${lang}-fq-${i}`} className="l2-rev">
                  <summary><span>{f.p}</span><span className="l2-mas" aria-hidden>+</span></summary>
                  <p>{f.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CIERRE (oscuro, con el mismo portón que la L1) ---- */}
        <section className="l2-cierre" id="cierre">
          <div className="l2-wrap l2-angosto">
            <h2 className="l2-rev">{t.cierre.titulo}</h2>
            <p className="l2-rev">{t.cierre.sub}</p>
            <div className="l2-chat l2-rev">
              <div className="l2-chat-cab">
                <span className="l2-javatar" aria-hidden>J</span>
                <div>
                  <div className="l2-chat-n">J</div>
                  <div className="l2-chat-e">{td.online}</div>
                </div>
              </div>
              {!userEmail ? (
                <AuthGate lang={lang} google={google} />
              ) : faltaEmpresa ? (
                <CompletarEmpresa lang={lang} />
              ) : (
                <DiagChat lang={lang} email={userEmail} />
              )}
            </div>
            <p className="l2-nota l2-rev">
              {t.cierre.nota} · <a href={mailto(T[lang].asuntoMail)}>{EMAIL_CONTACTO}</a>
            </p>
          </div>
        </section>
      </main>

      {/* ---------------- PIE ---------------- */}
      <footer className="l2-pie">
        <div className="l2-wrap l2-pie-in">
          <div className="l2-pie-marca">
            <a href="#contenido" className="l2-logo">
              <span className="l2-badge" aria-hidden>J</span>
              <span>JOTA <b>agency</b></span>
            </a>
            <p>{t.pie.descripcion}</p>
            <a className="l2-pie-mail" href={mailto(T[lang].asuntoMail)}>{EMAIL_CONTACTO}</a>
          </div>
          {t.pie.secciones.map((s, i) => (
            <div key={`${lang}-pi-${i}`} className="l2-pie-col">
              <h4>{s.titulo}</h4>
              <ul>
                {s.links.map((l, j) => (<li key={j}><a href={l.href}>{l.texto}</a></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="l2-wrap l2-pie-legal">
          <span>© {new Date().getFullYear()} {t.pie.legal}</span>
        </div>
      </footer>
    </div>
  );
}
