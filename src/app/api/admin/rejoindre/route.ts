import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";
import { sendJoinApproved, trySend } from "@/lib/email";

export async function GET(_: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "moderation", "commercial"]);
  if ("error" in auth) return auth.error;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("join_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return apiError(error.message);
  return apiResponse(data ?? []);
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "moderation", "commercial"]);
  if ("error" in auth) return auth.error;

  const { id, status } = await req.json();
  if (!id || !status) return apiError("id and status required", 400);

  const ALLOWED_STATUSES = ["pending", "contacted", "approved", "rejected"];
  if (!ALLOWED_STATUSES.includes(status)) return apiError("Statut invalide", 400);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("join_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message);

  // Action réelle à l'approbation : email d'invitation à ouvrir sa boutique (best-effort)
  if (status === "approved" && data?.email) {
    await trySend(() => sendJoinApproved({ to: data.email as string, name: data.name as string | undefined }));
  }

  return apiResponse(data);
}
