"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"ES" | "EN">("ES");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = (es: string, en: string) => (lang === "ES" ? es : en);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || t("Error al iniciar sesión", "Login failed"));
    }
  }

  async function demoLogin() {
    setLoading(true);
    await fetch("/api/auth/demo", { method: "POST" });
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-20 pb-10">
      <div className="w-full max-w-sm flex justify-end mb-10">
        <div className="inline-flex rounded-lg overflow-hidden border border-border text-sm font-medium">
          {(["ES", "EN"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 transition-colors ${
                lang === l
                  ? "bg-gold-strong text-[#0a1020]"
                  : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center">
        <Logo size={64} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Jota Bot</h1>
        <p className="mt-1 text-muted">{t("Accedé a tu bot grid", "Access your grid bot")}</p>

        <form onSubmit={handleSubmit} className="w-full mt-8 flex flex-col gap-5">
          {error && (
            <div className="rounded-lg bg-red/10 border border-red/30 text-red text-sm px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-muted mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-surface border border-border px-4 py-3 outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-muted mb-2">
              {t("CONTRASEÑA", "PASSWORD")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-surface border border-border px-4 py-3 outline-none focus:border-gold transition-colors"
            />
            <div className="text-right mt-2">
              <Link href="#" className="text-sm text-muted hover:text-foreground">
                {t("¿Olvidaste tu contraseña?", "Forgot your password?")}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold py-3 transition-colors disabled:opacity-60"
          >
            {loading ? "..." : t("Entrar", "Sign in")}
          </button>
        </form>

        <div className="w-full flex items-center gap-3 my-6 text-xs text-muted">
          <span className="flex-1 h-px bg-border" />
          {t("O", "OR")}
          <span className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={demoLogin}
          disabled={loading}
          className="w-full rounded-lg bg-white text-[#1a1a1a] font-medium py-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-60"
        >
          <GoogleIcon />
          {t("Probar demo (cuenta de prueba)", "Try the demo account")}
        </button>

        <p className="mt-6 text-center text-xs text-muted leading-relaxed">
          {t(
            "El modo demo crea una cuenta de prueba con datos simulados. Sin riesgo.",
            "Demo mode creates a sandbox account with simulated data. No risk."
          )}
        </p>

        <p className="mt-6 text-sm text-muted">
          {t("¿Todavía no tenés cuenta?", "Don't have an account?")}{" "}
          <Link href="/register" className="text-gold-strong font-medium hover:underline">
            {t("Crear cuenta", "Create one")}
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 8.1 29.3 6 24 6 14.1 6 6 14.1 6 24s8.1 18 18 18 18-8.1 18-18c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m8.3 14.7 6.6 4.8C16.7 15.1 20 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 8.1 29.3 6 24 6 16.3 6 9.7 10.3 6.3 16.7z" />
      <path fill="#4CAF50" d="M24 42c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 37.6 16.2 42 24 42z" />
      <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 36.9 44 31 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
