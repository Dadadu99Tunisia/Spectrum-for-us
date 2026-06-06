"use client";
import { useEffect, useState, useCallback } from "react";
import {
  ShieldCheck, Package, Store, Flag, CheckCircle, XCircle,
  Eye, RefreshCw, Clock, ExternalLink, Image as ImageIcon,
  ChevronDown, SquareCheckBig, Minus,
} from "lucide-react";
import Link from "next/link";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type ModItem = {
  id: string;
  target_type: string;
  target_id: string;
  reason: string | null;
  mod_status: string;
  notes: string | null;
  created_at: string;
  // enriched from content preview
  preview?: {
    title: string;
    image_url: string | null;
    price?: number;
    shop_name?: string;
    slug?: string;
  } | null;
};

const TYPE_CFG: Record<string, { label: string; icon: React.ElementType; color: string; accent: string }> = {
  product: { label: "Produit",      icon: Package,     color: "#E0901E", accent: "rgba(224,144,30,.08)" },
  vendor:  { label: "Vendeur",      icon: Store,       color: "#a78bfa", accent: "rgba(167,139,250,.08)" },
  report:  { label: "Signalement",  icon: Flag,        color: "#f87171", accent: "rgba(248,113,113,.08)" },
  content: { label: "Contenu",      icon: ShieldCheck, color: "#1C9C95", accent: "rgba(28,156,149,.08)" },
};

