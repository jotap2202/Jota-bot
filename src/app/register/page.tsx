"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Error al crear la cuenta");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-24 pb-10">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Logo size={64} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Crear cuenta</h1>
        <p className="mt-1 text-muted">Empezá a operar con Jota Bot</p>

        <form onSubmit={handleSubmit} className="w-full mt-8 flex flex-col gap-5">
          {error && (
            <div className="rounded-lg bg-red/10 border border-red/30 text-red text-sm px-3 py-2">
              {error}
            </div>
          )}
          <Field label="NOMBRE" value={name} onChange={setName} />
          <Field label="EMAIL" type="email" value={email} onChange={setEmail} required />
          <Field
            label="CONTRASEÑA"
            type="password"
            value={password}
            onChange={setPassword}
            required
            hint="Mínimo 6 caracteres"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold hover:bg-gold-strong text-[#0a070a] font-semibold py-3 transition-colors disabled:opacity-60"
          >
            {loading ? "..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-gold-strong font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-muted mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-surface border border-border px-4 py-3 outline-none focus:border-gold transition-colors"
      />
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}
