import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export type AdminRole =
  | "super_admin" | "ceo" | "cfo" | "marketing" | "commercial"
  | "support" | "moderation" | "hr" | "vendor" | "buyer";

export const ADMIN_ROLES: AdminRole[] = [
  "super_admin","ceo","cfo","marketing","commercial","support","moderation","hr"
];

const ADMIN_EMAILS = ["hedibenazouz@gmail.com", "chennaoui.aicha@gmail.com"];

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

/** Vérifie auth + rôle admin. Retourne { user } ou { error: NextResponse } */
export async function requireAdmin(
  allowedRoles?: AdminRole[]
): Promise<{ user: AdminUser } | { error: NextResponse }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  // Email hardcodé = super_admin — toujours autorisé peu importe allowedRoles
  if (ADMIN_EMAILS.includes(user.email ?? "")) {
    return { user: { id: user.id, email: user.email!, role: "super_admin" as AdminRole } };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!profile || !ADMIN_ROLES.includes(profile.role as AdminRole)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  if (allowedRoles && !allowedRoles.includes(profile.role as AdminRole)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user: { id: user.id, email: user.email!, role: profile.role as AdminRole } };
}

/** Log une action admin */
export async function logActivity(
  userId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = await createClient();
    await supabase.from("activity_logs").insert({
      user_id: userId,
      action,
      target_type: targetType,
      target_id: targetId,
      metadata,
    });
  } catch { /* silently ignore */ }
}

/** Réponse standardisée */
export function apiResponse<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json({ data, meta: meta ?? {}, error: null }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status });
}
