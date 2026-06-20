import { NextResponse } from "next/server";
import { listRealPairs, lastPrice } from "@/lib/binance";

export async function GET() {
  const pairs = await Promise.all(
    listRealPairs().map(async (pair) => ({ pair, price: await lastPrice(pair) }))
  );
  return NextResponse.json({ pairs });
}
