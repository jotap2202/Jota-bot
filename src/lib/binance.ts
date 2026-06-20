// Real market data from Binance public endpoints (no API key required).
// Falls back to the deterministic synthetic model (prices.ts) on any failure,
// so the app always works offline / when Binance is unreachable.

import { priceAt, basePrice } from "./prices";

const BASE = "https://data-api.binance.vision";

// Our internal pair names -> Binance spot symbols.
const SYMBOL: Record<string, string> = {
  BTC_USDT_Perp: "BTCUSDT",
  ETH_USDT_Perp: "ETHUSDT",
  SOL_USDT_Perp: "SOLUSDT",
  BNB_USDT_Perp: "BNBUSDT",
  XRP_USDT_Perp: "XRPUSDT",
  DOGE_USDT_Perp: "DOGEUSDT",
  HYPE_USDT_Perp: "HYPEUSDT",
};

export type Candle = { t: number; price: number }; // t in seconds, price = close

type CacheEntry<T> = { at: number; ttl: number; data: T };
const cache = new Map<string, CacheEntry<unknown>>();

async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (hit && Date.now() - hit.at < hit.ttl) return hit.data;
  const data = await fn();
  cache.set(key, { at: Date.now(), ttl: ttlMs, data });
  return data;
}

function symbolOf(pair: string): string | null {
  return SYMBOL[pair] ?? null;
}

function pickInterval(spanMs: number): { interval: string; ms: number } {
  const day = 86400_000;
  if (spanMs <= 2 * day) return { interval: "15m", ms: 15 * 60_000 };
  if (spanMs <= 10 * day) return { interval: "1h", ms: 3_600_000 };
  if (spanMs <= 40 * day) return { interval: "4h", ms: 4 * 3_600_000 };
  return { interval: "1d", ms: day };
}

// Live last price. Falls back to synthetic on failure.
export async function lastPrice(pair: string): Promise<number> {
  const symbol = symbolOf(pair);
  if (!symbol) return priceAt(pair, Math.floor(Date.now() / 1000));
  try {
    return await cached(`px:${symbol}`, 5_000, async () => {
      const r = await fetch(`${BASE}/api/v3/ticker/price?symbol=${symbol}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      return +parseFloat(j.price).toFixed(parseFloat(j.price) < 1 ? 5 : 2);
    });
  } catch {
    return priceAt(pair, Math.floor(Date.now() / 1000));
  }
}

// 24h ticker stats (price + change %). Falls back to synthetic.
export async function ticker24h(pair: string): Promise<{ price: number; changePct: number }> {
  const symbol = symbolOf(pair);
  if (!symbol) {
    const now = Math.floor(Date.now() / 1000);
    const p = priceAt(pair, now);
    const prev = priceAt(pair, now - 86400);
    return { price: p, changePct: +(((p - prev) / prev) * 100).toFixed(2) };
  }
  try {
    return await cached(`t24:${symbol}`, 10_000, async () => {
      const r = await fetch(`${BASE}/api/v3/ticker/24hr?symbol=${symbol}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      const price = parseFloat(j.lastPrice);
      return {
        price: +price.toFixed(price < 1 ? 5 : 2),
        changePct: +parseFloat(j.priceChangePercent).toFixed(2),
      };
    });
  } catch {
    const now = Math.floor(Date.now() / 1000);
    const p = priceAt(pair, now);
    const prev = priceAt(pair, now - 86400);
    return { price: p, changePct: +(((p - prev) / prev) * 100).toFixed(2) };
  }
}

// Historical close series between two timestamps (ms). Falls back to synthetic.
export async function series(pair: string, sinceMs: number, untilMs: number): Promise<Candle[]> {
  const { interval, ms } = pickInterval(untilMs - sinceMs);
  const symbol = symbolOf(pair);

  const synthetic = (): Candle[] => {
    const out: Candle[] = [];
    for (let t = sinceMs; t <= untilMs; t += ms) {
      out.push({ t: Math.floor(t / 1000), price: priceAt(pair, Math.floor(t / 1000)) });
    }
    return out;
  };

  if (!symbol) return synthetic();

  try {
    return await cached(`kl:${symbol}:${interval}:${Math.floor(sinceMs / ms)}`, 60_000, async () => {
      const url = `${BASE}/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${sinceMs}&endTime=${untilMs}&limit=1000`;
      const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error(String(r.status));
      const rows = (await r.json()) as unknown[][];
      if (!Array.isArray(rows) || rows.length === 0) return synthetic();
      return rows.map((row) => ({
        t: Math.floor((row[0] as number) / 1000),
        price: parseFloat(row[4] as string), // close
      }));
    });
  } catch {
    return synthetic();
  }
}

export function listRealPairs(): string[] {
  return Object.keys(SYMBOL);
}

export { basePrice };
