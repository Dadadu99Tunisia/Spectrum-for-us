import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","moderation","commercial"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, Number(searchParams.get("page")   ?? 1));
  const limit  = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const status = searchParams.get("status") ?? "";
  const search = searchParams.get("search") ?? "";
  const offset = (page - 1) * limit;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(`
      id, title, price, status, created_at, image_url,
      shops!products_shop_id_fkey(id, name, slug)
    `, { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error, count } = await query;
  if (error) return apiError(error.message);
  return apiResponse(data, { total: count, page, limit });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","moderation"]);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { ids, status } = body;
  if (!ids?.length || !status) return apiError("ids[] and status required");

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ status }).in("id", ids);
  if (error) return apiError(error.message);

  for (const id of ids) {
    await logActivity(auth.user.id, `product_${status}`, "product", id, {});
  }
  return apiResponse({ updated: ids.length });
}
