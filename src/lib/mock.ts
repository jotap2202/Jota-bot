// Demo data for Phase 1. Later phases replace this with real DB + exchange data.

export type Bot = {
  id: string;
  name: string;
  pair: string;
  status: "running" | "paused" | "stopped";
  strategy: "grid";
  invested: number;
  leverage: number;
  positionNotional: number;
  pnl: number;
  pnlPct: number;
  grids: number;
  lowerPrice: number;
  upperPrice: number;
};

export type Portfolio = {
  totalEquity: number;
  totalPnl: number;
  realized: number;
  unrealized: number;
  positionNotional: number;
  invested: number;
  avgLeverage: number;
  equityChangePct: number;
};

export const bots: Bot[] = [
  {
    id: "bot_1",
    name: "HYPE Grid",
    pair: "HYPE_USDT_Perp",
    status: "running",
    strategy: "grid",
    invested: 85,
    leverage: 5,
    positionNotional: 223.37,
    pnl: -2.14,
    pnlPct: -2.51,
    grids: 20,
    lowerPrice: 22.5,
    upperPrice: 31.8,
  },
];

export const portfolio: Portfolio = {
  totalEquity: 82.86,
  totalPnl: -2.14,
  realized: 0.3,
  unrealized: -2.44,
  positionNotional: 223.37,
  invested: 85,
  avgLeverage: 5,
  equityChangePct: -2.51,
};

export const pairExposure = [
  { pair: "HYPE_USDT_Perp", notional: 223.37, pct: 100 },
];
