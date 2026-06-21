"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

type CredState = {
  connected: boolean;
  exchange?: string;
  mode?: string;
  apiKeyMasked?: string;
  updatedAt?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [cred, setCred] = useState<CredState | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [mode, setMode] = useState("paper");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/credentials");
    setCred(await res.json());
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, apiSecret, mode }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Credenciales guardadas y cifradas ✓");
      toast("Credenciales guardadas y cifradas");
      setApiKey("");
      setApiSecret("");
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Error al guardar");
      toast(d.error || "Error al guardar", "error");
    }
  }

  async function disconnect() {
    await fetch("/api/credentials", { method: "DELETE" });
    toast("Exchange desconectado");
    load();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Exchange credentials */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold">Credenciales del exchange</h2>
        <p className="text-sm text-muted mt-1">
          Tu API secret se cifra con <span className="text-gold-strong">AES-256-GCM</span> antes de
          guardarse. Nunca se muestra en texto plano.
        </p>

        <div className="mt-4 rounded-lg bg-background border border-border p-3 text-sm">
          {cred?.connected ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-green">● Conectado</span> · {cred.exchange} ·{" "}
                <span className="uppercase text-xs text-muted">{cred.mode}</span>
                <div className="text-muted tabular mt-1">API key: {cred.apiKeyMasked}</div>
              </div>
              <button onClick={disconnect} className="text-red text-sm hover:underline">
                Desconectar
              </button>
            </div>
          ) : (
            <span className="text-muted">Sin conexión. Estás en modo simulación (paper).</span>
          )}
        </div>

        <form onSubmit={save} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-wide text-muted mb-2">MODO</label>
            <div className="flex gap-2">
              {[
                { v: "paper", l: "Paper (simulación)" },
                { v: "testnet", l: "Testnet" },
                { v: "live", l: "Live (dinero real)" },
              ].map((m) => (
                <button
                  key={m.v}
                  type="button"
                  onClick={() => setMode(m.v)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    mode === m.v
                      ? "border-gold bg-gold/10 text-foreground"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {m.l}
                </button>
              ))}
            </div>
            {mode === "live" && (
              <p className="text-xs text-red mt-2">
                ⚠️ Modo Live opera con dinero real. Usá permisos de solo lectura + futuros, nunca
                retiros. Empezá con poco capital.
              </p>
            )}
          </div>

          <Field label="API KEY" value={apiKey} onChange={setApiKey} />
          <Field label="API SECRET" value={apiSecret} onChange={setApiSecret} type="password" />

          {msg && <p className="text-sm text-gold-strong">{msg}</p>}

          <button
            type="submit"
            disabled={saving}
            className="self-start rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold px-5 py-2.5 transition-colors disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar credenciales"}
          </button>
        </form>
      </section>

      {/* Account */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold">Cuenta</h2>
        <button
          onClick={logout}
          className="mt-4 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground hover:border-red hover:text-red transition-colors"
        >
          Cerrar sesión
        </button>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-muted mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-background border border-border px-4 py-3 outline-none focus:border-gold transition-colors tabular"
      />
    </div>
  );
}
