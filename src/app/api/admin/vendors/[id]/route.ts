import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin", "ceo"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const admin = createAdminClient();

  // Remove dependent rows first to satisfy FK constraints
  await admin.from("products").delete().eq("shop_id", id);
  await admin.from("vendor_kyc").delete().eq("shop_id", id);

  const { error } = await admin.from("shops").delete().eq("id", id);
  if (error) return apiError(`Suppression impossible : ${error.message}. Désactivez la boutique si elle a des commandes liées.`);

  await logActivity(auth.user.id, "shop_delete", "shop", id, {});
  return apiResponse({ deleted: true });
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","moderation","commercial"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = await createClient();

  const [shopRes, kycRes, productsRes] = await Promise.all([
    supabase.from("shops").select("*").eq("id", id).single(),
    supabase.from("vendor_kyc").select("*").eq("shop_id", id).maybeSingle(),
    supabase.from("products").select("id,name,title,is_active,price,created_at", { count: "exact" }).eq("shop_id", id).order("created_at", { ascending: false }).limit(5),
  ]);

  if (shopRes.error) return apiError(shopRes.error.message, 404);

  // Commandes via order_items (orders n'a pas de shop_id)
  const { data: orderItemsData } = await supabase
    .from("order_items")
    .select("order_id, price_at_purchase, quantity, orders(id, total_amount, status, created_at)")
    .eq("vendor_id", shopRes.data.owner_id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Dédupliquer les commandes
  const seenOrders = new Set<string>();
  const recentOrders: Record<string, unknown>[] = [];
  for (const item of (orderItemsData ?? [])) {
    const order = item.orders as unknown as Record<string, unknown> | null;
    if (order && !seenOrders.has(order.id as string)) {
      seenOrders.add(order.id as string);
      recentOrders.push(order);
      if (recentOrders.length >= 5) break;
    }
  }

  // CA total : somme des price_at_purchase * quantity pour ce vendeur sur commandes paid
  const { data: revenueItems } = await supabase
    .from("order_items")
    .select("price_at_purchase, quantity, orders!inner(status)")
    .eq("vendor_id", shopRes.data.owner_id)
    .eq("orders.status", "paid");
  const totalRevenue = (revenueItems ?? []).reduce((s, r) =>
    s + Number(r.price_at_purchase || 0) * Number(r.quantity || 1), 0);

  return apiResponse({
    shop: shopRes.data,
    kyc: kycRes.data ?? null,
    recent_products: productsRes.data ?? [],
    recent_orders: recentOrders,
    product_count: productsRes.count ?? 0,
    total_revenue: Math.round(totalRevenue * 100) / 100,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","moderation"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const allowed = ["is_active","is_verified","name","tagline","description","city","country","contact_email"];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];

  const admin = createAdminClient();
  const { data, error } = await admin.from("shops").update(update).eq("id", id).select().single();
  if (error) return apiError(error.message);
  await logActivity(auth.user.id, "shop_edit", "shop", id, update);
  return apiResponse(data);
}
