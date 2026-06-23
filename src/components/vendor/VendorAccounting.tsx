"use client";
import { useEffect, useState } from "react";
import { Receipt, Download, Loader2 } from "lucide-react";

const C = { ink: "#101014", soft: "#6B6258", line: "#ECE6DB", mag: "#FF2DA0", green: "#1B8155" };

type Sale = { date: string; order: string; shop: string; gross: number; rate: number; commission: number; net: number; status: string | null };
type Payout = { amount: number; method: string | null; reference: string | null; date: string; shop: string };
type Data = { payouts: Payout[]; sales: Sale[]; totals: { gross: number; commission: number; net: number; paid: number } };

const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const dt = (s: string) => new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

export function VendorAccounting() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/accounting").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    if (!data) return;
    const head = ["Date", "Commande", "Boutique", "Brut EUR", "Taux %", "Commission EUR", "Net EUR", "Statut"];
    const rows = data.sales.map(s => [dt(s.date), s.order, s.shop, s.gross.toFixed(2), s.rate, s.commission.toFixed(2), s.net.toFixed(2), s.status ?? ""]);
    const csv = [head, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `spectrum-ventes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (loading) return null;
  if (!data) return null;

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
      <div className="flex items-center gap-2 mb-3">
        <Receipt size={17} style={{ color: C.mag }} />
        <h3 className="font-bricolage font-semibold text-[15px]" style={{ color: C.ink }}>Comptabilité</h3>
        <button onClick={exportCsv} disabled={!data.sales.length}
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] rounded-full px-3 py-1.5 disabled:opacity-40" style={{ boxShadow: `inset 0 0 0 1px ${C.line}`, color: C.ink }}>
          <Download size={12} /> Export CSV
        </button>
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {([["Brut", data.totals.gross, C.ink], ["Commission", data.totals.commission, C.soft], ["Net", data.totals.net, C.green], ["Versé", data.totals.paid, C.soft]] as const).map(([l, v, col]) => (
          <div key={l}><p className="font-mono text-[9px] uppercase" style={{ color: C.soft }}>{l}</p><p className="font-fraunces text-[15px]" style={{ color: col }}>{eur(v)}</p></div>
        ))}
      </div>

      {/* Historique des versements reçus */}
      <p className="font-mono text-[10px] uppercase tracking-wider mb-1.5" style={{ color: C.soft }}>Versements reçus</p>
      {data.payouts.length === 0 ? (
        <p className="font-hanken text-[12px] italic" style={{ color: C.soft }}>Aucun versement pour l&apos;instant.</p>
      ) : (
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {data.payouts.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-[12.5px] py-1 border-b" style={{ borderColor: C.line }}>
              <span style={{ color: C.soft }}>{dt(p.date)} · {p.method ?? "—"}{p.reference ? ` · ${p.reference}` : ""}</span>
              <span className="font-fraunces" style={{ color: C.green }}>{eur(p.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
