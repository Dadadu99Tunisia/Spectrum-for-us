"use client";
import { useEffect, useState, useCallback } from "react";
import { Mail, Search, Plus, Link2, Globe, Send, CheckCircle, Clock, XCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Outreach = {
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

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "À contacter", color: "text-[#F3EADB]/40 bg-white/[0.05] border-white/[0.09]",  icon: Clock },
  contacted: { label: "Contacté",    color: "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20",    icon: Send },
  replied:   { label: "A répondu",   color: "text-[#6D2DB5] bg-[#6D2DB5]/10 border-[#6D2DB5]/20",    icon: CheckCircle },
  converted: { label: "Converti ✓",  color: "text-green-400 bg-green-400/10 border-green-400/20",    icon: CheckCircle },
  rejected:  { label: "Refusé",      color: "text-red-400 bg-red-400/10 border-red-400/20",           icon: XCircle },
};

const STATUSES = Object.keys(STATUS_CONFIG);

export default function OutreachPage() {
  const [items, setItems]     = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal]     = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<string | null>(null);
  const [form, setForm]       = useState({ name: "", email: "", instagram_handle: "", platform: "instagram", category: "", followers_count: "", notes: "" });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase.from("vendor_outreach").select("*", { count: "exact" }).order("created_at", { ascending: false });
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
    const update: Record<string, unknown> = { outreach_status: status };
    if (status === "contacted") update.email_sent_at = new Date().toISOString();
    await supabase.from("vendor_outreach").update(update).eq("id", id);
    showToast("Statut mis à jour ✓");
    fetch_();
  };

  const addContact = async () => {
    if (!form.name) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("vendor_outreach").insert({
      name: form.name, email: form.email || null,
      instagram_handle: form.instagram_handle || null,
      platform: form.platform, category: form.category || null,
      followers_count: form.followers_count ? Number(form.followers_count) : null,
      notes: form.notes || null,
      outreach_status: "pending",
    });
    setSaving(false);
    setShowForm(false);
    setForm({ name:"", email:"", instagram_handle:"", platform:"instagram", category:"", followers_count:"", notes:"" });
    showToast("Contact ajouté ✓");
    fetch_();
  };

  // Stats by status
  const statsCounts = STATUSES.reduce((acc, s) => {
    acc[s] = items.filter(i => i.outreach_status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#E0337E] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Outreach Vendeurs</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">{total} contact{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 transition-colors">
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-5 gap-3">
        {STATUSES.map(s => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          const count = items.filter(i => i.outreach_status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
              className={`p-3 rounded-xl border text-left transition-all ${statusFilter === s ? "border-[#E0337E]/40 bg-[#E0337E]/5" : "border-white/[0.08] hover:border-[#F3EADB]/15"}`}>
              <p className="font-fraunces text-xl text-[#F3EADB]">{count}</p>
              <p className={`font-mono text-[9px] uppercase tracking-wide mt-0.5 flex items-center gap-1 ${cfg.color.split(" ")[0]}`}>
                <Icon size={8} /> {cfg.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
          className="w-full max-w-sm pl-9 pr-4 py-2 bg-white/[0.05] border border-white/[0.09] rounded-lg font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : (
        <div className="rounded-xl border border-white/[0.08] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.03]">
                {["Nom","Plateforme","Contact","Catégorie","Abonnés","Statut","Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const cfg = STATUS_CONFIG[item.outreach_status] ?? STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <tr key={item.id} className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-hanken text-sm text-[#F3EADB]">{item.name}</p>
                      {item.notes && <p className="font-mono text-[9px] text-[#F3EADB]/25 truncate max-w-[140px]">{item.notes}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-[#F3EADB]/40 capitalize">{item.platform ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {item.email && (
                          <a href={`mailto:${item.email}`} className="text-[#F3EADB]/25 hover:text-[#E0337E] transition-colors"><Mail size={12} /></a>
                        )}
                        {item.instagram_handle && (
                          <a href={`https://instagram.com/${item.instagram_handle}`} target="_blank" rel="noreferrer"
                            className="text-[#F3EADB]/25 hover:text-[#CF3F7C] transition-colors"><Link2 size={12} /></a>
                        )}
                        {item.profile_url && (
                          <a href={item.profile_url} target="_blank" rel="noreferrer"
                            className="text-[#F3EADB]/25 hover:text-[#F3EADB] transition-colors"><Globe size={12} /></a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="font-mono text-[10px] text-[#F3EADB]/35">{item.category ?? "—"}</span></td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-[#F3EADB]/40">
                        {item.followers_count ? `${(item.followers_count / 1000).toFixed(1)}k` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 w-fit font-mono text-[9px] px-2 py-1 rounded-full border ${cfg.color}`}>
                        <Icon size={8} /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={item.outreach_status} onChange={e => updateStatus(item.id, e.target.value)}
                        className="bg-[#0e061a] border border-white/[0.09] rounded px-2 py-1 font-mono text-[9px] text-[#F3EADB]/50 focus:outline-none focus:border-[#E0337E]/40 transition-colors">
                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-12"><p className="font-hanken text-[#F3EADB]/30">Aucun contact</p></div>
          )}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-[#0e061a] border border-white/[0.09] rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-lg text-[#F3EADB]">Nouveau contact outreach</h2>
              <button onClick={() => setShowForm(false)} className="text-[#F3EADB]/30 hover:text-[#F3EADB]"><X size={16} /></button>
            </div>
            {[
              { key:"name", label:"Nom *", placeholder:"Prénom Nom ou pseudo" },
              { key:"email", label:"Email", placeholder:"contact@example.com" },
              { key:"instagram_handle", label:"Instagram", placeholder:"@handle (sans @)" },
              { key:"category", label:"Catégorie", placeholder:"Mode, Bijoux, Art…" },
              { key:"followers_count", label:"Abonnés", placeholder:"12000" },
              { key:"notes", label:"Notes", placeholder:"Contexte, raison du contact…" },
            ].map(f => (
              <div key={f.key}>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">{f.label}</label>
                <input value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-white/[0.05] border border-white/[0.09] rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
              </div>
            ))}
            <button onClick={addContact} disabled={!form.name || saving}
              className="w-full py-2.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 transition-colors disabled:opacity-40">
              {saving ? "Ajout…" : "Ajouter le contact"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
