"use client";
import { useEffect, useState } from "react";
import { Send, Loader2, Check, AlertTriangle } from "lucide-react";

type Seller = { seller_id: string; stripe_account_id: string; name: string; ready: boolean };
type Reversal = { id: string; seller_id: string; amount_cents: number; reason: string | null; stripe_transfer_id: string | null; created_at: string };

export default function ReverserPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [recent, setRecent] = useState<Reversal[]>([]);
  const [sellerId, setSellerId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ amount: number; id: string } | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/admin/reverse-payout");
    const j = await res.json();
    if (res.ok) { setSellers(j.data.sellers ?? []); setRecent(j.data.recent ?? []); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const nameOf = (id: string) => sellers.find((s) => s.seller_id === id)?.name ?? "—";
  const selected = sellers.find((s) => s.seller_id === sellerId);

  const submit = async () => {
    setSending(true); setErr("");
    try {
      const res = await fetch("/api/admin/reverse-payout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seller_id: sellerId, amount_eur: Number(amount), reason, order_ref: orderRef.trim() || undefined }),
      });
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Échec"); setConfirming(false); return; }
      setDone({ amount: j.data.amount_eur, id: j.data.transfer_id });
      setConfirming(false); setAmount(""); setReason(""); setSellerId(""); setOrderRef("");
      load();
    } catch { setErr("Erreur réseau"); setConfirming(false); } finally { setSending(false); }
  };

  const amountNum = Number(amount);
  const canSubmit = sellerId && Number.isFinite(amountNum) && amountNum > 0;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-fraunces text-2xl text-[#101014]">Reverser à un vendeur</h1>
        <p className="font-hanken text-sm text-[#101014]/50 mt-0.5">Régularisation : transfert Stripe vers le compte connecté d’un·e vendeur·se.</p>
      </div>

      {done && (
        <div className="rounded-xl bg-[#1B8155]/8 border border-[#1B8155]/25 px-4 py-3 font-hanken text-sm text-[#1B8155] flex items-center gap-2">
          <Check size={16} /> {done.amount.toFixed(2)} € envoyés ✦ <span className="font-mono text-[11px] text-[#101014]/40">{done.id}</span>
        </div>
      )}

      <div className="rounded-2xl border border-[#101014]/10 bg-white p-5 space-y-4">
        <div>
          <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1.5">Vendeur·se (Stripe)</label>
          <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} disabled={loading}
            className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none">
            <option value="">{loading ? "Chargement…" : "— Choisir —"}</option>
            {sellers.map((s) => (
              <option key={s.seller_id} value={s.seller_id}>{s.name}{s.ready ? "" : " (Stripe incomplet)"}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1.5">Montant (€)</label>
            <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="9.80" className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none" />
          </div>
        </div>
        <div>
          <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1.5">Motif (optionnel)</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="Ex. régularisation frais de port commande #4F6D3691"
            className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none" />
        </div>
        <div>
          <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1.5">Réf. commande (optionnel — puise dans son paiement)</label>
          <input value={orderRef} onChange={(e) => setOrderRef(e.target.value)}
            placeholder="Ex. 4F6D3691"
            className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-mono text-sm uppercase outline-none" />
          <p className="font-hanken text-[11px] text-[#101014]/40 mt-1">Si renseigné, le transfert est adossé au paiement de la commande → fonctionne même si les fonds sont « en attente ».</p>
        </div>

        {err && <p className="font-hanken text-sm text-red-500">{err}</p>}

        {!confirming ? (
          <button onClick={() => setConfirming(true)} disabled={!canSubmit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF2DA0] text-white font-hanken text-sm disabled:opacity-40">
            <Send size={15} /> Reverser
          </button>
        ) : (
          <div className="rounded-xl bg-[#FF2DA0]/[0.06] border border-[#FF2DA0]/25 p-4">
            <p className="font-hanken text-sm text-[#101014] flex items-start gap-2 mb-3">
              <AlertTriangle size={16} className="text-[#FF2DA0] shrink-0 mt-0.5" />
              Confirmer l’envoi de <strong>&nbsp;{amountNum.toFixed(2)} €&nbsp;</strong> à <strong>&nbsp;{nameOf(sellerId)}&nbsp;</strong> ({selected?.stripe_account_id}) ? Action irréversible.
            </p>
            <div className="flex gap-2">
              <button onClick={submit} disabled={sending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101014] text-white font-hanken text-sm disabled:opacity-50">
                {sending ? <><Loader2 size={15} className="animate-spin" /> Envoi…</> : <><Check size={15} /> Confirmer le virement</>}
              </button>
              <button onClick={() => setConfirming(false)} disabled={sending}
                className="px-4 py-2.5 rounded-xl border border-[#101014]/15 font-hanken text-sm text-[#101014]/60">Annuler</button>
            </div>
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <div>
          <p className="font-bricolage font-semibold text-[14px] text-[#101014] mb-2">Derniers reversements</p>
          <div className="rounded-2xl border border-[#101014]/10 overflow-hidden">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-2.5 border-b border-[#101014]/5 last:border-0">
                <span className="font-hanken text-[13px] text-[#101014]/70">{nameOf(r.seller_id)} <span className="text-[#101014]/35">· {r.reason ?? "—"}</span></span>
                <span className="font-mono text-[13px] font-bold text-[#1B8155]">{(r.amount_cents / 100).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
