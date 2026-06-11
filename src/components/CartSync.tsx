"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/store/cart";
import { createClient } from "@/lib/supabase/client";

/**
 * Persiste le panier des utilisateur·ices connecté·es pour permettre la relance
 * de panier abandonné (e-mail automatique si pas de commande dans l'heure).
 */
export function CartSync() {
  const { user } = useAuth();
  const { items } = useCart();
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(async () => {
      const supabase = createClient();
      if (items.length === 0) {
        await supabase.from("abandoned_carts").delete().eq("user_id", user.id);
        return;
      }
      const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
      await supabase.from("abandoned_carts").upsert({
        user_id: user.id,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image ?? null })),
        total: Math.round(total * 100) / 100,
        updated_at: new Date().toISOString(),
        reminded_at: null,
        recovered_at: null,
      });
    }, 2500);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [items, user]);

  return null;
}
