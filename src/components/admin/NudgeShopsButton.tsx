"use client";
import { useState } from "react";
import { Send, Loader2, X, Check } from "lucide-react";

type Row = { name: string; email: string | null };
type Preview = { activate_payment: Row[]; add_product: Row[] };

export function NudgeShopsButton() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ count: number } | null>(null);
  const [err, setErr] = useState("");

  const openPreview = async () => {
    setOpen(true); setLoading(true); setErr(""); setDone(null); setPreview(null);
    try {
      const res = await fetch("/api/admin/nudge-shops");
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Erreur"); return; }
      setPreview(j.data);
    } catch { setErr("Erreur réseau"); } finally { setLoading(false); }
  };

  const send = async () => {
    setSending(true); setErr("");
    try {
      const res = await fetch("/api/admin/nudge-shops", { method: "POST" });
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Erreur d'envoi"); return; }
      setDone({ count: j.data?.count ?? 0 });
    } catch { setErr("Erreur réseau"); } finally { setSending(false); }
  };

  const total = (preview?.activate_payment.length ?? 0) + (preview?.add_product.length ?? 0);

  return (
    <>
      <button onClick={openPreview}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#FF2DA0] text-white font-hanken text-sm hover:brightness-110">
        <Send size={14} /> Relancer les boutiques inactives
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-[#101014]/40"><X size={18} /></button>

            {done ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#1B8155]/10 flex items-center justify-center mx-auto mb-3"><Check size={28} className="text-[#1B8155]" /></div>
                <h3 className="font-fraunces text-xl text-[#101014] mb-1">{done.count} relance{done.count > 1 ? "s" : ""} envoyée{done.count > 1 ? "s" : ""} ✦</h3>
                <p className="font-hanken text-sm text-[#101014]/50">Les boutiques concernées ont reçu leur email.</p>
                <button onClick={() => setOpen(false)} className="mt-4 px-5 py-2 rounded-full bg-[#101014] text-white font-hanken text-sm">Fermer</button>
              </div>
            ) : (
              <>
                <h3 className="font-fraunces text-xl text-[#101014] mb-1">Relancer les boutiques inactives</h3>
                <p className="font-hanken text-[13px] text-[#101014]/50 mb-4">Email à la charte Spectrum, envoyé une fois.</p>

                {loading ? (
                  <div className="py-8 flex justify-center"><Loader2 size={20} className="animate-spin text-[#FF2DA0]" /></div>
                ) : preview && total === 0 ? (
                  <p className="font-hanken text-sm text-[#101014]/50 py-4 text-center">✅ Aucune boutique à relancer — tout le monde est actif et a des produits !</p>
                ) : preview ? (
                  <div className="space-y-4 mb-4">
                    {preview.activate_payment.length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#B5742A] mb-1.5">💳 Activer les paiements ({preview.activate_payment.length})</p>
                        {preview.activate_payment.map((r, i) => (
                          <p key={i} className="font-hanken text-[13px] text-[#101014]/70">{r.name} <span className="text-[#101014]/35">· {r.email ?? "—"}</span></p>
                        ))}
                      </div>
                    )}
                    {preview.add_product.length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#7A2BF0] mb-1.5">📦 Ajouter un produit ({preview.add_product.length})</p>
                        {preview.add_product.map((r, i) => (
                          <p key={i} className="font-hanken text-[13px] text-[#101014]/70">{r.name} <span className="text-[#101014]/35">· {r.email ?? "—"}</span></p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {err && <p className="font-hanken text-xs text-red-500 mb-2">{err}</p>}

                {preview && total > 0 && (
                  <button onClick={send} disabled={sending}
                    className="w-full py-3 rounded-full bg-[#FF2DA0] text-white font-hanken font-semibold text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2">
                    {sending ? <><Loader2 size={15} className="animate-spin" /> Envoi…</> : <><Send size={15} /> Envoyer {total} relance{total > 1 ? "s" : ""}</>}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
