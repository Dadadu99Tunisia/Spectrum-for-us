"use client";
import { useEffect, useState, useCallback } from "react";
import { Star, Search, Plus, Link2, Globe, Mail, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Ambassador = {
  id: string;
  name: string;
  platform: string | null;
  profile_url: string | null;
  email: string | null;
  instagram_handle: string | null;
  description: string | null;
  category: string | null;
  followers_count: number | null;
  outreach_status: string;
  email_sent_at: string | null;
  notes: string | null;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: "Prospect",   color: "text-[#F3EADB]/40 bg-[#F3EADB]/5 border-[#F3EADB]/10" },
  contacted: { label: "Contacté",   color: "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20" },
  replied:   { label: "A répondu",  color: "text-[#6D2DB5] bg-[#6D2DB5]/10 border-[#6D2DB5]/20" },
  converted: { label: "Ambassadeur ✓", color: "text-[#E0337E] bg-[#E0337E]/10 border-[#E0337E]/20" },
  rejected:  { label: "Refusé",     color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export default function AmbassadeursPage() {
  const [items, setItems]     = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("converted");
  const [total, setTotal]     = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<string | null>(null);
  const [form, setForm]       = useState({ name:"", email:"", instagram_handle:"", category:"", followers_count:"", notes:"" });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase.from("ambassadors").select("*", { count: "exact" }).order("followers_count", { ascending: false });
    if (statusFilter) q = q.eq("outreach_status", statusFilter);
    if (search)       q = q.ilike("name", `%${search}%`);
    const { data, count } = await q.limit(60);
    setItems(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { fetch_(); }, [fetch_]);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.from("ambassadors").update({ outreach_status: status }).eq("id", id);
    showToast("Statut mis à jour ✓");
    fetch_();
  };

  const addAmbassador = async () => {
    if (!form.name) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("ambassadors").insert({
      name: form.name, email: form.email || null,
      instagram_handle: form.instagram_handle || null,
      category: form.category || null,
      followers_count: form.followers_count ? Number(form.followers_count) : null,
      notes: form.notes || null,
      outreach_status: "pending",
    });
    setSaving(false);
    setShowForm(false);
    setForm({ name:"", email:"", instagram_handle:"", category:"", followers_count:"", notes:"" });
    showToast("Ambassadeur·rice ajouté·e ✓");
    fetch_();
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#E0337E] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Ambassadeur·rices</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">{total} profil{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 transition-colors">
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-[#F3EADB]/4 rounded-xl w-fit flex-wrap">
        {[["converted","Ambassadeurs actifs"],["pending","Prospects"],["contacted","Contactés"],["","Tous"]].map(([v,l]) => (
          <button key={v} onClick={() => setStatusFilter(v)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all ${statusFilter === v ? "bg-[#E0337E] text-white" : "text-[#F3EADB]/40 hover:text-[#F3EADB]"}`}>{l}</button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
          className="w-full pl-9 pr-4 py-2 bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/50 transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20"><Star size={40} className="mx-auto mb-3 text-[#F3EADB]/10" /><p className="font-hanken text-[#F3EADB]/30">Aucun ambassadeur·rice</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(a => {
            const cfg = STATUS_CONFIG[a.outreach_status] ?? STATUS_CONFIG.pending;
            return (
              <div key={a.id} className="p-5 rounded-2xl border border-[#F3EADB]/8 hover:border-[#F3EADB]/15 transition-all space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E0337E]/10 border border-[#E0337E]/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-fraunces text-base text-[#E0337E]">{a.name[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-hanken text-sm text-[#F3EADB] font-medium">{a.name}</p>
                    {a.category && <p className="font-mono text-[9px] text-[#F3EADB]/35 uppercase mt-0.5">{a.category}</p>}
                  </div>
                  <span className={`font-mono text-[8px] px-2 py-1 rounded-full border flex-shrink-0 ${cfg.color}`}>{cfg.label}</span>
                </div>
                {a.followers_count && (
                  <p className="font-mono text-sm text-[#F3EADB]/60">
                    <span className="text-[#E0337E] font-medium">{(a.followers_count / 1000).toFixed(1)}k</span>
                    <span className="text-[#F3EADB]/30 text-[10px] ml-1">abonnés</span>
                  </p>
                )}
                {a.notes && <p className="font-hanken text-xs text-[#F3EADB]/40 line-clamp-2">{a.notes}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-[#F3EADB]/6">
                  <div className="flex gap-2">
                    {a.email && <a href={`mailto:${a.email}`} className="text-[#F3EADB]/25 hover:text-[#E0337E] transition-colors"><Mail size={13} /></a>}
                    {a.instagram_handle && (
                      <a href={`https://instagram.com/${a.instagram_handle}`} target="_blank" rel="noreferrer"
                        className="text-[#F3EADB]/25 hover:text-[#CF3F7C] transition-colors"><Link2 size={13} /></a>
                    )}
                    {a.profile_url && (
                      <a href={a.profile_url} target="_blank" rel="noreferrer"
                        className="text-[#F3EADB]/25 hover:text-[#F3EADB] transition-colors"><Globe size={13} /></a>
                    )}
                  </div>
                  <select value={a.outreach_status} onChange={e => updateStatus(a.id, e.target.value)}
                    className="bg-transparent border border-[#F3EADB]/10 rounded px-2 py-1 font-mono text-[9px] text-[#F3EADB]/40 focus:outline-none focus:border-[#E0337E]/30 transition-colors">
                    {Object.entries(STATUS_CONFIG).map(([v,c]) => <option key={v} value={v}>{c.label}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-[#0e061a] border border-[#F3EADB]/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-lg text-[#F3EADB]">Nouvel·le ambassadeur·rice</h2>
              <button onClick={() => setShowForm(false)} className="text-[#F3EADB]/30 hover:text-[#F3EADB]"><X size={16} /></button>
            </div>
            {[
              { key:"name", label:"Nom *", placeholder:"Prénom Nom ou pseudo" },
              { key:"email", label:"Email", placeholder:"contact@example.com" },
              { key:"instagram_handle", label:"Instagram", placeholder:"handle sans @" },
              { key:"category", label:"Niche / Catégorie", placeholder:"Mode, Beauté, Art…" },
              { key:"followers_count", label:"Abonnés", placeholder:"25000" },
              { key:"notes", label:"Notes", placeholder:"Contexte, partenariat envisagé…" },
            ].map(f => (
              <div key={f.key}>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">{f.label}</label>
                <input value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50 transition-colors" />
              </div>
            ))}
            <button onClick={addAmbassador} disabled={!form.name || saving}
              className="w-full py-2.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 disabled:opacity-40 transition-colors">
              {saving ? "Ajout…" : "Ajouter"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
