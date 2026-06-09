"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RotateCcw, Loader2, Check } from "lucide-react";

const REASONS = [
  "Produit endommagé / défectueux",
  "Non conforme à la description",
  "Erreur de taille / variante",
  "Jamais reçu",
  "Changement d'avis (rétractation 14 j)",
  "Autre",
];

const STATUS_LABEL: Record<string, string> = {
  requested: "Retour demandé · en attente",
  approved: "Retour accepté",
  refused: "Retour refusé",
  refunded: "Remboursé ✓",
};

export function ReturnRequestButton({
  orderId, shopId, userId, existingStatus,
}: {
  orderId: string; shopId: string; userId: string; existingStatus?: string;
}) {
  const [status, setStatus] = useState<string | undefined>(existingStatus);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (status) {
    return <span className="font-mono text-[10px] text-[#101014]/45 mt-1 inline-block">↩︎ {STATUS_LABEL[status] ?? status}</span>;
  }

  const submit = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("return_requests").insert({
      order_id: orderId, shop_id: shopId, user_id: userId, reason, message: message.trim() || null,
    });
    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setStatus("requested"); setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] text-[#101014]/45 hover:text-[#FF2DA0] transition-colors">
        <RotateCcw size={11} /> Demander un retour
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-[#101014]/10 bg-[#101014]/[0.02] p-3 space-y-2">
      <select value={reason} onChange={e => setReason(e.target.value)}
        className="w-full bg-white border border-[#101014]/12 rounded-lg px-2.5 py-1.5 font-hanken text-xs focus:outline-none focus:border-[#FF2DA0]/50">
        {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="Détaille ta demande (facultatif)…"
        className="w-full bg-white border border-[#101014]/12 rounded-lg px-2.5 py-1.5 font-hanken text-xs focus:outline-none focus:border-[#FF2DA0]/50" />
      <div className="flex items-center gap-2">
        <button onClick={submit} disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101014] text-white font-hanken text-xs hover:brightness-125 disabled:opacity-40">
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Envoyer la demande
        </button>
        <button onClick={() => setOpen(false)} className="font-mono text-[10px] text-[#101014]/35 hover:text-[#101014]/60">Annuler</button>
      </div>
    </div>
  );
}
