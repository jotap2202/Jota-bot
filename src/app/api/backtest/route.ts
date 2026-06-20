import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { simulateSeries, type GridConfig } from "@/lib/engine";
import { lastPrice, series } from "@/lib/binance";

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const pair = String(b.pair || "BTC_USDT_Perp");
  const days = Math.max(1, Math.min(90, Number(b.days) || 14));
  const band = Math.max(2, Math.min(40, Number(b.band) || 10));
  const grids = Math.max(2, Math.min(200, Math.floor(Number(b.grids) || 20)));
  const invested = Math.max(10, Number(b.invested) || 100);
  const leverage = Math.max(1, Math.min(20, Number(b.leverage) || 2));

  const price = await lastPrice(pair);
  const cfg: GridConfig = {
    pair,
    lowerPrice: +(price * (1 - band / 100)).toFixed(price < 1 ? 5 : 2),
    upperPrice: +(price * (1 + band / 100)).toFixed(price < 1 ? 5 : 2),
    grids,
    invested,
    leverage,
  };

  const sinceMs = Date.now() - days * 86400_000;
  const candles = await series(pair, sinceMs, Date.now());
  const result = simulateSeries(cfg, candles, 80);

  let peak = result.curve[0]?.equity ?? invested;
  let maxDd = 0;
  for (const p of result.curve) {
    peak = Math.max(peak, p.equity);
    maxDd = Math.min(maxDd, ((p.equity - peak) / peak) * 100);
  }

  const totalReturnPct = +((result.totalPnl / invested) * 100).toFixed(2);
  const apr = +((totalReturnPct / days) * 365).toFixed(1);

  return NextResponse.json({
    config: cfg,
    curve: result.curve,
    stats: {
      totalReturnPct,
      totalPnl: result.totalPnl,
      realizedPnl: result.realizedPnl,
      trades: result.filledCount,
      maxDrawdownPct: +maxDd.toFixed(2),
      apr,
      days,
    },
  });
}
