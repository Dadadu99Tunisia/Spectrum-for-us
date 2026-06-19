import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * DELETE /api/vendor/shop · le vendeur supprime UNE de ses activités, ou tout son compte.
 * - body { shopId } et il reste d'autres activités → supprime cette seule activité
 *   (produits + KYC), repointe la place fondateur·ice (FK RESTRICT), garde le seller + statut vendeur.
 * - sinon (dernière activité, ou pas d'id) → teardown complet et profil non-vendeur.
 */
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    let targetId: string | null = null;
    try { const b = await req.json(); targetId = (b?.shopId as string) ?? null; } catch {}

    const { data: shops } = await admin.from("shops").select("id").eq("owner_id", user.id);
    const ids = (shops ?? []).map((s) => s.id as string);
    if (!ids.length) return NextResponse.json({ ok: true });

    // Suppression d'UNE activité s'il en reste d'autres → on préserve le reste du compte.
    if (targetId && ids.includes(targetId) && ids.length > 1) {
      const otherId = ids.find((i) => i !== targetId)!;
      // La FK founder_program_members.shop_id est ON DELETE RESTRICT : on repointe d'abord
      // la place fondateur·ice vers une activité conservée pour ne pas la perdre.
      await admin.from("founder_program_members").update({ shop_id: otherId }).eq("shop_id", targetId).eq("user_id", user.id);
      await admin.from("vendor_kyc").delete().eq("shop_id", targetId);
      await admin.from("products").delete().eq("shop_id", targetId);
      const { error } = await admin.from("shops").delete().eq("id", targetId);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, deleted: 1, remaining: ids.length - 1 });
    }

    // Teardown complet du compte vendeur (dernière activité ou aucun id fourni).
    await admin.from("founder_program_members").delete().in("shop_id", ids);
    await admin.from("vendor_kyc").delete().in("shop_id", ids);
    await admin.from("products").delete().in("shop_id", ids);
    const { error } = await admin.from("shops").delete().in("id", ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await admin.from("profiles").update({ is_vendor: false }).eq("id", user.id);
    return NextResponse.json({ ok: true, deleted: ids.length, full: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
