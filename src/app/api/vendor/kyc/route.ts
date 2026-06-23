import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// KYC vendeur·se (identité légale) — requis avant tout versement manuel (anti-AML).
// Rattaché à la boutique principale du·de la vendeur·se. Le·la vendeur·se soumet,
// l'admin vérifie. Le·la vendeur·se ne peut jamais passer son propre statut à "verified".

async function primaryShop(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("shops").select("id").eq("owner_id", userId)
    .order("created_at", { ascending: true }).limit(1).maybeSingle();
  return data?.id ?? null;
}

export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const shopId = await primaryShop(supabase, auth.user.id);
  if (!shopId) return NextResponse.json({ kyc: null });
  const { data } = await supabase.from("vendor_kyc")
    .select("legal_name, legal_type, vat_number, tax_id, address_line1, address_city, address_zip, address_country, id_document_url, kyc_status, kyc_submitted_at, kyc_verified_at, kyc_notes")
    .eq("shop_id", shopId).maybeSingle();
  return NextResponse.json({ kyc: data ?? null });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const shopId = await primaryShop(supabase, auth.user.id);
  if (!shopId) return NextResponse.json({ error: "Aucune boutique" }, { status: 400 });

  let b: Record<string, string | undefined>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide" }, { status: 400 }); }
  if (!b.legal_name?.trim()) return NextResponse.json({ error: "Nom légal requis" }, { status: 400 });

  const payload = {
    shop_id: shopId,
    legal_name: b.legal_name.trim(),
    legal_type: b.legal_type ?? null,
    vat_number: b.vat_number?.trim() || null,
    tax_id: b.tax_id?.trim() || null,
    address_line1: b.address_line1?.trim() || null,
    address_city: b.address_city?.trim() || null,
    address_zip: b.address_zip?.trim() || null,
    address_country: b.address_country?.trim() || null,
    id_document_url: b.id_document_url?.trim() || null,
    kyc_status: "submitted" as const,
    kyc_submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  // upsert sur shop_id (une fiche KYC par boutique)
  const { error } = await supabase.from("vendor_kyc").upsert(payload, { onConflict: "shop_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
