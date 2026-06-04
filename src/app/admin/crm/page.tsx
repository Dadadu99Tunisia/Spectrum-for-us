"use client";
import { useEffect, useState, useCallback } from "react";
import {
  TrendingUp, Plus, Search, X, ArrowRight, Calendar,
  Mail, Phone, Globe, Tag, MessageSquare, Trash2,
  ChevronRight, ExternalLink, AtSign, Building2,
  MapPin, Clock, Edit3, Check,
} from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  contact_type: string;
  stage: string;
  source: string | null;
  notes: string | null;
  tags: string[] | null;
  next_followup_at: string | null;
  created_at: string;
  updated_at: string;
};

const STAGES = ["identified","contacted","interested","negotiating","converted","lost"] as const;
const STAGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  identified:  { label: "Identifié",   color: "#F3EADB", bg: "#F3EADB08" },
  contacted:   { label: "Contacté",    color: "#E0901E", bg: "#E0901E10" },
  interested:  { label: "Intéressé",   color: "#6D2DB5", bg: "#6D2DB510" },
  negotiating: { label: "Négociation", color: "#CF3F7C", bg: "#CF3F7C10" },
  converted:   { label: "Converti ✓",  color: "#1C9C95", bg: "#1C9C9510" },
  lost:        { label: "Perdu",       color: "#E0533A", bg: "#E0533A10" },
};
const TYPE_LABELS: Record<string, string> = {
  prospect_vendor: "Vendeur·se", prospect_buyer: "Acheteur·se", partner: "Partenaire",
  investor: "Investisseur·se", grant: "Subvention", foundation: "Fondation",
  media: "Média", ambassador: "Ambassadeur·rice",
};

// ── Extract structured info from notes field ──────────────────
function parseNotes(notes: string | null) {
  if (!notes) return { website: null, instagram: null, city: null, category: null, raw: null };
  const website  = notes.match(/Site:\s*(https?:\/\/[^\s.]+\.[^\s.,]+(?:\.[^\s.,]+)?)/i)?.[1]
                ?? notes.match(/Site:\s*([a-z0-9-]+\.[a-z]{2,}(?:\.[a-z]{2,})?)/i)?.[1] ?? null;
  const instagram = notes.match(/Instagram:\s*@?([\w.]+)/i)?.[1] ?? null;
  const city      = notes.match(/Ville:\s*([^.]+)/i)?.[1]?.trim() ?? null;
  const category  = notes.match(/Catégorie:\s*([^.]+)/i)?.[1]?.trim() ?? null;
  return { website, instagram, city, category, raw: notes };
}

