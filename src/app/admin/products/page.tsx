"use client";
import { useEffect, useState, useCallback } from "react";
import { Package, Search, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Product = {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  image_url: string | null;
  shops: { id: string; name: string; slug: string } | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:   { label: "Actif",        color: "text-green-400 bg-green-400/10 border-green-400/20" },
  pending:  { label: "En attente",   color: "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20" },
  draft:    { label: "Brouillon",    color: "text-[#F3EADB]/40 bg-[#F3EADB]/5 border-[#F3EADB]/10" },
  rejected: { label: "Rejeté",       color: "text-red-400 bg-red-400/10 border-red-400/20" },
  inactive: { label: "Inactif",      color: "text-[#F3EADB]/30 bg-[#F3EADB]/3 border-[#F3EADB]/8" },
};

const STATUS_TABS = ["","pending","active","draft","rejected","inactive"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("pending");
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [toast, setToast]       = useState<string | null>(null);
  const LIMIT = 25;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    const res  = await fetch(`/api/admin/products?${params}`);
    const json = await res.json();
    setProducts(json.data ?? []);
    setTotal(json.meta?.total ?? 0);
    setLoading(false);
    setSelected(new Set());
  }, [page, status, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [status, search]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const bulkAction = async (newStatus: string) => {
    if (!selected.size) return;
    setBulkLoading(true);
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], status: newStatus }),
    });
    const json = await res.json();
    setBulkLoading(false);
    if (!json.error) {
      showToast(`${json.data?.updated} produit(s) mis à jour ✓`);
      fetchProducts();
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(prev => prev.size === products.length ? new Set() : new Set(products.map(p => p.id)));
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#E0337E] text-white font-hanken text-sm shadow-xl">{toast}</div>
      )}

      <div>
        <h1 className="font-fraunces text-2xl text-[#F3EADB]">Produits</h1>
        <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">{total} produit{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-[#F3EADB]/4 rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all ${
              status === s ? "bg-[#E0337E] text-white" : "text-[#F3EADB]/40 hover:text-[#F3EADB]"
            }`}>
            {s === "" ? "Tous" : STATUS_CONFIG[s]?.label ?? s}
          </button>
        ))}
      </div>

      {/* Search + bulk actions */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full pl-9 pr-4 py-2 bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/50 transition-colors" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#F3EADB]/40">{selected.size} sélectionné(s)</span>
            <button onClick={() => bulkAction("active")} disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[10px] hover:bg-green-500/20 transition-colors disabled:opacity-40">
              <CheckCircle size={11} /> Approuver
            </button>
            <button onClick={() => bulkAction("rejected")} disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] hover:bg-red-500/20 transition-colors disabled:opacity-40">
              <XCircle size={11} /> Rejeter
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package size={40} className="mx-auto mb-3 text-[#F3EADB]/10" />
          <p className="font-hanken text-[#F3EADB]/30">Aucun produit</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[#F3EADB]/8 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F3EADB]/6 bg-[#F3EADB]/2">
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox" checked={selected.size === products.length && products.length > 0}
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 rounded accent-[#E0337E] cursor-pointer" />
                  </th>
                  {["Produit","Boutique","Prix","Statut","Date",""].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const statusUi = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.draft;
                  return (
                    <tr key={p.id} className={`border-b border-[#F3EADB]/4 transition-colors ${selected.has(p.id) ? "bg-[#E0337E]/4" : "hover:bg-[#F3EADB]/2"}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)}
                          className="w-3.5 h-3.5 rounded accent-[#E0337E] cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-9 h-9 rounded-lg object-cover border border-[#F3EADB]/10 flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-[#F3EADB]/5 border border-[#F3EADB]/10 flex items-center justify-center flex-shrink-0">
                              <Package size={14} className="text-[#F3EADB]/20" />
                            </div>
                          )}
                          <p className="font-hanken text-sm text-[#F3EADB] truncate max-w-[200px]">{p.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-hanken text-sm text-[#F3EADB]/60">
                          {p.shops?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-fraunces text-sm text-[#F3EADB]">{Number(p.price).toFixed(2)} €</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-[#F3EADB]/25">
                          {new Date(p.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {p.status === "pending" && (
                            <>
                              <button
                                title="Approuver"
                                className="p-1.5 rounded-lg text-green-400/50 hover:text-green-400 border border-transparent hover:border-green-500/20 transition-colors"
                                onClick={() => { setSelected(new Set([p.id])); setTimeout(() => bulkAction("active"), 0); }}>
                                <CheckCircle size={12} />
                              </button>
                              <button
                                title="Rejeter"
                                className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-colors"
                                onClick={() => { setSelected(new Set([p.id])); setTimeout(() => bulkAction("rejected"), 0); }}>
                                <XCircle size={12} />
                              </button>
                            </>
                          )}
                          {p.shops?.slug && (
                            <a href={`/boutique/${p.shops.slug}`} target="_blank" rel="noreferrer"
                              className="p-1.5 rounded-lg text-[#F3EADB]/25 hover:text-[#F3EADB] border border-transparent hover:border-[#F3EADB]/10 transition-colors">
                              <Eye size={12} />
                            </a>
                          )}
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
              <span className="font-mono text-[10px] text-[#F3EADB]/25">
                {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} sur {total}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#F3EADB]/10 font-mono text-[10px] text-[#F3EADB]/40 hover:text-[#F3EADB] disabled:opacity-30 transition-colors">← Préc.</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
                  className="px-3 py-1.5 rounded-lg border border-[#F3EADB]/10 font-mono text-[10px] text-[#F3EADB]/40 hover:text-[#F3EADB] disabled:opacity-30 transition-colors">Suiv. →</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
