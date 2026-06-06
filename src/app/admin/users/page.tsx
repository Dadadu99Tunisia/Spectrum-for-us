"use client";
import { useEffect, useState, useCallback } from "react";
import { Users, Search, ShieldCheck, Ban, RotateCcw, ChevronDown } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

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
  super_admin: "text-[#E0337E] bg-[#E0337E]/10 border-[#E0337E]/20",
  ceo:         "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20",
  cfo:         "text-[#6D2DB5] bg-[#6D2DB5]/10 border-[#6D2DB5]/20",
  moderation:  "text-[#CF3F7C] bg-[#CF3F7C]/10 border-[#CF3F7C]/20",
  support:     "text-[#1C9C95] bg-[#1C9C95]/10 border-[#1C9C95]/20",
  marketing:   "text-blue-400 bg-blue-400/10 border-blue-400/20",
  commercial:  "text-green-400 bg-green-400/10 border-green-400/20",
  hr:          "text-purple-400 bg-purple-400/10 border-purple-400/20",
  vendor:      "text-[#F3EADB]/60 bg-white/[0.09] border-white/[0.14]",
  buyer:       "text-[#F3EADB]/30 bg-[#F3EADB]/3 border-white/[0.13]",
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
        <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#E0337E] text-white font-hanken text-sm shadow-xl">{toast}</div>
      )}

      <div>
        <h1 className="font-fraunces text-2xl text-[#F3EADB]">Utilisateurs</h1>
        <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">{total} compte{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-4 py-2 bg-white/[0.09] border border-white/[0.14] rounded-lg font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="bg-white/[0.09] border border-white/[0.14] rounded-lg px-3 py-2 font-mono text-xs text-[#F3EADB]/60 focus:outline-none focus:border-[#a78bfa]/50 transition-colors">
          {ROLES.map(r => <option key={r} value={r}>{r === "" ? "Tous les rôles" : r}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-white/[0.13] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.12] bg-white/[0.07]">
                  {["Utilisateur","Rôle","Statut","Dernière connexion","Inscription","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={`border-b border-white/[0.05] transition-colors ${u.is_suspended ? "bg-red-500/3" : "hover:bg-white/[0.07]"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#E0337E]/10 border border-[#E0337E]/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-fraunces text-xs text-[#E0337E]">
                            {(u.full_name || u.pseudo || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-hanken text-sm text-[#F3EADB]">{u.full_name || u.pseudo || "-"}</p>
                          <p className="font-mono text-[9px] text-[#F3EADB]/25">{u.id.slice(0,12)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editRole?.id === u.id ? (
                        <div className="flex items-center gap-1">
                          <select defaultValue={u.role}
                            onChange={e => changeRole(u.id, e.target.value)}
                            className="bg-[#0e061a] border border-[#E0337E]/40 rounded px-2 py-1 font-mono text-[10px] text-[#F3EADB] focus:outline-none text-xs">
                            {ROLES.filter(r => r !== "").map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <button onClick={() => setEditRole(null)} className="text-[#F3EADB]/30 hover:text-[#F3EADB] text-xs px-1">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => setEditRole({ id: u.id, current: u.role })}
                          className={`flex items-center gap-1 font-mono text-[9px] px-2 py-1 rounded-full border transition-colors hover:opacity-80 ${ROLE_COLOR[u.role] ?? "text-[#F3EADB]/30 bg-white/[0.09] border-white/[0.14]"}`}>
                          {u.role} <ChevronDown size={8} />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.is_suspended ? (
                        <span className="font-mono text-[9px] px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Suspendu</span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="font-mono text-[9px] text-[#F3EADB]/30">Actif</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-[#F3EADB]/25">
                        {u.last_seen_at ? new Date(u.last_seen_at).toLocaleDateString("fr-FR") : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-[#F3EADB]/25">
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
                            ? "text-green-400/60 hover:text-green-400 border border-green-500/20 hover:border-green-500/40"
                            : "text-[#F3EADB]/25 hover:text-red-400 border border-white/[0.13] hover:border-red-500/20"
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
              <span className="font-mono text-[10px] text-[#F3EADB]/25">
                {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)} sur {total}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.14] font-mono text-[10px] text-[#F3EADB]/40 hover:text-[#F3EADB] disabled:opacity-30 transition-colors">← Préc.</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.14] font-mono text-[10px] text-[#F3EADB]/40 hover:text-[#F3EADB] disabled:opacity-30 transition-colors">Suiv. →</button>
              </div>
            </div>
          )}
        </>
      )}

      {users.length === 0 && !loading && (
        <div className="text-center py-20">
          <Users size={40} className="mx-auto mb-3 text-[#F3EADB]/10" />
          <p className="font-hanken text-[#F3EADB]/30">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  );
}
