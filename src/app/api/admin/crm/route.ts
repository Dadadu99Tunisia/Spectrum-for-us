import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";
import { CRM_STAGES, CRM_CONTACT_TYPES } from "@/lib/crm/enums";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","marketing","commercial"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const stage  = searchParams.get("stage") ?? "";
  const type   = searchParams.get("type")  ?? "";
  const search = searchParams.get("search") ?? "";

  const supabase = createAdminClient();
  let query = supabase
    .from("crm_contacts")
    .select(
      `id, name, email, phone, company, contact_type, stage, source,
       next_followup_at, converted_at, created_at, updated_at, tags, notes`,
      { count: "exact" }
    )
    .order("updated_at", { ascending: false });

  if (stage)  query = query.eq("stage", stage);
  if (type)   query = query.eq("contact_type", type);
  // Recherche sur nom, email ET société (échappe les caractères PostgREST).
  if (search) {
    const s = search.replace(/[%,()]/g, " ").trim();
    if (s) query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,company.ilike.%${s}%`);
  }

  const { data, error, count } = await query;
  if (error) return apiError(error.message);
  return apiResponse(data, { total: count });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","marketing","commercial"]);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { name, email, phone, company, contact_type, stage, source, notes, next_followup_at } = body;
  if (!name) return apiError("name required");

  const ct = contact_type ?? "prospect_vendor";
  const st = stage ?? "identified";
  if (!CRM_CONTACT_TYPES.includes(ct)) return apiError(`contact_type invalide : ${ct}`);
  if (!CRM_STAGES.includes(st))        return apiError(`stage invalide : ${st}`);

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("crm_contacts").insert({
    name, email, phone, company,
    contact_type: ct, stage: st,
    source, notes, next_followup_at,
    assigned_to: auth.user.id,
  }).select().single();

  if (error) return apiError(error.message);
  return apiResponse(data, {}, 201);
}
