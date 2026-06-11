import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/rbac";

/** Recherche globale admin · cross-entités (users, boutiques, produits, commandes). */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const supabase = createAdminClient();
  const like = `%${q}%`;

  const [profiles, shops, products, orders] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role").ilike("full_name", like).limit(5),
    supabase.from("shops").select("id, name, slug, owner_id").ilike("name", like).limit(5),
    supabase.from("products").select("id, name, title, slug, price").or(`name.ilike.${like},title.ilike.${like}`).limit(6),
    supabase.from("orders").select("id, shipping_name, status, total_amount, created_at").ilike("shipping_name", like).limit(5),
  ]);

  const results = [
    ...(profiles.data ?? []).map(p => ({
      type: "user", id: p.id, title: p.full_name || "Sans nom",
      subtitle: `Rôle : ${p.role ?? "buyer"}`, href: "/admin/users",
    })),
    ...(shops.data ?? []).map(s => ({
      type: "shop", id: s.id, title: s.name,
      subtitle: "Boutique", href: `/admin/vendors`,
    })),
    ...(products.data ?? []).map(p => ({
      type: "product", id: p.id, title: p.name || p.title,
      subtitle: `Produit · ${Number(p.price).toFixed(2)} €`, href: `/produit/${p.slug || p.id}`,
    })),
    ...(orders.data ?? []).map(o => ({
      type: "order", id: o.id, title: `#${o.id.slice(0, 8).toUpperCase()} · ${o.shipping_name ?? ""}`,
      subtitle: `Commande · ${o.status} · ${Number(o.total_amount).toFixed(2)} €`, href: `/admin/orders/${o.id}`,
    })),
  ];

  return NextResponse.json({ results });
}
