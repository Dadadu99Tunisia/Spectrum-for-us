"use client";
import { useState } from "react";
import { Share2, Check } from "lucide-react";

/**
 * Partage natif (Web Share API) avec repli copie-lien.
 * Levier de viralité communautaire (IG/TikTok → produit/boutique).
 */
export function ShareButton({
  title,
  text,
  url,
  label = "Partager",
  className = "",
  iconOnly = false,
  size = 16,
}: {
  title: string;
  text?: string;
  url?: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
  size?: number;
}) {
  const [done, setDone] = useState(false);

  const share = async () => {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text: text ?? title, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* l'utilisateur a annulé le partage — non bloquant */
    }
  };

  return (
    <button onClick={share} aria-label={iconOnly ? label : undefined}
      className={`inline-flex items-center justify-center gap-1.5 ${className}`}>
      {done ? <Check size={size} /> : <Share2 size={size} />}
      {!iconOnly && <span>{done ? "Lien copié" : label}</span>}
    </button>
  );
}
