import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getPortfolio } from "@/lib/bots";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await getPortfolio(userId));
}
