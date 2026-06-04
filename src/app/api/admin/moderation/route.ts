import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","moderation","support"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit  = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const status = searchParams.get("status") ?? "pending";
  const type   = searchParams.get("type") ?? "";
  const offset = (page - 1) * limit;

  const supabase = await createClient();
  let query = supabase
    .from("moderation_queue")
    .select("*, profiles!moderation_queue_assigned_to_fkey(full_name)", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: true }); // FIFO

  if (status) query = query.eq("mod_status", status);
  if (type)   query = query.eq("target_type", type);

  const { data, error, count } = await query;
  if (error) return apiError(error.message);
  return apiResponse(data, { total: count, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","moderation"]);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { target_type, target_id, reason } = body;
  if (!target_type || !target_id) return apiError("target_type and target_id required");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("moderation_queue")
    .insert({ target_type, target_id, reason, mod_status: "pending" })
    .select()
    .single();

  if (error) return apiError(error.message);
  return apiResponse(data, {}, 201);
}
