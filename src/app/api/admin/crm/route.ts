import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","marketing","commercial"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const stage  = searchParams.get("stage") ?? "";
  const type   = searchParams.get("type")  ?? "";
  const search = searchParams.get("search") ?? "";

  const supabase = await createClient();
  let query = supabase
    .from("crm_contacts")
    .select(`
      id, name, email, company, contact_type, stage, source,
      next_followup_at, created_at, updated_at, tags,
      profiles!crm_contacts_assigned_to_fkey(id, full_name)
    `, { count: "exact" })
    .order("updated_at", { ascending: false });

  if (stage)  query = query.eq("stage", stage);
  if (type)   query = query.eq("contact_type", type);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error, count } = await query;
  if (error) return apiError(error.message);
  return apiResponse(data, { total: count });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","marketing","commercial"]);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { name, email, company, contact_type, stage, source, notes, next_followup_at } = body;
  if (!name) return apiError("name required");

  const supabase = await createClient();
  const { data, error } = await supabase.from("crm_contacts").insert({
    name, email, company,
    contact_type: contact_type ?? "prospect_vendor",
    stage: stage ?? "identified",
    source, notes, next_followup_at,
    assigned_to: auth.user.id,
  }).select().single();

  if (error) return apiError(error.message);
  return apiResponse(data, {}, 201);
}
