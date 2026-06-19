"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Globe, Check, Loader2, Pencil } from "lucide-react";

const C = { ink: "#101014", soft: "#6B6258", line: "#ECE6DB", mag: "#FF2DA0", green: "#1B8155" };

const COUNTRIES = ["Tunisie 🇹🇳", "Maroc 🇲🇦", "Algérie 🇩🇿", "Sénégal 🇸🇳", "Côte d'Ivoire 🇨🇮", "Cameroun 🇨🇲", "Liban 🇱🇧", "Égypte 🇪🇬", "Autre"];

const METHODS = [
  { v: "payoneer", l: "Payoneer (e-mail du compte)", ph: "ton@email.com" },
  { v: "wise", l: "Wise (e-mail / IBAN)", ph: "ton@email.com ou IBAN" },
  { v: "iban", l: "Virement bancaire (IBAN/RIB)", ph: "IBAN / RIB + nom de la banque" },
  { v: "other", l: "Autre (précise)", ph: "Western Union, D17…" },
];

export function ManualPayout({ shopId }: { shopId: string }) {
  const [mode, setMode] = useState<string>("stripe");
  const [method, setMethod] = useState("payoneer");
  const [details, setDetails] = useState("");
  const [country, setCountry] = useState("Tunisie 🇹🇳");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [balance, setBalance] = useState<{ earned: number; paid: number; owed: number } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("shops").select("payout_mode, payout_method, payout_details, country").eq("id", shopId).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setMode(data.payout_mode ?? "stripe");
          setMethod(data.payout_method ?? "payoneer");
          setDetails(data.payout_details ?? "");
          if (data.country) setCountry(data.country);
          if (data.payout_mode === "manual" && !data.payout_details) setEditing(true);
        }
        setLoading(false);
        if (data?.payout_mode === "manual") computeBalance();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  const computeBalance = async () => {
    const supabase = createClient();
    const [{ data: comm }, { data: ships }, { data: payouts }] = await Promise.all([
      supabase.from("commissions").select("gross_amount, commission_amount").eq("shop_id", shopId),
      supabase.from("order_shipments").select("shipping_cost").eq("shop_id", shopId),
      supabase.from("vendor_payouts").select("amount").eq("shop_id", shopId),
    ]);
    const earned = (comm ?? []).reduce((s, c) => s + Number(c.gross_amount || 0) - Number(c.commission_amount || 0), 0)
      + (ships ?? []).reduce((s, x) => s + Number(x.shipping_cost || 0), 0);
    const paid = (payouts ?? []).reduce((s, p) => s + Number(p.amount || 0), 0);
    setBalance({ earned: Math.round(earned * 100) / 100, paid: Math.round(paid * 100) / 100, owed: Math.round((earned - paid) * 100) / 100 });
  };

  const save = async (newMode: string) => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("shops").update({
      payout_mode: newMode,
      payout_method: newMode === "manual" ? method : null,
      payout_details: newMode === "manual" ? details.trim() : null,
      country: newMode === "manual" ? country : null,
    }).eq("id", shopId);
    setMode(newMode); setSaving(false); setEditing(false);
    if (newMode === "manual") computeBalance(); else setBalance(null);
  };

  if (loading) return null;

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
      <div className="flex items-center gap-2 mb-1">
        <Globe size={17} style={{ color: C.mag }} />
        <h3 className="font-bricolage font-semibold text-[15px]" style={{ color: C.ink }}>Pays sans Stripe (ex. Tunisie 🇹🇳)</h3>
        {mode === "manual" && <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] rounded-full px-2 py-0.5" style={{ background: `${C.green}1A`, color: C.green }}><Check size={11} /> Versement manuel</span>}
      </div>

      {mode === "manual" && !editing ? (
        <div>
          <p className="text-[13.5px] mb-1" style={{ color: C.soft }}>
            Tu es payé·e par <strong>versement manuel</strong> de la plateforme (hors Stripe).
          </p>
          <p className="font-mono text-[12px]" style={{ color: C.ink }}>
            {country} · {METHODS.find(m => m.v === method)?.l.split(" (")[0]} · {details || "—"}
          </p>
          <button onClick={() => setEditing(true)} className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: C.mag }}>
            <Pencil size={11} /> Modifier
          </button>
          {balance && (
            <div className="mt-3 pt-3 border-t flex items-center gap-5" style={{ borderColor: C.line }}>
              <div><p className="font-mono text-[9px] uppercase" style={{ color: C.soft }}>Gagné</p><p className="font-fraunces text-[15px]" style={{ color: C.ink }}>{balance.earned.toFixed(2)} €</p></div>
              <div><p className="font-mono text-[9px] uppercase" style={{ color: C.soft }}>Reçu</p><p className="font-fraunces text-[15px]" style={{ color: C.soft }}>{balance.paid.toFixed(2)} €</p></div>
              <div><p className="font-mono text-[9px] uppercase" style={{ color: C.mag }}>À recevoir</p><p className="font-fraunces text-[17px]" style={{ color: balance.owed > 0 ? C.mag : C.green }}>{balance.owed.toFixed(2)} €</p></div>
            </div>
          )}
        </div>
      ) : editing || mode === "manual" ? (
        <div className="space-y-2">
          <p className="text-[13px]" style={{ color: C.soft }}>Indique ton pays et comment être payé·e. La plateforme te reversera tes ventes (− commission) à la main, au rythme convenu.</p>
          <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm">
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={method} onChange={e => setMethod(e.target.value)} className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm">
            {METHODS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
          </select>
          <input value={details} onChange={e => setDetails(e.target.value)} placeholder={METHODS.find(m => m.v === method)?.ph}
            className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm" />
          <div className="flex items-center gap-2">
            <button onClick={() => save("manual")} disabled={saving || !details.trim()}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-[13px] text-white disabled:opacity-50" style={{ background: C.ink }}>
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Enregistrer
            </button>
            {mode === "manual" && <button onClick={() => save("stripe")} className="font-mono text-[11px]" style={{ color: C.soft }}>Repasser à Stripe</button>}
          </div>
        </div>
      ) : (
        <>
          <p className="text-[13.5px] mb-3" style={{ color: C.soft }}>
            Stripe n'est pas disponible dans certains pays (Tunisie, etc.). Si c'est ton cas, active le <strong>versement manuel</strong> : tu vends normalement, et la plateforme te paie via Payoneer / virement.
          </p>
          <button onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-[14px]" style={{ background: "#101014", color: "#fff" }}>
            Activer le versement manuel
          </button>
        </>
      )}
    </div>
  );
}
