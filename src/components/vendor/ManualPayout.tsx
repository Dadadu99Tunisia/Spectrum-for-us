"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Globe, Check, Loader2, Pencil } from "lucide-react";

const C = { ink: "#101014", soft: "#6B6258", line: "#ECE6DB", mag: "#FF2DA0", green: "#1B8155" };

// Versement manuel = ouvert au MONDE ENTIER (pour les pays où Stripe Connect n'est pas dispo).
const COUNTRIES = [
  "Tunisie 🇹🇳","Maroc 🇲🇦","Algérie 🇩🇿","Sénégal 🇸🇳","Côte d'Ivoire 🇨🇮","Cameroun 🇨🇲","Mali 🇲🇱","Bénin 🇧🇯","Togo 🇹🇬","RD Congo 🇨🇩","Madagascar 🇲🇬","Égypte 🇪🇬","Nigeria 🇳🇬","Kenya 🇰🇪","Afrique du Sud 🇿🇦","Ghana 🇬🇭",
  "Liban 🇱🇧","Turquie 🇹🇷","Émirats 🇦🇪","Arabie saoudite 🇸🇦","Israël 🇮🇱",
  "Inde 🇮🇳","Pakistan 🇵🇰","Bangladesh 🇧🇩","Indonésie 🇮🇩","Philippines 🇵🇭","Vietnam 🇻🇳","Thaïlande 🇹🇭","Chine 🇨🇳","Japon 🇯🇵","Corée du Sud 🇰🇷",
  "Brésil 🇧🇷","Argentine 🇦🇷","Mexique 🇲🇽","Colombie 🇨🇴","Chili 🇨🇱","Pérou 🇵🇪",
  "États-Unis 🇺🇸","Canada 🇨🇦","Royaume-Uni 🇬🇧","France 🇫🇷","Belgique 🇧🇪","Suisse 🇨🇭","Allemagne 🇩🇪","Espagne 🇪🇸","Italie 🇮🇹","Portugal 🇵🇹","Pays-Bas 🇳🇱",
  "Ukraine 🇺🇦","Russie 🇷🇺","Australie 🇦🇺","Nouvelle-Zélande 🇳🇿",
  "Autre pays 🌍",
];

const METHODS = [
  { v: "payoneer", l: "Payoneer (e-mail du compte)", ph: "ton@email.com" },
  { v: "wise", l: "Wise (e-mail / IBAN)", ph: "ton@email.com ou IBAN" },
  { v: "iban", l: "Virement bancaire (IBAN/RIB)", ph: "IBAN / RIB + nom de la banque" },
  { v: "other", l: "Autre (précise)", ph: "Western Union, D17…" },
];

