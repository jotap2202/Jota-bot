import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBots } from "@/lib/bots";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json({ bots: await getBots(userId) });
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const lowerPrice = Number(b.lowerPrice);
  const upperPrice = Number(b.upperPrice);
  const grids = Math.max(2, Math.min(200, Math.floor(Number(b.grids) || 20)));
  const invested = Number(b.invested);
  const leverage = Math.max(1, Math.min(20, Number(b.leverage) || 1));

  if (!b.name || !b.pair || !(lowerPrice > 0) || !(upperPrice > lowerPrice) || !(invested > 0)) {
    return NextResponse.json({ error: "Parámetros del bot inválidos" }, { status: 400 });
  }

  const bot = await prisma.bot.create({
    data: {
      userId,
      name: String(b.name).slice(0, 60),
      pair: String(b.pair),
      mode: b.mode === "testnet" ? "testnet" : "paper",
      status: b.start ? "running" : "stopped",
      lowerPrice,
      upperPrice,
      grids,
      invested,
      leverage,
    },
  });
  return NextResponse.json({ id: bot.id });
}
