import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET() {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  const admin = createAdminClient();

  const { data: shops } = await admin.from("shops")
    .select("id, name, owner_id, payout_method, payout_details")
    .eq("payout_mode", "manual");
  if (!shops?.length) return apiResponse([]);

  const shopIds = shops.map(s => s.id);
  const [{ data: comm }, { data: ships }, { data: payouts }] = await Promise.all([
    admin.from("commissions").select("shop_id, gross_amount, commission_amount").in("shop_id", shopIds),
    admin.from("order_shipments").select("shop_id, shipping_cost").in("shop_id", shopIds),
    admin.from("vendor_payouts").select("shop_id, amount").in("shop_id", shopIds),
  ]);

  const agg = (rows: { shop_id: string }[] | null, field: string, sign = 1) => {
    const m: Record<string, number> = {};
    for (const r of (rows ?? []) as Record<string, unknown>[]) {
      const sid = r.shop_id as string;
      m[sid] = (m[sid] ?? 0) + sign * Number(r[field] || 0);
    }
    return m;
  };
  const gross = agg(comm, "gross_amount");
  const commission = agg(comm, "commission_amount");
  const shipping = agg(ships, "shipping_cost");
  const paid = agg(payouts, "amount");

  const result = shops.map(s => {
    const earned = (gross[s.id] ?? 0) - (commission[s.id] ?? 0) + (shipping[s.id] ?? 0);
    const owed = Math.round((earned - (paid[s.id] ?? 0)) * 100) / 100;
    return {
      shop_id: s.id, name: s.name, payout_method: s.payout_method, payout_details: s.payout_details,
      earned: Math.round(earned * 100) / 100, paid: Math.round((paid[s.id] ?? 0) * 100) / 100, owed,
    };
  }).sort((a, b) => b.owed - a.owed);

  return apiResponse(result);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  let body: { shop_id?: string; amount?: number; method?: string; reference?: string; note?: string };
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }
  if (!body.shop_id || !body.amount || body.amount <= 0) return apiError("shop_id et montant requis");

  const admin = createAdminClient();
  const { error } = await admin.from("vendor_payouts").insert({
    shop_id: body.shop_id, amount: body.amount,
    method: body.method?.trim() || null, reference: body.reference?.trim() || null, note: body.note?.trim() || null,
    created_by: auth.user.id,
  });
  if (error) return apiError(error.message);
  return apiResponse({ ok: true });
}
