"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Truck, MapPin, Hand, Plus, Trash2, Check, Loader2, PackageCheck, Sparkles } from "lucide-react";

export type ShippingMethod = {
  id: string;
  type: "relay" | "home" | "pickup";
  label: string;
  price: number;          // en euros
  free_above: number | null; // offert dès X € (null = jamais)
  enabled: boolean;
};

const TYPE_META: Record<ShippingMethod["type"], { icon: React.ElementType; label: string; hint: string }> = {
  relay:  { icon: MapPin, label: "Point relais", hint: "Mondial Relay, Relais Colis…" },
  home:   { icon: Truck,  label: "À domicile",   hint: "Colissimo, Chronopost…" },
  pickup: { icon: Hand,   label: "Retrait en main propre", hint: "Remise locale, gratuit" },
};

const PRESETS: Omit<ShippingMethod, "id">[] = [
  { type: "relay",  label: "Point relais",           price: 4.9, free_above: null, enabled: true },
  { type: "home",   label: "Livraison à domicile",   price: 5.9, free_above: null, enabled: true },
  { type: "pickup", label: "Retrait en main propre", price: 0,   free_above: null, enabled: true },
];

const uid = () => `m_${Math.random().toString(36).slice(2, 9)}`;

export function ShippingSettings({ shopId, initial, initialSelfShip = true }: { shopId: string; initial: ShippingMethod[]; initialSelfShip?: boolean }) {
  const [methods, setMethods] = useState<ShippingMethod[]>(
    initial.length ? initial : PRESETS.map(p => ({ ...p, id: uid() }))
  );
  const [selfShip, setSelfShip] = useState<boolean>(initialSelfShip);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const patch = (id: string, p: Partial<ShippingMethod>) =>
    setMethods(ms => ms.map(m => (m.id === id ? { ...m, ...p } : m)));
  const remove = (id: string) => setMethods(ms => ms.filter(m => m.id !== id));
  const add = (type: ShippingMethod["type"]) =>
    setMethods(ms => [...ms, { id: uid(), type, label: TYPE_META[type].label, price: 0, free_above: null, enabled: true }]);

  const save = async () => {
    setSaving(true); setSaved(false);
    const clean = methods.map(m => ({
      ...m,
      price: Math.max(0, Number(m.price) || 0),
      free_above: m.free_above != null && m.free_above !== ("" as unknown) ? Math.max(0, Number(m.free_above)) : null,
      label: m.label.trim() || TYPE_META[m.type].label,
    }));
    const supabase = createClient();
    const { error } = await supabase.from("shops").update({ shipping_options: clean, self_ship: selfShip }).eq("id", shopId);
    setSaving(false);
    if (!error) { setMethods(clean); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    else alert("Erreur : " + error.message);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-fraunces text-2xl text-[#101014] mb-1">Livraison</h2>
        <p className="font-hanken text-sm text-[#101014]/50">
          Choisis les modes que tu proposes. Les <strong>tarifs sont calculés automatiquement selon le poids du colis</strong> (grille plateforme) — tu n&apos;as rien à fixer.
        </p>
        <div className="mt-3 rounded-xl border border-[#ECE6DB] bg-[#101014]/[0.02] p-3 font-mono text-[11px] text-[#101014]/55 space-y-0.5">
          <p className="text-[#101014]/40 mb-1">Grille point relais (domicile +1 €) :</p>
          <p>0–1 kg : 5,90 € · 1–2 kg : 8,90 € · 2–5 kg : 12,90 € · 5–10 kg : 18,90 €</p>
        </div>
      </div>

      {/* Qui gère la livraison ? */}
      <div className="mb-7">
        <p className="font-bricolage font-semibold text-[15px] text-[#101014] mb-3">Qui gère l’expédition ?</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <button type="button" onClick={() => setSelfShip(true)}
            className="text-left rounded-2xl border p-4 transition-all"
            style={selfShip ? { borderColor: "#FF2DA0", boxShadow: "inset 0 0 0 1px #FF2DA0", background: "rgba(255,45,160,0.04)" } : { borderColor: "rgba(16,16,20,0.12)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <PackageCheck size={16} className="text-[#FF2DA0]" />
              <span className="font-hanken text-sm font-semibold text-[#101014]">Je gère ma livraison</span>
              {selfShip && <Check size={14} className="text-[#FF2DA0] ml-auto" />}
            </div>
            <p className="font-hanken text-[12.5px] text-[#101014]/55 leading-snug">
              Tu expédies avec ton transporteur habituel (Mondial Relay, La Poste…). <strong>Tu reçois les frais de port</strong> avec ton versement. Tu saisis le n° de suivi à l’envoi.
            </p>
          </button>
          <button type="button" onClick={() => setSelfShip(false)}
            className="text-left rounded-2xl border p-4 transition-all"
            style={!selfShip ? { borderColor: "#7A2BF0", boxShadow: "inset 0 0 0 1px #7A2BF0", background: "rgba(122,43,240,0.04)" } : { borderColor: "rgba(16,16,20,0.12)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={16} className="text-[#7A2BF0]" />
              <span className="font-hanken text-sm font-semibold text-[#101014]">Spectrum gère pour moi</span>
              {!selfShip && <Check size={14} className="text-[#7A2BF0] ml-auto" />}
            </div>
            <p className="font-hanken text-[12.5px] text-[#101014]/55 leading-snug">
              Spectrum fournit une <strong>étiquette prépayée</strong> : tu imprimes, tu déposes le colis, rien à avancer. La plateforme garde les frais de port.
            </p>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {methods.map(m => {
          const Meta = TYPE_META[m.type];
          const Icon = Meta.icon;
          return (
            <div key={m.id} className={`rounded-2xl border p-4 transition-colors ${m.enabled ? "border-[#101014]/12 bg-white" : "border-[#101014]/8 bg-[#101014]/[0.02] opacity-70"}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF2DA0]/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#FF2DA0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <input value={m.label} onChange={e => patch(m.id, { label: e.target.value })}
                      className="flex-1 font-hanken text-sm font-medium text-[#101014] bg-transparent border-b border-transparent hover:border-[#101014]/15 focus:border-[#FF2DA0] focus:outline-none py-0.5" />
                    <button onClick={() => remove(m.id)} className="text-[#101014]/25 hover:text-red-500 shrink-0"><Trash2 size={14} /></button>
                  </div>
                  <p className="font-mono text-[10px] text-[#101014]/30 mb-3">{Meta.label} · {Meta.hint}</p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="font-mono text-[11px] text-[#101014]/45">Tarif auto · selon le poids</span>
                    <label className="flex items-center gap-1.5 text-[#101014]/60">
                      <span className="font-mono text-[11px]">Offert dès</span>
                      <input type="number" min={0} step="1" placeholder="—"
                        value={m.free_above ?? ""}
                        onChange={e => patch(m.id, { free_above: e.target.value === "" ? null : Number(e.target.value) })}
                        className="w-20 bg-[#101014]/5 border border-[#101014]/10 rounded-lg px-2 py-1 font-mono text-xs text-[#101014] focus:outline-none focus:border-[#FF2DA0]/50" />
                      <span className="font-mono text-[11px]">€</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer ml-auto">
                      <span className="font-mono text-[11px] text-[#101014]/40">{m.enabled ? "Activé" : "Désactivé"}</span>
                      <input type="checkbox" checked={m.enabled} onChange={e => patch(m.id, { enabled: e.target.checked })} className="accent-[#FF2DA0] w-4 h-4" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ajouter une méthode */}
      <div className="flex flex-wrap gap-2 mt-4">
        {(Object.keys(TYPE_META) as ShippingMethod["type"][]).map(t => {
          const Icon = TYPE_META[t].icon;
          return (
            <button key={t} onClick={() => add(t)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-dashed border-[#101014]/20 text-[#101014]/55 hover:border-[#FF2DA0]/50 hover:text-[#FF2DA0] font-hanken text-xs transition-colors">
              <Plus size={12} /> <Icon size={12} /> {TYPE_META[t].label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-7">
        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101014] text-white font-hanken text-sm hover:brightness-125 transition-all disabled:opacity-40">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saved && <span className="font-hanken text-sm text-green-600 flex items-center gap-1"><Check size={14} /> Enregistré</span>}
      </div>

      <p className="font-mono text-[10px] text-[#101014]/30 mt-5 leading-relaxed">
        {selfShip
          ? "Au paiement, l'acheteur·se choisit son point relais (carte Mondial Relay) et les frais de port sont ajoutés à TON versement. Tu saisis le n° de suivi à l'expédition."
          : "Spectrum gère l'expédition : une étiquette prépayée sera générée pour chaque commande, tu n'avances rien. (Nécessite que la plateforme ait activé Sendcloud.)"}
      </p>
    </div>
  );
}
