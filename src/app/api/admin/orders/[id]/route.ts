import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","support","commercial"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id, status, total_amount, created_at, updated_at,
      tracking_number, carrier,
      dispute_status, dispute_reason,
      refund_status, refund_amount, refund_reason, refunded_at,
      shipping_address, billing_address,
      stripe_payment_intent_id,
      user_id
    `)
    .eq("id", id)
    .single();

  if (error || !order) return apiError("Commande introuvable", 404);

  // Buyer profile
  const { data: buyer } = await supabase
    .from("profiles")
    .select("id, full_name, pseudo, email")
    .eq("id", order.user_id)
    .single();

  // Order items
  const { data: items } = await supabase
    .from("order_items")
    .select(`
      id, quantity, unit_price, total_price,
      product_id, product_title, product_image_url,
      shop_id, shop_name
    `)
    .eq("order_id", id);

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
    buyer: buyer ?? null,
    items: items ?? [],
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
  const allowed = ["status","tracking_number","carrier","dispute_status","dispute_reason"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of allowed) if (k in body) update[k] = body[k];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message);
  return apiResponse(data);
}
