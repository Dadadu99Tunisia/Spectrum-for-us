import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","support","commercial"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = createAdminClient();

  // Colonnes réelles uniquement (cf. schéma orders).
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id, status, total_amount, created_at,
      tracking_number, carrier,
      dispute_status, dispute_opened_at,
      refund_status, refund_amount,
      shipping_name, shipping_email, shipping_address, shipping_city, shipping_zip, shipping_country,
      payment_intent_id, user_id
    `)
    .eq("id", id)
    .single();

  if (error || !order) return apiError("Commande introuvable", 404);

  // Buyer profile
  const { data: buyer } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", order.user_id)
    .maybeSingle();

  // Order items (la colonne réelle est price_at_purchase ; titre/image via products, boutique via shops)
  const { data: rawItems } = await supabase
    .from("order_items")
    .select("id, quantity, price_at_purchase, product_id, products(name, title, image_url, images, shops(name))")
    .eq("order_id", id);

  const items = (rawItems ?? []).map(it => {
    const p = (it as { products?: { name?: string; title?: string; image_url?: string; images?: string[]; shops?: { name?: string } | { name?: string }[] } | null }).products ?? null;
    const shop = Array.isArray(p?.shops) ? p?.shops[0] : p?.shops;
    const unit = Number(it.price_at_purchase || 0);
    return {
      id: it.id, quantity: it.quantity, product_id: it.product_id,
      unit_price: unit, total_price: unit * Number(it.quantity || 1),
      product_title: p?.name || p?.title || "Article",
      product_image_url: p?.image_url || p?.images?.[0] || null,
      shop_name: shop?.name ?? null,
    };
  });

  // Activity log for this order
  const { data: activity } = await supabase
    .from("activity_logs")
    .select("action, metadata, created_at, user_id")
    .eq("target_type", "order")
    .eq("target_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  return apiResponse({
    ...order,
    // Alias pour la page (champs attendus mais nommés différemment / inexistants)
    stripe_payment_intent_id: order.payment_intent_id,
    updated_at: order.created_at,
    shipping_address: {
      name: order.shipping_name, address: order.shipping_address,
      city: order.shipping_city, zip: order.shipping_zip, country: order.shipping_country,
    },
    buyer: buyer ?? null,
    items,
    activity: activity ?? [],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(["super_admin","ceo","support"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  // orders n'a PAS de colonne updated_at ni dispute_reason (cf. schéma réel).
  const allowed = ["status","tracking_number","carrier","dispute_status"];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message);
  return apiResponse(data);
}
