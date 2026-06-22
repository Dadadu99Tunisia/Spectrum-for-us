import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * SELLER = entité financière unique d'un·e vendeur·se (1 par utilisateur·rice).
 * Porte tout le financier : Stripe Connect, versements manuels, abonnement.
 * Les `shops` sont désormais des ACTIVITÉS (branding/commerce) rattachées à un seller
 * via `shops.seller_id`. Un seller peut avoir plusieurs activités, mais UN SEUL compte Stripe.
 */

export type Seller = {
  id: string;
  user_id: string;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean;
  stripe_payouts_enabled: boolean;
  stripe_customer_id: string | null;
  country: string | null;
  payout_mode: string | null;
  payout_method: string | null;
  payout_details: string | null;
  subscription_status: string | null;
  subscription_id: string | null;
  subscription_current_period_end: string | null;
  verification_status: string | null;
  risk_level: string;
};

export const SELLER_COLS =
  "id, user_id, stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, stripe_customer_id, country, payout_mode, payout_method, payout_details, subscription_status, subscription_id, subscription_current_period_end, verification_status, risk_level";

/** Récupère le seller d'un·e utilisateur·rice, le crée si absent. Nécessite un client admin (service-role). */
export async function ensureSeller(admin: SupabaseClient, userId: string): Promise<Seller> {
  const { data } = await admin.from("sellers").select(SELLER_COLS).eq("user_id", userId).maybeSingle();
  if (data) return data as Seller;
  const { data: created, error } = await admin
    .from("sellers")
    .insert({ user_id: userId })
    .select(SELLER_COLS)
    .single();
  if (error) throw new Error(error.message);
  // Réconcilie les activités existantes du seller (sinon shops.seller_id reste NULL et
  // la page produit affiche "Bientôt en vente" à vie + l'abonnement n'est pas relié au seller).
  await admin.from("shops").update({ seller_id: (created as Seller).id }).eq("owner_id", userId).is("seller_id", null);
  return created as Seller;
}

/** Lecture seule du seller (null si absent). */
export async function getSeller(client: SupabaseClient, userId: string): Promise<Seller | null> {
  const { data } = await client.from("sellers").select(SELLER_COLS).eq("user_id", userId).maybeSingle();
  return (data as Seller) ?? null;
}

/**
 * Résout le seller (et donc le compte Stripe destinataire) d'une ACTIVITÉ.
 * Utilise shops.seller_id ; retombe sur owner_id si la liaison manque (auto-réparation).
 */
export async function sellerForShop(admin: SupabaseClient, shopId: string): Promise<Seller | null> {
  const { data: shop } = await admin
    .from("shops")
    .select("seller_id, owner_id")
    .eq("id", shopId)
    .maybeSingle();
  if (!shop) return null;
  if (shop.seller_id) {
    const { data } = await admin.from("sellers").select(SELLER_COLS).eq("id", shop.seller_id).maybeSingle();
    if (data) return data as Seller;
  }
  if (shop.owner_id) return ensureSeller(admin, shop.owner_id as string);
  return null;
}
