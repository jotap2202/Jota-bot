import Link from "next/link";
import { Logo } from "@/components/Logo";
import { DemoButton } from "@/components/DemoButton";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-bold tracking-wide">JOTA BOT</span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted hover:text-foreground hidden sm:inline">Características</a>
          <a href="#pricing" className="text-muted hover:text-foreground hidden sm:inline">Precios</a>
          <Link href="/login" className="text-muted hover:text-foreground">Entrar</Link>
          <Link href="/register" className="rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold px-4 py-2 transition-colors">
            Crear cuenta
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted mb-6">
          <span className="w-2 h-2 rounded-full bg-green" /> Precios reales de Binance · Modo simulación sin riesgo
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
          Grid trading en <span className="text-gold-strong">piloto automático</span>
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Creá bots de rejilla, hacé backtest de tus estrategias y monitorizá tu cartera en tiempo
          real. Empezá en modo paper —sin dinero real— y pasá a live cuando estés listo.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <DemoButton className="rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold px-7 py-3.5 text-lg transition-colors">
            Probar la demo gratis →
          </DemoButton>
          <Link href="/register" className="rounded-lg border border-border px-7 py-3.5 text-lg text-foreground hover:bg-surface transition-colors">
            Crear cuenta
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted">Sin tarjeta. La demo crea una cuenta de prueba con bots de ejemplo.</p>
      </section>

      {/* Stats strip */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-3 rounded-xl border border-border overflow-hidden">
          {[
            { v: "7", l: "Pares soportados" },
            { v: "24/7", l: "Operación continua" },
            { v: "AES-256", l: "Credenciales cifradas" },
          ].map((s) => (
            <div key={s.l} className="bg-surface p-6 text-center border-r border-border last:border-r-0">
              <div className="text-2xl font-bold tabular text-gold-strong">{s.v}</div>
              <div className="text-xs text-muted mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center">Todo lo que necesitás para operar</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { i: "🤖", t: "Bots grid", d: "Definí rango, grids y apalancamiento. El bot compra abajo y vende arriba automáticamente." },
            { i: "🧪", t: "Backtest", d: "Probá tu estrategia sobre datos históricos reales antes de arriesgar un peso." },
            { i: "📊", t: "Dashboard en vivo", d: "Equity, PNL realizado y no realizado, exposición por par y curva de cartera." },
            { i: "📈", t: "Mercado en tiempo real", d: "Precios de Binance actualizados al segundo con tendencias visuales." },
            { i: "⇄", t: "Arbitraje", d: "Escáner de diferencias de precio entre exchanges para no perder oportunidades." },
            { i: "🔐", t: "Seguridad primero", d: "Tus API secrets se cifran con AES-256-GCM. Permisos de solo lectura + futuros, nunca retiros." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-border bg-surface p-6">
              <div className="text-3xl">{f.i}</div>
              <h3 className="mt-4 font-semibold text-lg">{f.t}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center">Planes simples</h2>
        <p className="text-center text-muted mt-2">Empezá gratis. Escalá cuando crezcas.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <Plan
            name="Free"
            price="$0"
            period="/mes"
            features={["1 bot activo", "Modo paper (simulación)", "Backtest básico", "Datos de mercado en vivo"]}
            cta="Empezar gratis"
            href="/register"
          />
          <Plan
            name="Pro"
            price="$29"
            period="/mes"
            highlight
            features={["10 bots activos", "Modo live (dinero real)", "Backtest ilimitado", "Arbitraje entre exchanges", "Soporte prioritario"]}
            cta="Probar Pro"
            href="/register"
          />
          <Plan
            name="Trader"
            price="$99"
            period="/mes"
            features={["Bots ilimitados", "Multi-exchange", "API y webhooks", "Estrategias avanzadas", "Gestor de cuenta"]}
            cta="Contactar"
            href="/register"
          />
        </div>
        <p className="text-center text-xs text-muted mt-8">
          Operar con dinero real implica riesgo financiero. Jota Bot no garantiza beneficios.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">¿Listo para automatizar tu trading?</h2>
        <div className="mt-8">
          <DemoButton className="rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold px-8 py-4 text-lg transition-colors">
            Probar la demo ahora →
          </DemoButton>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Logo size={22} /> <span>© {new Date().getFullYear()} Jota Bot</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-foreground">Entrar</Link>
            <a href="#pricing" className="hover:text-foreground">Precios</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Plan({
  name,
  price,
  period,
  features,
  cta,
  href,
  highlight,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 flex flex-col ${
        highlight ? "border-gold bg-gold/5 relative" : "border-border bg-surface"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold text-[#0a1020] text-xs font-semibold px-3 py-1">
          Más popular
        </span>
      )}
      <h3 className="font-semibold text-lg">{name}</h3>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-bold tabular">{price}</span>
        <span className="text-muted text-sm mb-1">{period}</span>
      </div>
      <ul className="mt-6 flex flex-col gap-3 text-sm flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-green mt-0.5">✓</span>
            <span className="text-muted">{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-6 rounded-lg py-2.5 text-center font-semibold transition-colors ${
          highlight
            ? "bg-gold hover:bg-gold-strong text-[#0a1020]"
            : "border border-border hover:bg-background text-foreground"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
