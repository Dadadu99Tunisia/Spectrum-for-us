import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Taux de commission (%) de la plateforme.
 *
 * Deux rails de monétisation :
 *  - Vendeur **Stripe** (pays où Stripe Connect existe) : abonnement 9,90 €/mois
 *    + commission basse (défaut 5 %). 0 % pendant la fenêtre fondateur·ice.
 *  - Vendeur **versement manuel** (pays sans Stripe : Tunisie, Maghreb…) : PAS
 *    d'abonnement → commission plus forte (défaut 12 %), prélevée à la source au
 *    moment du versement manuel. Fenêtre fondateur·ice = commission réduite
 *    (défaut 6 %), et non 0 %, car il n'y a pas d'abonnement offert en regard.
 *
 * Le gate est le `payout_mode` du seller (pas l'IP) : économiquement
 * auto-sélectif et difficile à truander (cf. mémo pricing).
 */

export const DEFAULT_COMMISSION_RATE = 5;          // % · vendeur Stripe abonné
export const DEFAULT_MANUAL_RATE = 12;             // % · vendeur versement manuel (sans abo)
export const DEFAULT_MANUAL_FOUNDER_RATE = 6;      // % · fondateur·ice en versement manuel

export interface CommissionRates {
  defaultRate: number;
  manualRate: number;
  manualFounderRate: number;
}

/** Décision pure du taux pour une boutique donnée (testable, sans I/O). */
export function resolveCommissionRate(opts: {
  payoutMode: string | null;            // "manual" | "stripe" | null
  founderFreeUntil: string | null;      // ISO ou null
  founderOverride: number | null;       // override explicite du programme fondateur
  rates: CommissionRates;
  nowMs?: number;
}): number {
  const now = opts.nowMs ?? Date.now();
  const manual = opts.payoutMode === "manual";
  const founderActive = !!opts.founderFreeUntil && new Date(opts.founderFreeUntil).getTime() > now;

  if (manual) {
    // Le versement manuel coûte plus cher à servir (payout Wise/Payoneer, risque,
    // trésorerie) → on garde une commission même en fondateur·ice.
    return founderActive ? opts.rates.manualFounderRate : opts.rates.manualRate;
  }
  if (founderActive) return 0;                                  // avantage fondateur·ice Stripe
  if (opts.founderOverride != null) return Number(opts.founderOverride);
  return opts.rates.defaultRate;
}

/** Lit les taux configurables (admin_settings) avec repli sur les défauts. */
export async function getCommissionRates(supabase: SupabaseClient): Promise<CommissionRates> {
  const { data } = await supabase
    .from("admin_settings")
    .select("key, value")
    .in("key", ["commission_rate", "commission_rate_manual", "commission_rate_manual_founder"]);
  const m: Record<string, number> = {};
  for (const r of (data ?? []) as { key: string; value: unknown }[]) {
    const n = Number(r.value);
    if (Number.isFinite(n)) m[r.key] = n;
  }
  return {
    defaultRate: m.commission_rate ?? DEFAULT_COMMISSION_RATE,
    manualRate: m.commission_rate_manual ?? DEFAULT_MANUAL_RATE,
    manualFounderRate: m.commission_rate_manual_founder ?? DEFAULT_MANUAL_FOUNDER_RATE,
  };
}

// ── Garde-fous d'unit economics (paramétrables admin_settings) ───────────────
// 1) Marge de port plateforme : sur une boutique self-ship, la plateforme garde
//    ce montant (couvre les frais Stripe sur le port) et reverse le reste.
// 2) Plancher de commission : commission mini par boutique quand un taux > 0
//    s'applique (évite que le 0,25 € fixe Stripe mange la commission sur petit panier).
export const DEFAULT_SHIPPING_MARGIN_CENTS = 30;   // 0,30 €
export const DEFAULT_COMMISSION_FLOOR_CENTS = 30;  // 0,30 €

export interface PlatformFees {
  shippingMarginCents: number;
  commissionFloorCents: number;
}

export async function getPlatformFees(supabase: SupabaseClient): Promise<PlatformFees> {
  const { data } = await supabase
    .from("admin_settings")
    .select("key, value")
    .in("key", ["shipping_platform_margin_cents", "commission_floor_cents"]);
  const m: Record<string, number> = {};
  for (const r of (data ?? []) as { key: string; value: unknown }[]) {
    const n = Number(r.value);
    if (Number.isFinite(n) && n >= 0) m[r.key] = Math.round(n);
  }
  return {
    shippingMarginCents: m.shipping_platform_margin_cents ?? DEFAULT_SHIPPING_MARGIN_CENTS,
    commissionFloorCents: m.commission_floor_cents ?? DEFAULT_COMMISSION_FLOOR_CENTS,
  };
}

/** Plancher de commission (centimes). Ignoré si taux 0 (fondateur·ice) ; jamais > sous-total. */
export function applyCommissionFloor(commissionCents: number, rate: number, subtotalCents: number, floorCents: number): number {
  if (rate <= 0 || subtotalCents <= 0) return commissionCents;
  return Math.min(subtotalCents, Math.max(commissionCents, floorCents));
}

/**
 * Taux de commission (%) appliqué à une boutique à l'instant T.
 * Tient compte du rail de versement du seller (Stripe vs manuel).
 */
export async function getCommissionRate(supabase: SupabaseClient, shopId: string): Promise<number> {
  const rates = await getCommissionRates(supabase);

  const { data: shop } = await supabase
    .from("shops")
    .select("seller_id, sellers(payout_mode)")
    .eq("id", shopId)
    .maybeSingle();
  const sellerRel = (shop as { sellers?: { payout_mode?: string | null } | { payout_mode?: string | null }[] | null } | null)?.sellers ?? null;
  const payoutMode = (Array.isArray(sellerRel) ? sellerRel[0]?.payout_mode : sellerRel?.payout_mode) ?? null;

  const { data: f } = await supabase
    .from("founder_program_members")
    .select("commission_free_until, commission_rate_override")
    .eq("shop_id", shopId)
    .maybeSingle();

  return resolveCommissionRate({
    payoutMode,
    founderFreeUntil: f?.commission_free_until ?? null,
    founderOverride: f?.commission_rate_override ?? null,
    rates,
  });
}
