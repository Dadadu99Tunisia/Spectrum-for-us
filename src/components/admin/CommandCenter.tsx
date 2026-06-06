"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Activity, ShoppingCart, AlertTriangle, ShieldAlert, CreditCard, RefreshCw } from "lucide-react";

type Data = {
  todayRevenue: number; todayOrders: number; toProcess: number;
  failed7d: number; moderationPending: number; atRiskSubs: number; ts: string;
};

export function CommandCenter() {
  const [d, setD] = useState<Data | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try { const r = await fetch("/api/admin/command-center"); if (r.ok) setD(await r.json()); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const eur = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " €";

  const tiles = [
    { label: "Ventes aujourd'hui", value: d ? eur(d.todayRevenue) : "—", sub: d ? `${d.todayOrders} commande${d.todayOrders > 1 ? "s" : ""}` : "", icon: Activity, accent: "#1C9C95", href: "/admin/finance", alert: false },
    { label: "À traiter", value: d ? String(d.toProcess) : "—", sub: "commandes payées", icon: ShoppingCart, accent: "#E0901E", href: "/admin/orders", alert: !!d && d.toProcess > 0 },
    { label: "Modération", value: d ? String(d.moderationPending) : "—", sub: "en attente", icon: ShieldAlert, accent: "#6D2DB5", href: "/admin/moderation", alert: !!d && d.moderationPending > 0 },
    { label: "Abos à risque", value: d ? String(d.atRiskSubs) : "—", sub: "période expirée", icon: CreditCard, accent: "#E0337E", href: "/admin/vendors", alert: !!d && d.atRiskSubs > 0 },
    { label: "Paiements échoués", value: d ? String(d.failed7d) : "—", sub: "7 derniers jours", icon: AlertTriangle, accent: "#E0533A", href: "/admin/orders", alert: !!d && d.failed7d > 0 },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1C9C95] animate-pulse" />
          <h2 className="font-hanken text-sm font-semibold text-[#F3EADB]/80">Command Center</h2>
          <span className="font-mono text-[10px] text-[#F3EADB]/25">temps réel · 30s</span>
        </div>
        <button onClick={load} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors" aria-label="Rafraîchir">
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {tiles.map(t => {
          const Icon = t.icon;
          return (
            <Link key={t.label} href={t.href}
              className="rounded-xl p-3.5 transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${t.alert ? t.accent + "55" : "rgba(255,255,255,0.08)"}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.accent + "22" }}>
                  <Icon size={14} style={{ color: t.accent }} />
                </span>
                {t.alert && <span className="w-2 h-2 rounded-full" style={{ background: t.accent }} />}
              </div>
              <div className="font-bricolage font-bold text-xl text-[#F3EADB] leading-none">{t.value}</div>
              <div className="font-hanken text-[11px] text-[#F3EADB]/45 mt-1">{t.label}</div>
              {t.sub && <div className="font-mono text-[9px] text-[#F3EADB]/25 mt-0.5">{t.sub}</div>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
