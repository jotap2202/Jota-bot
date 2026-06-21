import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBotDetail } from "@/lib/bots";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const detail = await getBotDetail(userId, id);
  if (!detail) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(detail);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const owned = await prisma.bot.findFirst({ where: { id, userId } });
  if (!owned) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.status && ["running", "paused", "stopped"].includes(body.status)) {
    data.status = body.status;
  }
  if (body.name) data.name = String(body.name).slice(0, 60);

  // Config edit: validate and apply. Changing the grid recalculates the
  // simulation, so we reset createdAt to "now" — the bot restarts cleanly with
  // the new parameters instead of rewriting its past.
  let configChanged = false;
  if (body.lowerPrice !== undefined || body.upperPrice !== undefined || body.grids !== undefined || body.invested !== undefined || body.leverage !== undefined) {
    const lowerPrice = Number(body.lowerPrice ?? owned.lowerPrice);
    const upperPrice = Number(body.upperPrice ?? owned.upperPrice);
    const grids = Math.max(2, Math.min(200, Math.floor(Number(body.grids ?? owned.grids))));
    const invested = Number(body.invested ?? owned.invested);
    const leverage = Math.max(1, Math.min(20, Number(body.leverage ?? owned.leverage)));
    if (!(lowerPrice > 0) || !(upperPrice > lowerPrice) || !(invested > 0)) {
      return NextResponse.json({ error: "Parámetros del bot inválidos" }, { status: 400 });
    }
    Object.assign(data, { lowerPrice, upperPrice, grids, invested, leverage });
    configChanged = true;
  }
  if (configChanged) data.createdAt = new Date();

  const bot = await prisma.bot.update({ where: { id }, data });
  return NextResponse.json({ id: bot.id, status: bot.status });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const owned = await prisma.bot.findFirst({ where: { id, userId } });
  if (!owned) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  await prisma.bot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
