import { prisma } from "./db";
import { simulateSeries, type GridConfig, type SimResult } from "./engine";
import { series as priceSeries } from "./binance";

type DbBot = {
  id: string;
  name: string;
  pair: string;
  status: string;
  mode: string;
  lowerPrice: number;
  upperPrice: number;
  grids: number;
  invested: number;
  leverage: number;
  createdAt: Date;
  updatedAt: Date;
};

function cfgOf(bot: DbBot): GridConfig {
  return {
    pair: bot.pair,
    lowerPrice: bot.lowerPrice,
    upperPrice: bot.upperPrice,
    grids: bot.grids,
    invested: bot.invested,
    leverage: bot.leverage,
  };
}

async function simBot(bot: DbBot): Promise<SimResult> {
  const nowMs = bot.status === "running" ? Date.now() : bot.updatedAt.getTime();
  const candles = await priceSeries(bot.pair, bot.createdAt.getTime(), nowMs);
  return simulateSeries(cfgOf(bot), candles);
}

export type BotState = {
  id: string;
  name: string;
  pair: string;
  status: "running" | "paused" | "stopped";
  mode: string;
  invested: number;
  leverage: number;
  grids: number;
  lowerPrice: number;
  upperPrice: number;
  createdAt: Date;
  currentPrice: number;
  positionNotional: number;
  realizedPnl: number;
  unrealizedPnl: number;
  pnl: number;
  pnlPct: number;
  filledCount: number;
  curve: { t: number; equity: number }[];
};

async function stateOf(bot: DbBot): Promise<BotState> {
  const sim = await simBot(bot);
  return {
    id: bot.id,
    name: bot.name,
    pair: bot.pair,
    status: bot.status as "running" | "paused" | "stopped",
    mode: bot.mode,
    invested: bot.invested,
    leverage: bot.leverage,
    grids: bot.grids,
    lowerPrice: bot.lowerPrice,
    upperPrice: bot.upperPrice,
    createdAt: bot.createdAt,
    currentPrice: sim.currentPrice,
    positionNotional: sim.positionNotional,
    realizedPnl: sim.realizedPnl,
    unrealizedPnl: sim.unrealizedPnl,
    pnl: sim.totalPnl,
    pnlPct: bot.invested ? +((sim.totalPnl / bot.invested) * 100).toFixed(2) : 0,
    filledCount: sim.filledCount,
    curve: sim.curve,
  };
}

export async function getBots(userId: string): Promise<BotState[]> {
  const bots = await prisma.bot.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return Promise.all(bots.map(stateOf));
}

export async function getBotDetail(userId: string, botId: string) {
  const bot = await prisma.bot.findFirst({ where: { id: botId, userId } });
  if (!bot) return null;
  const sim = await simBot(bot);
  return { bot, sim, curve: sim.curve };
}

function equityAt(curve: { t: number; equity: number }[], t: number, fallback: number): number {
  if (!curve.length) return fallback;
  let val = fallback;
  for (const p of curve) {
    if (p.t <= t) val = p.equity;
    else break;
  }
  return val;
}

export async function getPortfolio(userId: string) {
  const bots = await getBots(userId);
  const invested = bots.reduce((s, b) => s + b.invested, 0);
  const realized = bots.reduce((s, b) => s + b.realizedPnl, 0);
  const unrealized = bots.reduce((s, b) => s + b.unrealizedPnl, 0);
  const positionNotional = bots.reduce((s, b) => s + b.positionNotional, 0);
  const totalPnl = realized + unrealized;
  const totalEquity = invested + totalPnl;
  const wNotional = bots.reduce((s, b) => s + b.positionNotional * b.leverage, 0);
  const avgLeverage =
    positionNotional > 0 ? wNotional / positionNotional : bots.length ? bots[0].leverage : 0;

  const exposure = bots.filter((b) => b.positionNotional > 0).map((b) => ({ pair: b.pair, notional: b.positionNotional }));
  const totalExp = exposure.reduce((s, e) => s + e.notional, 0) || 1;
  const pairExposure = exposure.map((e) => ({
    pair: e.pair,
    notional: +e.notional.toFixed(2),
    pct: +((e.notional / totalExp) * 100).toFixed(0),
  }));

  return {
    totalEquity: +totalEquity.toFixed(2),
    totalPnl: +totalPnl.toFixed(2),
    realized: +realized.toFixed(2),
    unrealized: +unrealized.toFixed(2),
    positionNotional: +positionNotional.toFixed(2),
    invested: +invested.toFixed(2),
    avgLeverage: +avgLeverage.toFixed(1),
    equityChangePct: invested ? +((totalPnl / invested) * 100).toFixed(2) : 0,
    botCount: bots.length,
    runningCount: bots.filter((b) => b.status === "running").length,
    pairExposure,
    bots,
  };
}

// Aggregate portfolio equity curve, summing each bot's curve over a shared timeline.
export async function getPortfolioCurve(userId: string, bots?: BotState[], points = 60) {
  const states = bots ?? (await getBots(userId));
  if (states.length === 0) return [] as { t: number; equity: number }[];

  const nowSec = Math.floor(Date.now() / 1000);
  const earliest = Math.min(...states.map((b) => Math.floor(b.createdAt.getTime() / 1000)));
  const out: { t: number; equity: number }[] = [];
  for (let i = 0; i <= points; i++) {
    const t = Math.floor(earliest + ((nowSec - earliest) * i) / points);
    let equity = 0;
    for (const b of states) {
      const created = Math.floor(b.createdAt.getTime() / 1000);
      if (created > t) continue;
      equity += equityAt(b.curve, t, b.invested);
    }
    out.push({ t, equity: +equity.toFixed(2) });
  }
  return out;
}
