"use client";

import { useState } from "react";
import type { Address } from "@/lib/types/address";

const T = { ink: "#101014", soft: "#6B6258", line: "#ECE6DB", mag: "#FF2DA0" };
const input = "w-full rounded-xl px-4 py-3 text-[15px] outline-none";
const inputStyle = { boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink } as const;

/** Formulaire d'adresse réutilisable (compte + checkout). */
export function AddressForm({
  initial, onSubmit, onCancel, submitting,
}: {
  initial: Omit<Address, "id">;
  onSubmit: (a: Omit<Address, "id">) => void;
  onCancel?: () => void;
  submitting?: boolean;
}) {
  const [f, setF] = useState(initial);
  const set = (k: keyof typeof f, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.full_name.trim() || !f.line1.trim() || !f.city.trim() || !f.zip.trim()) return;
    onSubmit(f);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className={input} style={inputStyle} placeholder="Libellé (Domicile, Travail…)" value={f.label ?? ""} onChange={(e) => set("label", e.target.value)} />
      <input className={input} style={inputStyle} placeholder="Nom complet *" value={f.full_name} onChange={(e) => set("full_name", e.target.value)} required />
      <input className={input} style={inputStyle} placeholder="Téléphone" value={f.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
      <input className={input} style={inputStyle} placeholder="Adresse *" value={f.line1} onChange={(e) => set("line1", e.target.value)} required />
      <input className={input} style={inputStyle} placeholder="Complément (appartement, étage…)" value={f.line2 ?? ""} onChange={(e) => set("line2", e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <input className={input} style={inputStyle} placeholder="Code postal *" value={f.zip} onChange={(e) => set("zip", e.target.value)} required />
        <input className={input} style={inputStyle} placeholder="Ville *" value={f.city} onChange={(e) => set("city", e.target.value)} required />
      </div>
      <input className={input} style={inputStyle} placeholder="Pays" value={f.country} onChange={(e) => set("country", e.target.value.toUpperCase())} />
      <label className="flex items-center gap-2 text-[14px]" style={{ color: T.soft }}>
        <input type="checkbox" checked={f.is_default} onChange={(e) => set("is_default", e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: T.mag }} />
        Définir comme adresse par défaut
      </label>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={submitting} className="flex-1 rounded-full py-3 font-semibold text-[15px] text-white disabled:opacity-50" style={{ background: T.ink }}>
          {submitting ? "Enregistrement…" : "Enregistrer"}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="px-5 rounded-full font-semibold text-[15px]" style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}>Annuler</button>}
      </div>
    </form>
  );
}