// ── Contact Detail Panel ──────────────────────────────────────
function ContactPanel({
  contact, onClose, onUpdate, onDelete,
}: {
  contact: Contact;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Contact>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [note, setNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const cfg = STAGE_CONFIG[contact.stage] ?? STAGE_CONFIG.identified;
  const parsed = parseNotes(contact.notes);

  const startEdit = (field: string, val: string) => {
    setEditing(field);
    setEditVal(val ?? "");
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    await onUpdate(contact.id, { [editing]: editVal || null });
    setSaving(false);
    setEditing(null);
  };

  const moveStage = async (s: string) => {
    await onUpdate(contact.id, { stage: s });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0e061a] border-l border-[#F3EADB]/10 flex flex-col h-full overflow-hidden shadow-2xl">
        {/* Prism top */}
        <div className="h-[2px] shrink-0" style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#F3EADB]/8 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {editing === "name" ? (
                <div className="flex items-center gap-2">
                  <input autoFocus value={editVal} onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                    className="flex-1 bg-[#F3EADB]/8 border border-[#E0337E]/40 rounded-lg px-2 py-1 font-fraunces text-lg text-[#F3EADB] focus:outline-none" />
                  <button onClick={saveEdit} disabled={saving} className="text-[#1C9C95]"><Check size={16} /></button>
                </div>
              ) : (
                <button onClick={() => startEdit("name", contact.name)}
                  className="group flex items-center gap-2">
                  <h2 className="font-fraunces text-xl text-[#F3EADB] truncate">{contact.name}</h2>
                  <Edit3 size={12} className="text-[#F3EADB]/20 group-hover:text-[#F3EADB]/50 transition-colors shrink-0" />
                </button>
              )}
              {contact.company && (
                <p className="font-mono text-xs text-[#F3EADB]/35 mt-0.5 flex items-center gap-1">
                  <Building2 size={10} /> {contact.company}
                </p>
              )}
            </div>
            <button onClick={onClose} className="text-[#F3EADB]/30 hover:text-[#F3EADB] transition-colors shrink-0 mt-1">
              <X size={18} />
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="font-mono text-[9px] px-2 py-1 rounded-full border"
              style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}30` }}>
              {cfg.label}
            </span>
            <span className="font-mono text-[9px] px-2 py-1 rounded-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 text-[#F3EADB]/50">
              {TYPE_LABELS[contact.contact_type] ?? contact.contact_type}
            </span>
            {contact.source && (
              <span className="font-mono text-[9px] px-2 py-1 rounded-full bg-[#6D2DB5]/10 border border-[#6D2DB5]/20 text-[#6D2DB5]/70">
                {contact.source}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Contact info */}
          <div className="space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25 mb-3">Contact</p>

            {/* Email */}
            <InfoRow
              icon={<Mail size={13} />}
              label="Email"
              value={contact.email}
              field="email"
              editing={editing}
              editVal={editVal}
              onEdit={startEdit}
              onSave={saveEdit}
              onCancel={() => setEditing(null)}
              onChange={setEditVal}
              saving={saving}
              renderValue={v => (
                <a href={`mailto:${v}`} className="text-[#E0337E] hover:underline flex items-center gap-1">
                  {v} <ExternalLink size={10} />
                </a>
              )}
            />

            {/* Phone */}
            <InfoRow
              icon={<Phone size={13} />}
              label="Téléphone"
              value={contact.phone}
              field="phone"
              editing={editing}
              editVal={editVal}
              onEdit={startEdit}
              onSave={saveEdit}
              onCancel={() => setEditing(null)}
              onChange={setEditVal}
              saving={saving}
              renderValue={v => (
                <a href={`tel:${v}`} className="text-[#F3EADB]/70 hover:text-[#F3EADB]">{v}</a>
              )}
            />

            {/* Website from notes */}
            {parsed.website && (
              <div className="flex items-center gap-3 py-1.5">
                <span className="text-[#F3EADB]/25 shrink-0"><Globe size={13} /></span>
                <a href={parsed.website.startsWith("http") ? parsed.website : `https://${parsed.website}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-hanken text-sm text-[#1C9C95] hover:underline flex items-center gap-1 truncate">
                  {parsed.website} <ExternalLink size={10} />
                </a>
              </div>
            )}

            {/* Instagram from notes */}
            {parsed.instagram && (
              <div className="flex items-center gap-3 py-1.5">
                <span className="text-[#F3EADB]/25 shrink-0"><AtSign size={13} /></span>
                <a href={`https://instagram.com/${parsed.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="font-hanken text-sm text-[#CF3F7C] hover:underline flex items-center gap-1">
                  @{parsed.instagram} <ExternalLink size={10} />
                </a>
              </div>
            )}

            {/* City from notes */}
            {parsed.city && (
              <div className="flex items-center gap-3 py-1.5">
                <span className="text-[#F3EADB]/25 shrink-0"><MapPin size={13} /></span>
                <span className="font-hanken text-sm text-[#F3EADB]/60">{parsed.city}</span>
              </div>
            )}

            {/* Category from notes */}
            {parsed.category && (
              <div className="flex items-center gap-3 py-1.5">
                <span className="text-[#F3EADB]/25 shrink-0"><Tag size={13} /></span>
                <span className="font-hanken text-sm text-[#F3EADB]/60">{parsed.category}</span>
              </div>
            )}
          </div>

          {/* Follow-up */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25 mb-3">Suivi</p>
            <InfoRow
              icon={<Calendar size={13} />}
              label="Prochain suivi"
              value={contact.next_followup_at ? new Date(contact.next_followup_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null}
              field="next_followup_at"
              editing={editing}
              editVal={editVal}
              onEdit={(f) => startEdit(f, contact.next_followup_at?.slice(0, 10) ?? "")}
              onSave={saveEdit}
              onCancel={() => setEditing(null)}
              onChange={setEditVal}
              saving={saving}
              inputType="date"
            />
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25">Notes</p>
              <button onClick={() => setAddingNote(!addingNote)}
                className="font-mono text-[9px] text-[#E0337E]/60 hover:text-[#E0337E] transition-colors">
                + Ajouter
              </button>
            </div>

            {addingNote && (
              <div className="mb-3 space-y-2">
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                  placeholder="Ajouter une note…"
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/40 resize-none transition-colors" />
                <div className="flex gap-2">
                  <button onClick={async () => {
                    const newNotes = contact.notes ? `${contact.notes}\n\n[${new Date().toLocaleDateString("fr-FR")}] ${note}` : note;
                    await onUpdate(contact.id, { notes: newNotes });
                    setNote(""); setAddingNote(false);
                  }} className="flex-1 py-1.5 rounded-lg bg-[#E0337E] text-white font-hanken text-xs">
                    Enregistrer
                  </button>
                  <button onClick={() => { setNote(""); setAddingNote(false); }}
                    className="px-3 py-1.5 rounded-lg border border-[#F3EADB]/10 text-[#F3EADB]/40 font-hanken text-xs hover:text-[#F3EADB]">
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {contact.notes ? (
              <div className="bg-[#F3EADB]/[0.03] border border-[#F3EADB]/8 rounded-xl p-3">
                <p className="font-hanken text-xs text-[#F3EADB]/55 leading-relaxed whitespace-pre-wrap">
                  {contact.notes}
                </p>
              </div>
            ) : (
              <p className="font-hanken text-xs text-[#F3EADB]/20 italic">Aucune note</p>
            )}
          </div>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25 mb-3">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map(t => (
                  <span key={t} className="font-mono text-[9px] px-2 py-1 rounded-full bg-[#6D2DB5]/10 border border-[#6D2DB5]/20 text-[#6D2DB5]/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stage change */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25 mb-3">Changer le statut</p>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.filter(s => s !== contact.stage).map(s => {
                const c = STAGE_CONFIG[s];
                return (
                  <button key={s} onClick={() => moveStage(s)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-hanken text-xs transition-all hover:scale-105"
                    style={{ borderColor: `${c.color}25`, color: c.color, background: c.bg }}>
                    <ArrowRight size={10} /> {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="pt-2 border-t border-[#F3EADB]/6 space-y-1">
            <p className="flex items-center gap-2 font-mono text-[9px] text-[#F3EADB]/20">
              <Clock size={9} /> Créé le {new Date(contact.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="flex items-center gap-2 font-mono text-[9px] text-[#F3EADB]/20">
              <Clock size={9} /> Mis à jour le {new Date(contact.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#F3EADB]/8 px-5 py-3">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <p className="font-hanken text-xs text-red-400 flex-1">Supprimer ce contact ?</p>
              <button onClick={() => onDelete(contact.id)}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 font-hanken text-xs hover:bg-red-500/30 transition-colors">
                Confirmer
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 rounded-lg border border-[#F3EADB]/10 text-[#F3EADB]/40 font-hanken text-xs">
                Annuler
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-[#F3EADB]/20 hover:text-red-400 transition-colors font-hanken text-xs">
              <Trash2 size={12} /> Supprimer ce contact
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Reusable editable info row ────────────────────────────────
function InfoRow({
  icon, label, value, field, editing, editVal,
  onEdit, onSave, onCancel, onChange, saving,
  renderValue, inputType = "text",
}: {
  icon: React.ReactNode; label: string; value: string | null; field: string;
  editing: string | null; editVal: string;
  onEdit: (f: string, v: string) => void;
  onSave: () => void; onCancel: () => void;
  onChange: (v: string) => void;
  saving: boolean;
  renderValue?: (v: string) => React.ReactNode;
  inputType?: string;
}) {
  const isEditing = editing === field;
  return (
    <div className="flex items-center gap-3 py-1.5 group">
      <span className="text-[#F3EADB]/25 shrink-0">{icon}</span>
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            autoFocus type={inputType} value={editVal} onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }}
            className="flex-1 bg-[#F3EADB]/8 border border-[#E0337E]/40 rounded-lg px-2 py-1 font-hanken text-sm text-[#F3EADB] focus:outline-none"
          />
          <button onClick={onSave} disabled={saving} className="text-[#1C9C95] shrink-0"><Check size={14} /></button>
          <button onClick={onCancel} className="text-[#F3EADB]/30 shrink-0"><X size={12} /></button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
          {value ? (
            <span className="font-hanken text-sm text-[#F3EADB]/70 truncate">
              {renderValue ? renderValue(value) : value}
            </span>
          ) : (
            <span className="font-hanken text-xs text-[#F3EADB]/20 italic">{label}…</span>
          )}
          <button onClick={() => onEdit(field, value ?? "")}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Edit3 size={11} className="text-[#F3EADB]/30 hover:text-[#F3EADB]/60" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main CRM Page ─────────────────────────────────────────────
export default function CRMPage() {
  const [contacts, setContacts]   = useState<Contact[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [selected, setSelected]   = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    name: "", email: "", company: "", contact_type: "prospect_vendor",
    stage: "identified", source: "", notes: "",
  });
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)      params.set("search", search);
    if (stageFilter) params.set("stage", stageFilter);
    const res  = await fetch(`/api/admin/crm?${params}`);
    const json = await res.json();
    setContacts(json.data ?? []);
    // Refresh selected if open
    if (selected) {
      const updated = (json.data ?? []).find((c: Contact) => c.id === selected.id);
      if (updated) setSelected(updated);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const updateContact = async (id: string, patch: Partial<Contact>) => {
    await fetch(`/api/admin/crm/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await fetchContacts();
  };

  const deleteContact = async (id: string) => {
    await fetch(`/api/admin/crm/${id}`, { method: "DELETE" });
    setSelected(null);
    await fetchContacts();
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

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-4 py-2 bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/50 transition-colors" />
        </div>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          className="bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-mono text-xs text-[#F3EADB]/60 focus:outline-none">
          <option value="">Tous les statuts</option>
          {STAGES.map(s => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
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
                <div className="space-y-2 min-h-[80px]">
                  {cols.map(c => {
                    const parsed = parseNotes(c.notes);
                    return (
                      <button key={c.id} onClick={() => setSelected(c)}
                        className="w-full text-left p-3 rounded-xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02] hover:border-[#F3EADB]/20 hover:bg-[#F3EADB]/[0.04] transition-all group">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="font-hanken text-sm text-[#F3EADB] truncate">{c.name}</p>
                          <ChevronRight size={12} className="text-[#F3EADB]/20 group-hover:text-[#F3EADB]/50 shrink-0 mt-0.5 transition-colors" />
                        </div>
                        {c.company && <p className="font-mono text-[9px] text-[#F3EADB]/30 truncate mb-1">{c.company}</p>}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full"
                            style={{ background: cfg.bg, color: cfg.color }}>
                            {TYPE_LABELS[c.contact_type]?.slice(0, 10) ?? c.contact_type}
                          </span>
                        </div>
                        {c.email && (
                          <p className="font-mono text-[9px] text-[#F3EADB]/25 truncate mt-1.5 flex items-center gap-1">
                            <Mail size={8} /> {c.email}
                          </p>
                        )}
                        {parsed.website && !c.email && (
                          <p className="font-mono text-[9px] text-[#1C9C95]/50 truncate mt-1.5 flex items-center gap-1">
                            <Globe size={8} /> {parsed.website}
                          </p>
                        )}
                        {c.next_followup_at && (
                          <p className="flex items-center gap-1 font-mono text-[9px] text-[#E0901E]/70 mt-1.5">
                            <Calendar size={8} /> {new Date(c.next_followup_at).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Lost */}
          <div className="flex-shrink-0 w-52 opacity-50 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#E0533A]">Perdu</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-[#F3EADB]/5 text-[#F3EADB]/25">{byStage("lost").length}</span>
            </div>
            {byStage("lost").slice(0,3).map(c => (
              <button key={c.id} onClick={() => setSelected(c)}
                className="w-full text-left p-3 mb-2 rounded-xl border border-[#F3EADB]/5 hover:border-[#F3EADB]/10 transition-colors">
                <p className="font-hanken text-sm text-[#F3EADB]/40 truncate">{c.name}</p>
              </button>
            ))}
            {byStage("lost").length > 3 && (
              <p className="font-mono text-[9px] text-[#F3EADB]/20 pl-3">+{byStage("lost").length - 3} autres</p>
            )}
          </div>
        </div>
      ) : (
        /* ── List view ── */
        <div className="space-y-1.5">
          {contacts.length === 0 ? (
            <div className="text-center py-20">
              <TrendingUp size={40} className="mx-auto mb-3 text-[#F3EADB]/10" />
              <p className="font-hanken text-[#F3EADB]/30">Aucun contact CRM</p>
            </div>
          ) : contacts.map(c => {
            const cfg = STAGE_CONFIG[c.stage] ?? STAGE_CONFIG.identified;
            const parsed = parseNotes(c.notes);
            return (
              <button key={c.id} onClick={() => setSelected(c)}
                className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-[#F3EADB]/8 hover:border-[#F3EADB]/18 hover:bg-[#F3EADB]/[0.02] transition-all group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-fraunces text-sm"
                  style={{ background: cfg.bg, color: cfg.color }}>
                  {c.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-hanken text-sm text-[#F3EADB]">{c.name}</p>
                    {c.company && <span className="font-mono text-[9px] text-[#F3EADB]/30 truncate">{c.company}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {c.email && <span className="font-mono text-[9px] text-[#F3EADB]/25 flex items-center gap-1"><Mail size={8} />{c.email}</span>}
                    {parsed.website && <span className="font-mono text-[9px] text-[#1C9C95]/40 flex items-center gap-1"><Globe size={8} />{parsed.website}</span>}
                  </div>
                </div>
                <span className="font-mono text-[9px] px-2 py-1 rounded-full border shrink-0"
                  style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}30` }}>
                  {cfg.label}
                </span>
                <span className="font-mono text-[9px] text-[#F3EADB]/25 shrink-0 hidden sm:block">
                  {TYPE_LABELS[c.contact_type] ?? c.contact_type}
                </span>
                <ChevronRight size={14} className="text-[#F3EADB]/15 group-hover:text-[#F3EADB]/40 shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      )}

      {/* Contact detail panel */}
      {selected && (
        <ContactPanel
          contact={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateContact}
          onDelete={deleteContact}
        />
      )}

      {/* Create contact modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-[#0e061a] border border-[#F3EADB]/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-fraunces text-lg text-[#F3EADB]">Nouveau contact</h2>
              <button onClick={() => setShowForm(false)} className="text-[#F3EADB]/30 hover:text-[#F3EADB]"><X size={16} /></button>
            </div>
            {[
              { key: "name",    label: "Nom *",       placeholder: "Nom / Marque" },
              { key: "email",   label: "Email",        placeholder: "contact@example.com" },
              { key: "company", label: "Organisation", placeholder: "Nom de l'entreprise" },
              { key: "source",  label: "Source",       placeholder: "etsy, google, événement…" },
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
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Notes</label>
              <textarea value={newContact.notes} onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))}
                rows={2} placeholder="Site web, Instagram, ville, catégorie…"
                className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50 resize-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Type</label>
                <select value={newContact.contact_type} onChange={e => setNewContact(p => ({ ...p, contact_type: e.target.value }))}
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-mono text-xs text-[#F3EADB]/60 focus:outline-none">
                  {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Étape</label>
                <select value={newContact.stage} onChange={e => setNewContact(p => ({ ...p, stage: e.target.value }))}
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-mono text-xs text-[#F3EADB]/60 focus:outline-none">
                  {STAGES.map(s => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
                </select>
              </div>
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
