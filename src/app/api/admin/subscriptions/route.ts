import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/rbac";

/** Abonnements vendeurs (9,90 €/mois) · vue admin. */
export async function GET() {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  const supabase = createAdminClient();
  // L'abonnement (9,90 €/mois) est porté par le SELLER. On affiche son activité primaire pour le libellé.
  const { data: sellers } = await supabase
    .from("sellers")
    .select("id, user_id, subscription_status, subscription_id, subscription_current_period_end, stripe_customer_id, created_at")
    .order("created_at", { ascending: false });
  const { data: shops } = await supabase
    .from("shops")
    .select("id, name, slug, seller_id, owner_id, created_at")
    .order("created_at", { ascending: true });
  const primary: Record<string, { name: string; slug: string }> = {};
  for (const sh of shops ?? []) {
    if (sh.seller_id && !primary[sh.seller_id]) primary[sh.seller_id] = { name: sh.name, slug: sh.slug };
  }

  const rows = (sellers ?? []).map(s => {
    const end = s.subscription_current_period_end ? new Date(s.subscription_current_period_end) : null;
    const status = s.subscription_status === "active"
      ? (end && end.getTime() < Date.now() ? "past_due" : "active")
      : (s.subscription_id ? "canceled" : "none");
    const p = primary[s.id] ?? { name: "—", slug: "" };
    return {
      id: s.id, shop: p.name, slug: p.slug, owner_id: s.user_id,
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
