import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAbandonedCart, trySend } from "@/lib/email";

// Relance des paniers abandonnés. Déclenché par un cron (Vercel Cron / pg_cron).
export async function GET(req: NextRequest) {
  // Protection : Vercel Cron envoie "Authorization: Bearer <CRON_SECRET>"
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const admin = createAdminClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  // Paniers abandonnés depuis +1h, jamais relancés, non récupérés, < 7 jours
  const { data: carts } = await admin.from("abandoned_carts")
    .select("user_id, items, total, updated_at")
    .is("reminded_at", null).is("recovered_at", null)
    .lt("updated_at", oneHourAgo).gt("updated_at", sevenDaysAgo)
    .limit(50);

  let sent = 0;
  for (const c of carts ?? []) {
    try {
      const { data: u } = await admin.auth.admin.getUserById(c.user_id as string);
      const email = u?.user?.email;
      const items = (Array.isArray(c.items) ? c.items : []) as { name: string; price: number; quantity: number }[];
      if (email && items.length) {
        await trySend(() => sendAbandonedCart({ to: email, items, total: Number(c.total) }));
        sent++;
      }
    } catch (e) { console.error("[cron] panier abandonné", e); }
    // Marque comme relancé (même si pas d'email, pour ne pas réessayer en boucle)
    await admin.from("abandoned_carts").update({ reminded_at: new Date().toISOString() }).eq("user_id", c.user_id);
  }

  return NextResponse.json({ ok: true, processed: carts?.length ?? 0, sent });
}
