"use client";
import { useEffect, useState, useCallback } from "react";
import { ShieldAlert, Loader2, RefreshCw, PauseCircle } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Row = {
  seller_id: string; name: string; email: string | null; has_stripe: boolean;
  risk_level: "low" | "medium" | "high";
  paid_orders: number; refunds: number; disputes: number; refund_rate: number; dispute_rate: number;
};

const BADGE: Record<string, { bg: string; fg: string; label: string }> = {
  high:   { bg: "#FBE0E6", fg: "#C0203F", label: "Élevé" },
  medium: { bg: "#FCEAD2", fg: "#9A6516", label: "Moyen" },
  low:    { bg: "#DCF0E5", fg: "#16A06A", label: "Faible" },
};

export default function RisquePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<{ high: number; medium: number; low: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/risk", { cache: "no-store" });
    const json = await res.json();
    setRows(json.data ?? []);
    setSummary(json.summary ?? null);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const hold = async (seller_id: string, delay_days: number) => {
    setBusy(seller_id);
    const res = await fetch("/api/admin/risk", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seller_id, delay_days }),
    });
    const json = await res.json();
    setBusy(null);
    setToast(json.error ? `Erreur : ${json.error}` : `Versements retenus ${json.data?.delay_days}j ✓`);
    setTimeout(() => setToast(""), 3000);
  };

  if (loading) return <div className="flex items-center justify-center py-32"><SpectrumLoader size="md" /></div>;

  return (
    <div>
      {toast && <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-white border border-[#FF2DA0]/30 text-[#101014] text-sm shadow-2xl">{toast}</div>}

      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="text-[#FF2DA0]" size={22} />
        <h1 className="font-fraunces text-2xl text-[#101014] flex-1">Risque & fraude</h1>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium border border-[#101014]/12 hover:bg-[#101014]/[0.03]">
          <RefreshCw size={14} /> Recalculer
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["high", "medium", "low"] as const).map(k => (
            <div key={k} className="rounded-2xl border border-[#101014]/8 bg-white p-4">
              <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: BADGE[k].fg }}>{BADGE[k].label}</p>
              <p className="font-fraunces text-3xl text-[#101014]">{summary[k]}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-[#101014]/8 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[10px] uppercase tracking-wide text-[#101014]/40 border-b border-[#101014]/8">
              <th className="px-4 py-3">Vendeur·se</th>
              <th className="px-4 py-3">Risque</th>
              <th className="px-4 py-3 text-right">Cmd payées</th>
              <th className="px-4 py-3 text-right">Remb.</th>
              <th className="px-4 py-3 text-right">Litiges</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.seller_id} className="border-b border-[#101014]/5 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-bricolage font-semibold text-[#101014]">{r.name}</p>
                  <p className="font-mono text-[11px] text-[#101014]/40">{r.email ?? "—"}{!r.has_stripe && " · manuel"}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded-full" style={{ background: BADGE[r.risk_level].bg, color: BADGE[r.risk_level].fg }}>{BADGE[r.risk_level].label}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono">{r.paid_orders}</td>
                <td className="px-4 py-3 text-right font-mono">{r.refunds} <span className="text-[#101014]/35">({r.refund_rate}%)</span></td>
                <td className="px-4 py-3 text-right font-mono">{r.disputes} <span className="text-[#101014]/35">({r.dispute_rate}%)</span></td>
                <td className="px-4 py-3 text-right">
                  {r.has_stripe ? (
                    <button onClick={() => hold(r.seller_id, 7)} disabled={busy === r.seller_id}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium border border-[#101014]/12 hover:bg-[#101014]/[0.03] disabled:opacity-50">
                      {busy === r.seller_id ? <Loader2 size={13} className="animate-spin" /> : <PauseCircle size={13} />} Retenir 7j
                    </button>
                  ) : <span className="text-[#101014]/30 text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-hanken text-[12px] text-[#101014]/45 mt-4 leading-relaxed">
        Score = taux de remboursement &amp; de litige par seller. « Retenir 7j » ajuste le délai de versement Stripe (delay_days) du compte — réversible.
      </p>
    </div>
  );
}
