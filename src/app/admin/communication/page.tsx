"use client";
import { useEffect, useState } from "react";
import { Briefcase, Mail, Users, Globe, TrendingUp, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Stats = {
  total: number;
  confirmed: number;
  fr: number;
  en: number;
  ar: number;
  sources: Record<string, number>;
  byMonth: { month: string; count: number }[];
};

export default function CommunicationPage() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<{ id: string; email: string; locale: string | null; source: string | null; confirmed: boolean; created_at: string }[]>([]);
  const [tab, setTab]       = useState<"stats" | "list">("stats");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
        const rows = data ?? [];
        setSubscribers(rows);
        const sources: Record<string, number> = {};
        rows.forEach(r => { const s = r.source ?? "direct"; sources[s] = (sources[s] ?? 0) + 1; });
        const monthMap: Record<string, number> = {};
        rows.forEach(r => { const m = r.created_at.slice(0, 7); monthMap[m] = (monthMap[m] ?? 0) + 1; });
        const byMonth = Object.entries(monthMap)
          .sort(([a],[b]) => a.localeCompare(b)).slice(-6)
          .map(([month, count]) => ({
            month: new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
            count,
          }));
        setStats({
          total: rows.length,
          confirmed: rows.filter(r => r.confirmed).length,
          fr: rows.filter(r => r.locale === "fr").length,
          en: rows.filter(r => r.locale === "en").length,
          ar: rows.filter(r => r.locale === "ar").length,
          sources, byMonth,
        });
      } catch { /* silently fail */ } finally { setLoading(false); }
    })();
  }, []);

  const exportCSV = () => {
    const csv = ["email,locale,source,confirmed,date"]
      .concat(subscribers.map(s => `${s.email},${s.locale ?? ""},${s.source ?? ""},${s.confirmed},${s.created_at.split("T")[0]}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `newsletter_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const maxMonth = stats ? Math.max(...stats.byMonth.map(m => m.count), 1) : 1;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#1A1612]">Communication</h1>
          <p className="font-hanken text-sm text-[#1A1612]/40 mt-0.5">Newsletter & audience</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1A1612]/10 text-[#1A1612]/50 hover:text-[#1A1612] font-hanken text-sm transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#1A1612]/4 rounded-xl w-fit">
        {[["stats","Statistiques"],["list","Liste des abonnés"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v as typeof tab)}
            className={`px-4 py-1.5 rounded-lg font-mono text-[10px] transition-all ${tab === v ? "bg-[#FF3D7F] text-white" : "text-[#1A1612]/40 hover:text-[#1A1612]"}`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : tab === "stats" && stats ? (
        <div className="space-y-5">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total abonnés", value: stats.total, icon: Users, color: "#FF3D7F" },
              { label: "Confirmés",     value: stats.confirmed, icon: Mail, color: "#1C9C95" },
              { label: "Taux confirm.", value: `${stats.total > 0 ? Math.round(stats.confirmed/stats.total*100) : 0}%`, icon: TrendingUp, color: "#6D2DB5" },
              { label: "Langues actives", value: [stats.fr > 0 ? "FR" : "", stats.en > 0 ? "EN" : "", stats.ar > 0 ? "AR" : ""].filter(Boolean).join(", "), icon: Globe, color: "#E0901E" },
            ].map(k => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="p-5 rounded-2xl border border-[#1A1612]/8 bg-[#1A1612]/[0.02]">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
                    <Icon size={15} style={{ color: k.color }} />
                  </div>
                  <p className="font-fraunces text-xl text-[#1A1612]">{k.value}</p>
                  <p className="font-mono text-[9px] text-[#1A1612]/30 uppercase tracking-widest mt-1">{k.label}</p>
                </div>
              );
            })}
          </div>

          {/* Growth chart */}
          {stats.byMonth.length > 0 && (
            <div className="p-5 rounded-2xl border border-[#1A1612]/8 bg-[#1A1612]/[0.02]">
              <p className="font-fraunces text-base text-[#1A1612] mb-5">Nouveaux abonnés / mois</p>
              <div className="flex items-end gap-3 h-32">
                {stats.byMonth.map(m => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="font-mono text-[9px] text-[#1A1612]/40">{m.count}</span>
                    <div className="w-full rounded-t-md transition-all"
                      style={{ height: `${(m.count / maxMonth) * 100}%`, background: "linear-gradient(180deg, #FF3D7F, #6D2DB5)", minHeight: "4px" }} />
                    <span className="font-mono text-[8px] text-[#1A1612]/25">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Breakdown locale + sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl border border-[#1A1612]/8 bg-[#1A1612]/[0.02]">
              <p className="font-fraunces text-base text-[#1A1612] mb-4">Par langue</p>
              <div className="space-y-3">
                {[["Français", stats.fr, "#FF3D7F"], ["Anglais", stats.en, "#6D2DB5"], ["Arabe", stats.ar, "#1C9C95"]].map(([l, n, c]) => (
                  <div key={String(l)} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-[#1A1612]/40 w-16">{l as string}</span>
                    <div className="flex-1 h-2 bg-[#1A1612]/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${stats.total > 0 ? (Number(n)/stats.total)*100 : 0}%`, background: c as string }} />
                    </div>
                    <span className="font-mono text-[10px] text-[#1A1612]/40 w-8 text-right">{n as number}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-[#1A1612]/8 bg-[#1A1612]/[0.02]">
              <p className="font-fraunces text-base text-[#1A1612] mb-4">Par source</p>
              <div className="space-y-2">
                {Object.entries(stats.sources).sort(([,a],[,b]) => (b as number)-(a as number)).slice(0,6).map(([src, cnt]) => (
                  <div key={src} className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#1A1612]/40 capitalize">{src}</span>
                    <span className="font-mono text-[10px] text-[#1A1612]/60">{cnt as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List tab */
        <div className="rounded-xl border border-[#1A1612]/8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1612]/6 bg-[#1A1612]/2">
                {["Email","Langue","Source","Confirmé","Inscription"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.slice(0, 100).map(s => (
                <tr key={s.id} className="border-b border-[#1A1612]/4 hover:bg-[#1A1612]/2 transition-colors">
                  <td className="px-4 py-3 font-hanken text-sm text-[#1A1612]/80">{s.email}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[#1A1612]/40 uppercase">{s.locale ?? "-"}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[#1A1612]/40">{s.source ?? "direct"}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${s.confirmed ? "text-green-600 border-green-400/20" : "text-[#1A1612]/25 border-[#1A1612]/10"}`}>
                      {s.confirmed ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[#1A1612]/25">{new Date(s.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
