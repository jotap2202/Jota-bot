import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { lastPrice } from "@/lib/binance";

// Creates (or reuses) a demo account preloaded with sample bots so the product
// is instantly explorable. Each call uses a unique email to avoid collisions.
export async function POST() {
  const email = `demo+${Date.now()}@jotabot.app`;
  const user = await prisma.user.create({
    data: {
      email,
      name: "Cuenta Demo",
      passwordHash: await hashPassword(crypto.randomUUID()),
    },
  });

  const daysAgo = (d: number) => new Date(Date.now() - d * 86400_000);

  const samples = [
    { name: "HYPE Grid", pair: "HYPE_USDT_Perp", grids: 20, invested: 85, leverage: 5, band: 0.12, days: 6, status: "running" },
    { name: "BTC Conservador", pair: "BTC_USDT_Perp", grids: 30, invested: 250, leverage: 2, band: 0.08, days: 12, status: "running" },
    { name: "SOL Swing", pair: "SOL_USDT_Perp", grids: 15, invested: 120, leverage: 3, band: 0.15, days: 3, status: "paused" },
  ];

  for (const s of samples) {
    const base = await lastPrice(s.pair);
    await prisma.bot.create({
      data: {
        userId: user.id,
        name: s.name,
        pair: s.pair,
        status: s.status,
        mode: "paper",
        grids: s.grids,
        invested: s.invested,
        leverage: s.leverage,
        lowerPrice: +(base * (1 - s.band)).toFixed(base < 1 ? 5 : 2),
        upperPrice: +(base * (1 + s.band)).toFixed(base < 1 ? 5 : 2),
        createdAt: daysAgo(s.days),
      },
    });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
