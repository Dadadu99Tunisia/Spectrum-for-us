"use client";
import { useEffect, useState, useCallback } from "react";
import { Users, Search, ShieldCheck, Ban, RotateCcw, ChevronDown, X, Loader2 } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type UserDetail = {
  id: string; full_name: string | null; pseudo: string | null; role: string; email: string | null;
  country: string | null; created_at: string; is_suspended: boolean;
  orders: Array<{ id: string; total_amount: number; status: string; created_at: string }>;
  orders_count: number; total_spent: number;
  bookings: Array<{ id: string; start_at: string; status: string; amount: number | null; products: { name: string | null; title: string | null } | null }>;
  bookings_count: number;
};

type User = {
  id: string;
  full_name: string | null;
  pseudo: string | null;
  role: string;
  is_suspended: boolean;
  country: string | null;
  last_seen_at: string | null;
  created_at: string;
};

const ROLES = ["","buyer","vendor","support","moderation","marketing","commercial","hr","cfo","ceo","super_admin"];
const ROLE_COLOR: Record<string, string> = {
  super_admin: "text-[#FF2DA0] bg-[#FF2DA0]/10 border-[#FF2DA0]/20",
  ceo:         "text-[#FFD400] bg-[#FFD400]/10 border-[#FFD400]/20",
  cfo:         "text-[#7A2BF0] bg-[#7A2BF0]/10 border-[#7A2BF0]/20",
  moderation:  "text-[#FF2DA0] bg-[#FF2DA0]/10 border-[#FF2DA0]/20",
  support:     "text-[#2323C4] bg-[#2323C4]/10 border-[#2323C4]/20",
  marketing:   "text-blue-400 bg-blue-400/10 border-blue-400/20",
  commercial:  "text-green-600 bg-green-400/10 border-green-400/20",
  hr:          "text-purple-400 bg-purple-400/10 border-purple-400/20",
  vendor:      "text-[#101014]/60 bg-[#101014]/[0.09] border-[#101014]/[0.14]",
  buyer:       "text-[#101014]/30 bg-[#101014]/3 border-[#101014]/[0.13]",
};

