"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, Check } from "lucide-react";

const C = { ink: "#101014", soft: "#6B6258", line: "#ECE6DB", mag: "#FF2DA0", green: "#1B8155", amber: "#B5742A" };
const LEGAL_TYPES = ["Particulier", "Auto-entrepreneur·se", "Société", "Association", "Autre"];

type Kyc = { legal_name?: string; legal_type?: string; vat_number?: string; address_country?: string; id_document_url?: string; kyc_status?: string } | null;

// Vérification d'identité (KYC) requise avant tout versement — conformité anti-blanchiment.
export function VendorKyc() {
  const [kyc, setKyc] = useState<Kyc>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ legal_name: "", legal_type: "Particulier", vat_number: "", tax_id: "", address_country: "", id_document_url: "" });

  useEffect(() => {
    fetch("/api/vendor/kyc").then(r => r.json()).then(d => {
      setKyc(d.kyc ?? null);
      if (d.kyc) setForm(f => ({ ...f, ...Object.fromEntries(Object.entries(d.kyc).filter(([, v]) => v != null)) }));
      setEditing(!d.kyc);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!form.legal_name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/vendor/kyc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { setKyc({ ...form, kyc_status: "submitted" }); setEditing(false); }
    else { const j = await res.json().catch(() => ({})); alert("Erreur : " + (j.error ?? res.status)); }
  };

  if (loading) return null;
  const status = kyc?.kyc_status ?? "none";

  return (
    <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${C.line}` }}>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={17} style={{ color: status === "verified" ? C.green : C.mag }} />
        <h3 className="font-bricolage font-semibold text-[15px]" style={{ color: C.ink }}>Vérification d&apos;identité</h3>
        {status === "verified" && <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] rounded-full px-2 py-0.5" style={{ background: `${C.green}1A`, color: C.green }}><Check size={11} /> Vérifiée</span>}
        {status === "submitted" && <span className="ml-auto font-mono text-[10px] rounded-full px-2 py-0.5" style={{ background: `${C.amber}1A`, color: C.amber }}>En cours</span>}
      </div>

      {status === "verified" ? (
        <p className="text-[13.5px]" style={{ color: C.soft }}>Ton identité est vérifiée — tu peux recevoir tes versements.</p>
      ) : status === "submitted" && !editing ? (
        <div>
          <p className="text-[13.5px] mb-1" style={{ color: C.soft }}>Tes informations sont en cours de vérification par notre équipe.</p>
          <button onClick={() => setEditing(true)} className="font-mono text-[11px]" style={{ color: C.mag }}>Modifier</button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[13px] mb-1" style={{ color: C.soft }}>Obligatoire avant ton premier versement (conformité). Tes données restent confidentielles.</p>
          <input value={form.legal_name} onChange={e => setForm(f => ({ ...f, legal_name: e.target.value }))} placeholder="Nom légal complet *"
            className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm" />
          <select value={form.legal_type} onChange={e => setForm(f => ({ ...f, legal_type: e.target.value }))}
            className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm">
            {LEGAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input value={form.address_country} onChange={e => setForm(f => ({ ...f, address_country: e.target.value }))} placeholder="Pays de résidence fiscale"
            className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm" />
          <input value={form.tax_id} onChange={e => setForm(f => ({ ...f, tax_id: e.target.value }))} placeholder="Identifiant fiscal / N° fiscal (DAC7)"
            className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm" />
          <input value={form.vat_number} onChange={e => setForm(f => ({ ...f, vat_number: e.target.value }))} placeholder="N° TVA (si applicable)"
            className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm" />
          <input value={form.id_document_url} onChange={e => setForm(f => ({ ...f, id_document_url: e.target.value }))} placeholder="Lien vers une pièce d'identité (optionnel)"
            className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm" />
          <button onClick={submit} disabled={saving || !form.legal_name.trim()}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-[13px] text-white disabled:opacity-50" style={{ background: C.ink }}>
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Envoyer pour vérification
          </button>
        </div>
      )}
    </div>
  );
}
