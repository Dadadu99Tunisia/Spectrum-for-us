"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Trophy, Rocket, Users, Download, Search, X,
  ChevronUp, ChevronDown, Edit3, Check, Crown,
  Star, RefreshCw, Minus,
} from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import { FounderBadge, type FounderStatus } from "@/components/founder/FounderBadge";

// ─── Types ────────────────────────────────────────────────────────────────────
type Member = {
  id: string;
  rank: number;
  status: FounderStatus;
  subscription_free_until: string | null;
  commission_free_until: string | null;
  commission_rate_override: number | null;
  is_founder: boolean;
  is_early_adopter: boolean;
  notes: string | null;
  created_at: string;
  profiles: { full_name: string | null; pseudo: string | null } | null;
  shops: { id: string; name: string | null; slug: string | null; is_active: boolean } | null;
};

type Counts = {
  founder_count: number;
  early_adopter_count: number;
  founder_slots: number;
  early_adopter_slots: number;
  founder_remaining: number;
  early_remaining: number;
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG: Record<FounderStatus, {
  label: string; icon: React.ElementType;
  color: string; bg: string; border: string;
}> = {
  FOUNDER:       { label: "Fondateur·ice", icon: Crown,  color: "#FFD700", bg: "rgba(255,215,0,.08)",  border: "rgba(255,215,0,.2)" },
  EARLY_ADOPTER: { label: "Pionnier·e",    icon: Rocket, color: "#a78bfa", bg: "rgba(167,139,250,.08)", border: "rgba(167,139,250,.2)" },
  STANDARD:      { label: "Standard",      icon: Star,   color: "#6b7280", bg: "rgba(107,114,128,.08)", border: "rgba(107,114,128,.15)" },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, total, color, icon: Icon, sub,
}: {
  label: string; value: number; total: number;
  color: string; icon: React.ElementType; sub?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="bg-[#1c1235] border border-[#101014]/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${color}15` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <p className="font-hanken text-sm text-[#101014]/60">{label}</p>
        </div>
        <span className="font-mono text-[10px]" style={{ color }}>
          {value}<span className="text-[#101014]/25">/{total}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#101014]/8 overflow-hidden mb-2">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] text-[#101014]/25">{pct}% rempli</p>
        {sub && <p className="font-mono text-[9px]" style={{ color }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── Inline commission editor ─────────────────────────────────────────────────
function CommissionEditor({
  member, onSave,
}: {
  member: Member;
  onSave: (id: string, patch: { commission_rate_override: number | null; notes: string | null }) => Promise<void>;
}) {
  const [editing, setEditing]   = useState(false);
  const [rate, setRate]         = useState(
    member.commission_rate_override != null
      ? String(Math.round(member.commission_rate_override * 10000) / 100)
      : ""
  );
  const [notes, setNotes]       = useState(member.notes ?? "");
  const [saving, setSaving]     = useState(false);

  const save = async () => {
    setSaving(true);
    const rateNum = rate === "" ? null : parseFloat(rate) / 100;
    await onSave(member.id, {
      commission_rate_override: rateNum != null && !isNaN(rateNum) ? rateNum : null,
      notes: notes.trim() || null,
    });
    setSaving(false);
    setEditing(false);
  };

  if (!editing) {
    const display = member.commission_rate_override != null
      ? `${(member.commission_rate_override * 100).toFixed(1)}%`
      : "-";
    return (
      <button onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 group text-left">
        <span className="font-mono text-sm text-[#101014]/60">{display}</span>
        <Edit3 size={10} className="text-[#101014]/15 group-hover:text-[#a78bfa] transition-colors" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        autoFocus
        type="number" min="0" max="100" step="0.1"
        value={rate}
        onChange={e => setRate(e.target.value)}
        placeholder="0"
        className="w-16 bg-[#101014]/6 border border-[#a78bfa]/40 rounded-lg px-2 py-1 font-mono text-xs text-[#101014] focus:outline-none"
      />
      <span className="font-mono text-xs text-[#101014]/30">%</span>
      <button onClick={save} disabled={saving}
        className="text-[#34d399] hover:text-[#34d399]/70 transition-colors">
        {saving ? <RefreshCw size={11} className="animate-spin" /> : <Check size={11} />}
      </button>
      <button onClick={() => setEditing(false)} className="text-[#101014]/25 hover:text-[#101014]">
        <X size={10} />
      </button>
    </div>
  );
}

// ─── Sort helper ──────────────────────────────────────────────────────────────
type SortKey = "rank" | "status" | "created_at" | "commission_rate_override";

function SortButton({
  label, sortKey, current, dir, onClick,
}: {
  label: string; sortKey: SortKey;
  current: SortKey; dir: "asc" | "desc"; onClick: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button onClick={() => onClick(sortKey)}
      className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#101014]/30 hover:text-[#101014]/60 transition-colors group">
      {label}
      {active ? (
        dir === "asc" ? <ChevronUp size={10} className="text-[#a78bfa]" /> : <ChevronDown size={10} className="text-[#a78bfa]" />
      ) : (
        <Minus size={9} className="opacity-0 group-hover:opacity-40 transition-opacity" />
      )}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FounderProgramPage() {
  const [members, setMembers]     = useState<Member[]>([]);
  const [counts, setCounts]       = useState<Counts | null>(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey]     = useState<SortKey>("rank");
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("asc");
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (statusFilter) p.set("status", statusFilter);
    if (search)       p.set("search", search);
    try {
      const res  = await fetch(`/api/admin/founder-program?${p}`);
      const json = await res.json();
      setMembers(json.data ?? []);
      if (json.counts) setCounts(json.counts);
    } catch {
      setMembers([]);
    }
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...members].sort((a, b) => {
    let diff = 0;
    if (sortKey === "rank")                    diff = a.rank - b.rank;
    else if (sortKey === "status")             diff = a.status.localeCompare(b.status);
    else if (sortKey === "created_at")         diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    else if (sortKey === "commission_rate_override") diff = (a.commission_rate_override ?? 99) - (b.commission_rate_override ?? 99);
    return sortDir === "asc" ? diff : -diff;
  });

  const patchMember = async (id: string, patch: { commission_rate_override: number | null; notes: string | null }) => {
    await fetch(`/api/admin/founder-program/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const res  = await fetch("/api/admin/founder-program/export");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = `founder-program-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-fraunces text-2xl text-[#101014] flex items-center gap-3">
            <Trophy size={22} className="text-[#FFD700]" />
            Programme Fondateur
          </h1>
          <p className="font-hanken text-sm text-[#101014]/35 mt-0.5">
            Gestion des early adopters · Avantages exclusifs à vie
          </p>
        </div>
        <button onClick={exportCSV} disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#101014]/10 bg-[#101014]/4 text-[#101014]/50 hover:text-[#101014] hover:border-[#101014]/20 font-hanken text-sm transition-all disabled:opacity-40">
          {exporting ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
          Exporter CSV
        </button>
      </div>

      {/* ── Stats ── */}
      {counts && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Fondateur·ices"
            value={counts.founder_count}
            total={counts.founder_slots}
            color="#FFD700"
            icon={Crown}
            sub={counts.founder_remaining > 0 ? `${counts.founder_remaining} places restantes` : "Complet 🎉"}
          />
          <StatCard
            label="Pionnier·es"
            value={counts.early_adopter_count}
            total={counts.early_adopter_slots}
            color="#a78bfa"
            icon={Rocket}
            sub={counts.early_remaining > 0 ? `${counts.early_remaining} places restantes` : "Complet 🎉"}
          />
          <div className="bg-[#1c1235] border border-[#101014]/8 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#2323C4]/15">
                <Users size={16} className="text-[#2323C4]" />
              </div>
              <p className="font-hanken text-sm text-[#101014]/60">Total inscrits</p>
            </div>
            <p className="font-fraunces text-3xl text-[#101014]">
              {counts.founder_count + counts.early_adopter_count}
            </p>
            <p className="font-mono text-[9px] text-[#101014]/25 mt-1">
              sur les {counts.founder_slots + counts.early_adopter_slots} places Early Adopter
            </p>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101014]/22" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un nom, boutique…"
            className="w-full pl-9 pr-9 py-2 bg-[#101014]/4 border border-[#101014]/8 rounded-xl font-hanken text-sm text-[#101014] placeholder-[#101014]/22 focus:outline-none focus:border-[#a78bfa]/40 transition-colors" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#101014]/25 hover:text-[#101014]">
              <X size={12} />
            </button>
          )}
        </div>
        {(["", "FOUNDER", "EARLY_ADOPTER", "STANDARD"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-2 rounded-xl font-mono text-[10px] border transition-all ${
              statusFilter === s
                ? "bg-[#7A2BF0]/25 border-[#7A2BF0]/40 text-[#a78bfa]"
                : "bg-[#101014]/4 border-[#101014]/8 text-[#101014]/40 hover:text-[#101014]/60"
            }`}>
            {s === "" ? "Tous" : STATUS_CFG[s as FounderStatus].label}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <SpectrumLoader size="sm" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-24">
          <Trophy size={36} className="mx-auto mb-3 text-[#101014]/8" />
          <p className="font-hanken text-[#101014]/25">Aucun membre trouvé</p>
          <p className="font-mono text-[10px] text-[#101014]/15 mt-1">
            Les membres s&apos;ajoutent automatiquement à l&apos;inscription vendeur
          </p>
        </div>
      ) : (
        <div className="bg-[#1c1235] border border-[#101014]/8 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[56px_1fr_160px_140px_120px_120px_110px] gap-4 px-5 py-3 border-b border-[#101014]/6">
            <SortButton label="Rang" sortKey="rank" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#101014]/30">Vendeur·se</span>
            <SortButton label="Statut" sortKey="status" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#101014]/30">Abonnement gratuit</span>
            <SortButton label="Commission" sortKey="commission_rate_override" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#101014]/30">Comm. 0% jusqu'au</span>
            <SortButton label="Inscrit le" sortKey="created_at" current={sortKey} dir={sortDir} onClick={toggleSort} />
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#101014]/[0.04]">
            {sorted.map((m) => {
              const cfg  = STATUS_CFG[m.status];
              const Icon = cfg.icon;
              const name = m.profiles?.full_name ?? m.profiles?.pseudo ?? "-";
              const shop = m.shops?.name ?? "-";

              return (
                <div key={m.id}
                  className="grid grid-cols-[56px_1fr_160px_140px_120px_120px_110px] gap-4 px-5 py-3.5 items-center hover:bg-[#101014]/[0.015] transition-colors">

                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center font-fraunces text-base font-bold"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {m.rank}
                    </span>
                  </div>

                  {/* Vendor */}
                  <div className="min-w-0">
                    <p className="font-hanken text-sm text-[#101014] truncate">{name}</p>
                    <p className="font-mono text-[9px] text-[#101014]/30 truncate mt-0.5">{shop}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[10px]"
                      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                      <Icon size={10} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Sub free until */}
                  <div>
                    {m.subscription_free_until ? (
                      <span className="font-mono text-xs text-[#101014]/50">
                        {new Date(m.subscription_free_until).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-[#101014]/20">-</span>
                    )}
                  </div>

                  {/* Commission rate (editable) */}
                  <CommissionEditor member={m} onSave={patchMember} />

                  {/* Commission free until */}
                  <div>
                    {m.commission_free_until ? (
                      <span className="font-mono text-xs text-[#101014]/50">
                        {new Date(m.commission_free_until).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-[#101014]/20">-</span>
                    )}
                  </div>

                  {/* Created at */}
                  <div>
                    <span className="font-mono text-[10px] text-[#101014]/30">
                      {new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#101014]/6 flex items-center justify-between">
            <p className="font-mono text-[9px] text-[#101014]/20">
              {sorted.length} résultat{sorted.length !== 1 ? "s" : ""}
            </p>
            <p className="font-mono text-[9px] text-[#101014]/15">
              Le rang est immutable · Le statut est attribué à vie
            </p>
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      <div className="grid sm:grid-cols-3 gap-3">
        {(Object.entries(STATUS_CFG) as [FounderStatus, typeof STATUS_CFG[FounderStatus]][]).map(([s, cfg]) => {
          const benefits: Record<FounderStatus, string[]> = {
            FOUNDER:       ["Abonnement gratuit 3 ans", "0 % commission 12 mois", "Mise en avant prioritaire", "Badge exclusif"],
            EARLY_ADOPTER: ["Abonnement gratuit 6 mois", "0 % commission 6 mois", "Badge Pionnier·e"],
            STANDARD:      ["Abonnement 9,90€ ou 19,90€/mois", "Commission 5-12 %"],
          };
          const Icon = cfg.icon;
          return (
            <div key={s} className="rounded-2xl p-4 border"
              style={{ background: cfg.bg, borderColor: cfg.border }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: cfg.color }} />
                <p className="font-hanken text-sm font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
                {s !== "STANDARD" && (
                  <FounderBadge status={s} size="sm" />
                )}
              </div>
              <ul className="space-y-1">
                {benefits[s].map(b => (
                  <li key={b} className="font-hanken text-xs text-[#101014]/45 flex items-center gap-1.5">
                    <span style={{ color: cfg.color }}>·</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

    </div>
  );
}
