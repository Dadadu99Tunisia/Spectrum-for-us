import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Public endpoint · no auth required
// Returns counts for the marketing banner
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("founder_program_counts")
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { founder_count: 0, early_adopter_count: 0, founder_slots: 20, early_adopter_slots: 100, founder_remaining: 20, early_remaining: 100 },
      { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate" } }
    );
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate" },
  });
}
