"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Notif = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  read: boolean;
  created_at: string;
};

const ICONS: Record<string, string> = {
  new_order: "🛍", order_paid: "✦", order_shipped: "🚚", order_delivered: "📬",
  new_message: "💬", review: "⭐", default: "🔔",
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60); if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60); if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24); if (d < 7) return `il y a ${d} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.read).length;

  // Chargement initial + abonnement temps réel
  useEffect(() => {
    if (!user) { setItems([]); return; }
    const supabase = createClient();
    let active = true;

    supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(30)
      .then(({ data }) => { if (active && data) setItems(data as Notif[]); });

    const ch = supabase
      .channel(`notifs:${user.id}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => setItems((prev) => [payload.new as Notif, ...prev].slice(0, 40)))
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => setItems((prev) => prev.map((n) => (n.id === (payload.new as Notif).id ? (payload.new as Notif) : n))))
      .subscribe();

    return () => { active = false; supabase.removeChannel(ch); };
  }, [user]);

  // Fermer au clic extérieur
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const markRead = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    setItems((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)));
    const supabase = createClient();
    await supabase.from("notifications").update({ read: true }).in("id", ids);
  }, []);

  const markAllRead = useCallback(async () => {
    const ids = items.filter((n) => !n.read).map((n) => n.id);
    await markRead(ids);
  }, [items, markRead]);

  const onItem = (n: Notif) => {
    if (!n.read) markRead([n.id]);
    setOpen(false);
    if (n.href) router.push(n.href);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label={`Notifications${unread ? ` · ${unread} non lues` : ""}`}
        className="relative w-10 h-10 rounded-full flex items-center justify-center"
        style={{ boxShadow: "inset 0 0 0 1px rgba(16,16,20,0.13)", color: "#101014" }}>
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-mono flex items-center justify-center text-white"
            style={{ background: "#FF2DA0" }}>{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] max-w-[90vw] rounded-2xl bg-white overflow-hidden z-[120]"
          style={{ boxShadow: "0 12px 40px rgba(16,16,20,0.16), inset 0 0 0 1px rgba(16,16,20,0.08)" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#101014]/8">
            <span className="font-bricolage font-bold text-[15px] text-[#101014]">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="inline-flex items-center gap-1 font-hanken text-[12px] text-[#FF2DA0] hover:underline">
                <Check size={12} /> Tout marquer lu
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-10 text-center font-hanken text-sm text-[#101014]/40">Aucune notification pour l’instant ✦</p>
            ) : (
              items.map((n) => (
                <button key={n.id} onClick={() => onItem(n)}
                  className="w-full text-left flex gap-3 px-4 py-3 hover:bg-[#101014]/[0.03] transition-colors border-b border-[#101014]/5 last:border-0"
                  style={{ background: n.read ? "transparent" : "rgba(255,45,160,0.04)" }}>
                  <span className="text-lg leading-none mt-0.5">{ICONS[n.type] ?? ICONS.default}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-hanken text-[13.5px] font-semibold text-[#101014] leading-snug">{n.title}</span>
                    {n.body && <span className="block font-hanken text-[12.5px] text-[#101014]/55 leading-snug mt-0.5 line-clamp-2">{n.body}</span>}
                    <span className="block font-mono text-[10px] text-[#101014]/35 mt-1">{timeAgo(n.created_at)}</span>
                  </span>
                  {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: "#FF2DA0" }} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
