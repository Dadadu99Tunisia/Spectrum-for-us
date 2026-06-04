import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","support"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, Number(searchParams.get("page")   ?? 1));
  const limit    = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const status   = searchParams.get("status") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const offset   = (page - 1) * limit;

  const supabase = await createClient();
  let query = supabase
    .from("support_tickets")
    .select(`
      id, ticket_number, subject, category, priority, ticket_status,
      created_at, updated_at, sla_due_at, first_response_at,
      profiles!support_tickets_user_id_fkey(id, full_name),
      assigned:profiles!support_tickets_assigned_to_fkey(id, full_name)
    `, { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (status)   query = query.eq("ticket_status", status);
  if (priority) query = query.eq("priority", priority);

  const { data, error, count } = await query;
  if (error) return apiError(error.message);
  return apiResponse(data, { total: count, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","support"]);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { user_id, subject, category, priority } = body;
  if (!subject) return apiError("subject required");

  const supabase = await createClient();
  const ticket_number = `TKT-${Date.now().toString(36).toUpperCase()}`;
  const sla_hours = priority === "urgent" ? 4 : priority === "high" ? 8 : 24;

  const { data, error } = await supabase.from("support_tickets").insert({
    ticket_number, user_id, subject, category,
    priority: priority ?? "medium",
    ticket_status: "open",
    sla_due_at: new Date(Date.now() + sla_hours * 3600000).toISOString(),
  }).select().single();

  if (error) return apiError(error.message);
  return apiResponse(data, {}, 201);
}
