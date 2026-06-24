"use client";
import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Search, RefreshCw, ExternalLink, RotateCcw } from "lucide-react";
import Link from "next/link";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  tracking_number: string | null;
  dispute_status: string | null;
  refund_status: string | null;
  refund_amount: number | null;
  profiles: { id: string; full_name: string | null; pseudo: string | null } | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente", color: "text-[#FFD400] bg-[#FFD400]/10 border-[#FFD400]/20" },
  paid:      { label: "Payé",       color: "text-[#7A2BF0] bg-[#7A2BF0]/10 border-[#7A2BF0]/20" },
  shipped:   { label: "Expédié",    color: "text-[#2323C4] bg-[#2323C4]/10 border-[#2323C4]/20" },
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
          toast.startsWith("Erreur") ? "bg-red-500 text-white" : "bg-[#FF2DA0] text-white"
        }`}>{toast}</div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#101014]">Commandes</h1>
          <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">{total} commande{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#101014]/[0.14] text-[#101014]/40 hover:text-[#101014] transition-colors text-sm">
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101014]/25" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-4 py-2 bg-[#101014]/[0.09] border border-[#101014]/[0.14] rounded-lg font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
        </div>
        <div className="flex gap-1 p-1 bg-[#101014]/[0.08] rounded-lg flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${
                statusFilter === s ? "bg-[#FF2DA0] text-white" : "text-[#101014]/40 hover:text-[#101014]"
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
          <ShoppingCart size={40} className="mx-auto mb-3 text-[#101014]/10" />
          <p className="font-hanken text-[#101014]/30">Aucune commande</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[#101014]/[0.13] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#101014]/[0.12] bg-[#101014]/[0.07]">
                  {["ID","Client","Statut","Total","Litige","Remboursement","Date","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#101014]/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const statusUi = STATUS_CONFIG[order.status] ?? { label: order.status, color: "text-[#101014]/40 bg-[#101014]/[0.09] border-[#101014]/[0.14]" };
                  return (
                    <tr key={order.id} className="border-b border-[#101014]/[0.05] hover:bg-[#101014]/[0.07] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-[#101014]/30">
                          #{order.id.slice(0,8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-hanken text-sm text-[#101014]/70">
                          {order.profiles?.full_name ?? order.profiles?.pseudo ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${statusUi.color}`}>
                          {statusUi.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-fraunces text-sm text-[#101014]">
                          {Number(order.total_amount).toFixed(2)} €
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.dispute_status ? (
                          <span className="font-mono text-[9px] text-red-600">{order.dispute_status}</span>
                        ) : (
                          <span className="text-[#101014]/15">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {order.refund_status ? (
                          <span className="font-mono text-[9px] text-[#2323C4]">
                            {order.refund_status} {order.refund_amount ? `(${order.refund_amount}€)` : ""}
                          </span>
                        ) : (
                          <span className="text-[#101014]/15">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-[#101014]/30">
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
                              className="p-1.5 rounded-lg text-[#101014]/25 hover:text-[#FFD400] transition-colors disabled:opacity-40">
                              <RotateCcw size={12} />
                            </button>
                          )}
                          <Link href={`/admin/orders/${order.id}`}
                            className="p-1.5 rounded-lg text-[#101014]/25 hover:text-[#101014] transition-colors inline-flex">
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
              <span className="font-mono text-[10px] text-[#101014]/25">
                {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)} sur {total}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#101014]/[0.14] font-mono text-[10px] text-[#101014]/40 hover:text-[#101014] disabled:opacity-30 transition-colors">
                  ← Préc.
                </button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
                  className="px-3 py-1.5 rounded-lg border border-[#101014]/[0.14] font-mono text-[10px] text-[#101014]/40 hover:text-[#101014] disabled:opacity-30 transition-colors">
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
