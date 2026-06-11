import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","moderation"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const { action, notes } = body; // action: 'approve' | 'reject' | 'assign'

  if (!["approve","reject","assign"].includes(action)) {
    return apiError("action must be approve, reject or assign");
  }

  const supabase = createAdminClient();
  const update: Record<string, unknown> = { notes };

  if (action === "approve" || action === "reject") {
    update.mod_status  = action === "approve" ? "approved" : "rejected";
    update.reviewed_by = auth.user.id;
    update.reviewed_at = new Date().toISOString();
  }
  if (action === "assign") {
    update.assigned_to = auth.user.id;
  }

  const { data, error } = await supabase
    .from("moderation_queue")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message);

  // Si approbation d'un produit, l'activer
  if (action === "approve" && data.target_type === "product") {
    await supabase.from("products").update({ status: "active" }).eq("id", data.target_id);
  }
  // Si approbation d'un vendeur
  if (action === "approve" && data.target_type === "vendor") {
    await supabase.from("shops").update({ is_active: true }).eq("id", data.target_id);
  }
  // Si rejet, désactiver
  if (action === "reject" && data.target_type === "product") {
    await supabase.from("products").update({ status: "rejected" }).eq("id", data.target_id);
  }

  await logActivity(auth.user.id, `moderation_${action}`, data.target_type, data.target_id, { notes });

  return apiResponse(data);
}
