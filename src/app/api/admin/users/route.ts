import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","support","moderation","hr"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page    = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit   = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const search  = searchParams.get("search") ?? "";
  const role    = searchParams.get("role") ?? "";
  const offset  = (page - 1) * limit;

  const supabase = createAdminClient();
  let query = supabase
    .from("profiles")
    .select("id,full_name,role,is_suspended,country,last_seen_at,created_at", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (search) query = query.ilike("full_name", `%${search}%`);
  if (role)   query = query.eq("role", role);

  const { data, error, count } = await query;
  if (error) return apiError(error.message);

  return apiResponse(data, { total: count, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","hr"]);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { email, full_name, role } = body;
  if (!email || !role) return apiError("email and role required");

  const supabase = createAdminClient();
  // 1) Créer le compte auth (l'email est obligatoire ; profiles.id = FK vers auth.users)
  const { data: created, error: authErr } = await supabase.auth.admin.createUser({
    email, email_confirm: true, user_metadata: { full_name },
  });
  if (authErr || !created?.user) return apiError(authErr?.message ?? "Création du compte échouée");

  // 2) Renseigner le profil (un trigger peut déjà l'avoir créé → upsert)
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: created.user.id, full_name: full_name ?? null, role })
    .select()
    .single();
  if (error) return apiError(error.message);

  await logActivity(auth.user.id, "create_user", "user", created.user.id, { email, role });
  return apiResponse(data, {}, 201);
}
