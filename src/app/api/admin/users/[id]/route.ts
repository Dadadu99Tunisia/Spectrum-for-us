import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const admin = createAdminClient();

  const { data: profile, error } = await admin.from("profiles").select("*").eq("id", id).single();
  if (error) return apiError(error.message, 404);

  // E-mail (auth) + commandes + réservations
  const [{ data: authUser }, { data: orders }, { data: bookings }] = await Promise.all([
    admin.auth.admin.getUserById(id),
    admin.from("orders").select("id, total_amount, status, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(10),
    admin.from("bookings").select("id, start_at, status, amount, products(name, title)").eq("customer_id", id).order("start_at", { ascending: false }).limit(10),
  ]);

  const ordersList = orders ?? [];
  const totalSpent = ordersList.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);

  return apiResponse({
    ...profile,
    email: authUser?.user?.email ?? null,
    orders: ordersList,
    orders_count: ordersList.length,
    total_spent: totalSpent,
    bookings: bookings ?? [],
    bookings_count: (bookings ?? []).length,
  });
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

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message);

  // Sync CRM : passer quelqu'un en rôle "vendor" le place dans la phase "vendor" du pipeline
  // (crée le contact s'il n'existe pas) → suivi des vendeur·ses qui n'ont pas encore monté leur boutique.
  if (update.role === "vendor") {
    try {
      const { data: au } = await supabase.auth.admin.getUserById(id);
      const email = au?.user?.email ?? null;
      const name = (data.full_name as string)
        || (au?.user?.user_metadata?.full_name as string)
        || email || "Vendeur·se";
      const nowIso = new Date().toISOString();
      if (email) {
        const { data: rows } = await supabase.from("crm_contacts").select("id").eq("email", email).limit(1);
        if (rows && rows.length) {
          // Contact existant : aligne stage ET type, et horodate la conversion.
          await supabase.from("crm_contacts")
            .update({ stage: "vendor", contact_type: "prospect_vendor", converted_at: nowIso, updated_at: nowIso })
            .eq("id", rows[0].id);
        } else {
          await supabase.from("crm_contacts").insert({
            name, email, contact_type: "prospect_vendor", stage: "vendor",
            converted_at: nowIso, source: "role_assignment", assigned_to: auth.user.id,
          });
        }
      } else {
        console.warn(`[users] sync CRM vendor: pas d'email pour user ${id}, contact CRM non créé`);
      }
    } catch (e) { console.error("[users] sync CRM vendor", e); }
  }

  const action = body.is_suspended === true ? "suspend_user"
    : body.is_suspended === false ? "unsuspend_user"
    : body.role ? "change_role" : "update_user";

  await logActivity(auth.user.id, action, "user", id, update);
  return apiResponse(data);
}
