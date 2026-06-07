"use client";
import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Search, RefreshCw, ExternalLink, RotateCcw } from "lucide-react";
import Link from "next/link";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  tracking_number: string | null;
  dispute_status: string | null;
  refund_status: string | null;
  refund_amount: number | null;
  profiles: { id: string; full_name: string | null; pseudo: string | null } | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente", color: "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20" },
  paid:      { label: "Payé",       color: "text-[#6D2DB5] bg-[#6D2DB5]/10 border-[#6D2DB5]/20" },
  shipped:   { label: "Expédié",    color: "text-[#1C9C95] bg-[#1C9C95]/10 border-[#1C9C95]/20" },
  delivered: { label: "Livré",      color: "text-green-600 bg-green-400/10 border-green-400/20" },
  cancelled: { label: "Annulé",     color: "text-red-600 bg-red-400/10 border-red-400/20" },
};

const STATUS_FILTERS = ["","pending","paid","shipped","delivered","cancelled"];

export default function OrdersPage() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [refunding, setRefunding] = useState<string | null>(null);
  const [toast, setToast]       = useState<string | null>(null);
  const LIMIT = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (statusFilter) params.set("status", statusFilter);
    if (search)       params.set("search", search);
    try {
      const res = await fetch(`/api/admin/orders?${params}`);
      const json = await res.json();
      setOrders(json.data ?? []);
      setTotal(json.meta?.total ?? 0);
    } catch {
      // silently fail · show empty state
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [statusFilter, search]);

  const handleRefund = async (orderId: string) => {
    if (!confirm("Rembourser cette commande ?")) return;
    setRefunding(orderId);
    const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Remboursement admin" }),
    });
    const json = await res.json();
    setRefunding(null);
    if (json.error) {
      setToast(`Erreur : ${json.error}`);
    } else {
      setToast("Remboursement effectué ✓");
      fetchOrders();
    }
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-16 right-6 z-50 px-4 py-2 rounded-lg font-hanken text-sm shadow-xl ${
          toast.startsWith("Erreur") ? "bg-red-500 text-white" : "bg-[#FF3D7F] text-white"
        }`}>{toast}</div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#1A1612]">Commandes</h1>
          <p className="font-hanken text-sm text-[#1A1612]/40 mt-0.5">{total} commande{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1A1612]/[0.14] text-[#1A1612]/40 hover:text-[#1A1612] transition-colors text-sm">
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1612]/25" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-4 py-2 bg-[#1A1612]/[0.09] border border-[#1A1612]/[0.14] rounded-lg font-hanken text-sm text-[#1A1612] placeholder-[#1A1612]/25 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
        </div>
        <div className="flex gap-1 p-1 bg-[#1A1612]/[0.08] rounded-lg flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${
                statusFilter === s ? "bg-[#FF3D7F] text-white" : "text-[#1A1612]/40 hover:text-[#1A1612]"
              }`}>
              {s === "" ? "Tous" : STATUS_CONFIG[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart size={40} className="mx-auto mb-3 text-[#1A1612]/10" />
          <p className="font-hanken text-[#1A1612]/30">Aucune commande</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[#1A1612]/[0.13] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A1612]/[0.12] bg-[#1A1612]/[0.07]">
                  {["ID","Client","Statut","Total","Litige","Remboursement","Date","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const statusUi = STATUS_CONFIG[order.status] ?? { label: order.status, color: "text-[#1A1612]/40 bg-[#1A1612]/[0.09] border-[#1A1612]/[0.14]" };
                  return (
                    <tr key={order.id} className="border-b border-[#1A1612]/[0.05] hover:bg-[#1A1612]/[0.07] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-[#1A1612]/30">
                          #{order.id.slice(0,8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-hanken text-sm text-[#1A1612]/70">
                          {order.profiles?.full_name ?? order.profiles?.pseudo ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-fraunces text-sm text-[#1A1612]">
                          {Number(order.total).toFixed(2)} €
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.dispute_status ? (
                          <span className="font-mono text-[9px] text-red-600">{order.dispute_status}</span>
                        ) : (
                          <span className="text-[#1A1612]/15">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {order.refund_status ? (
                          <span className="font-mono text-[9px] text-[#1C9C95]">
                            {order.refund_status} {order.refund_amount ? `(${order.refund_amount}€)` : ""}
                          </span>
                        ) : (
                          <span className="text-[#1A1612]/15">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-[#1A1612]/30">
                          {new Date(order.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {order.status === "paid" && !order.refund_status && (
                            <button
                              onClick={() => handleRefund(order.id)}
                              disabled={refunding === order.id}
                              title="Rembourser"
                              className="p-1.5 rounded-lg text-[#1A1612]/25 hover:text-[#E0901E] transition-colors disabled:opacity-40">
                              <RotateCcw size={12} />
                            </button>
                          )}
                          <Link href={`/admin/orders/${order.id}`}
                            className="p-1.5 rounded-lg text-[#1A1612]/25 hover:text-[#1A1612] transition-colors inline-flex">
                            <ExternalLink size={12} />
                          </Link>
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
              <span className="font-mono text-[10px] text-[#1A1612]/25">
                {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)} sur {total}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#1A1612]/[0.14] font-mono text-[10px] text-[#1A1612]/40 hover:text-[#1A1612] disabled:opacity-30 transition-colors">
                  ← Préc.
                </button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
                  className="px-3 py-1.5 rounded-lg border border-[#1A1612]/[0.14] font-mono text-[10px] text-[#1A1612]/40 hover:text-[#1A1612] disabled:opacity-30 transition-colors">
                  Suiv. →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
