import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return apiError(error.message, 404);
  return apiResponse(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","hr","support"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const allowed = ["role","is_suspended","suspended_reason","country","full_name"];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];

  if (body.is_suspended === true) update.suspended_at = new Date().toISOString();
  if (body.is_suspended === false) {
    update.suspended_at = null;
    update.suspended_reason = null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message);

  const action = body.is_suspended === true ? "suspend_user"
    : body.is_suspended === false ? "unsuspend_user"
    : body.role ? "change_role" : "update_user";

  await logActivity(auth.user.id, action, "user", id, update);
  return apiResponse(data);
}
