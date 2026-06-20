"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkline } from "@/components/Sparkline";

type Market = { pair: string; price: number; changePct: number; spark: number[] };

export default function MarketPage() {
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    const load = () =>
      fetch("/api/market").then((r) => r.json()).then((d) => setMarkets(d.markets));
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">Market</h1>
        <p className="text-sm text-muted mt-1">Precios en tiempo real (actualiza cada 5s)</p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold tracking-wide text-muted bg-surface border-b border-border">
          <div className="col-span-4">PAR</div>
          <div className="col-span-3 text-right">PRECIO</div>
          <div className="col-span-2 text-right">24H</div>
          <div className="col-span-3 text-right">TENDENCIA</div>
        </div>
        {markets.map((m) => {
          const up = m.changePct >= 0;
          return (
            <div
              key={m.pair}
              className="grid grid-cols-12 items-center px-5 py-4 border-b border-border last:border-b-0 hover:bg-surface/40 transition-colors"
            >
              <div className="col-span-4 font-medium tabular">{m.pair}</div>
              <div className="col-span-3 text-right tabular">${m.price}</div>
              <div className={`col-span-2 text-right tabular ${up ? "text-green" : "text-red"}`}>
                {up ? "+" : ""}{m.changePct}%
              </div>
              <div className="col-span-3 flex justify-end items-center gap-3">
                <Sparkline data={m.spark} up={up} />
                <Link
                  href={`/dashboard/bots/new`}
                  className="text-xs text-gold-strong hover:underline whitespace-nowrap"
                >
                  Crear bot
                </Link>
              </div>
            </div>
          );
        })}
        {markets.length === 0 && (
          <div className="px-5 py-10 text-center text-muted text-sm">Cargando mercados...</div>
        )}
      </div>
    </div>
  );
}
