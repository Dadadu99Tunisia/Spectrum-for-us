import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, activity_type, description, website, instagram, is_queer } = body;

  if (!name?.trim() || !email?.trim() || !activity_type?.trim()) {
    return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const supabase = await createClient();

  // Déduplication : un email ne peut soumettre qu'une seule demande non-rejetée
  const { data: existing } = await supabase
    .from("join_requests")
    .select("id, status")
    .eq("email", email.trim().toLowerCase())
    .neq("status", "rejected")
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ ok: true }); // Réponse neutre pour ne pas révéler l'existence
  }

  const { error } = await supabase.from("join_requests").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    activity_type,
    description: description?.trim() || null,
    website: website?.trim() || null,
    instagram: instagram?.trim() || null,
    is_queer: Boolean(is_queer),
  });

  if (error) {
    console.error("join_requests insert error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
