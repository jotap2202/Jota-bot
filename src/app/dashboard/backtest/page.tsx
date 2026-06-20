"use client";

import { useEffect, useState } from "react";
import { EquityChart } from "@/components/EquityChart";

type Pair = { pair: string; price: number };
type Result = {
  curve: { t: number; equity: number }[];
  stats: {
    totalReturnPct: number;
    totalPnl: number;
    realizedPnl: number;
    trades: number;
    maxDrawdownPct: number;
    apr: number;
    days: number;
  };
};

export default function BacktestPage() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [pair, setPair] = useState("BTC_USDT_Perp");
  const [days, setDays] = useState(14);
  const [band, setBand] = useState(10);
  const [grids, setGrids] = useState(20);
  const [invested, setInvested] = useState(100);
  const [leverage, setLeverage] = useState(2);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/pairs").then((r) => r.json()).then((d) => {
      setPairs(d.pairs);
      if (d.pairs[0]) setPair(d.pairs[0].pair);
    });
  }, []);

  async function run() {
    setLoading(true);
    const res = await fetch("/api/backtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pair, days, band, grids, invested, leverage }),
    });
    setResult(await res.json());
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">Backtest</h1>
        <p className="text-sm text-muted mt-1">
          Simulá una estrategia grid sobre el histórico antes de arrancarla.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <Field label="Par">
          <select value={pair} onChange={(e) => setPair(e.target.value)} className="input">
            {pairs.map((p) => (
              <option key={p.pair} value={p.pair}>{p.pair}</option>
            ))}
          </select>
        </Field>
        <Field label="Período (días)">
          <input type="number" min={1} max={90} value={days} onChange={(e) => setDays(+e.target.value)} className="input" />
        </Field>
        <Field label="Rango ±%">
          <input type="number" min={2} max={40} value={band} onChange={(e) => setBand(+e.target.value)} className="input" />
        </Field>
        <Field label="Grids">
          <input type="number" min={2} max={200} value={grids} onChange={(e) => setGrids(+e.target.value)} className="input" />
        </Field>
        <Field label="Inversión">
          <input type="number" min={10} value={invested} onChange={(e) => setInvested(+e.target.value)} className="input" />
        </Field>
        <Field label="Apalancamiento">
          <input type="number" min={1} max={20} value={leverage} onChange={(e) => setLeverage(+e.target.value)} className="input" />
        </Field>
        <div className="col-span-2 md:col-span-3">
          <button
            onClick={run}
            disabled={loading}
            className="rounded-lg bg-gold hover:bg-gold-strong text-[#0a1020] font-semibold px-5 py-2.5 transition-colors disabled:opacity-60"
          >
            {loading ? "Calculando..." : "Ejecutar backtest"}
          </button>
        </div>
      </div>

      {result?.stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-xl border border-border overflow-hidden">
            <Stat label="RETORNO" value={`${result.stats.totalReturnPct > 0 ? "+" : ""}${result.stats.totalReturnPct}%`} cls={result.stats.totalReturnPct >= 0 ? "text-green" : "text-red"} />
            <Stat label="APR EST." value={`${result.stats.apr}%`} cls={result.stats.apr >= 0 ? "text-green" : "text-red"} />
            <Stat label="MAX DRAWDOWN" value={`${result.stats.maxDrawdownPct}%`} cls="text-red" />
            <Stat label="TRADES" value={String(result.stats.trades)} />
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-xs font-semibold tracking-wide text-muted">EQUITY SIMULADA ({result.stats.days}d)</div>
            <div className="mt-2"><EquityChart data={result.curve} height={260} /></div>
          </div>
        </>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.5rem;
          background: var(--background);
          border: 1px solid var(--border);
          padding: 0.6rem 1rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--gold);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-muted mb-2">{label}</label>
      {children}
    </div>
  );
}

function Stat({ label, value, cls = "" }: { label: string; value: string; cls?: string }) {
  return (
    <div className="bg-surface p-5 border-r border-b border-border last:border-r-0">
      <div className="text-xs font-semibold tracking-wide text-muted">{label}</div>
      <div className={`text-xl font-bold mt-2 tabular ${cls}`}>{value}</div>
    </div>
  );
}
