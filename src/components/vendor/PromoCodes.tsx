"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tag, Plus, Trash2, Loader2, Check } from "lucide-react";

type Code = {
  id: string; code: string; kind: "percent" | "fixed"; value: number;
  min_order: number | null; max_uses: number | null; used_count: number;
  expires_at: string | null; active: boolean;
};
const EMPTY = { code: "", kind: "percent" as "percent" | "fixed", value: "10", min_order: "", max_uses: "", expires_at: "" };

export function PromoCodes({ shopId }: { shopId: string }) {
  const [codes, setCodes] = useState<Code[] | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data } = await createClient().from("discount_codes").select("*").eq("shop_id", shopId).order("created_at", { ascending: false });
    setCodes((data ?? []) as Code[]);
  }, [shopId]);
  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!form.code.trim() || !form.value) { setErr("Code et valeur requis."); return; }
    setSaving(true); setErr("");
    const { error } = await createClient().from("discount_codes").insert({
      shop_id: shopId, code: form.code.trim().toUpperCase(), kind: form.kind, value: Number(form.value),
      min_order: form.min_order ? Number(form.min_order) : null,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    });
    setSaving(false);
    if (error) { setErr(error.code === "23505" ? "Ce code existe déjà." : error.message); return; }
    setForm(EMPTY); setShowForm(false); load();
  };

  const toggle = async (c: Code) => { await createClient().from("discount_codes").update({ active: !c.active }).eq("id", c.id); load(); };
  const del = async (id: string) => { if (!confirm("Supprimer ce code ?")) return; await createClient().from("discount_codes").delete().eq("id", id); load(); };

  const I = "bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2.5 py-1.5 font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/50";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-fraunces text-2xl text-[#101014] flex items-center gap-2"><Tag size={18} /> Codes promo</h2>
          <p className="font-hanken text-sm text-[#101014]/50">Crée des réductions pour ta boutique. La remise s'applique sur tes produits au paiement.</p>
        </div>
        <button onClick={() => { setShowForm(s => !s); setErr(""); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FF2DA0] text-white font-hanken text-sm"><Plus size={14} /> Nouveau</button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-[#FF2DA0]/30 bg-[#FF2DA0]/[0.03] p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Code *</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="BIENVENUE10" className={I + " w-full uppercase"} /></div>
            <div><label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Type</label>
              <select value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value as "percent" | "fixed" })} className={I + " w-full"}>
                <option value="percent">Pourcentage (%)</option><option value="fixed">Montant fixe (€)</option>
              </select></div>
            <div><label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Valeur * {form.kind === "percent" ? "(%)" : "(€)"}</label>
              <input type="number" min="1" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className={I + " w-full"} /></div>
            <div><label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Min. commande (€)</label>
              <input type="number" min="0" value={form.min_order} onChange={e => setForm({ ...form, min_order: e.target.value })} placeholder="—" className={I + " w-full"} /></div>
            <div><label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Nb max d'usages</label>
              <input type="number" min="1" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} placeholder="illimité" className={I + " w-full"} /></div>
            <div><label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Expire le</label>
              <input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} className={I + " w-full"} /></div>
          </div>
          {err && <p className="font-hanken text-sm text-red-500">{err}</p>}
          <button onClick={create} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#101014] text-white font-hanken text-sm disabled:opacity-40">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Créer le code
          </button>
        </div>
      )}

      {codes === null ? <div className="flex items-center gap-2 text-[#101014]/40 py-6"><Loader2 size={15} className="animate-spin" /> Chargement…</div>
        : codes.length === 0 ? <p className="font-hanken text-sm text-[#101014]/40 py-6">Aucun code promo. Crée ta première offre !</p>
        : (
        <div className="space-y-2">
          {codes.map(c => {
            const expired = c.expires_at && new Date(c.expires_at) < new Date();
            const used = c.max_uses != null && c.used_count >= c.max_uses;
            return (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#101014]/12 bg-white p-3.5">
                <div className="min-w-0">
                  <p className="font-mono font-bold text-[#101014] tracking-wide">{c.code} <span className="text-[#FF2DA0]">{c.kind === "percent" ? `−${c.value}%` : `−${c.value} €`}</span></p>
                  <p className="font-mono text-[10px] text-[#101014]/40">
                    {c.min_order ? `min ${c.min_order} € · ` : ""}{c.used_count}{c.max_uses ? `/${c.max_uses}` : ""} utilisé{c.used_count > 1 ? "s" : ""}{c.expires_at ? ` · exp. ${new Date(c.expires_at).toLocaleDateString("fr-FR")}` : ""}
                    {(expired || used) && <span className="text-red-500"> · {expired ? "expiré" : "épuisé"}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggle(c)} className={`font-mono text-[10px] px-2 py-1 rounded-full border ${c.active ? "text-green-600 border-green-400/30 bg-green-400/10" : "text-[#101014]/40 border-[#101014]/15"}`}>{c.active ? "Actif" : "Inactif"}</button>
                  <button onClick={() => del(c.id)} className="text-[#101014]/25 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
