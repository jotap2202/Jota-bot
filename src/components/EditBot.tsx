"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

type BotCfg = {
  id: string;
  name: string;
  lowerPrice: number;
  upperPrice: number;
  grids: number;
  invested: number;
  leverage: number;
};

export function EditBot({ bot }: { bot: BotCfg }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(bot.name);
  const [lower, setLower] = useState(bot.lowerPrice);
  const [upper, setUpper] = useState(bot.upperPrice);
  const [grids, setGrids] = useState(bot.grids);
  const [invested, setInvested] = useState(bot.invested);
  const [leverage, setLeverage] = useState(bot.leverage);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/bots/${bot.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lowerPrice: lower, upperPrice: upper, grids, invested, leverage }),
    });
    setSaving(false);
    if (res.ok) {
      toast("Bot actualizado");
      setOpen(false);
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      toast(d.error || "No se pudo actualizar", "error");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        ✎ Editar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl">
            <h3 className="font-semibold text-lg">Editar bot</h3>
            <p className="text-xs text-muted mt-1">
              Cambiar la rejilla reinicia la simulación con los nuevos parámetros.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Field label="Nombre">
                <input value={name} onChange={(e) => setName(e.target.value)} className="inp" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Precio inferior">
                  <input type="number" value={lower} onChange={(e) => setLower(+e.target.value)} className="inp" />
                </Field>
                <Field label="Precio superior">
                  <input type="number" value={upper} onChange={(e) => setUpper(+e.target.value)} className="inp" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Grids">
                  <input type="number" value={grids} onChange={(e) => setGrids(+e.target.value)} className="inp" />
                </Field>
                <Field label="Inversión">
                  <input type="number" value={invested} onChange={(e) => setInvested(+e.target.value)} className="inp" />
                </Field>
                <Field label="Apalanc.">
                  <input type="number" value={leverage} onChange={(e) => setLeverage(+e.target.value)} className="inp" />
                </Field>
              </div>
            </div>

            <div className="mt-5 flex gap-3 justify-end">
              <button onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="rounded-lg bg-gold hover:bg-gold-strong text-[#0a070a] font-semibold px-5 py-2 text-sm transition-colors disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .inp {
          width: 100%;
          border-radius: 0.5rem;
          background: var(--background);
          border: 1px solid var(--border);
          padding: 0.55rem 0.75rem;
          font-size: 0.85rem;
          outline: none;
        }
        .inp:focus { border-color: var(--gold); }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}
