import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";
import { CRM_STAGES, CRM_CONTACT_TYPES, CRM_CONVERTED_STAGES } from "@/lib/crm/enums";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","marketing","commercial"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("crm_interactions")
    .select("id, type, subject, content, created_at")
    .eq("contact_id", id)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return apiError(error.message);
  return apiResponse(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","marketing","commercial"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  // Validation des enums avant écriture (évite 22P02/23514 bruts).
  if ("stage" in body && !CRM_STAGES.includes(body.stage)) return apiError(`stage invalide : ${body.stage}`);
  if ("contact_type" in body && !CRM_CONTACT_TYPES.includes(body.contact_type)) return apiError(`contact_type invalide : ${body.contact_type}`);

  const allowed = ["name","email","phone","company","contact_type","stage","source","notes","tags","next_followup_at","assigned_to"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of allowed) if (k in body) update[k] = body[k];
  // converted_at : posé quand on entre dans un stage abouti, remis à null si on en sort.
  if ("stage" in body) update.converted_at = CRM_CONVERTED_STAGES.includes(body.stage) ? new Date().toISOString() : null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("crm_contacts").update(update).eq("id", id).select().single();
  if (error) return apiError(error.message);
  return apiResponse(data);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("crm_contacts").delete().eq("id", id);
  if (error) return apiError(error.message);
  return apiResponse({ deleted: id });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Ajouter une interaction
  const auth = await requireAdmin(["super_admin","ceo","marketing","commercial"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const { type, subject, content } = body;

  const supabase = await createClient();
  const { data, error } = await supabase.from("crm_interactions").insert({
    contact_id: id, user_id: auth.user.id, type, subject, content,
  }).select().single();

  if (error) return apiError(error.message);
  // Mettre à jour updated_at du contact
  await supabase.from("crm_contacts").update({ updated_at: new Date().toISOString() }).eq("id", id);
  return apiResponse(data, {}, 201);
}
