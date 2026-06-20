// Deterministic price model for paper trading.
// Each pair has a base price; a seeded sine+noise walk produces a price for any
// timestamp so the simulation is consistent across reloads without a background
// worker. A real exchange adapter can replace `priceAt` later.

const BASE_PRICES: Record<string, number> = {
  BTC_USDT_Perp: 64000,
  ETH_USDT_Perp: 3100,
  SOL_USDT_Perp: 145,
  HYPE_USDT_Perp: 27,
  BNB_USDT_Perp: 580,
  XRP_USDT_Perp: 0.52,
  DOGE_USDT_Perp: 0.12,
};

export function basePrice(pair: string): number {
  return BASE_PRICES[pair] ?? 100;
}

export function listPairs(): string[] {
  return Object.keys(BASE_PRICES);
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Smooth pseudo-random oscillation in [-1, 1] for a given pair & time.
function wave(pair: string, t: number): number {
  const seed = hashSeed(pair);
  const a = Math.sin(t / 3600 + (seed % 100));
  const b = Math.sin(t / 900 + (seed % 53)) * 0.5;
  const c = Math.sin(t / 180 + (seed % 31)) * 0.25;
  return (a + b + c) / 1.75;
}

// Price for a pair at a unix-seconds timestamp. Amplitude ~6% of base.
export function priceAt(pair: string, unixSeconds: number): number {
  const base = basePrice(pair);
  const amp = base * 0.06;
  return +(base + amp * wave(pair, unixSeconds)).toFixed(base < 1 ? 5 : 2);
}

export function currentPrice(pair: string): number {
  return priceAt(pair, Math.floor(Date.now() / 1000));
}
