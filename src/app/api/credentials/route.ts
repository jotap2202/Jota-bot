import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { encrypt, decrypt, mask } from "@/lib/crypto";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const cred = await prisma.exchangeCredential.findFirst({ where: { userId } });
  if (!cred) return NextResponse.json({ connected: false });

  // Never return the raw secret — only a masked preview.
  return NextResponse.json({
    connected: true,
    exchange: cred.exchange,
    mode: cred.mode,
    apiKeyMasked: mask(decrypt(cred.apiKeyEnc)),
    updatedAt: cred.updatedAt,
  });
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { apiKey, apiSecret, mode, exchange } = await req.json().catch(() => ({}));
  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "API key y secret requeridos" }, { status: 400 });
  }

  const ex = exchange || "binance";
  const safeMode = ["paper", "testnet", "live"].includes(mode) ? mode : "paper";

  await prisma.exchangeCredential.upsert({
    where: { userId_exchange: { userId, exchange: ex } },
    update: { apiKeyEnc: encrypt(apiKey), apiSecretEnc: encrypt(apiSecret), mode: safeMode },
    create: {
      userId,
      exchange: ex,
      mode: safeMode,
      apiKeyEnc: encrypt(apiKey),
      apiSecretEnc: encrypt(apiSecret),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await prisma.exchangeCredential.deleteMany({ where: { userId } });
  return NextResponse.json({ ok: true });
}
