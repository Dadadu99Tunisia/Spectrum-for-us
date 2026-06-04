"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Layout, Type, Image as ImageIcon, FileText, Globe, Search as SearchIcon,
  Save, RotateCcw, Eye, EyeOff, ChevronDown, Megaphone, Sparkles,
  Palette, Share2, BarChart2, ShoppingBag, Store, Mail,
  Plus, Trash2, GripVertical, ExternalLink, Star, X,
  Navigation, Layers, MousePointerClick, Monitor, Check
} from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

// ─── Types ───────────────────────────────────────────────────────────
type ContentBlock = {
  id: string; key: string; section: string;
  type: "text"|"html"|"boolean"|"color"|"image"|"url"|"number";
  label: string; description: string|null; value: string|null; default_value: string|null; updated_at: string;
};
type SitePage = {
  id: string; slug: string; title: string; content: string|null;
  meta_title: string|null; meta_desc: string|null;
  is_published: boolean; show_in_nav: boolean; nav_label: string|null; sort_order: number; updated_at: string;
};
type NavItem = {
  id: string; location: string; label: string; url: string; sort_order: number; is_active: boolean; open_new_tab: boolean;
};
type Popup = {
  id: string; name: string; title: string|null; body: string|null; cta_label: string|null; cta_url: string|null;
  image_url: string|null; trigger: string; trigger_value: number; bg_color: string; is_active: boolean; show_once: boolean;
};
type Testimonial = {
  id: string; author: string; role: string|null; content: string; avatar_url: string|null; rating: number; is_active: boolean; sort_order: number;
};

// ─── Sections sidebar ───────────────────────────────────────────────
const SECTIONS = [
  { id:"banners",   label:"Bandeaux",         icon:Megaphone,        color:"#E0337E",  group:"Visibilité" },
  { id:"promo",     label:"Promotions",        icon:Sparkles,         color:"#E0901E",  group:"Visibilité" },
  { id:"hero",      label:"Page d'accueil",    icon:Monitor,          color:"#6D2DB5",  group:"Pages" },
  { id:"manifeste", label:"Section Manifeste", icon:Type,             color:"#F2B79E",  group:"Pages" },
  { id:"boutique",  label:"Boutique",          icon:ShoppingBag,      color:"#1C9C95",  group:"Pages" },
  { id:"vendeurs",  label:"Page vendeurs",     icon:Store,            color:"#E0337E",  group:"Pages" },
  { id:"stats",     label:"Chiffres clés",     icon:BarChart2,        color:"#6D2DB5",  group:"Pages" },
  { id:"theme",     label:"Thème & couleurs",  icon:Palette,          color:"#E0901E",  group:"Design" },
  { id:"social",    label:"Réseaux sociaux",   icon:Share2,           color:"#1C9C95",  group:"Design" },
  { id:"seo",       label:"SEO",               icon:Globe,            color:"#6D2DB5",  group:"Design" },
  { id:"emails",    label:"Emails",            icon:Mail,             color:"#E0337E",  group:"Système" },
  { id:"footer",    label:"Footer",            icon:Layout,           color:"#E0901E",  group:"Système" },
  { id:"__pages",   label:"Pages personnalisées", icon:FileText,      color:"#1C9C95",  group:"Avancé" },
  { id:"__nav",     label:"Navigation",        icon:Navigation,       color:"#6D2DB5",  group:"Avancé" },
  { id:"__popups",  label:"Popups",            icon:MousePointerClick,color:"#E0337E",  group:"Avancé" },
  { id:"__testimonials", label:"Avis / Témoignages", icon:Star,       color:"#E0901E",  group:"Avancé" },
];

const GROUPS = ["Visibilité","Pages","Design","Système","Avancé"];

