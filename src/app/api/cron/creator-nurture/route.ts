import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCreatorActivation, trySend } from "@/lib/email";

/**
 * Nurturing créateur·ice · relance les boutiques encore VIDES.
 * J+1 : créée il y a 1-2 j, 0 produit, jamais relancée → "publie ta 1re création".
 * J+7 : créée il y a 7-8 j, 0 produit, J+7 jamais envoyé → relance d'urgence.
 * Idempotence via la table nurture_log. Déclenché par Vercel Cron (quotidien).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const admin = createAdminClient();
  const now = Date.now();
  const DAY = 86400000;

  const windows = [
    { kind: "creator_j1", day: 1 as const, from: new Date(now - 2 * DAY).toISOString(), to: new Date(now - 1 * DAY).toISOString() },
    { kind: "creator_j7", day: 7 as const, from: new Date(now - 8 * DAY).toISOString(), to: new Date(now - 7 * DAY).toISOString() },
  ];

  let sent = 0;
  for (const w of windows) {
    // Boutiques (1 par owner) créées dans la fenêtre
    const { data: shops } = await admin
      .from("shops")
      .select("id, name, owner_id, created_at")
      .gte("created_at", w.from).lt("created_at", w.to)
      .limit(200);

    for (const shop of shops ?? []) {
      try {
        // Déjà relancée pour ce palier ?
        const { data: already } = await admin.from("nurture_log")
          .select("user_id").eq("user_id", shop.owner_id).eq("kind", w.kind).maybeSingle();
        if (already) continue;

        // A déjà publié au moins un produit ? → activé·e, on ne relance pas
        const { count: prodCount } = await admin.from("products")
          .select("id", { count: "exact", head: true }).eq("shop_id", shop.id);
        if ((prodCount ?? 0) > 0) {
          // marque comme traité pour ne pas re-checker à chaque run
          await admin.from("nurture_log").insert({ user_id: shop.owner_id, kind: w.kind });
          continue;
        }

        const { data: u } = await admin.auth.admin.getUserById(shop.owner_id as string);
        const email = u?.user?.email;
        const pseudo = (u?.user?.user_metadata?.full_name as string) || (shop.name as string) || "créateur·ice";
        if (email) {
          await trySend(() => sendCreatorActivation({ to: email, pseudo, day: w.day }));
          sent++;
        }
        await admin.from("nurture_log").insert({ user_id: shop.owner_id, kind: w.kind });
      } catch (e) {
        console.error("[cron] creator-nurture", w.kind, e);
      }
    }
  }

  return NextResponse.json({ ok: true, sent });
}
