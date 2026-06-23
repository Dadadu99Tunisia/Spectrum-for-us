"use client";
import { useState } from "react";
import { Flag, X } from "lucide-react";

const REASONS: { v: string; l: string }[] = [
  { v: "counterfeit", l: "Contrefaçon / produit non authentique" },
  { v: "illegal", l: "Produit illégal ou interdit" },
  { v: "hate", l: "Contenu haineux / discriminatoire" },
  { v: "harassment", l: "Harcèlement" },
  { v: "scam", l: "Arnaque / fraude" },
  { v: "sexual_minor", l: "Contenu sexuel impliquant un mineur" },
  { v: "spam", l: "Spam" },
  { v: "other", l: "Autre" },
];

const T = { ink: "#101014", soft: "#6B6258", line: "#ECE6DB", mag: "#FF2DA0" };

export function ReportButton({ targetType, targetId, label = "Signaler" }: { targetType: string; targetId: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!reason) return;
    setState("sending"); setErr("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_id: targetId, reason, details }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(j.error ?? "Erreur"); setState("error"); return; }
      setState("done");
    } catch { setErr("Erreur réseau"); setState("error"); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] transition-colors"
        style={{ color: T.soft }}>
        <Flag size={12} /> {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-3xl p-6" style={{ background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="absolute top-4 right-4" style={{ color: T.soft }}><X size={18} /></button>

            {state === "done" ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-2">✓</p>
                <h3 className="font-fraunces text-xl mb-1" style={{ color: T.ink }}>Signalement envoyé</h3>
                <p className="font-hanken text-sm" style={{ color: T.soft }}>Merci. Notre équipe examine chaque signalement.</p>
                <button onClick={() => setOpen(false)} className="mt-4 px-5 py-2 rounded-full text-white font-hanken text-sm" style={{ background: T.ink }}>Fermer</button>
              </div>
            ) : (
              <>
                <h3 className="font-fraunces text-xl mb-1" style={{ color: T.ink }}>Signaler</h3>
                <p className="font-hanken text-[13px] mb-4" style={{ color: T.soft }}>Aide-nous à garder Spectrum sûr. Choisis un motif.</p>
                <div className="space-y-1.5 mb-3 max-h-56 overflow-y-auto">
                  {REASONS.map(r => (
                    <button key={r.v} onClick={() => setReason(r.v)}
                      className="w-full text-left px-3 py-2 rounded-xl font-hanken text-sm transition-colors"
                      style={reason === r.v ? { background: `${T.mag}12`, boxShadow: `inset 0 0 0 1.5px ${T.mag}`, color: T.ink } : { boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}>
                      {r.l}
                    </button>
                  ))}
                </div>
                <textarea value={details} onChange={e => setDetails(e.target.value)} rows={2}
                  placeholder="Détails (optionnel)…"
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none mb-3" style={{ background: "#FBFAF8", boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }} />
                {err && <p className="font-hanken text-xs mb-2" style={{ color: "#C0392B" }}>{err}</p>}
                <button onClick={submit} disabled={!reason || state === "sending"}
                  className="w-full py-3 rounded-full font-hanken font-semibold text-sm text-white disabled:opacity-50" style={{ background: T.mag }}>
                  {state === "sending" ? "Envoi…" : "Envoyer le signalement"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
