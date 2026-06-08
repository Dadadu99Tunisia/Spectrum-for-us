"use client";
import { useEffect, useState } from "react";
import { Eye, ShoppingCart, Heart, Mail, Users } from "lucide-react";

type Data = {
  total: number; signedVisitors: number;
  byType: Record<string, number>;
  byDay: { date: string; count: number }[];
  funnel: Record<string, number>;
};

const C = { ink: "#1A1612", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF3D7F" };

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`).then(r => r.json()).then(j => { setData(j.data ?? null); setLoading(false); });
  }, [days]);

  const f = data?.funnel ?? {};
  const maxDay = Math.max(1, ...(data?.byDay ?? []).map(d => d.count));

  const cards = [
    { label: "Vues de page", value: f.page_view ?? 0, icon: Eye },
    { label: "Visiteurs connectés", value: data?.signedVisitors ?? 0, icon: Users },
    { label: "Ajouts panier", value: f.add_to_cart ?? 0, icon: ShoppingCart },
    { label: "Suivis créateur", value: f.follow_shop ?? 0, icon: Heart },
    { label: "Inscrits newsletter", value: f.newsletter_subscribe ?? 0, icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-fraunces text-2xl" style={{ color: C.ink }}>Analytics</h1>
          <p className="font-hanken text-sm mt-0.5" style={{ color: C.soft }}>Événements first-party · {data?.total ?? 0} sur {days} jours</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: `${C.ink}14` }}>
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className="px-3 py-1.5 rounded-md font-mono text-[10px] transition-all"
              style={days === d ? { background: C.mag, color: "#fff" } : { color: C.soft }}>{d}j</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center font-hanken" style={{ color: C.faint }}>Chargement…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {cards.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="rounded-2xl p-4" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                  <Icon size={16} style={{ color: C.mag }} />
                  <p className="font-fraunces text-2xl mt-2" style={{ color: C.ink }}>{c.value.toLocaleString("fr-FR")}</p>
                  <p className="font-hanken text-[12px]" style={{ color: C.soft }}>{c.label}</p>
                </div>
              );
            })}
          </div>

          {/* Tendance vues/jour */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
            <h2 className="font-bricolage font-semibold text-[15px] mb-4" style={{ color: C.ink }}>Vues par jour</h2>
            {(data?.byDay.length ?? 0) === 0 ? (
              <p className="font-hanken text-sm" style={{ color: C.faint }}>Pas encore de données. Navigue sur le site, les événements apparaîtront ici.</p>
            ) : (
              <div className="flex items-end gap-1 h-40">
                {data!.byDay.map(d => (
                  <div key={d.date} className="flex-1 rounded-t" title={`${d.date} · ${d.count}`}
                    style={{ height: `${(d.count / maxDay) * 100}%`, background: C.mag, opacity: 0.85, minHeight: 2 }} />
                ))}
              </div>
            )}
          </div>

          {/* Tous les événements */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
            <h2 className="font-bricolage font-semibold text-[15px] mb-3" style={{ color: C.ink }}>Tous les événements</h2>
            <div className="space-y-1.5">
              {Object.entries(data?.byType ?? {}).sort((a, b) => b[1] - a[1]).map(([type, n]) => (
                <div key={type} className="flex items-center justify-between font-hanken text-sm py-1" style={{ borderBottom: `1px solid ${C.line}` }}>
                  <span style={{ color: C.soft }}>{type}</span>
                  <span className="font-mono font-bold" style={{ color: C.ink }}>{n.toLocaleString("fr-FR")}</span>
                </div>
              ))}
              {Object.keys(data?.byType ?? {}).length === 0 && <p className="font-hanken text-sm" style={{ color: C.faint }}>Aucun événement.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
