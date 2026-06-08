"use client";
import { useEffect, useState, useCallback } from "react";
import { Package, Search, CheckCircle, XCircle, Eye, Pencil, Trash2, X } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Product = {
  id: string;
  name: string | null;
  title: string | null;
  price: number;
  listing_status: string | null;
  is_active: boolean;
  is_featured: boolean;
  category: string | null;
  subcategory: string | null;
  quantity: number | null;
  type: string | null;
  description?: string | null;
  image_url: string | null;
  slug: string | null;
  created_at: string;
  shops: { id: string; name: string; slug: string } | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  approved: { label: "Approuvé",  color: "text-green-600 bg-green-400/10 border-green-400/20" },
  pending:  { label: "En attente", color: "text-[#FFD400] bg-[#FFD400]/10 border-[#FFD400]/20" },
  draft:    { label: "Brouillon",  color: "text-[#101014]/40 bg-[#101014]/[0.09] border-[#101014]/[0.14]" },
  rejected: { label: "Rejeté",     color: "text-red-600 bg-red-400/10 border-red-400/20" },
};
const STATUS_TABS = ["", "pending", "approved", "rejected", "draft", "active", "inactive"];
const TAB_LABEL: Record<string, string> = { "": "Tous", active: "Visibles", inactive: "Masqués", ...Object.fromEntries(Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])) };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("");
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy]         = useState(false);
  const [toast, setToast]       = useState<string | null>(null);
  const [editing, setEditing]   = useState<Product | null>(null);
  const LIMIT = 25;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/admin/products?${params}`);
      const json = await res.json();
      setProducts(json.data ?? []);
      setTotal(json.meta?.total ?? 0);
      setSelected(new Set());
    } finally { setLoading(false); }
  }, [page, status, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [status, search]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  const bulkPatch = async (payload: Record<string, unknown>, ids?: string[]) => {
    const list = ids ?? [...selected];
    if (!list.length) return;
    setBusy(true);
    const res = await fetch("/api/admin/products", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: list, ...payload }),
    });
    const json = await res.json(); setBusy(false);
    if (!json.error) { showToast(`${json.data?.updated} produit(s) mis à jour ✓`); fetchProducts(); }
    else showToast(`Erreur : ${json.error}`);
  };

  const removeProducts = async (ids: string[]) => {
    if (!ids.length) return;
    if (!confirm(`Supprimer définitivement ${ids.length} produit(s) ? Cette action est irréversible.`)) return;
    setBusy(true);
    const res = await fetch("/api/admin/products", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const json = await res.json(); setBusy(false);
    if (!json.error) { showToast(`${json.data?.deleted} produit(s) supprimé(s) ✓`); fetchProducts(); }
    else showToast(`Erreur : ${json.error}`);
  };

  const saveEdit = async (p: Product) => {
    setBusy(true);
    const res = await fetch("/api/admin/products", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id, name: p.name, title: p.title, price: p.price, category: p.category,
        subcategory: p.subcategory, quantity: p.quantity, description: p.description,
        image_url: p.image_url, listing_status: p.listing_status, is_active: p.is_active, is_featured: p.is_featured,
      }),
    });
    const json = await res.json(); setBusy(false);
    if (!json.error) { showToast("Produit enregistré ✓"); setEditing(null); fetchProducts(); }
    else showToast(`Erreur : ${json.error}`);
  };

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(prev => prev.size === products.length ? new Set() : new Set(products.map(p => p.id)));

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-16 right-6 z-[60] px-4 py-2 rounded-lg bg-[#FF2DA0] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-fraunces text-2xl text-[#101014]">Produits</h1>
          <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">{total} produit{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-[#101014]/[0.08] rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all ${status === s ? "bg-[#FF2DA0] text-white" : "text-[#101014]/40 hover:text-[#101014]"}`}>
            {TAB_LABEL[s] ?? s}
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101014]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit…"
            className="w-full pl-9 pr-4 py-2 bg-[#101014]/[0.09] border border-[#101014]/[0.14] rounded-lg font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#a78bfa]/50" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-[#101014]/40">{selected.size} sélectionné(s)</span>
            <button onClick={() => bulkPatch({ listing_status: "approved" })} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 font-mono text-[10px] hover:bg-green-500/20 disabled:opacity-40"><CheckCircle size={11} /> Approuver</button>
            <button onClick={() => bulkPatch({ listing_status: "rejected" })} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 font-mono text-[10px] hover:bg-red-500/20 disabled:opacity-40"><XCircle size={11} /> Rejeter</button>
            <button onClick={() => bulkPatch({ is_active: true })} disabled={busy} className="px-3 py-1.5 rounded-lg bg-[#101014]/[0.08] border border-[#101014]/[0.14] text-[#101014]/70 font-mono text-[10px] hover:bg-[#101014]/[0.12] disabled:opacity-40">Afficher</button>
            <button onClick={() => bulkPatch({ is_active: false })} disabled={busy} className="px-3 py-1.5 rounded-lg bg-[#101014]/[0.08] border border-[#101014]/[0.14] text-[#101014]/70 font-mono text-[10px] hover:bg-[#101014]/[0.12] disabled:opacity-40">Masquer</button>
            <button onClick={() => removeProducts([...selected])} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 font-mono text-[10px] hover:bg-red-500/20 disabled:opacity-40"><Trash2 size={11} /> Supprimer</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20"><Package size={40} className="mx-auto mb-3 text-[#101014]/10" /><p className="font-hanken text-[#101014]/30">Aucun produit</p></div>
      ) : (
        <>
          <div className="rounded-xl border border-[#101014]/[0.13] overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[#101014]/[0.12] bg-[#101014]/[0.07]">
                  <th className="px-4 py-3 w-8"><input type="checkbox" checked={selected.size === products.length && products.length > 0} onChange={toggleAll} className="w-3.5 h-3.5 rounded accent-[#FF2DA0] cursor-pointer" /></th>
                  {["Produit", "Boutique", "Prix", "Statut", "Visible", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#101014]/25">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const ui = STATUS_CONFIG[p.listing_status ?? "draft"] ?? STATUS_CONFIG.draft;
                  return (
                    <tr key={p.id} className={`border-b border-[#101014]/[0.05] ${selected.has(p.id) ? "bg-[#FF2DA0]/5" : "hover:bg-[#101014]/[0.07]"}`}>
                      <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="w-3.5 h-3.5 rounded accent-[#FF2DA0] cursor-pointer" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.image_url ? <img src={p.image_url} alt="" className="w-9 h-9 rounded-lg object-cover border border-[#101014]/[0.14]" /> : <div className="w-9 h-9 rounded-lg bg-[#101014]/[0.09] border border-[#101014]/[0.14] flex items-center justify-center"><Package size={14} className="text-[#101014]/20" /></div>}
                          <p className="font-hanken text-sm text-[#101014] truncate max-w-[220px]">{p.name || p.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="font-hanken text-sm text-[#101014]/60">{p.shops?.name ?? "-"}</span></td>
                      <td className="px-4 py-3"><span className="font-fraunces text-sm text-[#101014]">{Number(p.price).toFixed(2)} €</span></td>
                      <td className="px-4 py-3"><span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${ui.color}`}>{ui.label}</span></td>
                      <td className="px-4 py-3">
                        <button onClick={() => bulkPatch({ is_active: !p.is_active }, [p.id])} disabled={busy}
                          className={`font-mono text-[9px] px-2 py-1 rounded-full border ${p.is_active ? "text-green-600 bg-green-400/10 border-green-400/20" : "text-[#101014]/30 bg-[#101014]/[0.06] border-[#101014]/[0.12]"}`}>
                          {p.is_active ? "Oui" : "Non"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button title="Modifier" onClick={() => setEditing({ ...p })} className="p-1.5 rounded-lg text-[#101014]/40 hover:text-[#a78bfa] border border-transparent hover:border-[#101014]/[0.14]"><Pencil size={12} /></button>
                          {p.slug && <a href={`/produit/${p.slug}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-[#101014]/25 hover:text-[#101014] border border-transparent hover:border-[#101014]/[0.14]"><Eye size={12} /></a>}
                          <button title="Supprimer" onClick={() => removeProducts([p.id])} className="p-1.5 rounded-lg text-red-600/50 hover:text-red-600 border border-transparent hover:border-red-500/20"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {total > LIMIT && (
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#101014]/25">{(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)} sur {total}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-[#101014]/[0.14] font-mono text-[10px] text-[#101014]/40 hover:text-[#101014] disabled:opacity-30">← Préc.</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total} className="px-3 py-1.5 rounded-lg border border-[#101014]/[0.14] font-mono text-[10px] text-[#101014]/40 hover:text-[#101014] disabled:opacity-30">Suiv. →</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#ffffff] border border-[#101014]/[0.12] p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-fraunces text-xl text-[#101014]">Modifier le produit</h2>
              <button onClick={() => setEditing(null)} className="text-[#101014]/40 hover:text-[#101014]"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Nom"><input value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix (€)"><input type="number" step="0.01" value={editing.price ?? 0} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} className={inputCls} /></Field>
                <Field label="Stock"><input type="number" value={editing.quantity ?? 0} onChange={e => setEditing({ ...editing, quantity: Number(e.target.value) })} className={inputCls} /></Field>
              </div>
              <Field label="Catégorie"><input value={editing.category ?? ""} onChange={e => setEditing({ ...editing, category: e.target.value })} className={inputCls} /></Field>
              <Field label="Image (URL)"><input value={editing.image_url ?? ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} className={inputCls} /></Field>
              <Field label="Description"><textarea rows={3} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Statut">
                  <select value={editing.listing_status ?? "draft"} onChange={e => setEditing({ ...editing, listing_status: e.target.value })} className={inputCls}>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k} className="bg-[#ffffff]">{v.label}</option>)}
                  </select>
                </Field>
                <Field label="Visibilité">
                  <select value={editing.is_active ? "1" : "0"} onChange={e => setEditing({ ...editing, is_active: e.target.value === "1" })} className={inputCls}>
                    <option value="1" className="bg-[#ffffff]">Visible</option>
                    <option value="0" className="bg-[#ffffff]">Masqué</option>
                  </select>
                </Field>
              </div>
              <label className="flex items-center gap-2 font-hanken text-sm text-[#101014]/70">
                <input type="checkbox" checked={!!editing.is_featured} onChange={e => setEditing({ ...editing, is_featured: e.target.checked })} className="w-4 h-4 rounded accent-[#FF2DA0]" /> Mis en avant
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => saveEdit(editing)} disabled={busy} className="flex-1 py-2.5 rounded-lg bg-[#FF2DA0] text-white font-hanken font-semibold text-sm hover:brightness-110 disabled:opacity-50">Enregistrer</button>
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-[#101014]/[0.14] text-[#101014]/60 font-hanken text-sm hover:text-[#101014]">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 bg-[#101014]/[0.07] border border-[#101014]/[0.14] rounded-lg font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#a78bfa]/50";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block font-mono text-[10px] uppercase tracking-wide text-[#101014]/35 mb-1.5">{label}</label>{children}</div>;
}