const STATUS_TABS = ["pending","approved","rejected"] as const;
const TYPE_TABS   = ["","product","vendor","report","content"] as const;
const LIMIT = 50;

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export default function ModerationPage() {
  const [items, setItems]           = useState<ModItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [status, setStatus]         = useState<string>("pending");
  const [type, setType]             = useState<string>("");
  const [counts, setCounts]         = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected]     = useState<ModItem | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setCheckedIds(new Set());
    const p = new URLSearchParams({ status, limit: String(LIMIT) });
    if (type) p.set("type", type);
    const res  = await fetch(`/api/admin/moderation?${p}`);
    const json = await res.json();
    const raw: ModItem[] = json.data ?? [];

    // Enrich with content preview
    const enriched = await Promise.all(raw.map(async item => {
      try {
        if (item.target_type === "product") {
          const r = await fetch(`/api/admin/products?id=${item.target_id}`).then(r => r.json());
          const p = r.data?.[0];
          if (p) return { ...item, preview: { title: p.title, image_url: p.image_url, price: p.price, shop_name: p.shops?.name } };
        }
        if (item.target_type === "vendor") {
          const r = await fetch(`/api/admin/vendors/${item.target_id}`).then(r => r.json());
          const v = r.data;
          if (v) return { ...item, preview: { title: v.name, image_url: null, slug: v.slug } };
        }
      } catch { /* silent */ }
      return item;
    }));

    setItems(enriched);
    setLoading(false);
  }, [status, type]);

  const fetchCounts = useCallback(async () => {
    const results = await Promise.all(
      STATUS_TABS.map(s => fetch(`/api/admin/moderation?status=${s}&limit=1`).then(r => r.json()).catch(() => ({})))
    );
    const c: Record<string, number> = {};
    STATUS_TABS.forEach((s, i) => { c[s] = results[i]?.meta?.total ?? 0; });
    setCounts(c);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleAction = async (id: string, action: "approve" | "reject", notes?: string) => {
    setActionLoading(id + action);
    await fetch(`/api/admin/moderation/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes: notes ?? notesInput }),
    });
    setSelected(null);
    setNotesInput("");
    setActionLoading(null);
    setCheckedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    fetchItems();
    fetchCounts();
  };

  const handleBulk = async (action: "approve" | "reject") => {
    const ids = [...checkedIds];
    if (!ids.length) return;
    setActionLoading("bulk");
    await Promise.all(ids.map(id => fetch(`/api/admin/moderation/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes: `Bulk ${action}` }),
    })));
    setCheckedIds(new Set());
    setActionLoading(null);
    fetchItems();
    fetchCounts();
  };

  const toggleCheck = (id: string) =>
    setCheckedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const allPending = items.filter(i => i.mod_status === "pending");
  const allChecked = allPending.length > 0 && allPending.every(i => checkedIds.has(i.id));

  const toggleAll = () => {
    if (allChecked) setCheckedIds(new Set());
    else setCheckedIds(new Set(allPending.map(i => i.id)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Modération</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">File de validation des contenus</p>
        </div>
        <button onClick={() => { fetchItems(); fetchCounts(); }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.12] text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors text-sm">
          <RefreshCw size={13} /> Actualiser
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.06] rounded-xl w-fit">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all ${
              status === s ? "bg-[#E0337E] text-white shadow-lg shadow-[#E0337E]/20" : "text-[#F3EADB]/40 hover:text-[#F3EADB]"
            }`}>
            {s === "pending" ? "En attente" : s === "approved" ? "Approuvés" : "Rejetés"}
            {counts[s] !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                s === "pending" && counts[s] > 0 ? "bg-red-500 text-white" : "bg-white/[0.10] text-[#F3EADB]/50"
              }`}>{counts[s]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Type filter + bulk bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {TYPE_TABS.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wide transition-all border ${
                type === t
                  ? "bg-white/[0.10] border-white/[0.20] text-[#F3EADB]"
                  : "border-transparent text-[#F3EADB]/30 hover:text-[#F3EADB]/60 hover:border-white/[0.08]"
              }`}>
              {t === "" ? "Tous" : TYPE_CFG[t]?.label ?? t}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {checkedIds.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E0337E]/10 border border-[#E0337E]/25">
            <span className="font-mono text-[10px] text-[#F3EADB]/60">{checkedIds.size} sélectionné{checkedIds.size > 1 ? "s" : ""}</span>
            <button onClick={() => handleBulk("approve")} disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/25 text-green-400 font-hanken text-xs hover:bg-green-500/25 transition-colors disabled:opacity-40">
              <CheckCircle size={12} /> Approuver tout
            </button>
            <button onClick={() => handleBulk("reject")} disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 font-hanken text-xs hover:bg-red-500/25 transition-colors disabled:opacity-40">
              <XCircle size={12} /> Rejeter tout
            </button>
          </div>
        )}
      </div>

      {/* Queue */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-24">
          <ShieldCheck size={40} className="mx-auto mb-3 text-[#F3EADB]/10" />
          <p className="font-hanken text-[#F3EADB]/30">
            {status === "pending" ? "File vide · tout est à jour ✓" : "Aucun élément"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Select all header */}
          {status === "pending" && allPending.length > 1 && (
            <div className="flex items-center gap-3 px-4 py-2">
              <button onClick={toggleAll}
                className="flex items-center gap-2 font-mono text-[10px] text-[#F3EADB]/35 hover:text-[#F3EADB]/70 transition-colors">
                {allChecked
                  ? <SquareCheckBig size={13} className="text-[#E0337E]" />
                  : <Minus size={13} />}
                {allChecked ? "Tout désélectionner" : `Tout sélectionner (${allPending.length})`}
              </button>
            </div>
          )}

          {items.map(item => {
            const cfg  = TYPE_CFG[item.target_type] ?? { label: item.target_type, icon: ShieldCheck, color: "#F3EADB", accent: "rgba(243,234,219,.05)" };
            const Icon = cfg.icon;
            const isSelected  = selected?.id === item.id;
            const isChecked   = checkedIds.has(item.id);
            const isPending   = item.mod_status === "pending";

            return (
              <div key={item.id}
                className={`rounded-2xl border transition-all ${
                  isSelected ? "border-[#E0337E]/40 bg-[#E0337E]/5" :
                  isChecked  ? "border-[#a78bfa]/30 bg-[#a78bfa]/5" :
                  "border-white/[0.10] bg-white/[0.04] hover:border-white/[0.16]"
                }`}>
                <div className="flex items-center gap-3 p-4">
                  {/* Checkbox (only pending) */}
                  {isPending && (
                    <button onClick={() => toggleCheck(item.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isChecked ? "bg-[#a78bfa] border-[#a78bfa]" : "border-white/[0.20] bg-white/[0.04] hover:border-white/[0.40]"
                      }`}>
                      {isChecked && <CheckCircle size={10} className="text-white" />}
                    </button>
                  )}

                  {/* Preview image */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: cfg.accent, border: `1px solid ${cfg.color}25` }}>
                    {item.preview?.image_url ? (
                      <img src={item.preview.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={18} style={{ color: cfg.color }} />
                    )}
                  </div>

                  {/* Content info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                        style={{ color: cfg.color, borderColor: `${cfg.color}30`, background: cfg.accent }}>
                        {cfg.label}
                      </span>
                      {item.preview?.title ? (
                        <span className="font-hanken text-sm text-[#F3EADB] truncate">{item.preview.title}</span>
                      ) : (
                        <span className="font-mono text-[10px] text-[#F3EADB]/30">{item.target_id.slice(0, 12).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[#F3EADB]/35">
                      {item.preview?.shop_name && (
                        <span className="font-mono text-[10px]">{item.preview.shop_name}</span>
                      )}
                      {item.preview?.price !== undefined && (
                        <span className="font-mono text-[10px] text-[#1C9C95]/70">{fmt(item.preview.price)}</span>
                      )}
                      {item.reason && (
                        <span className="font-hanken text-xs text-[#f87171]/70 truncate max-w-48">{item.reason}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={9} className="text-[#F3EADB]/20" />
                      <span className="font-mono text-[9px] text-[#F3EADB]/25">
                        {new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* View link */}
                    {item.target_type === "product" && (
                      <Link href={`/admin/products`}
                        className="p-2 rounded-lg border border-white/[0.10] text-[#F3EADB]/35 hover:text-[#F3EADB] transition-colors" title="Voir dans Produits">
                        <ExternalLink size={13} />
                      </Link>
                    )}
                    {item.target_type === "vendor" && item.preview?.slug && (
                      <Link href={`/admin/vendors/${item.target_id}`}
                        className="p-2 rounded-lg border border-white/[0.10] text-[#F3EADB]/35 hover:text-[#F3EADB] transition-colors" title="Voir vendeur">
                        <ExternalLink size={13} />
                      </Link>
                    )}

                    {isPending ? (
                      <>
                        <button onClick={() => { setSelected(isSelected ? null : item); setNotesInput(""); }}
                          className={`p-2 rounded-lg border transition-colors ${isSelected ? "border-[#E0337E]/40 bg-[#E0337E]/10 text-[#E0337E]" : "border-white/[0.12] text-[#F3EADB]/40 hover:text-[#F3EADB]"}`}>
                          <Eye size={13} />
                        </button>
                        <button disabled={!!actionLoading} onClick={() => handleAction(item.id, "reject")}
                          className="p-2 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                          <XCircle size={13} />
                        </button>
                        <button disabled={!!actionLoading} onClick={() => handleAction(item.id, "approve")}
                          className="p-2 rounded-lg border border-green-500/20 text-green-400/60 hover:text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40">
                          <CheckCircle size={13} />
                        </button>
                      </>
                    ) : (
                      <span className={`font-mono text-[10px] px-2 py-1 rounded-full border ${
                        item.mod_status === "approved"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {item.mod_status === "approved" ? "✓ Approuvé" : "✗ Rejeté"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded notes panel */}
                {isSelected && (
                  <div className="px-4 pb-4 border-t border-white/[0.10] pt-4">
                    <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase tracking-widest mb-2">Notes de modération</p>
                    <textarea value={notesInput} onChange={e => setNotesInput(e.target.value)}
                      placeholder="Raison de la décision (optionnel)…" rows={2}
                      className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-2 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#a78bfa]/50 resize-none mb-3 transition-colors" />
                    <div className="flex gap-2">
                      <button disabled={!!actionLoading} onClick={() => handleAction(item.id, "reject")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-hanken text-sm hover:bg-red-500/20 transition-colors disabled:opacity-40">
                        <XCircle size={13} /> Rejeter
                      </button>
                      <button disabled={!!actionLoading} onClick={() => handleAction(item.id, "approve")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-hanken text-sm hover:bg-green-500/20 transition-colors disabled:opacity-40">
                        <CheckCircle size={13} /> Approuver
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
