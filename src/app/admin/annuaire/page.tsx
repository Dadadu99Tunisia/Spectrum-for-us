"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Search, X, Upload, Link as LinkIcon, Check, Trash2,
  Star, EyeOff, Eye, RefreshCw, ExternalLink, ChevronDown,
} from "lucide-react";
import { ORGS, CATEGORIES, type OrgEntry } from "@/data/annuaire-orgs";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
type Override = {
  org_id: string;
  logo_url?: string | null;
  custom_name?: string | null;
  custom_desc?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  accent?: string | null;
  is_featured?: boolean;
  is_hidden?: boolean;
};

type EditState = {
  logo_url: string;
  custom_name: string;
  custom_desc: string;
  website: string;
  phone: string;
  email: string;
  accent: string;
  is_featured: boolean;
  is_hidden: boolean;
};

function domain(url?: string | null) {
  if (!url) return null;
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

function codeToFlag(code: string) {
  return [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("");
}

// ─── Logo preview ──────────────────────────────────────────────────────────────
function LogoPreview({ org, override, size = 52 }: { org: OrgEntry; override?: Override; size?: number }) {
  const [err, setErr] = useState(false);
  const url = override?.logo_url ?? null;
  const clearbitDomain = domain(org.website);
  const r = Math.round(size * 0.28);

  if (url && !err) return (
    <div className="shrink-0 overflow-hidden bg-white flex items-center justify-center"
      style={{ width: size, height: size, borderRadius: r }}>
      <Image src={url} alt={org.name} width={size} height={size} className="object-contain" onError={() => setErr(true)} unoptimized />
    </div>
  );

  if (!url && clearbitDomain) return (
    <div className="shrink-0 overflow-hidden bg-white flex items-center justify-center"
      style={{ width: size, height: size, borderRadius: r }}>
      <Image src={`https://logo.clearbit.com/${clearbitDomain}`} alt={org.name} width={size} height={size}
        className="object-contain" onError={() => setErr(true)} unoptimized />
    </div>
  );

  return (
    <div className="shrink-0 flex items-center justify-center font-bold"
      style={{ width: size, height: size, borderRadius: r, background: `${org.accent}22`, border: `1.5px solid ${org.accent}44`, fontSize: size * 0.38, color: org.accent }}>
      {org.logo ?? codeToFlag(org.countryCode)}
    </div>
  );
}

// ─── Edit drawer ──────────────────────────────────────────────────────────────
function EditDrawer({
  org, override, onSave, onDelete, onClose,
}: {
  org: OrgEntry;
  override?: Override;
  onSave: (data: Partial<Override>) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [logoMode, setLogoMode] = useState<"url" | "upload">("url");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<EditState>({
    logo_url: override?.logo_url ?? "",
    custom_name: override?.custom_name ?? "",
    custom_desc: override?.custom_desc ?? "",
    website: override?.website ?? "",
    phone: override?.phone ?? "",
    email: override?.email ?? "",
    accent: override?.accent ?? org.accent,
    is_featured: override?.is_featured ?? false,
    is_hidden: override?.is_hidden ?? false,
  });

  const set = (k: keyof EditState, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  // Upload logo to Supabase storage
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const ext = file.name.split(".").pop();
      const path = `${org.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("annuaire-logos")
        .upload(path, file, { upsert: true });
      if (upErr) throw new Error(upErr.message);
      const { data } = supabase.storage.from("annuaire-logos").getPublicUrl(path);
      set("logo_url", data.publicUrl);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      org_id: org.id,
      logo_url: form.logo_url || null,
      custom_name: form.custom_name || null,
      custom_desc: form.custom_desc || null,
      website: form.website || null,
      phone: form.phone || null,
      email: form.email || null,
      accent: form.accent || null,
      is_featured: form.is_featured,
      is_hidden: form.is_hidden,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const base = "w-full font-hanken text-sm text-[#1A1612]/80 bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FF3D7F]/50 transition-colors placeholder-[#1A1612]/20";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0a0814] border-l border-[#1A1612]/10 flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-[#1A1612]/8 shrink-0">
          <LogoPreview org={org} override={override ? { ...override, logo_url: form.logo_url || override.logo_url } : (form.logo_url ? { org_id: org.id, logo_url: form.logo_url } : undefined)} size={48} />
          <div className="flex-1 min-w-0">
            <h2 className="font-bricolage font-bold text-[#1A1612] text-base leading-tight truncate">
              {org.name}
            </h2>
            <p className="font-mono text-[10px] text-[#1A1612]/30 mt-0.5">
              {codeToFlag(org.countryCode)} {org.city} · ID: {org.id}
            </p>
          </div>
          <button onClick={onClose} className="text-[#1A1612]/30 hover:text-[#1A1612] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Logo section */}
          <div className="space-y-3">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[#1A1612]/30">Logo</label>

            {/* Mode toggle */}
            <div className="flex rounded-xl overflow-hidden border border-[#1A1612]/10">
              {(["url", "upload"] as const).map(m => (
                <button key={m} onClick={() => setLogoMode(m)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-mono transition-all"
                  style={{ background: logoMode === m ? "#FF3D7F18" : "transparent", color: logoMode === m ? "#FF3D7F" : "rgba(26,22,18,0.35)" }}>
                  {m === "url" ? <><LinkIcon size={11} />URL</> : <><Upload size={11} />Importer</>}
                </button>
              ))}
            </div>

            {logoMode === "url" ? (
              <div className="space-y-2">
                <input type="url" placeholder="https://example.com/logo.png"
                  value={form.logo_url} onChange={e => set("logo_url", e.target.value)}
                  className={base} />
                {form.logo_url && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#1A1612]/5 border border-[#1A1612]/8">
                    <LogoPreview org={org} override={{ org_id: org.id, logo_url: form.logo_url }} size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-[#1A1612]/40 truncate">{form.logo_url}</p>
                    </div>
                    <button onClick={() => set("logo_url", "")} className="text-[#1A1612]/20 hover:text-[#FF3D7F] transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-[#1A1612]/15 text-[#1A1612]/35 hover:border-[#FF3D7F]/40 hover:text-[#FF3D7F]/70 transition-all text-sm font-hanken">
                  {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? "Envoi en cours…" : "Cliquer pour choisir un fichier"}
                </button>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden" onChange={handleUpload} />
                {uploadError && <p className="text-xs text-red-400 font-mono">{uploadError}</p>}
                <p className="font-mono text-[9px] text-[#1A1612]/20">PNG, JPG, WebP ou SVG · max 2 Mo</p>
                {form.logo_url && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#1C9C95]/10 border border-[#1C9C95]/20">
                    <Check size={12} className="text-[#1C9C95] shrink-0" />
                    <LogoPreview org={org} override={{ org_id: org.id, logo_url: form.logo_url }} size={36} />
                    <p className="font-mono text-[10px] text-[#1C9C95] truncate flex-1">{domain(form.logo_url)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accent color */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[#1A1612]/30">Couleur accent</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.accent} onChange={e => set("accent", e.target.value)}
                className="w-12 h-10 rounded-xl border border-[#1A1612]/10 bg-transparent cursor-pointer p-0.5" />
              <input type="text" value={form.accent} onChange={e => set("accent", e.target.value)}
                className="flex-1 font-mono text-sm text-[#1A1612]/70 bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF3D7F]/50" />
              <button onClick={() => set("accent", org.accent)}
                className="text-xs font-mono text-[#1A1612]/25 hover:text-[#1A1612]/60 transition-colors whitespace-nowrap">
                Reset
              </button>
            </div>
          </div>

          {/* Custom fields */}
          <div className="space-y-3">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[#1A1612]/30 flex items-center gap-1.5">
              Champs personnalisés
              <span className="text-[#1A1612]/15 normal-case">(surcharge les données statiques)</span>
            </label>
            <div className="space-y-2.5">
              <input type="text" placeholder={`Nom · par défaut : ${org.name}`}
                value={form.custom_name} onChange={e => set("custom_name", e.target.value)} className={base} />
              <textarea placeholder={`Description · par défaut : ${org.description.slice(0, 60)}…`}
                value={form.custom_desc} onChange={e => set("custom_desc", e.target.value)}
                rows={3} className={`${base} resize-none`} />
              <input type="url" placeholder={`Site · par défaut : ${org.website ?? "—"}`}
                value={form.website} onChange={e => set("website", e.target.value)} className={base} />
              <input type="tel" placeholder={`Téléphone · par défaut : ${org.phone ?? "—"}`}
                value={form.phone} onChange={e => set("phone", e.target.value)} className={base} />
              <input type="email" placeholder={`Email · par défaut : ${org.email ?? "—"}`}
                value={form.email} onChange={e => set("email", e.target.value)} className={base} />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5">
            {([
              { key: "is_featured" as const, label: "Mise en avant", desc: "Apparaît en tête de liste", icon: Star, color: "#E0901E" },
              { key: "is_hidden" as const, label: "Masquer", desc: "N'apparaît plus dans l'annuaire", icon: EyeOff, color: "#FF3D7F" },
            ]).map(({ key, label, desc, icon: Icon, color }) => (
              <button key={key} onClick={() => set(key, !form[key])}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                style={{ background: form[key] ? `${color}12` : "rgba(26,22,18,0.03)", borderColor: form[key] ? `${color}40` : "rgba(26,22,18,0.09)" }}>
                <Icon size={15} style={{ color: form[key] ? color : "rgba(26,22,18,0.25)" }} />
                <div className="flex-1 text-left">
                  <p className="font-hanken text-sm" style={{ color: form[key] ? "#1A1612" : "rgba(26,22,18,0.50)" }}>{label}</p>
                  <p className="font-mono text-[9px] text-[#1A1612]/20">{desc}</p>
                </div>
                <div className={`w-9 h-5 rounded-full transition-all relative ${form[key] ? "" : ""}`}
                  style={{ background: form[key] ? color : "rgba(26,22,18,0.10)" }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: form[key] ? "calc(100% - 18px)" : "2px" }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-[#1A1612]/8 flex items-center gap-3 shrink-0">
          {override && (
            <button onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#FF3D7F]/20 text-[#FF3D7F]/60 hover:text-[#FF3D7F] hover:border-[#FF3D7F]/40 transition-all text-xs font-mono">
              <Trash2 size={12} />Reset
            </button>
          )}
          <button onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-hanken font-semibold text-sm transition-all"
            style={{ background: saved ? "#1C9C95" : "#FF3D7F", color: "#fff", opacity: saving ? 0.7 : 1 }}>
            {saving ? <RefreshCw size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
            {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminAnnuairePage() {
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editOrg, setEditOrg] = useState<OrgEntry | null>(null);
  const [filterHasOverride, setFilterHasOverride] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterHidden, setFilterHidden] = useState(false);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/annuaire");
    const { data } = await res.json();
    const map: Record<string, Override> = {};
    (data ?? []).forEach((o: Override) => { map[o.org_id] = o; });
    setOverrides(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Partial<Override>) => {
    await fetch("/api/admin/annuaire", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await load();
  };

  const handleDelete = async (orgId: string) => {
    await fetch("/api/admin/annuaire", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_id: orgId }),
    });
    await load();
    setEditOrg(null);
  };

  const q = search.toLowerCase().trim();
  const filtered = ORGS.filter(o => {
    const ms = !q || o.name.toLowerCase().includes(q) || o.city.toLowerCase().includes(q) || o.country.toLowerCase().includes(q);
    if (filterHasOverride && !overrides[o.id]) return false;
    if (filterFeatured && !overrides[o.id]?.is_featured) return false;
    if (filterHidden && !overrides[o.id]?.is_hidden) return false;
    return ms;
  });

  // Group by country
  const grouped = useMemo_(() => {
    const map = new Map<string, OrgEntry[]>();
    filtered.forEach(o => {
      if (!map.has(o.country)) map.set(o.country, []);
      map.get(o.country)!.push(o);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const totalOverrides = Object.keys(overrides).length;

  return (
    <div className="min-h-screen" style={{ background: "#080612" }}>
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-bricolage font-bold text-[#1A1612] text-2xl mb-1">
              Annuaire LGBTQIA+ 🏳️‍🌈
            </h1>
            <p className="font-hanken text-sm text-[#1A1612]/40">
              {ORGS.length} organisations · {totalOverrides} personnalisées
            </p>
          </div>
          <a href="/annuaire" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1A1612]/10 text-[#1A1612]/40 hover:text-[#1A1612] hover:border-[#1A1612]/20 transition-all text-sm font-mono">
            Voir l'annuaire <ExternalLink size={12} />
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Avec logo custom", value: Object.values(overrides).filter(o => o.logo_url).length, color: "#FF3D7F" },
            { label: "Mises en avant", value: Object.values(overrides).filter(o => o.is_featured).length, color: "#E0901E" },
            { label: "Masquées", value: Object.values(overrides).filter(o => o.is_hidden).length, color: "#6D2DB5" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border border-[#1A1612]/8 bg-[#1A1612]/[0.02] p-4">
              <div className="font-fraunces text-2xl tabular-nums" style={{ color }}>{value}</div>
              <div className="font-mono text-[10px] text-[#1A1612]/30 mt-1 uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1612]/25 pointer-events-none" />
            <input type="search" placeholder="Rechercher une organisation…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-[#1A1612]/10 bg-[#1A1612]/[0.04] text-[#1A1612]/80 placeholder-[#1A1612]/20 text-sm font-hanken outline-none focus:border-[#FF3D7F]/50 transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1612]/30 hover:text-[#FF3D7F]"><X size={12} /></button>}
          </div>
          {[
            { label: "Personnalisées", active: filterHasOverride, toggle: () => setFilterHasOverride(v => !v), color: "#FF3D7F" },
            { label: "⭐ En avant", active: filterFeatured, toggle: () => setFilterFeatured(v => !v), color: "#E0901E" },
            { label: "🙈 Masquées", active: filterHidden, toggle: () => setFilterHidden(v => !v), color: "#6D2DB5" },
          ].map(({ label, active, toggle, color }) => (
            <button key={label} onClick={toggle}
              className="px-3 py-2 rounded-xl border text-xs font-mono transition-all"
              style={{ borderColor: active ? color : "rgba(26,22,18,0.10)", color: active ? color : "rgba(26,22,18,0.35)", background: active ? `${color}12` : "transparent" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Org list grouped by country */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={20} className="animate-spin text-[#FF3D7F]" />
          </div>
        ) : (
          <div className="space-y-3">
            {grouped.map(([country, orgs]) => {
              const code = orgs[0].countryCode;
              const isOpen = expandedCountry === country || !!q || filterHasOverride || filterFeatured || filterHidden;
              return (
                <div key={country} className="rounded-2xl border border-[#1A1612]/8 overflow-hidden">
                  {/* Country header */}
                  <button onClick={() => setExpandedCountry(expandedCountry === country ? null : country)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#1A1612]/[0.02] hover:bg-[#1A1612]/[0.04] transition-colors">
                    <span className="text-xl leading-none">{codeToFlag(code)}</span>
                    <span className="font-bricolage font-semibold text-[#1A1612]/80 text-sm flex-1 text-left">{country}</span>
                    <span className="font-mono text-[9px] text-[#1A1612]/25 px-2 py-0.5 rounded-full bg-[#1A1612]/5">
                      {orgs.length} · {orgs.filter(o => overrides[o.id]).length} custom
                    </span>
                    <ChevronDown size={13} className="text-[#1A1612]/20 transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }} />
                  </button>

                  {/* Orgs */}
                  {isOpen && (
                    <div className="divide-y divide-[#1A1612]/5">
                      {orgs.map(org => {
                        const ov = overrides[org.id];
                        return (
                          <div key={org.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1A1612]/[0.02] transition-colors group">
                            <LogoPreview org={org} override={ov} size={44} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bricolage font-semibold text-[#1A1612]/80 text-sm truncate">
                                  {ov?.custom_name ?? org.name}
                                </span>
                                {ov?.is_featured && <span className="text-[9px] font-mono text-[#E0901E] bg-[#E0901E]/12 px-1.5 py-0.5 rounded-full">⭐ avant</span>}
                                {ov?.is_hidden && <span className="text-[9px] font-mono text-[#6D2DB5] bg-[#6D2DB5]/12 px-1.5 py-0.5 rounded-full">🙈 masqué</span>}
                                {ov?.logo_url && <span className="text-[9px] font-mono text-[#1C9C95] bg-[#1C9C95]/12 px-1.5 py-0.5 rounded-full">Logo ✓</span>}
                              </div>
                              <p className="font-mono text-[9px] text-[#1A1612]/25 mt-0.5">{org.city} · {org.id}</p>
                            </div>
                            <button onClick={() => setEditOrg(org)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-xl bg-[#FF3D7F]/15 text-[#FF3D7F] text-xs font-mono hover:bg-[#FF3D7F]/25 shrink-0">
                              Modifier
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit drawer */}
      {editOrg && (
        <EditDrawer
          org={editOrg}
          override={overrides[editOrg.id]}
          onSave={handleSave}
          onDelete={() => handleDelete(editOrg.id)}
          onClose={() => setEditOrg(null)}
        />
      )}
    </div>
  );
}

// tiny inline useMemo workaround (no import needed — React is already available)
function useMemo_<T>(fn: () => T, deps: unknown[]): T {
  const ref = useRef<{ deps: unknown[]; value: T } | null>(null);
  if (!ref.current || deps.some((d, i) => d !== ref.current!.deps[i])) {
    ref.current = { deps, value: fn() };
  }
  return ref.current.value;
}
