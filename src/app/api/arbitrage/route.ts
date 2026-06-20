import { NextResponse } from "next/server";
import { listPairs, priceAt } from "@/lib/prices";

const EXCHANGES = ["Binance", "Bybit", "OKX", "Hyperliquid"];

// Deterministic synthetic cross-exchange spreads for the scanner UI.
export async function GET() {
  const now = Math.floor(Date.now() / 1000);

  const opps = listPairs().map((pair) => {
    const base = priceAt(pair, now);
    // Each exchange has a small deterministic offset that drifts over time.
    const quotes = EXCHANGES.map((ex, i) => {
      const drift = Math.sin(now / 120 + i * 1.7 + pair.length) * 0.0015; // ±0.15%
      return { exchange: ex, price: +(base * (1 + drift)).toFixed(base < 1 ? 5 : 2) };
    });
    const sorted = [...quotes].sort((a, b) => a.price - b.price);
    const low = sorted[0];
    const high = sorted[sorted.length - 1];
    const spreadPct = +(((high.price - low.price) / low.price) * 100).toFixed(3);
    return {
      pair,
      buyOn: low.exchange,
      buyPrice: low.price,
      sellOn: high.exchange,
      sellPrice: high.price,
      spreadPct,
    };
  });

  opps.sort((a, b) => b.spreadPct - a.spreadPct);
  return NextResponse.json({ opportunities: opps });
}
