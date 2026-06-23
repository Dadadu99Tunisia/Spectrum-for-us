import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Intake de signalement (notice-and-action DSA) : un·e utilisateur·ice connecté·e
// signale un produit / une boutique / un avis / un message abusif.
const TARGET_TYPES = ["product", "shop", "review", "message", "user"];
const REASONS = ["illegal", "counterfeit", "hate", "harassment", "scam", "sexual_minor", "spam", "other"];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Connecte-toi pour signaler." }, { status: 401 });

  let body: { target_type?: string; target_id?: string; reason?: string; details?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide" }, { status: 400 }); }

  const { target_type, target_id, reason, details } = body;
  if (!target_type || !TARGET_TYPES.includes(target_type)) return NextResponse.json({ error: "target_type invalide" }, { status: 400 });
  if (!target_id) return NextResponse.json({ error: "target_id requis" }, { status: 400 });
  if (!reason || !REASONS.includes(reason)) return NextResponse.json({ error: "Motif invalide" }, { status: 400 });

  const { error } = await supabase.from("reports").insert({
    reporter_id: auth.user.id,
    target_type, target_id, reason,
    details: details?.slice(0, 2000) ?? null,
    status: "open",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
