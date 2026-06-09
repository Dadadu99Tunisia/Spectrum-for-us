"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { RotateCcw, Loader2, Check, X } from "lucide-react";

type Ret = {
  id: string; order_id: string; reason: string; message: string | null;
  status: string; refund_amount: number | null; created_at: string;
};

const STATUS: Record<string, { label: string; cls: string }> = {
  requested: { label: "À traiter", cls: "bg-[#FCEAD2] text-[#9A6516]" },
  refunded:  { label: "Remboursé", cls: "bg-[#DCF0E5] text-[#1E8A5A]" },
  refused:   { label: "Refusé",    cls: "bg-[#FBE0E6] text-[#C0344D]" },
  approved:  { label: "Accepté",   cls: "bg-[#DDEBFB] text-[#2660B8]" },
};

export function ReturnsManager({ shopId }: { shopId: string }) {
  const [items, setItems] = useState<Ret[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("return_requests")
      .select("id, order_id, reason, message, status, refund_amount, created_at")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Ret[]);
  }, [shopId]);

  useEffect(() => { load(); }, [load]);

  const act = async (id: string, action: "approve" | "refuse") => {
    if (action === "approve" && !confirm("Approuver ce retour et rembourser l'acheteur·se ? Le montant correspondant te sera repris.")) return;
    setBusy(id);
    const res = await fetch("/api/vendor/return", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setBusy(null);
    if (res.ok) load();
    else { const j = await res.json().catch(() => ({})); alert("Erreur : " + (j.error ?? res.status)); }
  };

  if (items === null || items.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-fraunces text-lg text-[#101014] mb-3 flex items-center gap-2"><RotateCcw size={16} /> Demandes de retour</h3>
      <div className="space-y-3">
        {items.map(r => {
          const st = STATUS[r.status] ?? STATUS.requested;
          return (
            <div key={r.id} className="rounded-2xl border border-[#101014]/12 bg-white p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] text-[#101014]/45">Commande #{r.order_id.slice(0, 8).toUpperCase()}</span>
                <span className={`font-mono text-[9px] px-2 py-1 rounded-full ${st.cls}`}>{st.label}{r.refund_amount ? ` · ${r.refund_amount.toFixed(2)} €` : ""}</span>
              </div>
              <p className="font-hanken text-[13px] text-[#101014] mb-0.5">{r.reason}</p>
              {r.message && <p className="font-hanken text-xs text-[#101014]/55 mb-2">« {r.message} »</p>}
              {r.status === "requested" && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => act(r.id, "approve")} disabled={busy === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101014] text-white font-hanken text-xs hover:brightness-125 disabled:opacity-40">
                    {busy === r.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Approuver & rembourser
                  </button>
                  <button onClick={() => act(r.id, "refuse")} disabled={busy === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#101014]/15 text-[#101014]/55 font-hanken text-xs hover:border-red-400/40 hover:text-red-500 disabled:opacity-40">
                    <X size={12} /> Refuser
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
