"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Pair = { pair: string; price: number };

export default function NewBotPage() {
  const router = useRouter();
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [name, setName] = useState("");
  const [pair, setPair] = useState("");
  const [band, setBand] = useState(10); // % around current price
  const [grids, setGrids] = useState(20);
  const [invested, setInvested] = useState(100);
  const [leverage, setLeverage] = useState(2);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/pairs")
      .then((r) => r.json())
      .then((d) => {
        setPairs(d.pairs);
        if (d.pairs[0]) setPair(d.pairs[0].pair);
      });
  }, []);

  const price = useMemo(() => pairs.find((p) => p.pair === pair)?.price ?? 0, [pairs, pair]);
  const lower = useMemo(() => +(price * (1 - band / 100)).toFixed(price < 1 ? 5 : 2), [price, band]);
  const upper = useMemo(() => +(price * (1 + band / 100)).toFixed(price < 1 ? 5 : 2), [price, band]);
  const perGrid = useMemo(
    () => (invested * leverage) / Math.max(grids, 1),
    [invested, leverage, grids]
  );

  async function create(start: boolean) {
    setError("");
    setSaving(true);
    const res = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || `${pair.split("_")[0]} Grid`,
        pair,
        lowerPrice: lower,
        upperPrice: upper,
        grids,
        invested,
        leverage,
        start,
      }),
    });
    setSaving(false);
    if (res.ok) {
      const d = await res.json();
      router.push(`/dashboard/bots/${d.id}`);
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Error al crear el bot");
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/bots" className="text-muted hover:text-foreground">←</Link>
        <h1 className="text-3xl font-bold">Nuevo bot grid</h1>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-5">
        <Row label="Nombre">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${pair.split("_")[0] || "BTC"} Grid`}
            className="w-full rounded-lg bg-background border border-border px-4 py-2.5 outline-none focus:border-gold"
          />
        </Row>

        <Row label="Par">
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="w-full rounded-lg bg-background border border-border px-4 py-2.5 outline-none focus:border-gold tabular"
          >
            {pairs.map((p) => (
              <option key={p.pair} value={p.pair}>
                {p.pair} — ${p.price}
              </option>
            ))}
          </select>
        </Row>

        <Row label={`Rango de precios (±${band}%)`}>
          <input
            type="range"
            min={2}
            max={40}
            value={band}
            onChange={(e) => setBand(Number(e.target.value))}
            className="w-full accent-[var(--gold)]"
          />
          <div className="flex justify-between text-sm text-muted tabular mt-2">
            <span>Inferior: <span className="text-foreground">${lower}</span></span>
            <span>Actual: ${price}</span>
            <span>Superior: <span className="text-foreground">${upper}</span></span>
          </div>
        </Row>

        <div className="grid grid-cols-3 gap-4">
          <Row label="Grids">
            <input
              type="number"
              min={2}
              max={200}
              value={grids}
              onChange={(e) => setGrids(Number(e.target.value))}
              className="w-full rounded-lg bg-background border border-border px-4 py-2.5 outline-none focus:border-gold tabular"
            />
          </Row>
          <Row label="Inversión (USDT)">
            <input
              type="number"
              min={10}
              value={invested}
              onChange={(e) => setInvested(Number(e.target.value))}
              className="w-full rounded-lg bg-background border border-border px-4 py-2.5 outline-none focus:border-gold tabular"
            />
          </Row>
          <Row label="Apalancamiento">
            <input
              type="number"
              min={1}
              max={20}
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="w-full rounded-lg bg-background border border-border px-4 py-2.5 outline-none focus:border-gold tabular"
            />
          </Row>
        </div>

        <div className="rounded-lg bg-background border border-border p-4 text-sm flex flex-col gap-1">
          <div className="flex justify-between"><span className="text-muted">Capital efectivo</span><span className="tabular">${(invested * leverage).toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Orden por grid</span><span className="tabular">${perGrid.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Separación entre grids</span><span className="tabular">${((upper - lower) / Math.max(grids, 1)).toFixed(price < 1 ? 5 : 2)}</span></div>
        </div>

        {error && <p className="text-sm text-red">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => create(true)}
            disabled={saving || !pair}
            className="rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold px-5 py-2.5 transition-colors disabled:opacity-60"
          >
            Crear y arrancar
          </button>
          <button
            onClick={() => create(false)}
            disabled={saving || !pair}
            className="rounded-lg border border-border px-5 py-2.5 text-muted hover:text-foreground transition-colors disabled:opacity-60"
          >
            Crear pausado
          </button>
        </div>
        <p className="text-xs text-muted">
          Modo simulación (paper). No se ejecutan órdenes reales hasta que conectes un exchange en
          modo Live desde Settings.
        </p>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-muted mb-2">{label}</label>
      {children}
    </div>
  );
}
