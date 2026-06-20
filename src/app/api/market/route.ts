import { NextResponse } from "next/server";
import { listRealPairs, ticker24h, series } from "@/lib/binance";

export async function GET() {
  const now = Date.now();
  const dayAgo = now - 86400_000;

  const markets = await Promise.all(
    listRealPairs().map(async (pair) => {
      const [t, candles] = await Promise.all([ticker24h(pair), series(pair, dayAgo, now)]);
      return {
        pair,
        price: t.price,
        changePct: t.changePct,
        spark: candles.map((c) => c.price),
      };
    })
  );

  return NextResponse.json({ markets });
}
