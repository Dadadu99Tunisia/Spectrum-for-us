"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle2, AlertTriangle, XCircle, Minus } from "lucide-react";

type Row = { id: string; shop: string; slug: string; status: string; renewal: string | null; hasStripe: boolean };
type Summary = { active: number; pastDue: number; canceled: number; none: number; mrr: number };

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  active:   { label: "Actif",     bg: "rgba(28,156,149,.16)", fg: "#3FD4C7" },
  past_due: { label: "En retard", bg: "rgba(224,144,30,.16)", fg: "#F2A03D" },
  canceled: { label: "Annulé",    bg: "rgba(224,51,126,.16)", fg: "#FF6FA3" },
  none:     { label: "Aucun",     bg: "rgba(243,234,219,.08)", fg: "rgba(243,234,219,.45)" },
};

export default function AdminSubscriptions() {
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/admin/subscriptions").then(r => r.json()).then(d => { setRows(d.rows ?? []); setSummary(d.summary ?? null); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const eur = (n: number) => new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(n) + " €";
  const filtered = filter === "all" ? rows : rows.filter(r => r.status === filter);

  const kpis = [
    { label: "MRR", value: summary ? eur(summary.mrr) : "—", icon: CreditCard, accent: "#1C9C95" },
    { label: "Actifs", value: summary?.active ?? "—", icon: CheckCircle2, accent: "#1C9C95", f: "active" },
    { label: "En retard", value: summary?.pastDue ?? "—", icon: AlertTriangle, accent: "#F2A03D", f: "past_due" },
    { label: "Annulés", value: summary?.canceled ?? "—", icon: XCircle, accent: "#FF6FA3", f: "canceled" },
    { label: "Sans abo", value: summary?.none ?? "—", icon: Minus, accent: "rgba(243,234,219,.4)", f: "none" },
  ];

  return (
    <div className="space-y-6 max-w-[1440px]">
      <div>
        <h1 className="font-bricolage font-bold text-2xl text-[#F3EADB]">Abonnements</h1>
        <p className="font-hanken text-sm text-[#F3EADB]/40 mt-1">Abonnement vendeur · 9,90 €/mois · déclenché à la 1ʳᵉ vente.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <button key={k.label} onClick={() => k.f && setFilter(filter === k.f ? "all" : k.f)}
              className="text-left rounded-2xl p-4 transition-all hover:bg-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${filter === k.f ? k.accent + "66" : "rgba(255,255,255,0.1)"}` }}>
              <span className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: k.accent + "22" }}>
                <Icon size={15} style={{ color: k.accent }} />
              </span>
              <div className="font-bricolage font-bold text-2xl text-[#F3EADB]">{k.value}</div>
              <div className="font-hanken text-[11px] text-[#F3EADB]/45 mt-0.5">{k.label}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="px-5 py-3 flex items-center justify-between border-b border-white/[0.08]">
          <h2 className="font-hanken font-semibold text-sm text-[#F3EADB]">{filtered.length} boutique{filtered.length > 1 ? "s" : ""}{filter !== "all" && ` · ${STATUS[filter]?.label}`}</h2>
          {filter !== "all" && <button onClick={() => setFilter("all")} className="font-mono text-[10px] text-[#FF6FA3]">Tout voir</button>}
        </div>
        {loading ? (
          <div className="p-5 space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-white/[0.05] animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center font-hanken text-sm text-[#F3EADB]/35">Aucune boutique.</p>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">
              {["Boutique", "Statut", "MRR", "Renouvellement", "Stripe"].map(h => <th key={h} className="text-left font-mono text-[10px] uppercase tracking-wider text-[#F3EADB]/30 px-5 py-2.5">{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map(r => {
                const s = STATUS[r.status] ?? STATUS.none;
                return (
                  <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                    <td className="px-5 py-3">
                      <Link href={`/boutique/${r.slug}`} target="_blank" className="font-hanken text-sm text-[#F3EADB] hover:text-[#FF6FA3]">{r.shop}</Link>
                    </td>
                    <td className="px-5 py-3"><span className="font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.fg }}>{s.label}</span></td>
                    <td className="px-5 py-3 font-hanken text-sm text-[#F3EADB]/70">{r.status === "active" ? "9,90 €" : "—"}</td>
                    <td className="px-5 py-3 font-mono text-xs text-[#F3EADB]/45">{r.renewal ? new Date(r.renewal).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                    <td className="px-5 py-3">{r.hasStripe ? <CheckCircle2 size={15} className="text-[#1C9C95]" /> : <Minus size={15} className="text-[#F3EADB]/20" />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
