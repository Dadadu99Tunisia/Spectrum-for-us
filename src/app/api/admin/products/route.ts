import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

const SELECT = `
  id, name, title, price, listing_status, is_active, is_featured,
  category, subcategory, quantity, type, image_url, slug, created_at,
  shops!products_shop_id_fkey(id, name, slug)
`;

const EDITABLE = [
  "name", "title", "price", "category", "subcategory", "quantity",
  "description", "image_url", "is_active", "is_featured", "listing_status", "type",
] as const;

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "moderation", "commercial"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit  = Math.min(100, Number(searchParams.get("limit") ?? 25));
  const status = searchParams.get("status") ?? "";
  const search = searchParams.get("search") ?? "";
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();
  let query = supabase
    .from("products")
    .select(SELECT, { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (status === "active") query = query.eq("is_active", true);
  else if (status === "inactive") query = query.eq("is_active", false);
  else if (status) query = query.eq("listing_status", status);
  if (search) query = query.or(`name.ilike.%${search}%,title.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return apiError(error.message);
  return apiResponse(data, { total: count, page, limit });
}

// Bulk update (status / activation) on several products
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "moderation", "ceo"]);
  if ("error" in auth) return auth.error;

  const { ids, listing_status, is_active } = await req.json();
  if (!ids?.length) return apiError("ids[] required");

  const update: Record<string, unknown> = {};
  if (listing_status) {
    update.listing_status = listing_status;
    update.is_active = listing_status === "approved";
  }
  if (typeof is_active === "boolean") update.is_active = is_active;
  if (!Object.keys(update).length) return apiError("nothing to update");

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(update).in("id", ids);
  if (error) return apiError(error.message);

  for (const id of ids) await logActivity(auth.user.id, "product_update", "product", id, update);
  return apiResponse({ updated: ids.length });
}

// Edit a single product
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "moderation", "ceo"]);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { id } = body;
  if (!id) return apiError("id required");

  const update: Record<string, unknown> = {};
  for (const k of EDITABLE) if (k in body) update[k] = body[k];
  if ("price" in update) update.price = Number(update.price) || 0;
  if ("quantity" in update) update.quantity = Number(update.quantity) || 0;
  if (!Object.keys(update).length) return apiError("nothing to update");

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("products").update(update).eq("id", id).select(SELECT).single();
  if (error) return apiError(error.message);

  await logActivity(auth.user.id, "product_edit", "product", id, update);
  return apiResponse(data);
}

// Delete product(s)
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo"]);
  if ("error" in auth) return auth.error;

  const { ids } = await req.json();
  if (!ids?.length) return apiError("ids[] required");

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().in("id", ids);
  if (error) return apiError(error.message);

  for (const id of ids) await logActivity(auth.user.id, "product_delete", "product", id, {});
  return apiResponse({ deleted: ids.length });
}
