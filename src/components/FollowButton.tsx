"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { track } from "@/lib/track";
import { Heart, Check } from "lucide-react";

/**
 * FollowButton · suivre une boutique/créateur·ice. Première boucle de
 * rétention : les nouveautés des boutiques suivies apparaissent dans /suivis.
 */
export function FollowButton({ shopId, className = "" }: { shopId: string; className?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let active = true;
    (async () => {
      const { count: c } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("shop_id", shopId);
      if (active) setCount(c ?? 0);
      if (user) {
        const { data } = await supabase.from("follows").select("id").eq("shop_id", shopId).eq("user_id", user.id).maybeSingle();
        if (active) setFollowing(!!data);
      }
    })();
    return () => { active = false; };
  }, [shopId, user?.id]);

  const toggle = async () => {
    if (!user) { router.push("/auth"); return; }
    if (busy) return;
    setBusy(true);
    if (following) {
      await supabase.from("follows").delete().eq("shop_id", shopId).eq("user_id", user.id);
      setFollowing(false); setCount((c) => Math.max(0, (c ?? 1) - 1));
    } else {
      await supabase.from("follows").insert({ shop_id: shopId, user_id: user.id });
      setFollowing(true); setCount((c) => (c ?? 0) + 1);
      track("follow_shop", { shopId });
    }
    setBusy(false);
  };

  return (
    <button onClick={toggle} disabled={busy}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-hanken font-semibold text-sm transition-all disabled:opacity-60 ${className}`}
      style={following
        ? { background: "#fff", color: "#1A1612", boxShadow: "inset 0 0 0 1px #ECE6DB" }
        : { background: "#1A1612", color: "#fff" }}>
      {following ? <><Check size={15} /> Suivi{count ? ` · ${count}` : ""}</> : <><Heart size={15} /> Suivre{count ? ` · ${count}` : ""}</>}
    </button>
  );
}
