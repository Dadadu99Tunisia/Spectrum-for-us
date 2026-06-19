import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewFavorite, trySend } from "@/lib/email";

/**
 * Persiste un favori et notifie le·la créateur·ice — une seule fois par (user, produit).
 * Appelé quand un·e utilisateur·rice connecté·e met une création en favori.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  let productId: string | null = null;
  try { productId = (await req.json())?.productId ?? null; } catch {}
  if (!productId) return NextResponse.json({ ok: false }, { status: 400 });

  const admin = createAdminClient();

  // Déjà en favori ? → ne pas re-notifier
  const { data: existing } = await admin.from("favorites")
    .select("product_id").eq("user_id", user.id).eq("product_id", productId).maybeSingle();
  await admin.from("favorites").upsert({ user_id: user.id, product_id: productId }, { onConflict: "user_id,product_id" });
  if (existing) return NextResponse.json({ ok: true });

  try {
    const { data: product } = await admin.from("products")
      .select("name, title, slug, shop_id").eq("id", productId).maybeSingle();
    if (product) {
      const { data: shop } = await admin.from("shops").select("owner_id").eq("id", product.shop_id).maybeSingle();
      if (shop?.owner_id && shop.owner_id !== user.id) {
        const { data: owner } = await admin.auth.admin.getUserById(shop.owner_id as string);
        const email = owner?.user?.email;
        if (email) await trySend(() => sendNewFavorite({
          to: email,
          productName: (product.name as string) || (product.title as string) || "Une création",
          productSlug: product.slug as string,
        }));
      }
    }
  } catch (e) { console.error("[notify] favorite", e); }

  return NextResponse.json({ ok: true });
}
