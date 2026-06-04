import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * RGPD Art. 20 — Droit à la portabilité des données
 * GET /api/account/export
 * Retourne toutes les données personnelles de l'utilisateur en JSON.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = user.id;

  // Collecter toutes les données
  const [profileRes, ordersRes, orderItemsRes, shopRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("orders").select("*").eq("user_id", userId),
    supabase
      .from("order_items")
      .select("*, orders!inner(user_id)")
      .eq("orders.user_id", userId),
    supabase.from("shops").select("id, name, slug, description, city, created_at").eq("owner_id", userId),
  ]);

  const export_data = {
    exported_at: new Date().toISOString(),
    rgpd_basis: "RGPD Art. 20 — Droit à la portabilité",
    account: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
    profile: profileRes.data ?? null,
    orders: ordersRes.data ?? [],
    order_items: (orderItemsRes.data ?? []).map((item: Record<string, unknown>) => {
      // Retirer la jointure interne
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { orders: _orders, ...rest } = item;
      return rest;
    }),
    shops: shopRes.data ?? [],
  };

  return new NextResponse(JSON.stringify(export_data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="spectrum-export-${userId.slice(0, 8)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
