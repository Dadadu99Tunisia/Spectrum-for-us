"use client";
import { useEffect, useState, useCallback } from "react";
import { TrendingUp, Plus, Search, X, ArrowRight, Calendar, ChevronRight } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  contact_type: string;
  stage: string;
  source: string | null;
  next_followup_at: string | null;
  created_at: string;
  updated_at: string;
  profiles: { id: string; full_name: string | null } | null;
};

const STAGES = ["identified","contacted","interested","negotiating","converted","lost"] as const;
const STAGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  identified:  { label: "Identifié",    color: "#F3EADB", bg: "#F3EADB08" },
  contacted:   { label: "Contacté",     color: "#E0901E", bg: "#E0901E10" },
  interested:  { label: "Intéressé",    color: "#6D2DB5", bg: "#6D2DB510" },
  negotiating: { label: "Négociation",  color: "#CF3F7C", bg: "#CF3F7C10" },
  converted:   { label: "Converti ✓",   color: "#1C9C95", bg: "#1C9C9510" },
  lost:        { label: "Perdu",        color: "#E0533A", bg: "#E0533A10" },
};
const TYPE_LABELS: Record<string, string> = {
  prospect_vendor: "Vendeur", prospect_buyer: "Acheteur", partner: "Partenaire",
  investor: "Investisseur", grant: "Subvention", foundation: "Fondation",
  media: "Média", ambassador: "Ambassadeur",
};

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "", email: "", company: "", contact_type: "prospect_vendor",
    stage: "identified", source: "", notes: "",
  });
  const [movingId, setMovingId] = useState<string | null>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)      params.set("search", search);
    if (stageFilter) params.set("stage", stageFilter);
    const res  = await fetch(`/api/admin/crm?${params}`);
    const json = await res.json();
    setContacts(json.data ?? []);
    setLoading(false);
  }, [search, stageFilter]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const createContact = async () => {
    if (!newContact.name) return;
    setSavingNew(true);
    await fetch("/api/admin/crm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });
    setSavingNew(false);
    setShowForm(false);
    setNewContact({ name:"", email:"", company:"", contact_type:"prospect_vendor", stage:"identified", source:"", notes:"" });
    fetchContacts();
  };

  const moveStage = async (id: string, stage: string) => {
    setMovingId(id);
    await fetch(`/api/admin/crm/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    setMovingId(null);
    fetchContacts();
  };

  const byStage = (stage: string) => contacts.filter(c => c.stage === stage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">CRM Pipeline</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">{contacts.length} contact{contacts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-[#F3EADB]/4 rounded-lg">
            {(["kanban","list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${
                  view === v ? "bg-[#E0337E] text-white" : "text-[#F3EADB]/40 hover:text-[#F3EADB]"
                }`}>{v === "kanban" ? "Kanban" : "Liste"}</button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 transition-colors">
            <Plus size={14} /> Nouveau contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="w-full pl-9 pr-4 py-2 bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/50 transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : view === "kanban" ? (
        /* ── Kanban ── */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.filter(s => s !== "lost").map(stage => {
            const cfg = STAGE_CONFIG[stage];
            const cols = byStage(stage);
            return (
              <div key={stage} className="flex-shrink-0 w-64">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-[#F3EADB]/8 text-[#F3EADB]/30">{cols.length}</span>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {cols.map(c => (
                    <div key={c.id} className="p-3 rounded-xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02] hover:border-[#F3EADB]/15 transition-all group">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-hanken text-sm text-[#F3EADB] truncate">{c.name}</p>
                          {c.company && <p className="font-mono text-[9px] text-[#F3EADB]/30 truncate">{c.company}</p>}
                        </div>
                        <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          {TYPE_LABELS[c.contact_type] ?? c.contact_type}
                        </span>
                      </div>
                      {c.email && <p className="font-mono text-[9px] text-[#F3EADB]/25 truncate mb-2">{c.email}</p>}
                      {c.next_followup_at && (
                        <p className="flex items-center gap-1 font-mono text-[9px] text-[#E0901E]/70">
                          <Calendar size={8} /> {new Date(c.next_followup_at).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                      {/* Stage arrows */}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {STAGES.filter(s => s !== stage && s !== "lost").slice(0, 3).map(nextStage => (
                          <button key={nextStage} onClick={() => moveStage(c.id, nextStage)}
                            disabled={movingId === c.id}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#F3EADB]/5 font-mono text-[8px] text-[#F3EADB]/30 hover:text-[#F3EADB]/70 hover:bg-[#F3EADB]/10 transition-colors disabled:opacity-30">
                            <ArrowRight size={7} /> {STAGE_CONFIG[nextStage]?.label.slice(0,6)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Lost column */}
          <div className="flex-shrink-0 w-52 opacity-50 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#E0533A]">Perdu</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-[#F3EADB]/5 text-[#F3EADB]/25">{byStage("lost").length}</span>
            </div>
            <div className="space-y-2">
              {byStage("lost").slice(0,3).map(c => (
                <div key={c.id} className="p-3 rounded-xl border border-[#F3EADB]/5 bg-transparent">
                  <p className="font-hanken text-sm text-[#F3EADB]/40 truncate">{c.name}</p>
                </div>
              ))}
              {byStage("lost").length > 3 && (
                <p className="font-mono text-[9px] text-[#F3EADB]/20 pl-3">+{byStage("lost").length - 3} autres</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── List view ── */
        <div className="space-y-2">
          {contacts.length === 0 ? (
            <div className="text-center py-20">
              <TrendingUp size={40} className="mx-auto mb-3 text-[#F3EADB]/10" />
              <p className="font-hanken text-[#F3EADB]/30">Aucun contact CRM</p>
            </div>
          ) : contacts.map(c => {
            const cfg = STAGE_CONFIG[c.stage] ?? STAGE_CONFIG.identified;
            return (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#F3EADB]/8 hover:border-[#F3EADB]/15 transition-all">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-fraunces text-sm"
                  style={{ background: cfg.bg, color: cfg.color }}>
                  {c.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-hanken text-sm text-[#F3EADB]">{c.name}</p>
                    {c.company && <span className="font-mono text-[9px] text-[#F3EADB]/30">{c.company}</span>}
                  </div>
                  <p className="font-mono text-[9px] text-[#F3EADB]/25">{c.email ?? "—"}</p>
                </div>
                <span className="font-mono text-[9px] px-2 py-1 rounded-full border"
                  style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}30` }}>
                  {cfg.label}
                </span>
                <span className="font-mono text-[9px] text-[#F3EADB]/25">{TYPE_LABELS[c.contact_type] ?? c.contact_type}</span>
                {c.next_followup_at && (
                  <span className="flex items-center gap-1 font-mono text-[9px] text-[#E0901E]/60">
                    <Calendar size={9} /> {new Date(c.next_followup_at).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create contact modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-[#0e061a] border border-[#F3EADB]/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-fraunces text-lg text-[#F3EADB]">Nouveau contact</h2>
              <button onClick={() => setShowForm(false)} className="text-[#F3EADB]/30 hover:text-[#F3EADB]"><X size={16} /></button>
            </div>
            {[
              { key: "name",    label: "Nom *",        placeholder: "Prénom Nom" },
              { key: "email",   label: "Email",         placeholder: "contact@example.com" },
              { key: "company", label: "Organisation",  placeholder: "Nom de l'entreprise" },
              { key: "source",  label: "Source",        placeholder: "LinkedIn, événement…" },
            ].map(f => (
              <div key={f.key}>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">{f.label}</label>
                <input
                  value={(newContact as Record<string, string>)[f.key]}
                  onChange={e => setNewContact(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50 transition-colors" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Type</label>
                <select value={newContact.contact_type} onChange={e => setNewContact(p => ({ ...p, contact_type: e.target.value }))}
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-mono text-xs text-[#F3EADB]/60 focus:outline-none focus:border-[#E0337E]/50 transition-colors">
                  {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Étape</label>
                <select value={newContact.stage} onChange={e => setNewContact(p => ({ ...p, stage: e.target.value }))}
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-mono text-xs text-[#F3EADB]/60 focus:outline-none focus:border-[#E0337E]/50 transition-colors">
                  {STAGES.map(s => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Notes</label>
              <textarea value={newContact.notes} onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))}
                rows={2} placeholder="Contexte, infos importantes…"
                className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50 resize-none transition-colors" />
            </div>
            <button onClick={createContact} disabled={!newContact.name || savingNew}
              className="w-full py-2.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 transition-colors disabled:opacity-40">
              {savingNew ? "Création…" : "Créer le contact"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
