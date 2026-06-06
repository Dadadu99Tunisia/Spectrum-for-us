import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/rbac";

/** Abonnements vendeurs (9,90 €/mois) — vue admin. */
export async function GET() {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { data: shops } = await supabase
    .from("shops")
    .select("id, name, slug, owner_id, subscription_status, subscription_id, subscription_current_period_end, stripe_customer_id, created_at")
    .order("created_at", { ascending: false });

  const rows = (shops ?? []).map(s => {
    const end = s.subscription_current_period_end ? new Date(s.subscription_current_period_end) : null;
    const status = s.subscription_status === "active"
      ? (end && end.getTime() < Date.now() ? "past_due" : "active")
      : (s.subscription_id ? "canceled" : "none");
    return {
      id: s.id, shop: s.name, slug: s.slug, owner_id: s.owner_id,
      status, renewal: s.subscription_current_period_end,
      hasStripe: !!s.stripe_customer_id, subscription_id: s.subscription_id,
    };
  });

  const summary = {
    active: rows.filter(r => r.status === "active").length,
    pastDue: rows.filter(r => r.status === "past_due").length,
    canceled: rows.filter(r => r.status === "canceled").length,
    none: rows.filter(r => r.status === "none").length,
    mrr: rows.filter(r => r.status === "active").length * 9.9,
  };

  return NextResponse.json({ rows, summary }, { headers: { "Cache-Control": "no-store" } });
}
