/**
 * Grille de tarifs de port plateforme, par mode et par palier de poids.
 * Le prix s'ajuste automatiquement au poids réel du colis (modèle type Vinted).
 * Calibrée pour couvrir les tarifs Sendcloud (~4 € en 0-1 kg) avec une petite marge.
 */
export type ShipType = "relay" | "home" | "pickup";

export const SHIPPING_TIERS: Record<ShipType, { maxKg: number; price: number }[]> = {
  relay: [
    // Articles plats/légers (stickers, zines, pins, tirages) → lettre/petit colis suivi
    { maxKg: 0.1, price: 2.5 }, { maxKg: 0.25, price: 3.9 },
    { maxKg: 1, price: 5.9 }, { maxKg: 2, price: 8.9 }, { maxKg: 5, price: 12.9 },
    { maxKg: 10, price: 18.9 }, { maxKg: 30, price: 27.9 },
  ],
  home: [
    { maxKg: 0.1, price: 2.9 }, { maxKg: 0.25, price: 4.5 },
    { maxKg: 1, price: 6.9 }, { maxKg: 2, price: 9.9 }, { maxKg: 5, price: 14.9 },
    { maxKg: 10, price: 20.9 }, { maxKg: 30, price: 29.9 },
  ],
  pickup: [{ maxKg: Infinity, price: 0 }],
};

/** Prix de port (€) pour un mode et un poids (en grammes). */
export function shippingPrice(type: string, grams: number): number {
  const tiers = SHIPPING_TIERS[(type as ShipType)] ?? SHIPPING_TIERS.home;
  const kg = Math.max(0, Number(grams) || 0) / 1000;
  for (const t of tiers) if (kg <= t.maxKg) return t.price;
  return tiers[tiers.length - 1].price;
}
