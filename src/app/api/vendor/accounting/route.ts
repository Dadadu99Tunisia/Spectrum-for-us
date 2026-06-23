import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Compta vendeur·se : historique des versements reçus + détail des ventes
// (brut, commission, net) pour export comptable. Lecture seule, scoppée au·à la
// propriétaire des boutiques.
export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: shops } = await supabase.from("shops").select("id, name").eq("owner_id", auth.user.id);
  const shopIds = (shops ?? []).map(s => s.id);
  if (!shopIds.length) return NextResponse.json({ payouts: [], sales: [], totals: { gross: 0, commission: 0, net: 0, paid: 0 } });
  const shopName: Record<string, string> = Object.fromEntries((shops ?? []).map(s => [s.id, s.name]));

  const [{ data: payouts }, { data: comm }] = await Promise.all([
    supabase.from("vendor_payouts").select("amount, method, reference, paid_at, created_at, shop_id").in("shop_id", shopIds).order("created_at", { ascending: false }),
    supabase.from("commissions").select("order_id, shop_id, gross_amount, commission_amount, commission_rate, status, created_at").in("shop_id", shopIds).order("created_at", { ascending: false }),
  ]);

  const sales = (comm ?? []).map(c => ({
    date: c.created_at,
    order: (c.order_id as string | null)?.slice(0, 8).toUpperCase() ?? "—",
    shop: shopName[c.shop_id as string] ?? "",
    gross: Number(c.gross_amount || 0),
    rate: Number(c.commission_rate || 0),
    commission: Number(c.commission_amount || 0),
    net: Number(c.gross_amount || 0) - Number(c.commission_amount || 0),
    status: c.status,
  }));

  const totals = sales.reduce((t, s) => ({
    gross: t.gross + s.gross, commission: t.commission + s.commission, net: t.net + s.net, paid: t.paid,
  }), { gross: 0, commission: 0, net: 0, paid: 0 });
  totals.paid = (payouts ?? []).reduce((s, p) => s + Number(p.amount || 0), 0);
  for (const k of Object.keys(totals) as (keyof typeof totals)[]) totals[k] = Math.round(totals[k] * 100) / 100;

  return NextResponse.json({
    payouts: (payouts ?? []).map(p => ({ amount: Number(p.amount || 0), method: p.method, reference: p.reference, date: p.paid_at ?? p.created_at, shop: shopName[p.shop_id as string] ?? "" })),
    sales, totals,
  });
}
