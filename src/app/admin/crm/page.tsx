"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  TrendingUp, Plus, Search, X, ArrowRight, Calendar,
  Mail, Phone, Globe, Tag, MessageSquare, Trash2,
  ChevronRight, ExternalLink, AtSign, Building2,
  MapPin, Clock, Edit3, Check, Sparkles, Send,
  RefreshCw, LayoutGrid, List, Copy, CheckCheck,
  AlertCircle,
} from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

// ─── Types ────────────────────────────────────────────────────────────────────
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

type Interaction = {
  id: string;
  type: string | null;
  subject: string | null;
  content: string | null;
  created_at: string;
};

// ─── Stage config · aligned with DB enum ─────────────────────────────────────
const STAGES = ["identified","qualified","nurturing","contacted","partner","vendor","rejected","closed"] as const;
type Stage = typeof STAGES[number];

const STAGE_CFG: Record<Stage, { label: string; color: string; bg: string; dot: string }> = {
  identified: { label: "Identifié",   color: "#a78bfa", bg: "rgba(167,139,250,.08)", dot: "#a78bfa" },
  qualified:  { label: "Qualifié",    color: "#34d399", bg: "rgba(52,211,153,.08)",  dot: "#34d399" },
  nurturing:  { label: "Nurturing",   color: "#fbbf24", bg: "rgba(251,191,36,.08)",  dot: "#fbbf24" },
  contacted:  { label: "Contacté",    color: "#60a5fa", bg: "rgba(96,165,250,.08)",  dot: "#60a5fa" },
  partner:    { label: "Partenaire ✓",color: "#2323C4", bg: "rgba(28,156,149,.08)", dot: "#2323C4" },
  vendor:     { label: "Vendeur·se ✦",color: "#16A06A", bg: "rgba(22,160,106,.10)", dot: "#16A06A" },
  rejected:   { label: "Rejeté",      color: "#f87171", bg: "rgba(248,113,113,.08)", dot: "#f87171" },
  closed:     { label: "Fermé",       color: "#6b7280", bg: "rgba(107,114,128,.08)", dot: "#6b7280" },
};

// Aligné sur l'enum DB `crm_type` (colonne crm_contacts.contact_type) :
// prospect_vendor, prospect_creator, prospect_association, prospect_buyer,
// partner, investor, grant, foundation, media, ambassador.
const TYPE_LABELS: Record<string, string> = {
  prospect_vendor:      "Vendeur·se",
  prospect_creator:     "Créateur·ice",
  prospect_association: "Association",
  prospect_buyer:       "Acheteur·se",
  partner:              "Partenaire",
  investor:             "Investisseur·se",
  grant:                "Subvention",
  foundation:           "Fondation",
  media:                "Média",
  ambassador:           "Ambassadeur·rice",
};

// Segment definitions · each tab filters by these contact_types (tous valides en enum)
const SEGMENTS = [
  { id: "all",          label: "Tout le pipeline",  icon: "◈",  types: [] as string[], color: "#101014", goal: 500, goalLabel: "contacts" },
  { id: "associations", label: "Associations",       icon: "🏳️‍🌈", types: ["prospect_association","foundation","grant"], color: "#a78bfa", goal: 500, goalLabel: "organisations" },
  { id: "createurs",    label: "Créateur·ices",      icon: "✦",  types: ["prospect_creator","prospect_vendor","ambassador"], color: "#FF2DA0", goal: 200, goalLabel: "créateurs" },
  { id: "partenaires",  label: "Partenaires",        icon: "⬡",  types: ["partner","investor","media"], color: "#2323C4", goal: 50, goalLabel: "partenaires" },
] as const;
type SegmentId = typeof SEGMENTS[number]["id"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseNotes(notes: string | null) {
  if (!notes) return { website: null, instagram: null, city: null, category: null, outreachMessage: null };
  const website  = notes.match(/Site:\s*(https?:\/\/[^\s]+)/i)?.[1]
                ?? notes.match(/Site:\s*([a-z0-9-]+\.[a-z]{2,}(?:\.[a-z]{2,})?)/i)?.[1] ?? null;
  const instagram = notes.match(/Instagram:\s*@?([\w.]+)/i)?.[1] ?? null;
  const city      = notes.match(/Ville:\s*([^\n.]+)/i)?.[1]?.trim() ?? null;
  const category  = notes.match(/Catégorie:\s*([^\n.]+)/i)?.[1]?.trim() ?? null;
  // Extract last outreach message
  const msgMatch  = notes.match(/\[MESSAGE PRÊT[^\]]*\]\n([\s\S]+?)(?=\n\[|$)/);
  const outreachMessage = msgMatch?.[1]?.trim() ?? null;
  return { website, instagram, city, category, outreachMessage };
}

function getAiScore(tags: string[] | null): number | null {
  if (!tags) return null;
  const t = tags.find(t => t.startsWith("ai-score:"));
  return t ? Number(t.split(":")[1]) : null;
}

function ScoreDot({ score }: { score: number }) {
  const colors = ["","#f87171","#fb923c","#fbbf24","#34d399","#a78bfa"];
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px]" style={{ color: colors[score] ?? "#101014" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full inline-block transition-all"
          style={{ background: i < score ? (colors[score] ?? "#101014") : "rgba(243,234,219,.12)" }} />
      ))}
      <span className="ml-0.5">{score}/5</span>
    </span>
  );
}

