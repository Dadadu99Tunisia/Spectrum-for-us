import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * DELETE /api/vendor/shop · le vendeur supprime SA propre boutique.
 * Supprime les dépendances (produits, KYC, programme fondateur) puis la
 * boutique, et repasse le profil en non-vendeur.
 */
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: shops } = await admin.from("shops").select("id").eq("owner_id", user.id);
    const ids = (shops ?? []).map((s) => s.id);
    if (!ids.length) return NextResponse.json({ ok: true });

    await admin.from("founder_program_members").delete().in("shop_id", ids);
    await admin.from("vendor_kyc").delete().in("shop_id", ids);
    await admin.from("products").delete().in("shop_id", ids);
    const { error } = await admin.from("shops").delete().in("id", ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await admin.from("profiles").update({ is_vendor: false }).eq("id", user.id);
    return NextResponse.json({ ok: true, deleted: ids.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
