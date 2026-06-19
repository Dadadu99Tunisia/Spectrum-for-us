import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";
import { computeSellerRisk } from "@/lib/risk";
import { getStripeServer } from "@/lib/stripe-server";

/** Risk scoring vendeurs · recalcul + (POST) rétention de versement Stripe. */
export async function GET() {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  const admin = createAdminClient();
  const { data: sellers } = await admin
    .from("sellers")
    .select("id, user_id, stripe_account_id, risk_level");
  if (!sellers?.length) return apiResponse([]);

  // Nom d'affichage = activité primaire de chaque seller
  const { data: shops } = await admin.from("shops").select("name, seller_id, created_at").order("created_at", { ascending: true });
  const primary: Record<string, string> = {};
  for (const sh of shops ?? []) if (sh.seller_id && !primary[sh.seller_id]) primary[sh.seller_id] = sh.name as string;

  const rows = [];
  for (const s of sellers) {
    const r = await computeSellerRisk(admin, s.id as string);
    if (r.risk_level !== s.risk_level) {
      await admin.from("sellers").update({ risk_level: r.risk_level }).eq("id", s.id);
    }
    let email: string | null = null;
    try { const { data } = await admin.auth.admin.getUserById(s.user_id as string); email = data?.user?.email ?? null; } catch {}
    rows.push({
      seller_id: s.id, name: primary[s.id as string] ?? "—", email,
      has_stripe: !!s.stripe_account_id,
      ...r,
      refund_rate: Math.round(r.refund_rate * 1000) / 10,
      dispute_rate: Math.round(r.dispute_rate * 1000) / 10,
    });
  }

  const order = { high: 0, medium: 1, low: 2 } as Record<string, number>;
  rows.sort((a, b) => (order[a.risk_level] - order[b.risk_level]) || (b.disputes - a.disputes));

  const summary = {
    high: rows.filter(r => r.risk_level === "high").length,
    medium: rows.filter(r => r.risk_level === "medium").length,
    low: rows.filter(r => r.risk_level === "low").length,
  };
  return apiResponse(rows, { summary });
}

/** Retient (ou libère) les versements Stripe d'un seller en ajustant delay_days. */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  let body: { seller_id?: string; delay_days?: number };
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }
  if (!body.seller_id || body.delay_days == null) return apiError("seller_id et delay_days requis");
  const delay = Math.max(2, Math.min(30, Math.round(body.delay_days)));

  const admin = createAdminClient();
  const { data: seller } = await admin.from("sellers").select("stripe_account_id").eq("id", body.seller_id).maybeSingle();
  if (!seller?.stripe_account_id) return apiError("Ce vendeur n'a pas de compte Stripe (versement manuel ?).", 400);

  try {
    const stripe = getStripeServer();
    await stripe.accounts.update(seller.stripe_account_id, {
      settings: { payouts: { schedule: { interval: "daily", delay_days: delay } } },
    });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Erreur Stripe", 500);
  }

  await logActivity(auth.user.id, "hold_payout", "seller", body.seller_id, { delay_days: delay });
  return apiResponse({ ok: true, delay_days: delay });
}
