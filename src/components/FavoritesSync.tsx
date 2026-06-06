"use client";

/**
 * Synchronise les favoris (localStorage `spectrum_favorites`) vers la table DB
 * `favorites` quand l'utilisateur est connecté — pour qu'ils soient persistants,
 * multi-device et visibles côté admin/analytics.
 *
 * Stratégie additive (union) + sûre : on n'écrase jamais les favoris d'un autre
 * appareil. Les suppressions précises sont gérées au point de toggle (fiche produit).
 */

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function FavoritesSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const sync = async () => {
      let local: string[] = [];
      try { local = JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]"); } catch { return; }
      const localSet = new Set(local.filter(id => UUID.test(id)));

      const supabase = createClient();
      const { data } = await supabase.from("favorites").select("product_id").eq("user_id", user.id);
      const dbIds = new Set((data ?? []).map(d => d.product_id as string));

      // localStorage → DB (uniquement les nouveaux, pas de delete)
      const toAdd = [...localSet].filter(id => !dbIds.has(id)).map(id => ({ user_id: user.id, product_id: id }));
      if (toAdd.length) await supabase.from("favorites").insert(toAdd);

      // DB → localStorage (récupère les favoris d'autres appareils)
      const union = [...new Set([...localSet, ...dbIds])];
      if (union.length !== localSet.size) {
        try { localStorage.setItem("spectrum_favorites", JSON.stringify(union)); } catch {}
      }
    };
    sync();
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, [user]);

  return null;
}