// ─── Field editor ────────────────────────────────────────────────────
function FieldEditor({ block, value, onChange }: { block: ContentBlock; value: string; onChange: (v:string)=>void }) {
  const base = "font-hanken text-sm text-[#F3EADB] bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#E0337E]/50 transition-colors w-full placeholder-[#F3EADB]/20";

  if (block.type === "boolean") {
    const on = value === "true";
    return (
      <button onClick={() => onChange(on ? "false" : "true")}
        className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border font-hanken text-sm transition-all ${on ? "bg-[#E0337E]/10 border-[#E0337E]/30 text-[#E0337E]" : "bg-[#F3EADB]/5 border-[#F3EADB]/10 text-[#F3EADB]/40"}`}>
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${on ? "border-[#E0337E] bg-[#E0337E]" : "border-[#F3EADB]/20"}`}>
          {on && <Check size={10} className="text-white" />}
        </div>
        {on ? "Activé" : "Désactivé"}
      </button>
    );
  }
  if (block.type === "color") {
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <input type="color" value={value || "#E0337E"} onChange={e => onChange(e.target.value)}
            className="w-12 h-12 rounded-xl border border-[#F3EADB]/10 cursor-pointer bg-transparent p-0.5" />
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-32 bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-mono text-sm text-[#F3EADB] focus:outline-none focus:border-[#E0337E]/50" />
        <div className="w-8 h-8 rounded-lg border border-[#F3EADB]/10" style={{ background: value }} />
      </div>
    );
  }
  if (block.type === "html") {
    return (
      <div className="space-y-1">
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={6}
          className={`${base} resize-y font-mono text-xs leading-relaxed`} />
        <p className="font-mono text-[9px] text-[#F3EADB]/20">HTML supporté</p>
      </div>
    );
  }
  if (block.type === "image") {
    return (
      <div className="space-y-2">
        <input type="url" value={value} onChange={e => onChange(e.target.value)} placeholder="https://..." className={base} />
        {value && <img src={value} alt="" className="h-24 rounded-xl object-cover border border-[#F3EADB]/10" />}
      </div>
    );
  }
  return (
    <input type={block.type === "url" ? "url" : block.type === "number" ? "number" : "text"}
      value={value} onChange={e => onChange(e.target.value)} placeholder={block.default_value ?? ""} className={base} />
  );
}

