import Stripe from "stripe";

/**
 * Instance Stripe serveur partagée. Lève une erreur claire si la clé manque.
 * À n'utiliser QUE côté serveur (jamais exposer STRIPE_SECRET_KEY au client).
 */
let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
  _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
  return _stripe;
}

export const PLATFORM_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spectrumforus.com";