// ─── Pipeline stats bar ────────────────────────────────────────────────────────
function PipelineBar({ contacts }: { contacts: Contact[] }) {
  const total = contacts.length;
  if (!total) return null;

  const counts = STAGES.reduce((acc, s) => {
    acc[s] = contacts.filter(c => c.stage === s).length;
    return acc;
  }, {} as Record<Stage, number>);

  const active = ["identified","qualified","nurturing","contacted","partner"] as Stage[];

  return (
    <div className="bg-white border border-[#101014]/8 rounded-2xl p-5">
      {/* Bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-px mb-5">
        {active.map(s => {
          const pct = (counts[s] / total) * 100;
          if (!pct) return null;
          return (
            <div key={s} style={{ width: `${pct}%`, background: STAGE_CFG[s].dot }}
              className="transition-all duration-700 rounded-sm" title={`${STAGE_CFG[s].label}: ${counts[s]}`} />
          );
        })}
      </div>
      {/* Counters */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {STAGES.map(s => (
          <div key={s} className="text-center">
            <p className="font-fraunces text-xl" style={{ color: STAGE_CFG[s].color }}>{counts[s]}</p>
            <p className="font-mono text-[9px] text-[#101014]/30 mt-0.5 leading-tight">{STAGE_CFG[s].label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Action Button ──────────────────────────────────────────────────────────
type AgentStatus = "idle" | "loading" | "done" | "error";

function AgentButton({
  icon, label, loadingLabel, status, onClick, variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  loadingLabel: string;
  status: AgentStatus;
  onClick: () => void;
  variant?: "default" | "primary";
}) {
  const base = "flex items-center gap-2 px-3 py-2 rounded-xl font-hanken text-xs transition-all disabled:opacity-40";
  const styles = {
    default: "bg-[#101014]/5 border border-[#101014]/10 text-[#101014]/60 hover:bg-[#101014]/8 hover:text-[#101014]",
    primary: "bg-[#7A2BF0]/20 border border-[#7A2BF0]/30 text-[#a78bfa] hover:bg-[#7A2BF0]/30",
  };
  return (
    <button onClick={onClick} disabled={status === "loading"}
      className={`${base} ${styles[variant]}`}>
      {status === "loading" ? (
        <RefreshCw size={12} className="animate-spin" />
      ) : status === "done" ? (
        <CheckCheck size={12} className="text-[#34d399]" />
      ) : status === "error" ? (
        <AlertCircle size={12} className="text-[#f87171]" />
      ) : icon}
      {status === "loading" ? loadingLabel : label}
    </button>
  );
}

// ─── Contact Detail Panel ─────────────────────────────────────────────────────
function ContactPanel({
  contact, onClose, onUpdate, onDelete, onRefresh,
}: {
  contact: Contact;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Contact>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: (id: string) => Promise<Contact | null>;
}) {
  const [local, setLocal]         = useState<Contact>(contact);
  const [editing, setEditing]     = useState<string | null>(null);
  const [editVal, setEditVal]     = useState("");
  const [saving, setSaving]       = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [note, setNote]           = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [qualifyStatus, setQualifyStatus] = useState<AgentStatus>("idle");
  const [outreachStatus, setOutreachStatus] = useState<AgentStatus>("idle");
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [timeline, setTimeline] = useState<Interaction[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadTimeline = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/crm/${id}`, { method: "GET" });
      const json = await res.json();
      setTimeline(json.data ?? []);
    } catch { setTimeline([]); }
  }, []);

  // Sync local state + timeline when parent contact changes
  useEffect(() => { setLocal(contact); loadTimeline(contact.id); }, [contact, loadTimeline]);

  const cfg    = STAGE_CFG[local.stage as Stage] ?? STAGE_CFG.identified;
  const parsed = parseNotes(local.notes);
  const score  = getAiScore(local.tags);

  const startEdit = (field: string, val: string) => { setEditing(field); setEditVal(val ?? ""); };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    const patch = { [editing]: editVal || null };
    await onUpdate(local.id, patch);
    setLocal(prev => ({ ...prev, ...patch }));
    setSaving(false);
    setEditing(null);
  };

  const moveStage = async (s: Stage) => {
    await onUpdate(local.id, { stage: s });
    setLocal(prev => ({ ...prev, stage: s }));
  };

  const runQualify = async () => {
    setQualifyStatus("loading");
    try {
      const res  = await fetch(`/api/admin/crm/${local.id}/qualify`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      if (json.data?.contact) setLocal(json.data.contact);
      setQualifyStatus("done");
    } catch {
      setQualifyStatus("error");
    }
  };

  const runOutreach = async () => {
    setOutreachStatus("loading");
    try {
      const res  = await fetch(`/api/admin/crm/${local.id}/outreach`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      if (json.data?.contact) setLocal(json.data.contact);
      setOutreachStatus("done");
    } catch {
      setOutreachStatus("error");
    }
  };

  const copyMessage = async (msg: string) => {
    await navigator.clipboard.writeText(msg);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setAddingNote(false);
    const res = await fetch(`/api/admin/crm/${local.id}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "note", content: note.trim() }),
    });
    setNote("");
    if (res.ok) loadTimeline(local.id);
    else { const j = await res.json().catch(() => ({})); alert("Note non enregistrée : " + (j.error ?? res.status)); }
  };

  const INTERACTION_META: Record<string, { icon: string; label: string }> = {
    note:         { icon: "📝", label: "Note" },
    stage_change: { icon: "🔀", label: "Étape" },
    qualify:      { icon: "🤖", label: "Qualification IA" },
    outreach:     { icon: "✉️", label: "Message généré" },
    email:        { icon: "✉️", label: "Email" },
  };

  const updatedParsed = parseNotes(local.notes);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div ref={panelRef}
        className="relative z-10 w-full max-w-[420px] bg-white border-l border-[#101014]/8 flex flex-col h-full shadow-2xl"
        style={{ boxShadow: "-20px 0 60px rgba(0,0,0,.6)" }}>

        {/* Prism accent bar */}
        <div className="h-[3px] shrink-0"
          style={{ background: `linear-gradient(90deg,${cfg.color},${cfg.dot}88,${cfg.color})` }} />

        {/* ── Header ── */}
        <div className="px-5 pt-4 pb-4 border-b border-[#101014]/6 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {editing === "name" ? (
                <div className="flex items-center gap-2">
                  <input autoFocus value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                    className="flex-1 bg-[#101014]/8 border border-[#7A2BF0]/50 rounded-lg px-2 py-1 font-fraunces text-lg text-[#101014] focus:outline-none focus:border-[#a78bfa]" />
                  <button onClick={saveEdit} disabled={saving} className="text-[#34d399]"><Check size={16} /></button>
                </div>
              ) : (
                <button onClick={() => startEdit("name", local.name)}
                  className="group flex items-center gap-2 text-left">
                  <h2 className="font-fraunces text-xl text-[#101014] leading-tight">{local.name}</h2>
                  <Edit3 size={11} className="text-[#101014]/15 group-hover:text-[#101014]/50 transition-colors shrink-0 mt-0.5" />
                </button>
              )}
              {local.company && (
                <p className="font-mono text-[10px] text-[#101014]/30 mt-1 flex items-center gap-1">
                  <Building2 size={9} /> {local.company}
                </p>
              )}
            </div>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#101014]/5 hover:bg-[#101014]/10 text-[#101014]/40 hover:text-[#101014] transition-all shrink-0">
              <X size={14} />
            </button>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full border"
              style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}30` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
              {cfg.label}
            </span>
            <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-[#101014]/5 border border-[#101014]/8 text-[#101014]/40">
              {TYPE_LABELS[local.contact_type] ?? local.contact_type}
            </span>
            {score !== null && <ScoreDot score={score} />}
            {local.source && (
              <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-[#7A2BF0]/10 border border-[#7A2BF0]/20 text-[#a78bfa]/60">
                {local.source}
              </span>
            )}
          </div>
        </div>

        {/* ── AI Actions ── */}
        <div className="px-5 py-3 border-b border-[#101014]/6 bg-[#7A2BF0]/5 shrink-0">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#a78bfa]/50 mb-2.5">Actions IA</p>
          <div className="flex gap-2 flex-wrap">
            <AgentButton
              icon={<Sparkles size={12} />}
              label="Qualifier"
              loadingLabel="Qualification…"
              status={qualifyStatus}
              onClick={runQualify}
              variant="primary"
            />
            <AgentButton
              icon={<Send size={12} />}
              label="Générer message"
              loadingLabel="Génération…"
              status={outreachStatus}
              onClick={runOutreach}
            />
          </div>
          {(qualifyStatus === "error" || outreachStatus === "error") && (
            <p className="font-mono text-[10px] text-[#f87171]/70 mt-2 flex items-center gap-1">
              <AlertCircle size={10} /> Ajoute OPENAI_API_KEY dans .env.local
            </p>
          )}
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Contact info section */}
          <div className="px-5 pt-4 pb-3">
            <SectionTitle>Contact</SectionTitle>
            <div className="space-y-0.5 mt-2">
              <InfoRow icon={<Mail size={12} />} label="Email"
                value={local.email} field="email"
                editing={editing} editVal={editVal}
                onEdit={startEdit} onSave={saveEdit} onCancel={() => setEditing(null)}
                onChange={setEditVal} saving={saving}
                renderValue={v => (
                  <a href={`mailto:${v}`} className="text-[#60a5fa] hover:underline flex items-center gap-1 truncate">
                    {v}<ExternalLink size={9} className="shrink-0" />
                  </a>
                )} />

              <InfoRow icon={<Phone size={12} />} label="Téléphone"
                value={local.phone} field="phone"
                editing={editing} editVal={editVal}
                onEdit={startEdit} onSave={saveEdit} onCancel={() => setEditing(null)}
                onChange={setEditVal} saving={saving}
                renderValue={v => <a href={`tel:${v}`} className="text-[#101014]/70 hover:text-[#101014]">{v}</a>}
              />

              {updatedParsed.website && (
                <div className="flex items-center gap-3 py-1.5">
                  <span className="text-[#101014]/20 shrink-0"><Globe size={12} /></span>
                  <a href={updatedParsed.website.startsWith("http") ? updatedParsed.website : `https://${updatedParsed.website}`}
                    target="_blank" rel="noopener noreferrer"
                    className="font-hanken text-sm text-[#2323C4] hover:underline flex items-center gap-1 truncate">
                    {updatedParsed.website}<ExternalLink size={9} className="shrink-0" />
                  </a>
                </div>
              )}

              {updatedParsed.instagram && (
                <div className="flex items-center gap-3 py-1.5">
                  <span className="text-[#101014]/20 shrink-0"><AtSign size={12} /></span>
                  <a href={`https://instagram.com/${updatedParsed.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="font-hanken text-sm text-[#FF2DA0] hover:underline flex items-center gap-1">
                    @{updatedParsed.instagram}<ExternalLink size={9} className="shrink-0" />
                  </a>
                </div>
              )}

              {updatedParsed.city && (
                <div className="flex items-center gap-3 py-1.5">
                  <span className="text-[#101014]/20 shrink-0"><MapPin size={12} /></span>
                  <span className="font-hanken text-sm text-[#101014]/55">{updatedParsed.city}</span>
                </div>
              )}

              {updatedParsed.category && (
                <div className="flex items-center gap-3 py-1.5">
                  <span className="text-[#101014]/20 shrink-0"><Tag size={12} /></span>
                  <span className="font-hanken text-sm text-[#101014]/55">{updatedParsed.category}</span>
                </div>
              )}
            </div>
          </div>

          {/* Outreach message (if generated) */}
          {updatedParsed.outreachMessage && (
            <div className="px-5 pb-4">
              <div className="bg-[#60a5fa]/5 border border-[#60a5fa]/15 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#60a5fa]/60 flex items-center gap-1.5">
                    <Send size={9} /> Message prêt
                  </p>
                  <button onClick={() => copyMessage(updatedParsed.outreachMessage!)}
                    className="flex items-center gap-1 font-mono text-[9px] text-[#60a5fa]/50 hover:text-[#60a5fa] transition-colors">
                    {copiedMsg ? <><CheckCheck size={9} /> Copié!</> : <><Copy size={9} /> Copier</>}
                  </button>
                </div>
                <p className="font-hanken text-xs text-[#101014]/65 leading-relaxed whitespace-pre-wrap">
                  {updatedParsed.outreachMessage}
                </p>
              </div>
            </div>
          )}

          {/* Follow-up */}
          <div className="px-5 pb-4">
            <SectionTitle>Suivi</SectionTitle>
            <div className="mt-2">
              <InfoRow icon={<Calendar size={12} />} label="Prochain suivi"
                value={local.next_followup_at
                  ? new Date(local.next_followup_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                  : null}
                field="next_followup_at"
                editing={editing} editVal={editVal}
                onEdit={(f) => startEdit(f, local.next_followup_at?.slice(0, 10) ?? "")}
                onSave={saveEdit} onCancel={() => setEditing(null)}
                onChange={setEditVal} saving={saving}
                inputType="date" />
            </div>
          </div>

          {/* Stage change */}
          <div className="px-5 pb-4">
            <SectionTitle>Changer le statut</SectionTitle>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {STAGES.filter(s => s !== local.stage).map(s => {
                const c = STAGE_CFG[s];
                return (
                  <button key={s} onClick={() => moveStage(s)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-hanken text-xs transition-all hover:scale-105 active:scale-95"
                    style={{ borderColor: `${c.color}25`, color: c.color, background: c.bg }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activité · timeline d'interactions */}
          <div className="px-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <SectionTitle>Activité</SectionTitle>
              <button onClick={() => setAddingNote(!addingNote)}
                className="font-mono text-[9px] text-[#a78bfa]/50 hover:text-[#a78bfa] transition-colors">
                {addingNote ? "Annuler" : "+ Note"}
              </button>
            </div>

            {addingNote && (
              <div className="mb-3 space-y-2">
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} autoFocus
                  placeholder="Ajouter une note…"
                  className="w-full bg-[#101014]/4 border border-[#101014]/10 rounded-xl px-3 py-2.5 font-hanken text-sm text-[#101014] placeholder-[#101014]/20 focus:outline-none focus:border-[#a78bfa]/40 resize-none transition-colors" />
                <div className="flex gap-2">
                  <button onClick={addNote}
                    className="flex-1 py-2 rounded-xl bg-[#7A2BF0] text-white font-hanken text-xs hover:bg-[#7A2BF0]/90 transition-colors">
                    Enregistrer
                  </button>
                  <button onClick={() => { setNote(""); setAddingNote(false); }}
                    className="px-4 py-2 rounded-xl border border-[#101014]/10 text-[#101014]/40 font-hanken text-xs hover:text-[#101014] transition-colors">
                    ✕
                  </button>
                </div>
              </div>
            )}

            {timeline.length > 0 ? (
              <div className="relative pl-4 max-h-72 overflow-y-auto">
                <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-[#101014]/8" />
                <div className="space-y-3">
                  {timeline.map(it => {
                    const meta = INTERACTION_META[it.type ?? "note"] ?? INTERACTION_META.note;
                    return (
                      <div key={it.id} className="relative">
                        <span className="absolute -left-4 top-1 text-[10px]">{meta.icon}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#101014]/35">{meta.label}</span>
                          <span className="font-mono text-[9px] text-[#101014]/25">
                            {new Date(it.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        {it.content && <p className="font-hanken text-xs text-[#101014]/60 leading-relaxed whitespace-pre-wrap mt-0.5">{it.content}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="font-hanken text-xs text-[#101014]/20 italic">Aucune activité pour l&apos;instant</p>
            )}

            {/* Notes importées (legacy, métadonnées prospection) */}
            {local.notes && (
              <details className="mt-3">
                <summary className="font-mono text-[9px] uppercase tracking-wider text-[#101014]/30 cursor-pointer hover:text-[#101014]/50">Notes importées</summary>
                <div className="bg-[#101014]/[0.025] border border-[#101014]/6 rounded-xl p-3 mt-1.5 max-h-40 overflow-y-auto">
                  <p className="font-hanken text-xs text-[#101014]/45 leading-relaxed whitespace-pre-wrap">{local.notes}</p>
                </div>
              </details>
            )}
          </div>

          {/* Tags */}
          {local.tags && local.tags.length > 0 && (
            <div className="px-5 pb-4">
              <SectionTitle>Tags</SectionTitle>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {local.tags.map(t => (
                  <span key={t} className="font-mono text-[9px] px-2 py-1 rounded-full bg-[#7A2BF0]/10 border border-[#7A2BF0]/20 text-[#a78bfa]/60">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="px-5 pb-5 border-t border-[#101014]/5 mt-1 pt-3 space-y-1">
            <p className="flex items-center gap-2 font-mono text-[9px] text-[#101014]/18">
              <Clock size={8} /> Créé le {new Date(local.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="flex items-center gap-2 font-mono text-[9px] text-[#101014]/18">
              <Clock size={8} /> Mis à jour le {new Date(local.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* ── Footer · delete ── */}
        <div className="shrink-0 border-t border-[#101014]/6 px-5 py-3">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <p className="font-hanken text-xs text-[#f87171] flex-1">Supprimer définitivement ?</p>
              <button onClick={() => onDelete(local.id)}
                className="px-3 py-1.5 rounded-lg bg-[#f87171]/15 border border-[#f87171]/25 text-[#f87171] font-hanken text-xs hover:bg-[#f87171]/25 transition-colors">
                Confirmer
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 rounded-lg border border-[#101014]/8 text-[#101014]/35 font-hanken text-xs hover:text-[#101014] transition-colors">
                Annuler
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-[#101014]/18 hover:text-[#f87171] transition-colors font-hanken text-xs">
              <Trash2 size={11} /> Supprimer ce contact
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] uppercase tracking-widest text-[#101014]/22 flex items-center gap-1.5">
      <span className="w-3 h-px bg-[#101014]/15 inline-block" />
      {children}
    </p>
  );
}

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
    <div className="flex items-center gap-3 py-1.5 group min-h-[36px]">
      <span className="text-[#101014]/18 shrink-0 w-4 flex justify-center">{icon}</span>
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input autoFocus type={inputType} value={editVal}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }}
            className="flex-1 bg-[#101014]/6 border border-[#a78bfa]/40 rounded-lg px-2 py-1 font-hanken text-sm text-[#101014] focus:outline-none focus:border-[#a78bfa]" />
          <button onClick={onSave} disabled={saving} className="text-[#34d399] shrink-0"><Check size={13} /></button>
          <button onClick={onCancel} className="text-[#101014]/25 shrink-0"><X size={11} /></button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
          {value ? (
            <span className="font-hanken text-sm text-[#101014]/65 truncate min-w-0">
              {renderValue ? renderValue(value) : value}
            </span>
          ) : (
            <span className="font-hanken text-xs text-[#101014]/18 italic">{label}…</span>
          )}
          <button onClick={() => onEdit(field, value ?? "")}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5 rounded hover:bg-[#101014]/8">
            <Edit3 size={10} className="text-[#101014]/35" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────
function KanbanCard({ c, onClick, onDragStart, dragging }: { c: Contact; onClick: () => void; onDragStart?: () => void; dragging?: boolean }) {
  const cfg    = STAGE_CFG[c.stage as Stage] ?? STAGE_CFG.identified;
  const parsed = parseNotes(c.notes);
  const score  = getAiScore(c.tags);
  const initials = (c.company ?? c.name).slice(0, 2).toUpperCase();

  return (
    <button onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onDragStart?.(); }}
      className="w-full text-left p-3.5 rounded-xl border border-[#101014]/8 bg-[#101014]/[0.015] hover:border-[#101014]/18 hover:bg-[#101014]/[0.035] transition-all group cursor-grab active:cursor-grabbing"
      style={dragging ? { opacity: 0.4 } : undefined}>
      <div className="flex items-start gap-2.5 mb-2">
        {/* Avatar */}
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-[10px] font-bold"
          style={{ background: cfg.bg, color: cfg.color }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-hanken text-sm text-[#101014] truncate leading-tight">{c.name}</p>
          {c.company && <p className="font-mono text-[9px] text-[#101014]/28 truncate mt-0.5">{c.company}</p>}
        </div>
        <ChevronRight size={11} className="text-[#101014]/15 group-hover:text-[#101014]/40 shrink-0 mt-1 transition-colors" />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.color }}>
          {TYPE_LABELS[c.contact_type]?.slice(0, 12) ?? c.contact_type}
        </span>
        {score !== null && (
          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-[#a78bfa]/10 text-[#a78bfa]/70">
            ★ {score}/5
          </span>
        )}
        {parsed.outreachMessage && (
          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-[#60a5fa]/10 text-[#60a5fa]/70 flex items-center gap-0.5">
            <Send size={7} /> msg prêt
          </span>
        )}
      </div>

      {c.email && (
        <p className="font-mono text-[9px] text-[#101014]/22 truncate mt-2 flex items-center gap-1">
          <Mail size={7} /> {c.email}
        </p>
      )}
      {!c.email && parsed.website && (
        <p className="font-mono text-[9px] text-[#2323C4]/40 truncate mt-2 flex items-center gap-1">
          <Globe size={7} /> {parsed.website}
        </p>
      )}
      {c.next_followup_at && (
        <p className="flex items-center gap-1 font-mono text-[9px] text-[#fbbf24]/60 mt-1.5">
          <Calendar size={7} /> {new Date(c.next_followup_at).toLocaleDateString("fr-FR")}
        </p>
      )}
    </button>
  );
}

// ─── Goal Progress Bar ────────────────────────────────────────────────────────
function GoalBar({ count, goal, label, color }: { count: number; goal: number; label: string; color: string }) {
  const pct = Math.min((count / goal) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-[#101014]/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-[10px] shrink-0" style={{ color }}>
        {count}<span className="text-[#101014]/25">/{goal} {label}</span>
      </span>
    </div>
  );
}

// ─── Follow-up Alert ──────────────────────────────────────────────────────────
function FollowUpAlert({ contacts, onSelect }: { contacts: Contact[]; onSelect: (c: Contact) => void }) {
  const now = new Date();
  const overdue = contacts.filter(c => c.next_followup_at && new Date(c.next_followup_at) <= now);
  if (overdue.length === 0) return null;
  return (
    <div className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={12} className="text-[#fbbf24]/70" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#fbbf24]/70">
          {overdue.length} relance{overdue.length > 1 ? "s" : ""} urgente{overdue.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="space-y-1.5">
        {overdue.slice(0, 4).map(c => {
          const days = Math.ceil((now.getTime() - new Date(c.next_followup_at!).getTime()) / 86400000);
          return (
            <button key={c.id} onClick={() => onSelect(c)}
              className="w-full flex items-center justify-between gap-3 text-left px-3 py-2 rounded-xl hover:bg-[#fbbf24]/5 transition-colors group">
              <span className="font-hanken text-sm text-[#101014]/70 truncate">{c.name}</span>
              <span className="font-mono text-[9px] text-[#fbbf24]/60 shrink-0">
                il y a {days}j <ArrowRight size={8} className="inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>
          );
        })}
        {overdue.length > 4 && (
          <p className="font-mono text-[9px] text-[#fbbf24]/30 pl-3">+{overdue.length - 4} autres</p>
        )}
      </div>
    </div>
  );
}

// ─── Segment Tabs ─────────────────────────────────────────────────────────────
function SegmentTabs({
  segment, setSegment, contacts,
}: {
  segment: SegmentId;
  setSegment: (s: SegmentId) => void;
  contacts: Contact[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SEGMENTS.map(seg => {
        const count = seg.types.length === 0
          ? contacts.length
          : contacts.filter(c => (seg.types as readonly string[]).includes(c.contact_type)).length;
        const active = segment === seg.id;
        return (
          <button key={seg.id} onClick={() => setSegment(seg.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-hanken text-sm transition-all border ${
              active
                ? "border-transparent text-white"
                : "bg-[#101014]/4 border-[#101014]/8 text-[#101014]/45 hover:text-[#101014]/70 hover:border-[#101014]/15"
            }`}
            style={active ? { background: seg.color, boxShadow: `0 4px 16px ${seg.color}30` } : {}}>
            <span className="text-[13px] leading-none">{seg.icon}</span>
            {seg.label}
            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
              active ? "bg-[#101014]/20" : "bg-[#101014]/8 text-[#101014]/35"
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CRMPage() {
  const [contacts, setContacts]     = useState<Contact[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [segment, setSegment]       = useState<SegmentId>("all");
  const [showForm, setShowForm]     = useState(false);
  const [savingNew, setSavingNew]   = useState(false);
  const [selected, setSelected]     = useState<Contact | null>(null);
  const [view, setView]             = useState<"kanban" | "list">("kanban");
  const [dragId, setDragId]         = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [newContact, setNewContact] = useState({
    name: "", email: "", company: "", contact_type: "prospect_vendor",
    stage: "identified", source: "", notes: "",
  });

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search)      p.set("search", search);
    if (stageFilter) p.set("stage", stageFilter);
    if (typeFilter)  p.set("type",  typeFilter);
    try {
      const res  = await fetch(`/api/admin/crm?${p}`);
      const json = await res.json();
      const list = json.data ?? [];
      setContacts(list);
      if (selected) {
        const upd = list.find((c: Contact) => c.id === selected.id);
        if (upd) setSelected(upd);
      }
    } catch {
      setContacts([]);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, stageFilter, typeFilter]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const createContact = async () => {
    if (!newContact.name) return;
    setSavingNew(true);
    try {
      const res = await fetch("/api/admin/crm", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert("Création échouée : " + (j.error ?? res.status));
        return; // garde la modale ouverte avec les valeurs saisies
      }
      setShowForm(false);
      setNewContact({ name:"",email:"",company:"",contact_type:"prospect_vendor",stage:"identified",source:"",notes:"" });
      fetchContacts();
    } finally {
      setSavingNew(false);
    }
  };

  const updateContact = async (id: string, patch: Partial<Contact>) => {
    // Optimistic, avec rollback si le serveur refuse (ex: valeur d'enum invalide).
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    const res = await fetch(`/api/admin/crm/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert("Mise à jour échouée : " + (j.error ?? res.status));
      fetchContacts(); // resynchronise depuis la DB
      return;
    }
    // Journalise les changements de stage dans la timeline (non bloquant).
    if (patch.stage) {
      fetch(`/api/admin/crm/${id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "stage_change", subject: patch.stage, content: `Déplacé vers « ${STAGE_CFG[patch.stage as Stage]?.label ?? patch.stage} »` }),
      }).catch(() => {});
    }
  };

  const deleteContact = async (id: string) => {
    const res = await fetch(`/api/admin/crm/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert("Suppression échouée : " + (j.error ?? res.status));
      return;
    }
    setSelected(null);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const refreshContact = async (id: string): Promise<Contact | null> => {
    await fetchContacts();
    return contacts.find(c => c.id === id) ?? null;
  };

  // Apply segment filter on top of search/stage/type filters
  const segCfg = SEGMENTS.find(s => s.id === segment)!;
  const filteredBySegment = segment === "all"
    ? contacts
    : contacts.filter(c => (segCfg.types as readonly string[]).includes(c.contact_type));

  const byStage = (stage: Stage) => filteredBySegment.filter(c => c.stage === stage);

  // Drag & drop kanban : déposer une carte dans une colonne change son stage (persisté).
  const dropOnStage = (stage: Stage) => {
    const id = dragId;
    setDragId(null);
    setDragOverStage(null);
    if (!id) return;
    const c = contacts.find(x => x.id === id);
    if (!c || c.stage === stage) return;
    updateContact(id, { stage });
    if (selected?.id === id) setSelected({ ...selected, stage });
  };

  const KANBAN_STAGES: Stage[] = ["identified","qualified","nurturing","contacted","partner","vendor"];
  const SIDE_STAGES:   Stage[] = ["rejected","closed"];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-fraunces text-2xl text-[#101014]">CRM Pipeline</h1>
          <p className="font-hanken text-sm text-[#101014]/35 mt-0.5">
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
            {segment !== "all" ? ` · ${filteredBySegment.length} ${segCfg.label.toLowerCase()}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* View toggle */}
          <div className="flex gap-0.5 p-1 bg-[#101014]/4 rounded-lg">
            {([["kanban", <LayoutGrid size={13} key="k" />], ["list", <List size={13} key="l" />]] as const).map(([v, ic]) => (
              <button key={v} onClick={() => setView(v as "kanban" | "list")}
                className={`w-8 h-7 flex items-center justify-center rounded-md transition-all ${
                  view === v ? "bg-[#FF2DA0] text-white" : "text-[#101014]/35 hover:text-[#101014]"
                }`}>{ic}</button>
            ))}
          </div>
          {/* New contact */}
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF2DA0] text-white font-hanken text-sm hover:bg-[#cf2d6e] transition-colors shadow-lg shadow-[#FF2DA0]/20">
            <Plus size={14} /> Nouveau
          </button>
        </div>
      </div>

      {/* ── Goal progress ── */}
      <div className="bg-white border border-[#101014]/8 rounded-2xl p-5 space-y-3">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[#101014]/30 mb-1">Progression objectifs</p>
        {SEGMENTS.filter(s => s.id !== "all").map(seg => {
          const count = contacts.filter(c => (seg.types as readonly string[]).includes(c.contact_type) && c.stage !== "rejected" && c.stage !== "closed").length;
          return <GoalBar key={seg.id} count={count} goal={seg.goal} label={seg.goalLabel} color={seg.color} />;
        })}
      </div>

      {/* ── Relances urgentes ── */}
      <FollowUpAlert contacts={contacts} onSelect={setSelected} />

      {/* ── Segment tabs ── */}
      <SegmentTabs segment={segment} setSegment={setSegment} contacts={contacts} />

      {/* ── Pipeline bar ── */}
      <PipelineBar contacts={filteredBySegment} />

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101014]/22" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un contact…"
            className="w-full pl-9 pr-9 py-2 bg-[#101014]/4 border border-[#101014]/8 rounded-xl font-hanken text-sm text-[#101014] placeholder-[#101014]/22 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#101014]/25 hover:text-[#101014]">
              <X size={12} />
            </button>
          )}
        </div>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          className="bg-[#101014]/4 border border-[#101014]/8 rounded-xl px-3 py-2 font-mono text-xs text-[#101014]/50 focus:outline-none focus:border-[#a78bfa]/40 appearance-none cursor-pointer">
          <option value="">Tous les statuts</option>
          {STAGES.map(s => <option key={s} value={s}>{STAGE_CFG[s].label}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="bg-[#101014]/4 border border-[#101014]/8 rounded-xl px-3 py-2 font-mono text-xs text-[#101014]/50 focus:outline-none focus:border-[#a78bfa]/40 appearance-none cursor-pointer">
          <option value="">Tous les types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24"><SpectrumLoader size="sm" /></div>
      ) : view === "kanban" ? (

        /* ══ Kanban ══ */
        <div className="flex gap-3 overflow-x-auto pb-6 -mx-1 px-1">
          {KANBAN_STAGES.map(stage => {
            const cfg  = STAGE_CFG[stage];
            const cols = byStage(stage);
            const isOver = dragOverStage === stage;
            return (
              <div key={stage} className="flex-shrink-0 w-[220px]"
                onDragOver={(e) => { if (dragId) { e.preventDefault(); setDragOverStage(stage); } }}
                onDragLeave={() => setDragOverStage(prev => prev === stage ? null : prev)}
                onDrop={(e) => { e.preventDefault(); dropOnStage(stage); }}>
                {/* Column header */}
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#101014]/50">{cfg.label}</span>
                  </div>
                  <span className="font-mono text-[9px] w-5 h-5 flex items-center justify-center rounded-full bg-[#101014]/6 text-[#101014]/35">
                    {cols.length}
                  </span>
                </div>
                {/* Cards (drop zone) */}
                <div className="space-y-2 min-h-[60px] rounded-xl transition-colors"
                  style={isOver ? { background: cfg.bg, boxShadow: `inset 0 0 0 1.5px ${cfg.dot}` } : undefined}>
                  {cols.map(c => <KanbanCard key={c.id} c={c} onClick={() => setSelected(c)}
                    onDragStart={() => setDragId(c.id)} dragging={dragId === c.id} />)}
                  {cols.length === 0 && (
                    <div className="border border-dashed border-[#101014]/6 rounded-xl h-16 flex items-center justify-center">
                      <p className="font-mono text-[9px] text-[#101014]/15">{isOver ? "déposer ici" : "vide"}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Side column: rejected + closed */}
          <div className="flex-shrink-0 w-[180px] opacity-40 hover:opacity-70 transition-opacity">
            {SIDE_STAGES.map(stage => {
              const cfg  = STAGE_CFG[stage];
              const cols = byStage(stage);
              return (
                <div key={stage} className="mb-4 rounded-xl transition-colors"
                  onDragOver={(e) => { if (dragId) { e.preventDefault(); setDragOverStage(stage); } }}
                  onDragLeave={() => setDragOverStage(prev => prev === stage ? null : prev)}
                  onDrop={(e) => { e.preventDefault(); dropOnStage(stage); }}
                  style={dragOverStage === stage ? { background: cfg.bg, boxShadow: `inset 0 0 0 1.5px ${cfg.dot}` } : undefined}>
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="font-mono text-[10px] text-[#101014]/40">{cfg.label}</span>
                    <span className="font-mono text-[9px] text-[#101014]/25">{cols.length}</span>
                  </div>
                  {cols.slice(0, 3).map(c => (
                    <button key={c.id} onClick={() => setSelected(c)}
                      className="w-full text-left px-3 py-2 mb-1.5 rounded-xl border border-[#101014]/5 hover:border-[#101014]/10 transition-colors">
                      <p className="font-hanken text-xs text-[#101014]/35 truncate">{c.name}</p>
                    </button>
                  ))}
                  {cols.length > 3 && (
                    <p className="font-mono text-[9px] text-[#101014]/18 pl-3">+{cols.length - 3} autres</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      ) : (

        /* ══ List view ══ */
        <div className="space-y-1">
          {filteredBySegment.length === 0 ? (
            <div className="text-center py-24">
              <TrendingUp size={36} className="mx-auto mb-3 text-[#101014]/8" />
              <p className="font-hanken text-[#101014]/25 text-sm">Aucun contact</p>
            </div>
          ) : filteredBySegment.map(c => {
            const cfg    = STAGE_CFG[c.stage as Stage] ?? STAGE_CFG.identified;
            const parsed = parseNotes(c.notes);
            const score  = getAiScore(c.tags);
            return (
              <button key={c.id} onClick={() => setSelected(c)}
                className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#101014]/6 hover:border-[#101014]/15 hover:bg-[#101014]/[0.02] transition-all group">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-[10px] font-bold"
                  style={{ background: cfg.bg, color: cfg.color }}>
                  {(c.company ?? c.name).slice(0, 2).toUpperCase()}
                </div>
                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-hanken text-sm text-[#101014]">{c.name}</p>
                    {c.company && <span className="font-mono text-[9px] text-[#101014]/28 truncate">{c.company}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {c.email && <span className="font-mono text-[9px] text-[#101014]/22 flex items-center gap-1"><Mail size={7} />{c.email}</span>}
                    {!c.email && parsed.website && <span className="font-mono text-[9px] text-[#2323C4]/40 flex items-center gap-1"><Globe size={7} />{parsed.website}</span>}
                    {parsed.instagram && <span className="font-mono text-[9px] text-[#FF2DA0]/40 flex items-center gap-1"><AtSign size={7} />{parsed.instagram}</span>}
                  </div>
                </div>
                {/* Score */}
                {score !== null && (
                  <span className="font-mono text-[9px] text-[#a78bfa]/60 shrink-0 hidden sm:block">★ {score}/5</span>
                )}
                {/* Stage badge */}
                <span className="font-mono text-[10px] px-2 py-1 rounded-full border shrink-0"
                  style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}25` }}>
                  {cfg.label}
                </span>
                <span className="font-mono text-[9px] text-[#101014]/22 shrink-0 hidden md:block">
                  {TYPE_LABELS[c.contact_type] ?? c.contact_type}
                </span>
                <ChevronRight size={12} className="text-[#101014]/12 group-hover:text-[#101014]/35 shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      )}

      {/* ── Contact panel ── */}
      {selected && (
        <ContactPanel
          contact={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateContact}
          onDelete={deleteContact}
          onRefresh={refreshContact}
        />
      )}

      {/* ── Create contact modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-white border border-[#101014]/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-fraunces text-lg text-[#101014]">Nouveau contact</h2>
              <button onClick={() => setShowForm(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#101014]/5 hover:bg-[#101014]/10 text-[#101014]/40 hover:text-[#101014] transition-all">
                <X size={13} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { key: "name",    label: "Nom *",       placeholder: "Nom / Marque" },
                { key: "email",   label: "Email",        placeholder: "contact@example.com" },
                { key: "company", label: "Organisation", placeholder: "Entreprise" },
                { key: "source",  label: "Source",       placeholder: "etsy, google, événement…" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-[#101014]/28 mb-1.5">{f.label}</label>
                  <input value={(newContact as Record<string, string>)[f.key]}
                    onChange={e => setNewContact(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-[#101014]/4 border border-[#101014]/8 rounded-xl px-3 py-2 font-hanken text-sm text-[#101014] placeholder-[#101014]/18 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#101014]/28 mb-1.5">Notes</label>
                <textarea value={newContact.notes}
                  onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))}
                  rows={2} placeholder="Site: https://…  Instagram: @…  Ville: Paris  Catégorie: Mode"
                  className="w-full bg-[#101014]/4 border border-[#101014]/8 rounded-xl px-3 py-2 font-hanken text-sm text-[#101014] placeholder-[#101014]/18 focus:outline-none focus:border-[#a78bfa]/50 resize-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-[#101014]/28 mb-1.5">Type</label>
                  <select value={newContact.contact_type}
                    onChange={e => setNewContact(p => ({ ...p, contact_type: e.target.value }))}
                    className="w-full bg-[#101014]/4 border border-[#101014]/8 rounded-xl px-3 py-2 font-mono text-xs text-[#101014]/50 focus:outline-none appearance-none">
                    {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-[#101014]/28 mb-1.5">Étape</label>
                  <select value={newContact.stage}
                    onChange={e => setNewContact(p => ({ ...p, stage: e.target.value }))}
                    className="w-full bg-[#101014]/4 border border-[#101014]/8 rounded-xl px-3 py-2 font-mono text-xs text-[#101014]/50 focus:outline-none appearance-none">
                    {STAGES.map(s => <option key={s} value={s}>{STAGE_CFG[s].label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#101014]/8 text-[#101014]/40 font-hanken text-sm hover:text-[#101014] transition-colors">
                Annuler
              </button>
              <button onClick={createContact} disabled={!newContact.name || savingNew}
                className="flex-1 py-2.5 rounded-xl bg-[#FF2DA0] text-white font-hanken text-sm hover:bg-[#cf2d6e] transition-colors disabled:opacity-40 shadow-lg shadow-[#FF2DA0]/20">
                {savingNew ? "Création…" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