// `shopId` conservé pour compat d'appel ; le versement manuel est désormais au niveau SELLER.
export function ManualPayout({ shopId: _shopId }: { shopId: string }) {
  const [mode, setMode] = useState<string>("stripe");
  const [method, setMethod] = useState("payoneer");
  const [details, setDetails] = useState("");
  const [country, setCountry] = useState("Autre pays 🌍");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [balance, setBalance] = useState<{ earned: number; paid: number; owed: number; available: number; held: number } | null>(null);
  const [info, setInfo] = useState<{ manualRate: number; manualFounderRate: number; holdDays: number }>({ manualRate: 12, manualFounderRate: 6, holdDays: 7 });

  useEffect(() => {
    fetch("/api/commission-info").then(r => r.json()).then(d => {
      if (d) setInfo({ manualRate: d.manualRate ?? 12, manualFounderRate: d.manualFounderRate ?? 6, holdDays: d.holdDays ?? 7 });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase.from("sellers").select("payout_mode, payout_method, payout_details, country").eq("user_id", user.id).maybeSingle()
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Solde agrégé sur TOUTES les activités du seller (commissions/ports - versements).
  const computeBalance = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: shops } = await supabase.from("shops").select("id").eq("owner_id", user.id);
    const ids = (shops ?? []).map(s => s.id);
    if (ids.length === 0) { setBalance({ earned: 0, paid: 0, owed: 0, available: 0, held: 0 }); return; }
    const [{ data: comm }, { data: ships }, { data: payouts }] = await Promise.all([
      supabase.from("commissions").select("gross_amount, commission_amount, created_at").in("shop_id", ids),
      supabase.from("order_shipments").select("shipping_cost").in("shop_id", ids),
      supabase.from("vendor_payouts").select("amount").in("shop_id", ids),
    ]);
    const net = (comm ?? []).reduce((s, c) => s + Number(c.gross_amount || 0) - Number(c.commission_amount || 0), 0);
    const shipTot = (ships ?? []).reduce((s, x) => s + Number(x.shipping_cost || 0), 0);
    const earned = net + shipTot;
    const paid = (payouts ?? []).reduce((s, p) => s + Number(p.amount || 0), 0);
    // Disponible = net des commissions hors fenêtre de rétention + port ; le reste est retenu.
    const cutoff = new Date(Date.now() - info.holdDays * 86400_000).toISOString();
    const availNet = (comm ?? []).reduce((s, c) => (c.created_at && c.created_at <= cutoff ? s + Number(c.gross_amount || 0) - Number(c.commission_amount || 0) : s), 0);
    const r2 = (n: number) => Math.round(n * 100) / 100;
    const owed = r2(earned - paid);
    const available = r2(Math.max(0, availNet + shipTot - paid));
    setBalance({ earned: r2(earned), paid: r2(paid), owed, available, held: r2(Math.max(0, owed - available)) });
  };

  const save = async (newMode: string) => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // upsert (crée la ligne seller si absente) + relie les boutiques (dispo paiement côté produit)
      await supabase.from("sellers").upsert({
        user_id: user.id,
        payout_mode: newMode,
        payout_method: newMode === "manual" ? method : null,
        payout_details: newMode === "manual" ? details.trim() : null,
        country: newMode === "manual" ? country : null,
      }, { onConflict: "user_id" });
      const { data: sel } = await supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle();
      if (sel) await supabase.from("shops").update({ seller_id: sel.id }).eq("owner_id", user.id).is("seller_id", null);
    }
    setMode(newMode); setSaving(false); setEditing(false);
    if (newMode === "manual") computeBalance(); else setBalance(null);
  };

  if (loading) return null;

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
      <div className="flex items-center gap-2 mb-1">
        <Globe size={17} style={{ color: C.mag }} />
        <h3 className="font-bricolage font-semibold text-[15px]" style={{ color: C.ink }}>Vendre depuis le monde entier 🌍</h3>
        {mode === "manual" && <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] rounded-full px-2 py-0.5" style={{ background: `${C.green}1A`, color: C.green }}><Check size={11} /> Versement manuel</span>}
      </div>

      {mode === "manual" && !editing ? (
        <div>
          <p className="text-[13.5px] mb-1" style={{ color: C.soft }}>
            Tu es payé·e par <strong>versement manuel</strong> de la plateforme (hors Stripe).
            <span style={{ color: C.ink }}> Aucun abonnement</span> — une commission de <strong>{info.manualRate}%</strong> est prélevée sur tes ventes, on te verse le reste.
          </p>
          <p className="font-mono text-[12px]" style={{ color: C.ink }}>
            {country} · {METHODS.find(m => m.v === method)?.l.split(" (")[0]} · {details || "—"}
          </p>
          <button onClick={() => setEditing(true)} className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: C.mag }}>
            <Pencil size={11} /> Modifier
          </button>
          {balance && (
            <div className="mt-3 pt-3 border-t flex items-center gap-4 flex-wrap" style={{ borderColor: C.line }}>
              <div><p className="font-mono text-[9px] uppercase" style={{ color: C.soft }}>Gagné</p><p className="font-fraunces text-[15px]" style={{ color: C.ink }}>{balance.earned.toFixed(2)} €</p></div>
              <div><p className="font-mono text-[9px] uppercase" style={{ color: C.soft }}>Reçu</p><p className="font-fraunces text-[15px]" style={{ color: C.soft }}>{balance.paid.toFixed(2)} €</p></div>
              <div><p className="font-mono text-[9px] uppercase" style={{ color: C.green }}>Disponible</p><p className="font-fraunces text-[17px]" style={{ color: C.green }}>{balance.available.toFixed(2)} €</p></div>
              {balance.held > 0 && (
                <div><p className="font-mono text-[9px] uppercase" style={{ color: C.soft }}>En attente</p><p className="font-fraunces text-[15px]" style={{ color: C.soft }}>{balance.held.toFixed(2)} €</p></div>
              )}
            </div>
          )}
          {balance && balance.held > 0 && (
            <p className="font-mono text-[10px] mt-1.5" style={{ color: C.soft }}>
              Les ventes récentes se débloquent {info.holdDays} j après la commande (sécurité expédition & litiges).
            </p>
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
            Stripe n'est pas disponible dans tous les pays. Où que tu sois dans le monde, active le <strong>versement manuel</strong> : tu vends normalement, et la plateforme te paie via Payoneer / Wise / virement.
            <span style={{ color: C.ink }}> Pas d'abonnement</span> — juste une commission de <strong>{info.manualRate}%</strong> sur tes ventes (réduite à {info.manualFounderRate}% pour les fondateur·ices).
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
