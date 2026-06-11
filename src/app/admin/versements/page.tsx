"use client";
import { useEffect, useState, useCallback } from "react";
import { Globe, Loader2, Check, Plus } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Row = {
  shop_id: string; name: string; payout_method: string | null; payout_details: string | null;
  country: string; email: string | null; products: number;
  earned: number; paid: number; owed: number;
};

export default function VersementsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ shop_id: string; amount: string; reference: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/payouts", { cache: "no-store" });
    const json = await res.json();
    setRows(json.data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const record = async () => {
    if (!form) return;
    setSaving(true);
    const res = await fetch("/api/admin/payouts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop_id: form.shop_id, amount: Number(form.amount), reference: form.reference }),
    });
    setSaving(false);
    if (res.ok) { setToast("Versement enregistré ✓"); setTimeout(() => setToast(""), 2500); setForm(null); load(); }
    else { const j = await res.json().catch(() => ({})); alert("Erreur : " + (j.error ?? res.status)); }
  };

  const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#FF2DA0] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div>
        <h1 className="font-fraunces text-2xl text-[#101014] flex items-center gap-2"><Globe size={20} /> Vendeur·ses hors Stripe 🇹🇳</h1>
        <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">Boutiques des pays où Stripe n&apos;existe pas (Tunisie & co.). Tu les paies à la main (Payoneer, virement…) — voici qui, combien, et leurs coordonnées.</p>
      </div>
      {!loading && rows.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          <div className="rounded-xl border border-[#101014]/12 bg-white px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase text-[#101014]/35">Boutiques</span>
            <p className="font-fraunces text-xl text-[#101014]">{rows.length}</p>
          </div>
          <div className="rounded-xl border border-[#FF2DA0]/25 bg-[#FF2DA0]/5 px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase text-[#FF2DA0]">Total à verser</span>
            <p className="font-fraunces text-xl text-[#FF2DA0]">{fmt(rows.reduce((s, r) => s + Math.max(0, r.owed), 0))}</p>
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="self-center bg-white border border-[#101014]/12 rounded-xl px-3 py-2 font-hanken text-sm">
            <option value="">Tous les pays</option>
            {[...new Set(rows.map(r => r.country))].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : rows.length === 0 ? (
        <div className="text-center py-20">
          <Globe size={40} className="mx-auto mb-3 text-[#101014]/10" />
          <p className="font-hanken text-[#101014]/30">Aucune boutique en versement manuel pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(filter ? rows.filter(r => r.country === filter) : rows).map(r => (
            <div key={r.shop_id} className="rounded-2xl border border-[#101014]/12 bg-white p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-bricolage font-bold text-[#101014]">{r.name} <span className="font-mono text-[10px] text-[#101014]/45">· {r.country}</span> <span className="font-mono text-[10px] text-[#101014]/35">· {r.products} produit{r.products > 1 ? "s" : ""}</span></p>
                  <p className="font-mono text-[11px] text-[#101014]/45">💳 {r.payout_method ?? "—"} · {r.payout_details ?? "—"}</p>
                  {r.email && <a href={`mailto:${r.email}`} className="font-mono text-[11px] text-[#2323C4] hover:underline">✉ {r.email}</a>}
                </div>
                <div className="flex items-center gap-5 text-right">
                  <div><p className="font-mono text-[9px] uppercase text-[#101014]/35">Gagné</p><p className="font-fraunces text-[#101014]">{fmt(r.earned)}</p></div>
                  <div><p className="font-mono text-[9px] uppercase text-[#101014]/35">Versé</p><p className="font-fraunces text-[#101014]/60">{fmt(r.paid)}</p></div>
                  <div><p className="font-mono text-[9px] uppercase text-[#FF2DA0]">À verser</p><p className="font-fraunces text-lg" style={{ color: r.owed > 0 ? "#FF2DA0" : "#1B8155" }}>{fmt(r.owed)}</p></div>
                  <button onClick={() => setForm({ shop_id: r.shop_id, amount: r.owed > 0 ? String(r.owed) : "", reference: "" })}
                    disabled={r.owed <= 0}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#101014] text-white font-hanken text-xs hover:brightness-125 disabled:opacity-30">
                    <Plus size={13} /> Enregistrer un versement
                  </button>
                </div>
              </div>

              {form?.shop_id === r.shop_id && (
                <div className="mt-3 pt-3 border-t border-[#101014]/8 flex flex-wrap items-end gap-2">
                  <label className="text-[11px] font-mono text-[#101014]/40">Montant (€)
                    <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                      className="block w-28 mt-1 bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2 py-1.5 font-mono text-xs" />
                  </label>
                  <label className="text-[11px] font-mono text-[#101014]/40 flex-1 min-w-[160px]">Référence (n° Payoneer / virement)
                    <input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })}
                      className="block w-full mt-1 bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2 py-1.5 font-mono text-xs" />
                  </label>
                  <button onClick={record} disabled={saving || !form.amount}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B8155] text-white font-hanken text-xs disabled:opacity-40">
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Valider
                  </button>
                  <button onClick={() => setForm(null)} className="font-mono text-[11px] text-[#101014]/35">Annuler</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
