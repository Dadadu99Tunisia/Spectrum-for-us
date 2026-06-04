import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","moderation"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const { action, notes } = body; // action: 'approve' | 'reject'

  if (!["approve","reject"].includes(action)) return apiError("action must be approve or reject");

  const supabase = await createClient();
  const kyc_status = action === "approve" ? "verified" : "rejected";

  const { data, error } = await supabase
    .from("vendor_kyc")
    .update({
      kyc_status,
      kyc_notes: notes,
      kyc_verified_at: action === "approve" ? new Date().toISOString() : null,
    })
    .eq("shop_id", id)
    .select()
    .single();

  if (error) return apiError(error.message);

  // Activer/désactiver la boutique selon le verdict
  if (action === "approve") {
    await supabase.from("shops").update({ is_active: true }).eq("id", id);
  }

  await logActivity(auth.user.id, `kyc_${action}`, "vendor", id, { notes, kyc_status });

  return apiResponse(data);
}
