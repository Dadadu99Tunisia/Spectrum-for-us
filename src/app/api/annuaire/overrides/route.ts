// Public endpoint — retourne tous les overrides (logo_url, is_hidden, etc.)
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const revalidate = 60; // ISR 60s

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("annuaire_overrides")
    .select("org_id, logo_url, custom_name, custom_desc, website, phone, email, accent, is_featured, is_hidden");
  return NextResponse.json({ data: data ?? [] });
}
