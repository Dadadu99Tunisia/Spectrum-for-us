import type { SupabaseClient } from "@supabase/supabase-js";

export type DiscountResult =
  | { ok: true; id: string; code: string; shop_id: string | null; discount_cents: number }
  | { ok: false; reason: string };

/**
 * Valide un code promo côté serveur et calcule la remise (en centimes).
 * subtotalByShop : sous-total HORS port par boutique, en centimes.
 * - Code boutique (shop_id) : remise sur le sous-total de cette boutique.
 * - Code plateforme (shop_id null) : remise sur le total des produits.
 */
export async function validateDiscount(
  admin: SupabaseClient,
  rawCode: string,
  subtotalByShop: Record<string, number>,
): Promise<DiscountResult> {
  const code = (rawCode || "").trim();
  if (!code) return { ok: false, reason: "Code vide" };

  const { data: dc } = await admin.from("discount_codes").select("*").ilike("code", code).maybeSingle();
  if (!dc || !dc.active) return { ok: false, reason: "Code invalide" };
  if (dc.expires_at && new Date(dc.expires_at).getTime() < Date.now()) return { ok: false, reason: "Code expiré" };
  if (dc.max_uses != null && dc.used_count >= dc.max_uses) return { ok: false, reason: "Code épuisé" };

  // Base de calcul (centimes)
  let base: number;
  if (dc.shop_id) {
    base = subtotalByShop[dc.shop_id] ?? 0;
    if (base <= 0) return { ok: false, reason: "Ce code s'applique à une boutique absente de ton panier" };
  } else {
    base = Object.values(subtotalByShop).reduce((s, v) => s + v, 0);
  }

  if (dc.min_order != null && base < Math.round(Number(dc.min_order) * 100))
    return { ok: false, reason: `Minimum ${Number(dc.min_order).toFixed(2)} € requis` };

  let discount = dc.kind === "percent"
    ? Math.round(base * (Number(dc.value) / 100))
    : Math.round(Number(dc.value) * 100);
  discount = Math.min(discount, base); // jamais plus que la base
  if (discount <= 0) return { ok: false, reason: "Remise nulle" };

  return { ok: true, id: dc.id, code: dc.code, shop_id: dc.shop_id ?? null, discount_cents: discount };
}
