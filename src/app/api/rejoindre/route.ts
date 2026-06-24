import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, activity_type, description, website, instagram, is_queer, hp, elapsed } = body;

  // ── Anti-spam (bots) · réponse neutre 200 pour ne pas révéler la détection ──
  // 1) Honeypot : champ caché que seuls les bots remplissent.
  if (typeof hp === "string" && hp.trim() !== "") return NextResponse.json({ ok: true });
  // 2) Piège temporel : un humain met > 2,5 s ; un bot soumet quasi instantanément.
  if (typeof elapsed === "number" && elapsed >= 0 && elapsed < 2500) return NextResponse.json({ ok: true });
  // 3) Gibberish : nom/description sans espace et > 14 car. avec casse mixte = signature de spam.
  const looksRandom = (s: string) => s.length > 14 && !/\s/.test(s) && !/[À-ÿ]/.test(s) && /[A-Z].*[a-z].*[A-Z]/.test(s);
  if (looksRandom(String(name ?? "")) || looksRandom(String(description ?? ""))) return NextResponse.json({ ok: true });

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
