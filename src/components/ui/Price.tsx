"use client";

import { useI18n } from "@/contexts/I18nContext";

/**
 * Price · affiche un montant (stocké en EUR) dans la devise active de
 * l'utilisateur. À utiliser partout où un prix est rendu, pour que le
 * sélecteur de devise s'applique à tous les éléments du site.
 */
export function Price({ eur, className }: { eur: number; className?: string }) {
  const { formatPrice } = useI18n();
  return <span className={className}>{formatPrice(Number(eur) || 0)}</span>;
}
