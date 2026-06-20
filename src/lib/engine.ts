// Grid trading engine (paper simulation).
//
// A grid bot places buy orders below and sell orders above price at evenly
// spaced levels. When price falls through a buy level it buys one grid quantity;
// when price rises through the next level it sells and books a small profit.
// This module replays a price series (real Binance klines, or the synthetic
// fallback) and returns the resulting state plus an equity trajectory. A real
// exchange adapter can later replace the replay with actual order fills.

export type GridConfig = {
  pair: string;
  lowerPrice: number;
  upperPrice: number;
  grids: number;
  invested: number;
  leverage: number;
};

export type Candle = { t: number; price: number };
export type SimTrade = { side: "buy" | "sell"; price: number; qty: number; pnl: number; t: number };

export type SimResult = {
  currentPrice: number;
  gridLevels: number[];
  position: number;
  entryPrice: number;
  realizedPnl: number;
  unrealizedPnl: number;
  positionNotional: number;
  totalPnl: number;
  trades: SimTrade[];
  filledCount: number;
  curve: { t: number; equity: number }[];
};

export function gridLevels(lower: number, upper: number, grids: number): number[] {
  const levels: number[] = [];
  const step = (upper - lower) / grids;
  for (let i = 0; i <= grids; i++) levels.push(+(lower + step * i).toFixed(6));
  return levels;
}

export function simulateSeries(
  cfg: GridConfig,
  series: Candle[],
  curvePoints = 60
): SimResult {
  const levels = gridLevels(cfg.lowerPrice, cfg.upperPrice, cfg.grids);
  const capital = cfg.invested * cfg.leverage;
  const midPrice = (cfg.lowerPrice + cfg.upperPrice) / 2;
  const qtyPerGrid = capital / cfg.grids / midPrice;
  const maxPos = qtyPerGrid * cfg.grids;

  let position = 0;
  let avgEntry = 0;
  let realizedPnl = 0;
  const trades: SimTrade[] = [];
  const curve: { t: number; equity: number }[] = [];

  const sampleEvery = Math.max(1, Math.floor(series.length / curvePoints));

  for (let idx = 0; idx < series.length; idx++) {
    const price = series[idx].price;
    const prev = idx === 0 ? price : series[idx - 1].price;

    for (const level of levels) {
      const crossedDown = prev > level && price <= level;
      const crossedUp = prev < level && price >= level;

      if (crossedDown && position < maxPos - 1e-9) {
        const newPos = position + qtyPerGrid;
        avgEntry = (avgEntry * position + level * qtyPerGrid) / newPos;
        position = newPos;
        trades.push({ side: "buy", price: level, qty: qtyPerGrid, pnl: 0, t: series[idx].t });
      }
      if (crossedUp && position >= qtyPerGrid - 1e-9) {
        const pnl = (level - avgEntry) * qtyPerGrid;
        realizedPnl += pnl;
        position -= qtyPerGrid;
        if (position < 1e-9) {
          position = 0;
          avgEntry = 0;
        }
        trades.push({ side: "sell", price: level, qty: qtyPerGrid, pnl, t: series[idx].t });
      }
    }

    if (idx % sampleEvery === 0 || idx === series.length - 1) {
      const unreal = position > 0 ? (price - avgEntry) * position : 0;
      curve.push({ t: series[idx].t, equity: +(cfg.invested + realizedPnl + unreal).toFixed(2) });
    }
  }

  const currentPrice = series.length ? series[series.length - 1].price : midPrice;
  const unrealizedPnl = position > 0 ? (currentPrice - avgEntry) * position : 0;
  const positionNotional = position * currentPrice;

  return {
    currentPrice: +currentPrice.toFixed(currentPrice < 1 ? 5 : 2),
    gridLevels: levels,
    position,
    entryPrice: avgEntry,
    realizedPnl: +realizedPnl.toFixed(2),
    unrealizedPnl: +unrealizedPnl.toFixed(2),
    positionNotional: +positionNotional.toFixed(2),
    totalPnl: +(realizedPnl + unrealizedPnl).toFixed(2),
    trades: trades.slice(-50).reverse(),
    filledCount: trades.length,
    curve,
  };
}