export default function UsersPage() {
  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast]       = useState<string | null>(null);
  const [editRole, setEditRole] = useState<{ id: string; current: string } | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openDetail = async (id: string) => {
    setDetailLoading(true); setDetail({ id } as UserDetail);
    const res = await fetch(`/api/admin/users/${id}`);
    const json = await res.json();
    setDetail(json.data ?? null);
    setDetailLoading(false);
  };
  const LIMIT = 25;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search)     params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    const res  = await fetch(`/api/admin/users?${params}`);
    const json = await res.json();
    setUsers(json.data ?? []);
    setTotal(json.meta?.total ?? 0);
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const toggleSuspend = async (user: User) => {
    setActionLoading(user.id + "suspend");
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_suspended: !user.is_suspended }),
    });
    const json = await res.json();
    setActionLoading(null);
    if (!json.error) {
      showToast(user.is_suspended ? "Compte réactivé ✓" : "Compte suspendu ✓");
      fetchUsers();
    }
  };

  const changeRole = async (userId: string, role: string) => {
    setActionLoading(userId + "role");
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const json = await res.json();
    setActionLoading(null);
    setEditRole(null);
    if (!json.error) { showToast("Rôle mis à jour ✓"); fetchUsers(); }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#FF2DA0] text-white font-hanken text-sm shadow-xl">{toast}</div>
      )}

      <div>
        <h1 className="font-fraunces text-2xl text-[#101014]">Utilisateurs</h1>
        <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">{total} compte{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101014]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-4 py-2 bg-[#101014]/[0.09] border border-[#101014]/[0.14] rounded-lg font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="bg-[#101014]/[0.09] border border-[#101014]/[0.14] rounded-lg px-3 py-2 font-mono text-xs text-[#101014]/60 focus:outline-none focus:border-[#a78bfa]/50 transition-colors">
          {ROLES.map(r => <option key={r} value={r}>{r === "" ? "Tous les rôles" : r}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[#101014]/[0.13] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#101014]/[0.12] bg-[#101014]/[0.07]">
                  {["Utilisateur","Rôle","Statut","Dernière connexion","Inscription","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#101014]/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={`border-b border-[#101014]/[0.05] transition-colors ${u.is_suspended ? "bg-red-500/3" : "hover:bg-[#101014]/[0.07]"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#FF2DA0]/10 border border-[#FF2DA0]/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-fraunces text-xs text-[#FF2DA0]">
                            {(u.full_name || u.pseudo || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <button onClick={() => openDetail(u.id)} className="text-left group">
                          <p className="font-hanken text-sm text-[#101014] group-hover:text-[#FF2DA0] transition-colors">{u.full_name || u.pseudo || "-"}</p>
                          <p className="font-mono text-[9px] text-[#101014]/25">{u.id.slice(0,12)}…</p>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editRole?.id === u.id ? (
                        <div className="flex items-center gap-1">
                          <select defaultValue={u.role}
                            onChange={e => changeRole(u.id, e.target.value)}
                            className="bg-white border border-[#FF2DA0]/40 rounded px-2 py-1 font-mono text-xs text-[#101014] focus:outline-none">
                            {ROLES.filter(r => r !== "").map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <button onClick={() => setEditRole(null)} className="text-[#101014]/30 hover:text-[#101014] text-xs px-1">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => setEditRole({ id: u.id, current: u.role })}
                          className={`flex items-center gap-1 font-mono text-[9px] px-2 py-1 rounded-full border transition-colors hover:opacity-80 ${ROLE_COLOR[u.role] ?? "text-[#101014]/30 bg-[#101014]/[0.09] border-[#101014]/[0.14]"}`}>
                          {u.role} <ChevronDown size={8} />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.is_suspended ? (
                        <span className="font-mono text-[9px] px-2 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">Suspendu</span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="font-mono text-[9px] text-[#101014]/30">Actif</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-[#101014]/25">
                        {u.last_seen_at ? new Date(u.last_seen_at).toLocaleDateString("fr-FR") : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-[#101014]/25">
                        {new Date(u.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        disabled={actionLoading === u.id + "suspend"}
                        onClick={() => toggleSuspend(u)}
                        title={u.is_suspended ? "Réactiver" : "Suspendre"}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                          u.is_suspended
                            ? "text-green-600/60 hover:text-green-600 border border-green-500/20 hover:border-green-500/40"
                            : "text-[#101014]/25 hover:text-red-600 border border-[#101014]/[0.13] hover:border-red-500/20"
                        }`}>
                        {u.is_suspended ? <RotateCcw size={12} /> : <Ban size={12} />}
                      </button>
                    </td>
                  </tr>
                ))}
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
                  className="px-3 py-1.5 rounded-lg border border-[#101014]/[0.14] font-mono text-[10px] text-[#101014]/40 hover:text-[#101014] disabled:opacity-30 transition-colors">← Préc.</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
                  className="px-3 py-1.5 rounded-lg border border-[#101014]/[0.14] font-mono text-[10px] text-[#101014]/40 hover:text-[#101014] disabled:opacity-30 transition-colors">Suiv. →</button>
              </div>
            </div>
          )}
        </>
      )}

      {users.length === 0 && !loading && (
        <div className="text-center py-20">
          <Users size={40} className="mx-auto mb-3 text-[#101014]/10" />
          <p className="font-hanken text-[#101014]/30">Aucun utilisateur trouvé</p>
        </div>
      )}

      {/* Panneau détail utilisateur */}
      {detail && (
        <div className="fixed inset-0 z-[80] flex justify-end" onClick={() => setDetail(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-fraunces text-xl text-[#101014]">Fiche utilisateur·ice</h2>
              <button onClick={() => setDetail(null)} className="text-[#101014]/40 hover:text-[#101014]"><X size={18} /></button>
            </div>
            {detailLoading || !detail.email && !detail.orders ? (
              <div className="flex items-center gap-2 text-[#101014]/40 py-10"><Loader2 size={15} className="animate-spin" /> Chargement…</div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="font-bricolage font-bold text-lg text-[#101014]">{detail.full_name || detail.pseudo || "—"}</p>
                  <p className="font-hanken text-sm text-[#101014]/55">{detail.email ?? "—"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${ROLE_COLOR[detail.role] ?? "text-[#101014]/40 border-[#101014]/15"}`}>{detail.role}</span>
                    {detail.is_suspended && <span className="font-mono text-[9px] px-2 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-400/20">suspendu</span>}
                    {detail.country && <span className="font-mono text-[9px] text-[#101014]/40">{detail.country}</span>}
                  </div>
                  <p className="font-mono text-[10px] text-[#101014]/30 mt-2">Inscrit·e le {new Date(detail.created_at).toLocaleDateString("fr-FR")}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#101014]/10 p-3">
                    <p className="font-mono text-[9px] text-[#101014]/35 uppercase">Commandes</p>
                    <p className="font-fraunces text-2xl text-[#101014]">{detail.orders_count}</p>
                    <p className="font-mono text-[10px] text-[#101014]/40">{detail.total_spent.toFixed(2)} € dépensés</p>
                  </div>
                  <div className="rounded-xl border border-[#101014]/10 p-3">
                    <p className="font-mono text-[9px] text-[#101014]/35 uppercase">Réservations</p>
                    <p className="font-fraunces text-2xl text-[#101014]">{detail.bookings_count}</p>
                  </div>
                </div>

                {detail.orders?.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] text-[#101014]/40 mb-2">Dernières commandes</p>
                    <div className="space-y-1.5">
                      {detail.orders.map(o => (
                        <div key={o.id} className="flex items-center justify-between rounded-lg border border-[#101014]/8 px-3 py-2">
                          <span className="font-mono text-[10px] text-[#101014]/45">#{o.id.slice(0,8).toUpperCase()} · {new Date(o.created_at).toLocaleDateString("fr-FR")}</span>
                          <span className="font-mono text-xs text-[#101014]">{Number(o.total_amount).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detail.bookings?.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] text-[#101014]/40 mb-2">Réservations</p>
                    <div className="space-y-1.5">
                      {detail.bookings.map(b => (
                        <div key={b.id} className="flex items-center justify-between rounded-lg border border-[#101014]/8 px-3 py-2">
                          <span className="font-hanken text-xs text-[#101014]">{b.products?.name || b.products?.title || "Service"}</span>
                          <span className="font-mono text-[10px] text-[#101014]/45">{new Date(b.start_at).toLocaleDateString("fr-FR")} · {b.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detail.orders_count === 0 && detail.bookings_count === 0 && (
                  <p className="font-hanken text-sm text-[#101014]/40">Aucune commande ni réservation pour l'instant.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
