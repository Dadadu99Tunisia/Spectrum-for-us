"use client";

import { useEffect, useState } from "react";
import { CreditCard, Check, ArrowRight, AlertCircle } from "lucide-react";

type Status = { connected: boolean; charges_enabled: boolean; payouts_enabled: boolean; details_submitted?: boolean } | null;

const C = { ink: "#101014", soft: "#6B6258", line: "#ECE6DB", mag: "#FF2DA0", green: "#1B8155", amber: "#B5742A" };

export function ConnectPayments() {
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/stripe/connect");
      const json = await res.json();
      setStatus(json);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const connect = async () => {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const json = await res.json();
      if (json.url) window.location.assign(json.url);
      else { setErr(json.error ?? "Erreur"); setBusy(false); }
    } catch { setErr("Erreur réseau"); setBusy(false); }
  };

  const active = status?.connected && status?.charges_enabled && status?.payouts_enabled;
  const pending = status?.connected && !active;

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
      <div className="flex items-center gap-2 mb-1">
        <CreditCard size={17} style={{ color: C.mag }} />
        <h3 className="font-bricolage font-semibold text-[15px]" style={{ color: C.ink }}>Paiements</h3>
        {active && <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] rounded-full px-2 py-0.5" style={{ background: `${C.green}1A`, color: C.green }}><Check size={11} /> Activé</span>}
        {pending && <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] rounded-full px-2 py-0.5" style={{ background: `${C.amber}1A`, color: C.amber }}><AlertCircle size={11} /> À finaliser</span>}
      </div>

      {loading ? (
        <p className="text-[13px]" style={{ color: C.soft }}>Chargement…</p>
      ) : active ? (
        <p className="text-[13.5px]" style={{ color: C.soft }}>Ton compte Stripe est connecté. Tu seras payé·e directement à chaque vente, déduction faite de la commission.</p>
      ) : (
        <>
          <p className="text-[13.5px] mb-3" style={{ color: C.soft }}>
            {pending
              ? "Ta configuration Stripe est incomplète. Finalise-la pour pouvoir recevoir tes paiements."
              : "Connecte ton compte Stripe pour recevoir l'argent de tes ventes directement. Sans ça, tu ne peux pas vendre."}
          </p>
          <button onClick={connect} disabled={busy}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-[14px] text-white disabled:opacity-50"
            style={{ background: C.ink }}>
            {busy ? "Redirection…" : pending ? "Finaliser ma configuration" : "Connecter mes paiements"} <ArrowRight size={15} />
          </button>
          {err && <p className="text-[12px] mt-2" style={{ color: "#c0392b" }}>{err}</p>}
        </>
      )}
    </div>
  );
}
