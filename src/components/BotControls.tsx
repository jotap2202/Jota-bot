"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./ToastProvider";

export function BotControls({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  async function setStatus(s: string) {
    setBusy(true);
    const res = await fetch(`/api/bots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    setBusy(false);
    if (res.ok) {
      toast(s === "running" ? "Bot arrancado" : "Bot pausado");
      router.refresh();
    } else {
      toast("No se pudo actualizar el bot", "error");
    }
  }

  async function remove() {
    if (!confirm("¿Eliminar este bot? No se puede deshacer.")) return;
    setBusy(true);
    const res = await fetch(`/api/bots/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Bot eliminado");
      router.push("/dashboard/bots");
      router.refresh();
    } else {
      setBusy(false);
      toast("No se pudo eliminar", "error");
    }
  }

  return (
    <div className="flex gap-2">
      {status === "running" ? (
        <button
          onClick={() => setStatus("paused")}
          disabled={busy}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:text-foreground text-muted transition-colors disabled:opacity-60"
        >
          ⏸ Pausar
        </button>
      ) : (
        <button
          onClick={() => setStatus("running")}
          disabled={busy}
          className="rounded-lg bg-green/15 border border-green/40 text-green px-4 py-2 text-sm transition-colors disabled:opacity-60"
        >
          ▶ Arrancar
        </button>
      )}
      <button
        onClick={remove}
        disabled={busy}
        className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-red hover:border-red transition-colors disabled:opacity-60"
      >
        Eliminar
      </button>
    </div>
  );
}
