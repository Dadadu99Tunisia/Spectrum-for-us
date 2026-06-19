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

    // Un historique de commandes DOIT être conservé (compta/RGPD) et les FK order_items/commissions
    // (NO ACTION) bloqueraient un hard-delete. → soft-delete (is_active=false) dès qu'il y a un historique.
    const hasHistory = async (scope: string[]) => {
      const [{ count: oic }, { count: cc }] = await Promise.all([
        admin.from("order_items").select("id", { count: "exact", head: true }).in("activity_id", scope),
        admin.from("commissions").select("id", { count: "exact", head: true }).in("shop_id", scope),
      ]);
      return (oic ?? 0) > 0 || (cc ?? 0) > 0;
    };

    // Suppression d'UNE activité s'il en reste d'autres → on préserve le reste du compte.
    if (targetId && ids.includes(targetId) && ids.length > 1) {
      const otherId = ids.find((i) => i !== targetId)!;
      if (await hasHistory([targetId])) {
        // Désactivation (historique conservé) : invisible publiquement, produits dépubliés.
        await admin.from("products").update({ is_active: false }).eq("shop_id", targetId);
        await admin.from("shops").update({ is_active: false }).eq("id", targetId);
        return NextResponse.json({ ok: true, deactivated: 1, remaining: ids.length - 1 });
      }
      // Repointe la place fondateur·ice avant suppression dure.
      await admin.from("founder_program_members").update({ shop_id: otherId }).eq("shop_id", targetId).eq("user_id", user.id);
      await admin.from("vendor_kyc").delete().eq("shop_id", targetId);
      await admin.from("products").delete().eq("shop_id", targetId);
      const { error } = await admin.from("shops").delete().eq("id", targetId);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, deleted: 1, remaining: ids.length - 1 });
    }

    // Teardown complet du compte vendeur (dernière activité ou aucun id fourni).
    if (await hasHistory(ids)) {
      // On garde l'historique : on dépublie tout et on repasse le profil en non-vendeur.
      await admin.from("products").update({ is_active: false }).in("shop_id", ids);
      await admin.from("shops").update({ is_active: false }).in("id", ids);
      await admin.from("profiles").update({ is_vendor: false }).eq("id", user.id);
      return NextResponse.json({ ok: true, deactivated: ids.length, full: true });
    }
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
