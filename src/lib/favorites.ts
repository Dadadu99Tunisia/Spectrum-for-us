import { createClient } from "@/lib/supabase/client";

/**
 * Favoris : localStorage (invité·e) + write-through DB (connecté·e).
 * Source de vérité = table `favorites` quand on est connecté·e ; localStorage en miroir.
 * Sans write-through des SUPPRESSIONS, FavoritesSync ré-ajoutait les favoris retirés (bug).
 */
export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]"); }
  catch { return []; }
}

/** Pose/retire un favori. `liked` = état VOULU (true = ajouté). Met à jour localStorage + DB. */
export function writeFavorite(productId: string, liked: boolean): string[] {
  const favs = getFavorites();
  const next = liked ? [...new Set([...favs, productId])] : favs.filter(f => f !== productId);
  try { localStorage.setItem("spectrum_favorites", JSON.stringify(next)); } catch {}
  // Write-through DB (fire-and-forget, non bloquant)
  (async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      if (liked) await supabase.from("favorites").upsert({ user_id: user.id, product_id: productId }, { onConflict: "user_id,product_id" });
      else await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
    } catch { /* non bloquant */ }
  })();
  return next;
}
