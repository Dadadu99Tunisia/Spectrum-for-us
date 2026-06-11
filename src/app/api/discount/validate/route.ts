import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateDiscount } from "@/lib/discount";

export async function POST(req: NextRequest) {
  let body: { code?: string; cart?: { id: string; quantity: number }[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide" }, { status: 400 }); }
  if (!body.code || !Array.isArray(body.cart) || !body.cart.length)
    return NextResponse.json({ error: "Code ou panier manquant" }, { status: 400 });

  const admin = createAdminClient();
  const ids = body.cart.map(i => i.id);
  const { data: products } = await admin.from("products").select("id, price, shop_id").in("id", ids);
  const pmap = Object.fromEntries((products ?? []).map(p => [p.id, p]));

  const subtotalByShop: Record<string, number> = {};
  for (const it of body.cart) {
    const p = pmap[it.id]; if (!p?.shop_id) continue;
    subtotalByShop[p.shop_id] = (subtotalByShop[p.shop_id] ?? 0) + Math.round(Number(p.price) * 100 * it.quantity);
  }

  const r = await validateDiscount(admin, body.code, subtotalByShop);
  if (!r.ok) return NextResponse.json({ valid: false, error: r.reason });
  return NextResponse.json({ valid: true, code: r.code, discount: r.discount_cents / 100 });
}
