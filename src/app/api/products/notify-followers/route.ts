import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendFollowerNewProduct, trySend } from "@/lib/email";

/**
 * Notifie les abonné·es d'une boutique d'une nouvelle création (Resend).
 * Sécurité : seul·e le·la propriétaire de la boutique peut déclencher.
 * Non bloquant (fire-and-forget côté client).
 */
export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();

    const { data: product } = await admin
      .from("products")
      .select("id, name, title, slug, price, shop_id")
      .eq("id", productId)
      .maybeSingle();
    if (!product) return NextResponse.json({ ok: true });

    const { data: shop } = await admin
      .from("shops")
      .select("id, name, owner_id")
      .eq("id", product.shop_id)
      .maybeSingle();
    // Seul le propriétaire peut notifier
    if (!shop || shop.owner_id !== user.id) return NextResponse.json({ ok: true });

    const { data: followers } = await admin
      .from("follows")
      .select("user_id")
      .eq("shop_id", shop.id);
    const followerIds = (followers ?? []).map((f) => f.user_id).filter((id) => id !== user.id);
    if (!followerIds.length) return NextResponse.json({ ok: true, notified: 0 });

    // Récupère les e-mails (service-role) puis envoie
    let notified = 0;
    await Promise.all(
      followerIds.map(async (id) => {
        const { data } = await admin.auth.admin.getUserById(id);
        const to = data?.user?.email;
        if (!to) return;
        notified++;
        await trySend(() =>
          sendFollowerNewProduct({
            to,
            shopName: shop.name,
            productName: product.name || product.title || "Nouvelle création",
            productSlug: product.slug || product.id,
            price: Number(product.price) || 0,
          })
        );
      })
    );

    return NextResponse.json({ ok: true, notified });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
