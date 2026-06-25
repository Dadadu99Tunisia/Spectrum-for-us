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

  // reviewed_by / assigned_to référencent profiles(id). Les admins reconnus par
  // email allowlist n'ont pas toujours de ligne profiles → on met null plutôt que
  // de violer la FK (ce qui faisait échouer la validation en silence → item bloqué).
  const { data: prof } = await supabase.from("profiles").select("id").eq("id", auth.user.id).maybeSingle();
  const actorId = prof?.id ?? null;

  const update: Record<string, unknown> = { notes };

  if (action === "approve" || action === "reject") {
    update.mod_status  = action === "approve" ? "approved" : "rejected";
    update.reviewed_by = actorId;
    update.reviewed_at = new Date().toISOString();
  }
  if (action === "assign") {
    update.assigned_to = actorId;
  }

  const { data, error } = await supabase
    .from("moderation_queue")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message);

  // Si approbation d'un produit, l'activer (colonne réelle = listing_status)
  if (action === "approve" && data.target_type === "product") {
    await supabase.from("products").update({ listing_status: "approved", is_active: true }).eq("id", data.target_id);
  }
  // Si approbation d'un vendeur
  if (action === "approve" && data.target_type === "vendor") {
    await supabase.from("shops").update({ is_active: true }).eq("id", data.target_id);
  }
  // Si rejet, désactiver
  if (action === "reject" && data.target_type === "product") {
    await supabase.from("products").update({ listing_status: "rejected", is_active: false }).eq("id", data.target_id);
  }

  await logActivity(auth.user.id, `moderation_${action}`, data.target_type, data.target_id, { notes });

  return apiResponse(data);
}