// ─── Main ────────────────────────────────────────────────────────────
export default function ContenuPage() {
  const [blocks, setBlocks]     = useState<ContentBlock[]>([]);
  const [dirty, setDirty]       = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [activeSection, setActiveSection] = useState("banners");
  const [search, setSearch]     = useState("");
  const [toast, setToast]       = useState<string|null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Specific data
  const [pages, setPages]           = useState<SitePage[]>([]);
  const [navItems, setNavItems]     = useState<NavItem[]>([]);
  const [popups, setPopups]         = useState<Popup[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  const loadBlocks = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/content");
    const json = await res.json() as { data: ContentBlock[] };
    setBlocks(json.data ?? []);
    setLoading(false);
  }, []);

  const loadSpecific = useCallback(async (section: string) => {
    if (section === "__pages") {
      const r = await fetch("/api/admin/content/pages");
      setPages((await r.json() as { data: SitePage[] }).data ?? []);
    } else if (section === "__nav") {
      const r = await fetch("/api/admin/content/navigation");
      setNavItems((await r.json() as { data: NavItem[] }).data ?? []);
    } else if (section === "__popups") {
      const r = await fetch("/api/admin/content/popups");
      setPopups((await r.json() as { data: Popup[] }).data ?? []);
    } else if (section === "__testimonials") {
      const r = await fetch("/api/admin/content/testimonials");
      setTestimonials((await r.json() as { data: Testimonial[] }).data ?? []);
    }
  }, []);

  useEffect(() => { loadBlocks(); }, [loadBlocks]);
  useEffect(() => { if (activeSection.startsWith("__")) loadSpecific(activeSection); }, [activeSection, loadSpecific]);

  const getValue = (block: ContentBlock) => block.key in dirty ? dirty[block.key] : (block.value ?? "");
  const setValue = (key: string, v: string) => setDirty(d => ({ ...d, [key]: v }));
  const resetBlock = (block: ContentBlock) => {
    if (block.default_value) setDirty(d => ({ ...d, [block.key]: block.default_value! }));
  };

  const save = async () => {
    if (!Object.keys(dirty).length) return;
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.entries(dirty).map(([key, value]) => ({ key, value }))),
    });
    await loadBlocks();
    setDirty({});
    setSaving(false);
    showToast("✓ Modifications sauvegardées");
  };

  const dirtyCount = Object.keys(dirty).length;
  const filtered = blocks.filter(b => {
    if (b.section !== activeSection) return false;
    if (search) return b.label.toLowerCase().includes(search.toLowerCase()) || b.key.includes(search.toLowerCase());
    return true;
  });

  // ─── Theme preview colors
  const themeColors = {
    primary:   blocks.find(b => b.key === "theme_color_primary")?.value ?? "#E0337E",
    secondary: blocks.find(b => b.key === "theme_color_secondary")?.value ?? "#6D2DB5",
    accent:    blocks.find(b => b.key === "theme_color_accent")?.value ?? "#E0901E",
    bg:        blocks.find(b => b.key === "theme_color_bg")?.value ?? "#3D1F5C",
    text:      blocks.find(b => b.key === "theme_color_text")?.value ?? "#F3EADB",
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {toast && <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e061a] border border-[#E0337E]/30 text-[#F3EADB] font-hanken text-sm shadow-2xl"><Check size={13} className="text-[#E0337E]" />{toast}</div>}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Site & Contenu</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">Gérez chaque aspect de votre site sans toucher au code</p>
        </div>
        {!activeSection.startsWith("__") && (
          <button onClick={save} disabled={dirtyCount === 0 || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 disabled:opacity-40 transition-all">
            <Save size={13} /> {saving ? "Sauvegarde…" : dirtyCount > 0 ? `Sauvegarder (${dirtyCount})` : "Sauvegarder"}
          </button>
        )}
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 space-y-4">
          {search && (
            <div className="relative">
              <SearchIcon size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtrer…"
                className="w-full pl-7 pr-3 py-1.5 bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg font-hanken text-xs text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none" />
            </div>
          )}
          {GROUPS.map(group => {
            const groupSections = SECTIONS.filter(s => s.group === group);
            return (
              <div key={group}>
                <p className="font-mono text-[8px] uppercase tracking-widest text-[#F3EADB]/20 px-2 mb-1.5">{group}</p>
                {groupSections.map(s => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  const hasDirty = !s.id.startsWith("__") && blocks.filter(b => b.section === s.id).some(b => b.key in dirty);
                  return (
                    <button key={s.id} onClick={() => { setActiveSection(s.id); setSearch(""); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-hanken text-sm transition-all mb-0.5 ${
                        isActive ? "text-[#F3EADB] border" : "text-[#F3EADB]/40 hover:text-[#F3EADB] hover:bg-[#F3EADB]/4 border border-transparent"
                      }`}
                      style={isActive ? { background: `${s.color}18`, borderColor: `${s.color}35` } : {}}>
                      <Icon size={13} style={isActive ? { color: s.color } : {}} />
                      <span className={isActive ? "text-[#F3EADB]" : ""}>{s.label}</span>
                      {hasDirty && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E0337E] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search bar for content blocks */}
          {!activeSection.startsWith("__") && (
            <div className="relative mb-4">
              <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un bloc de contenu…"
                className="w-full pl-9 pr-4 py-2 bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/50 transition-colors" />
            </div>
          )}

          {/* ── CONTENT BLOCKS ── */}
          {!activeSection.startsWith("__") && (
            loading ? (
              <div className="flex items-center justify-center py-20">
                <SpectrumLoader size="sm" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Type size={32} className="mx-auto mb-3 text-[#F3EADB]/10" />
                <p className="font-hanken text-[#F3EADB]/30">Aucun bloc dans cette section</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Theme preview */}
                {activeSection === "theme" && (
                  <div className="p-5 rounded-2xl border border-[#F3EADB]/8 mb-4 space-y-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#F3EADB]/30">Aperçu du thème</p>
                    <div className="flex gap-2">
                      {Object.entries(themeColors).map(([k, c]) => (
                        <div key={k} className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-lg border border-white/10" style={{ background: c }} />
                          <span className="font-mono text-[8px] text-[#F3EADB]/30 capitalize">{k}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl border border-[#F3EADB]/6 font-mono text-[9px] text-[#F3EADB]/30">
                      ℹ Les changements de couleurs nécessitent un redéploiement pour être appliqués sur le site.
                    </div>
                  </div>
                )}

                {filtered.map(block => {
                  const isDirty = block.key in dirty;
                  const isOpen = collapsed[block.key] !== true;
                  return (
                    <div key={block.key} className={`rounded-2xl border transition-all overflow-hidden ${isDirty ? "border-[#E0337E]/25 bg-[#E0337E]/[0.03]" : "border-[#F3EADB]/8 bg-[#F3EADB]/[0.015]"}`}>
                      <button className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
                        onClick={() => setCollapsed(c => ({ ...c, [block.key]: isOpen }))}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-hanken text-sm text-[#F3EADB]">{block.label}</p>
                            {isDirty && <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-md bg-[#E0337E]/15 text-[#E0337E]">modifié</span>}
                          </div>
                          {block.description && !isOpen && (
                            <p className="font-mono text-[10px] text-[#F3EADB]/25 mt-0.5 truncate">{block.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded border border-[#F3EADB]/8 text-[#F3EADB]/20 uppercase">{block.type}</span>
                          <ChevronDown size={12} className={`text-[#F3EADB]/20 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 space-y-3 border-t border-[#F3EADB]/5 pt-3">
                          {block.description && <p className="font-mono text-[10px] text-[#F3EADB]/30">{block.description}</p>}
                          <FieldEditor block={block} value={getValue(block)} onChange={v => setValue(block.key, v)} />
                          <div className="flex items-center justify-between">
                            <code className="font-mono text-[9px] text-[#F3EADB]/15 bg-[#F3EADB]/4 px-1.5 py-0.5 rounded">{block.key}</code>
                            {block.default_value && isDirty && (
                              <button onClick={() => resetBlock(block)}
                                className="flex items-center gap-1 font-mono text-[9px] text-[#F3EADB]/25 hover:text-[#F3EADB] transition-colors">
                                <RotateCcw size={9} /> Réinitialiser
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ── PAGES ── */}
          {activeSection === "__pages" && (
            <PagesManager pages={pages} onReload={() => loadSpecific("__pages")} showToast={showToast} />
          )}

          {/* ── NAVIGATION ── */}
          {activeSection === "__nav" && (
            <NavManager items={navItems} onReload={() => loadSpecific("__nav")} showToast={showToast} />
          )}

          {/* ── POPUPS ── */}
          {activeSection === "__popups" && (
            <PopupsManager popups={popups} onReload={() => loadSpecific("__popups")} showToast={showToast} />
          )}

          {/* ── TESTIMONIALS ── */}
          {activeSection === "__testimonials" && (
            <TestimonialsManager items={testimonials} onReload={() => loadSpecific("__testimonials")} showToast={showToast} />
          )}
        </div>
      </div>

      {/* Floating save bar */}
      {dirtyCount > 0 && !activeSection.startsWith("__") && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-5 py-3 rounded-2xl bg-[#0e061a] border border-[#E0337E]/30 shadow-2xl">
          <p className="font-hanken text-sm text-[#F3EADB]/60">
            <span className="text-[#E0337E] font-medium">{dirtyCount}</span> modification{dirtyCount > 1 ? "s" : ""} non sauvegardée{dirtyCount > 1 ? "s" : ""}
          </p>
          <button onClick={() => setDirty({})} className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#F3EADB] transition-colors">Annuler</button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 disabled:opacity-60 transition-colors">
            <Save size={12} /> {saving ? "…" : "Sauvegarder"}
          </button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// PAGES MANAGER
// ════════════════════════════════════════════════════════════════════
function PagesManager({ pages, onReload, showToast }: { pages: SitePage[]; onReload: ()=>void; showToast: (m:string)=>void }) {
  const [editing, setEditing] = useState<SitePage|null>(null);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState<Partial<SitePage>>({});

  const openNew = () => {
    setForm({ slug:"", title:"", content:"", meta_title:"", meta_desc:"", is_published:false, show_in_nav:false, nav_label:"" });
    setEditing({ id:"" } as SitePage);
  };
  const openEdit = (p: SitePage) => { setEditing(p); setForm(p); };

  const save = async () => {
    setSaving(true);
    if (editing?.id) {
      await fetch(`/api/admin/content/pages/${editing.id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    } else {
      await fetch("/api/admin/content/pages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    }
    setSaving(false); setEditing(null); onReload();
    showToast(editing?.id ? "Page mise à jour ✓" : "Page créée ✓");
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer cette page ?")) return;
    await fetch(`/api/admin/content/pages/${id}`, { method:"DELETE" });
    onReload(); showToast("Page supprimée");
  };

  const toggle = async (p: SitePage) => {
    await fetch(`/api/admin/content/pages/${p.id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ is_published: !p.is_published }) });
    onReload();
  };

  if (editing !== null) return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setEditing(null)} className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#F3EADB]">← Retour</button>
        <h2 className="font-fraunces text-lg text-[#F3EADB]">{editing.id ? "Modifier la page" : "Nouvelle page"}</h2>
      </div>
      {[
        { key:"title", label:"Titre *", placeholder:"Ma page" },
        { key:"slug", label:"Slug (URL)", placeholder:"ma-page" },
        { key:"meta_title", label:"Titre SEO", placeholder:"Titre affiché dans Google" },
        { key:"meta_desc", label:"Description SEO", placeholder:"Description courte (160 car.)" },
        { key:"nav_label", label:"Label navigation", placeholder:"Visible dans le menu si activé" },
      ].map(f => (
        <div key={f.key}>
          <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">{f.label}</label>
          <input value={(form as Record<string,string>)[f.key] ?? ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50" />
        </div>
      ))}
      <div>
        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Contenu (HTML)</label>
        <textarea value={form.content ?? ""} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={12}
          className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-3 py-2 font-mono text-xs text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50 resize-y" />
      </div>
      <div className="flex items-center gap-6">
        {[["is_published","Publiée"],["show_in_nav","Dans la navigation"]].map(([k,l]) => (
          <label key={k} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={Boolean((form as Record<string,unknown>)[k])} onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))}
              className="w-4 h-4 rounded accent-[#E0337E]" />
            <span className="font-hanken text-sm text-[#F3EADB]/60">{l}</span>
          </label>
        ))}
      </div>
      <button onClick={save} disabled={!form.title || saving}
        className="w-full py-2.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 disabled:opacity-40">
        {saving ? "Sauvegarde…" : "Sauvegarder la page"}
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-hanken text-sm text-[#F3EADB]/40">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90">
          <Plus size={13} /> Nouvelle page
        </button>
      </div>
      {pages.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#F3EADB]/10 rounded-2xl">
          <FileText size={32} className="mx-auto mb-3 text-[#F3EADB]/10" />
          <p className="font-hanken text-[#F3EADB]/30 mb-4">Aucune page personnalisée</p>
          <button onClick={openNew} className="px-4 py-2 rounded-xl border border-[#F3EADB]/15 text-[#F3EADB]/50 font-hanken text-sm hover:text-[#F3EADB]">Créer une page</button>
        </div>
      ) : pages.map(p => (
        <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#F3EADB]/8 hover:border-[#F3EADB]/15 transition-all">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-hanken text-sm text-[#F3EADB]">{p.title}</p>
              <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded border ${p.is_published ? "text-green-400 border-green-400/20" : "text-[#F3EADB]/25 border-[#F3EADB]/10"}`}>
                {p.is_published ? "Publiée" : "Brouillon"}
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#F3EADB]/25 mt-0.5">/{p.slug}</p>
          </div>
          <div className="flex items-center gap-1">
            <a href={`/${p.slug}`} target="_blank" rel="noreferrer"
              className="p-2 rounded-lg text-[#F3EADB]/20 hover:text-[#F3EADB] transition-colors"><ExternalLink size={12} /></a>
            <button onClick={() => toggle(p)} className="p-2 rounded-lg text-[#F3EADB]/20 hover:text-[#F3EADB] transition-colors">
              {p.is_published ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-[#F3EADB]/20 hover:text-[#F3EADB] transition-colors"><FileText size={12} /></button>
            <button onClick={() => del(p.id)} className="p-2 rounded-lg text-[#F3EADB]/20 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// NAV MANAGER
// ════════════════════════════════════════════════════════════════════
const NAV_LOCATIONS = [
  { id:"header", label:"Header (menu principal)" },
  { id:"footer", label:"Footer (liens)" },
  { id:"footer_legal", label:"Footer légal" },
];

function NavManager({ items, onReload, showToast }: { items: NavItem[]; onReload:()=>void; showToast:(m:string)=>void }) {
  const [activeTab, setActiveTab] = useState("header");
  const [adding, setAdding]       = useState(false);
  const [form, setForm]           = useState({ label:"", url:"", open_new_tab:false });
  const [saving, setSaving]       = useState(false);

  const filtered = items.filter(i => i.location === activeTab).sort((a,b) => a.sort_order - b.sort_order);

  const add = async () => {
    if (!form.label || !form.url) return;
    setSaving(true);
    await fetch("/api/admin/content/navigation", { method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ ...form, location: activeTab, sort_order: filtered.length + 1 }) });
    setForm({ label:"", url:"", open_new_tab:false }); setAdding(false); setSaving(false); onReload();
    showToast("Lien ajouté ✓");
  };

  const del = async (id: string) => {
    await fetch(`/api/admin/content/navigation/${id}`, { method:"DELETE" });
    onReload(); showToast("Lien supprimé");
  };

  const toggleActive = async (item: NavItem) => {
    await fetch("/api/admin/content/navigation", { method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify([{ id: item.id, is_active: !item.is_active }]) });
    onReload();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-[#F3EADB]/4 rounded-xl w-fit">
        {NAV_LOCATIONS.map(l => (
          <button key={l.id} onClick={() => setActiveTab(l.id)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all ${activeTab === l.id ? "bg-[#E0337E] text-white" : "text-[#F3EADB]/40 hover:text-[#F3EADB]"}`}>
            {l.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#F3EADB]/8 overflow-hidden">
        {filtered.map((item, idx) => (
          <div key={item.id} className={`flex items-center gap-3 px-4 py-3 border-b border-[#F3EADB]/5 last:border-0 ${!item.is_active ? "opacity-40" : ""}`}>
            <GripVertical size={13} className="text-[#F3EADB]/15 flex-shrink-0" />
            <span className="font-mono text-[9px] text-[#F3EADB]/20 w-4">{idx+1}</span>
            <div className="flex-1">
              <p className="font-hanken text-sm text-[#F3EADB]">{item.label}</p>
              <p className="font-mono text-[10px] text-[#F3EADB]/30">{item.url}</p>
            </div>
            {item.open_new_tab && <span className="font-mono text-[8px] text-[#F3EADB]/25 border border-[#F3EADB]/10 px-1.5 rounded">↗ nouvel onglet</span>}
            <button onClick={() => toggleActive(item)} className={`p-1.5 rounded-lg transition-colors ${item.is_active ? "text-[#F3EADB]/30 hover:text-[#F3EADB]" : "text-[#F3EADB]/15 hover:text-green-400"}`}>
              {item.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            <button onClick={() => del(item.id)} className="p-1.5 rounded-lg text-[#F3EADB]/20 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-8 font-hanken text-[#F3EADB]/25 text-sm">Aucun lien</p>}
      </div>

      {adding ? (
        <div className="p-4 rounded-2xl border border-[#E0337E]/20 bg-[#E0337E]/3 space-y-3">
          <p className="font-fraunces text-sm text-[#F3EADB]">Nouveau lien</p>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Label (ex: Boutique)"
              className="bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50" />
            <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="URL (ex: /boutique)"
              className="bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.open_new_tab} onChange={e => setForm(p => ({ ...p, open_new_tab: e.target.checked }))} className="accent-[#E0337E]" />
            <span className="font-hanken text-sm text-[#F3EADB]/50">Ouvrir dans un nouvel onglet</span>
          </label>
          <div className="flex gap-2">
            <button onClick={add} disabled={!form.label || !form.url || saving}
              className="px-4 py-1.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm disabled:opacity-40">{saving ? "…" : "Ajouter"}</button>
            <button onClick={() => setAdding(false)} className="px-4 py-1.5 rounded-xl border border-[#F3EADB]/10 text-[#F3EADB]/40 font-hanken text-sm">Annuler</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#F3EADB]/15 text-[#F3EADB]/40 font-hanken text-sm hover:text-[#F3EADB] hover:border-[#F3EADB]/25 transition-colors w-full justify-center">
          <Plus size={13} /> Ajouter un lien
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// POPUPS MANAGER
// ════════════════════════════════════════════════════════════════════
const TRIGGER_OPTIONS = [
  { value:"immediate", label:"Immédiat" },
  { value:"delay", label:"Après X secondes" },
  { value:"scroll", label:"Après X% de scroll" },
  { value:"exit_intent", label:"À la sortie" },
];

function PopupsManager({ popups, onReload, showToast }: { popups: Popup[]; onReload:()=>void; showToast:(m:string)=>void }) {
  const [editing, setEditing] = useState<Popup|null>(null);
  const [form, setForm]       = useState<Partial<Popup>>({});
  const [saving, setSaving]   = useState(false);

  const openNew = () => {
    setForm({ name:"", title:"", body:"", cta_label:"", cta_url:"", trigger:"delay", trigger_value:5, bg_color:"#3D1F5C", is_active:false, show_once:true });
    setEditing({ id:"" } as Popup);
  };

  const save = async () => {
    setSaving(true);
    if (editing?.id) {
      await fetch("/api/admin/content/popups", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id:editing.id, ...form }) });
    } else {
      await fetch("/api/admin/content/popups", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    }
    setSaving(false); setEditing(null); onReload();
    showToast(editing?.id ? "Popup mis à jour ✓" : "Popup créé ✓");
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ce popup ?")) return;
    await fetch("/api/admin/content/popups", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id }) });
    onReload(); showToast("Popup supprimé");
  };

  const toggleActive = async (p: Popup) => {
    await fetch("/api/admin/content/popups", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id:p.id, is_active:!p.is_active }) });
    onReload();
  };

  if (editing !== null) return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setEditing(null)} className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#F3EADB]">← Retour</button>
        <h2 className="font-fraunces text-lg text-[#F3EADB]">{editing.id ? "Modifier le popup" : "Nouveau popup"}</h2>
      </div>
      {[
        { key:"name", label:"Nom interne *", placeholder:"Ex: Popup bienvenue" },
        { key:"title", label:"Titre affiché", placeholder:"Bienvenue !" },
        { key:"cta_label", label:"Bouton CTA", placeholder:"Découvrir" },
        { key:"cta_url", label:"URL du CTA", placeholder:"/boutique" },
        { key:"image_url", label:"Image (URL)", placeholder:"https://..." },
      ].map(f => (
        <div key={f.key}>
          <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">{f.label}</label>
          <input value={(form as Record<string,string>)[f.key] ?? ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
            className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50" />
        </div>
      ))}
      <div>
        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Corps du texte</label>
        <textarea value={form.body ?? ""} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={4}
          className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50 resize-y" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Déclencheur</label>
          <select value={form.trigger ?? "delay"} onChange={e => setForm(p => ({ ...p, trigger: e.target.value }))}
            className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-3 py-2 font-hanken text-sm text-[#F3EADB] focus:outline-none">
            {TRIGGER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1.5">Valeur (sec / %)</label>
          <input type="number" value={form.trigger_value ?? 5} onChange={e => setForm(p => ({ ...p, trigger_value: Number(e.target.value) }))}
            className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-3 py-2 font-hanken text-sm text-[#F3EADB] focus:outline-none" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        {[["is_active","Actif"],["show_once","Afficher une seule fois"]].map(([k,l]) => (
          <label key={k} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={Boolean((form as Record<string,unknown>)[k])} onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))} className="accent-[#E0337E]" />
            <span className="font-hanken text-sm text-[#F3EADB]/60">{l}</span>
          </label>
        ))}
      </div>
      <button onClick={save} disabled={!form.name || saving}
        className="w-full py-2.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 disabled:opacity-40">
        {saving ? "Sauvegarde…" : "Sauvegarder"}
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-hanken text-sm text-[#F3EADB]/40">{popups.length} popup{popups.length !== 1 ? "s" : ""}</p>
        <button onClick={openNew} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90">
          <Plus size={13} /> Nouveau popup
        </button>
      </div>
      {popups.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#F3EADB]/10 rounded-2xl">
          <MousePointerClick size={32} className="mx-auto mb-3 text-[#F3EADB]/10" />
          <p className="font-hanken text-[#F3EADB]/30 mb-4">Aucun popup configuré</p>
        </div>
      ) : popups.map(p => (
        <div key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${p.is_active ? "border-[#E0337E]/20 bg-[#E0337E]/3" : "border-[#F3EADB]/8"}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-hanken text-sm text-[#F3EADB]">{p.name}</p>
              <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded border ${p.is_active ? "text-[#E0337E] border-[#E0337E]/20" : "text-[#F3EADB]/25 border-[#F3EADB]/10"}`}>
                {p.is_active ? "Actif" : "Inactif"}
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#F3EADB]/25 mt-0.5">
              {TRIGGER_OPTIONS.find(o => o.value === p.trigger)?.label} · {p.show_once ? "une seule fois" : "à chaque visite"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => toggleActive(p)} className="p-2 rounded-lg text-[#F3EADB]/25 hover:text-[#F3EADB] transition-colors">
              {p.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            <button onClick={() => { setEditing(p); setForm(p); }} className="p-2 rounded-lg text-[#F3EADB]/25 hover:text-[#F3EADB] transition-colors"><Layers size={12} /></button>
            <button onClick={() => del(p.id)} className="p-2 rounded-lg text-[#F3EADB]/20 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TESTIMONIALS MANAGER
// ════════════════════════════════════════════════════════════════════
function TestimonialsManager({ items, onReload, showToast }: { items: Testimonial[]; onReload:()=>void; showToast:(m:string)=>void }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState({ author:"", role:"", content:"", avatar_url:"", rating:5 });
  const [saving, setSaving] = useState(false);

  const add = async () => {
    setSaving(true);
    await fetch("/api/admin/content/testimonials", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    setForm({ author:"", role:"", content:"", avatar_url:"", rating:5 }); setAdding(false); setSaving(false); onReload();
    showToast("Témoignage ajouté ✓");
  };

  const del = async (id: string) => {
    await fetch("/api/admin/content/testimonials", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id }) });
    onReload(); showToast("Témoignage supprimé");
  };

  const toggleActive = async (t: Testimonial) => {
    await fetch("/api/admin/content/testimonials", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id:t.id, is_active:!t.is_active }) });
    onReload();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-hanken text-sm text-[#F3EADB]/40">{items.length} témoignage{items.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90">
          <Plus size={13} /> Ajouter
        </button>
      </div>

      {adding && (
        <div className="p-4 rounded-2xl border border-[#E0337E]/20 bg-[#E0337E]/3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[["author","Auteur *","Prénom Nom"],["role","Rôle","Cliente, Vendeur·se…"],["avatar_url","Avatar URL","https://…"]].map(([k,l,ph]) => (
              <div key={k} className={k === "author" ? "" : ""}>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1">{l}</label>
                <input value={(form as Record<string,string|number>)[k] as string ?? ""} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none" />
              </div>
            ))}
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1">Note (1-5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}
                className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-1">Témoignage *</label>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={3} placeholder="Texte du témoignage…"
              className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={add} disabled={!form.author || !form.content || saving}
              className="px-4 py-1.5 rounded-xl bg-[#E0337E] text-white font-hanken text-sm disabled:opacity-40">{saving ? "…" : "Ajouter"}</button>
            <button onClick={() => setAdding(false)} className="px-4 py-1.5 rounded-xl border border-[#F3EADB]/10 text-[#F3EADB]/40 font-hanken text-sm">Annuler</button>
          </div>
        </div>
      )}

      {items.length === 0 && !adding ? (
        <div className="text-center py-16 border border-dashed border-[#F3EADB]/10 rounded-2xl">
          <Star size={32} className="mx-auto mb-3 text-[#F3EADB]/10" />
          <p className="font-hanken text-[#F3EADB]/30">Aucun témoignage</p>
        </div>
      ) : items.map(t => (
        <div key={t.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${!t.is_active ? "opacity-40" : "border-[#F3EADB]/8 hover:border-[#F3EADB]/15"}`}>
          <div className="w-10 h-10 rounded-full bg-[#E0337E]/10 border border-[#E0337E]/20 flex items-center justify-center flex-shrink-0">
            {t.avatar_url ? <img src={t.avatar_url} alt="" className="w-full h-full rounded-full object-cover" /> : <span className="font-fraunces text-[#E0337E] text-base">{t.author[0]}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-hanken text-sm text-[#F3EADB] font-medium">{t.author}</p>
              {t.role && <p className="font-mono text-[10px] text-[#F3EADB]/30">{t.role}</p>}
              <div className="flex gap-0.5 ml-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} className={i < t.rating ? "text-[#E0901E]" : "text-[#F3EADB]/15"} fill={i < t.rating ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
            <p className="font-hanken text-xs text-[#F3EADB]/50 mt-1 line-clamp-2">{t.content}</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => toggleActive(t)} className="p-1.5 rounded-lg text-[#F3EADB]/20 hover:text-[#F3EADB] transition-colors">
              {t.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            <button onClick={() => del(t.id)} className="p-1.5 rounded-lg text-[#F3EADB]/20 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
