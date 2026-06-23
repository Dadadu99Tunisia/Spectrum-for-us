// Pays où Stripe Connect (comptes vendeurs) est disponible. Source : Stripe
// « Connect availability ». Hors de cette liste → on route le vendeur vers le
// versement manuel (plan commission-seule). Liste volontairement large ; en cas
// de doute le seller peut toujours tenter Stripe (l'API échoue proprement).
export const STRIPE_CONNECT_COUNTRIES = new Set<string>([
  // Amérique du Nord
  "US", "CA", "MX",
  // Europe (EEE + UK + CH + assimilés)
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "GB", "CH", "NO", "IS", "LI", "GI",
  // Asie-Pacifique
  "AU", "NZ", "JP", "SG", "HK", "MY", "TH", "ID", "PH",
  // Moyen-Orient / autres marchés Stripe
  "AE", "IL",
  // Amérique latine
  "BR",
]);

/** Vrai si Stripe Connect est dispo pour ce code pays ISO-2 (insensible à la casse). */
export function isStripeSupported(country: string | null | undefined): boolean {
  if (!country) return true; // pays inconnu → ne bloque rien, on garde le parcours Stripe par défaut
  return STRIPE_CONNECT_COUNTRIES.has(country.toUpperCase());
}
