import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const supabase = supabaseAdmin();

    // Find the NFC card by short code
    const { data: card, error } = await supabase
      .from("nfc_cards")
      .select("*")
      .eq("short_code", code)
      .single();

    if (error || !card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    // Check if card is active
    if (!card.is_active) {
      return NextResponse.json(
        { error: "Card is inactive" },
        { status: 410 }
      );
    }

    // Increment tap count and update last_tap_at
    await supabase
      .from("nfc_cards")
      .update({
        tap_count: card.tap_count + 1,
        last_tap_at: new Date().toISOString(),
      })
      .eq("id", card.id);

    // Return 302 redirect to destination URL
    return NextResponse.redirect(card.destination_url, { status: 302 });
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
