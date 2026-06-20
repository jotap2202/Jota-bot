"use client";

import { useEffect, useState } from "react";

type Opp = {
  pair: string;
  buyOn: string;
  buyPrice: number;
  sellOn: string;
  sellPrice: number;
  spreadPct: number;
};

export default function ArbitragePage() {
  const [opps, setOpps] = useState<Opp[]>([]);

  useEffect(() => {
    const load = () =>
      fetch("/api/arbitrage").then((r) => r.json()).then((d) => setOpps(d.opportunities));
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">Arbitrage</h1>
        <p className="text-sm text-muted mt-1">
          Diferencias de precio entre exchanges (actualiza cada 4s).
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold tracking-wide text-muted bg-surface border-b border-border">
          <div className="col-span-3">PAR</div>
          <div className="col-span-3">COMPRAR EN</div>
          <div className="col-span-3">VENDER EN</div>
          <div className="col-span-3 text-right">SPREAD</div>
        </div>
        {opps.map((o) => {
          const good = o.spreadPct >= 0.15;
          return (
            <div key={o.pair} className="grid grid-cols-12 items-center px-5 py-4 border-b border-border last:border-b-0">
              <div className="col-span-3 font-medium tabular">{o.pair}</div>
              <div className="col-span-3 text-sm">
                <span className="text-green">{o.buyOn}</span>
                <span className="text-muted tabular"> ${o.buyPrice}</span>
              </div>
              <div className="col-span-3 text-sm">
                <span className="text-red">{o.sellOn}</span>
                <span className="text-muted tabular"> ${o.sellPrice}</span>
              </div>
              <div className={`col-span-3 text-right tabular font-semibold ${good ? "text-green" : "text-muted"}`}>
                {o.spreadPct}%
              </div>
            </div>
          );
        })}
        {opps.length === 0 && (
          <div className="px-5 py-10 text-center text-muted text-sm">Escaneando exchanges...</div>
        )}
      </div>
      <p className="text-xs text-muted">
        Datos simulados con fines de demostración. La ejecución real de arbitraje requiere conectar
        varios exchanges y tener en cuenta comisiones y latencia.
      </p>
    </div>
  );
}
