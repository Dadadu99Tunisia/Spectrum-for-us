"use client";
import Image from "next/image";

/**
 * Image en mode `fill` avec garde-fou de domaine.
 * next/image LÈVE une erreur runtime si l'hôte n'est pas dans next.config remotePatterns,
 * ce qui casserait toute une grille à cause d'un seul produit avec une URL externe legacy.
 * → si l'hôte n'est pas autorisé, on retombe sur un <img> brut (non optimisé mais robuste).
 * Le parent DOIT être en position:relative avec une hauteur définie.
 */
const ALLOWED = ["supabase.co", "supabase.in", "images.unsplash.com", "cdn.spectrumforus.com", "logo.clearbit.com", "www.google.com"];

function hostAllowed(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true; // asset local
  try {
    const h = new URL(src).hostname;
    return ALLOWED.some(a => h === a || h.endsWith(`.${a}`));
  } catch {
    return false;
  }
}

export function FillImage({
  src, alt, sizes, className = "", priority = false,
}: { src: string; alt: string; sizes?: string; className?: string; priority?: boolean }) {
  if (!hostAllowed(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={`absolute inset-0 w-full h-full ${className}`} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
}
