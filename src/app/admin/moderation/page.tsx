"use client";
import { useEffect, useState, useCallback } from "react";
import { ShieldCheck, Package, Store, Flag, CheckCircle, XCircle, Eye, RefreshCw, Clock } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type ModItem = {
  id: string;
  target_type: string;
  target_id: string;
  reason: string | null;
  mod_status: string;
  notes: string | null;
  created_at: string;
};

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  product: { label: "Produit",  icon: Package, color: "text-[#E0901E]" },
  vendor:  { label: "Vendeur",  icon: Store,   color: "text-[#6D2DB5]" },
  report:  { label: "Signalement", icon: Flag, color: "text-red-400"  },
  content: { label: "Contenu",  icon: ShieldCheck, color: "text-[#1C9C95]" },
};

const STATUS_TABS = ["pending","approved","rejected"] as const;
const TYPE_TABS   = ["","product","vendor","report","content"] as const;

export default function ModerationPage() {
  const [items, setItems]       = useState<ModItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState<string>("pending");
  const [type, setType]         = useState<string>("");
  const [counts, setCounts]     = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<ModItem | null>(null);
  const [notesInput, setNotesInput] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status, limit: "50" });
    if (type) params.set("type", type);
    const res = await fetch(`/api/admin/moderation?${params}`);
    const json = await res.json();
    setItems(json.data ?? []);
    setLoading(false);
  }, [status, type]);

  const fetchCounts = useCallback(async () => {
    const res = await Promise.all(
      STATUS_TABS.map(s => fetch(`/api/admin/moderation?status=${s}&limit=1`).then(r => r.json()))
    );
    const c: Record<string, number> = {};
    STATUS_TABS.forEach((s, i) => { c[s] = res[i]?.meta?.total ?? 0; });
    setCounts(c);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id + action);
    await fetch(`/api/admin/moderation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes: notesInput }),
    });
    setSelected(null);
    setNotesInput("");
    setActionLoading(null);
    fetchItems();
    fetchCounts();
  };

  const pending = items.filter(i => i.mod_status === "pending");
  const reviewed = items.filter(i => i.mod_status !== "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Modération</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">File de validation des contenus</p>
        </div>
        <button onClick={() => { fetchItems(); fetchCounts(); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#F3EADB]/10 text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors text-sm">
          <RefreshCw size={13} /> Actualiser
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-[#F3EADB]/4 rounded-xl w-fit">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all ${
              status === s
                ? "bg-[#E0337E] text-white"
                : "text-[#F3EADB]/40 hover:text-[#F3EADB]"
            }`}>
            {s === "pending" ? "En attente" : s === "approved" ? "Approuvé" : "Rejeté"}
            {counts[s] !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                s === "pending" && counts[s] > 0 ? "bg-red-500 text-white" : "bg-[#F3EADB]/10"
              }`}>{counts[s]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_TABS.map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wide transition-all ${
              type === t
                ? "bg-[#F3EADB]/10 text-[#F3EADB]"
                : "text-[#F3EADB]/30 hover:text-[#F3EADB]/60"
            }`}>
            {t === "" ? "Tous" : TYPE_CONFIG[t]?.label ?? t}
          </button>
        ))}
      </div>

      {/* Queue */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <ShieldCheck size={40} className="mx-auto mb-3 text-[#F3EADB]/10" />
          <p className="font-hanken text-[#F3EADB]/30">
            {status === "pending" ? "File vide — tout est à jour ✓" : "Aucun élément"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => {
            const cfg = TYPE_CONFIG[item.target_type] ?? { label: item.target_type, icon: ShieldCheck, color: "text-[#F3EADB]/40" };
            const Icon = cfg.icon;
            const isSelected = selected?.id === item.id;
            return (
              <div key={item.id}
                className={`rounded-xl border transition-all ${
                  isSelected
                    ? "border-[#E0337E]/40 bg-[#E0337E]/5"
                    : "border-[#F3EADB]/8 bg-[#F3EADB]/2 hover:border-[#F3EADB]/15"
                }`}>
                <div className="flex items-center gap-4 p-4">
                  {/* Type icon */}
                  <div className={`w-9 h-9 rounded-lg bg-[#F3EADB]/5 flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon size={15} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        item.target_type === "product" ? "text-[#E0901E] border-[#E0901E]/30 bg-[#E0901E]/5" :
                        item.target_type === "vendor"  ? "text-[#6D2DB5] border-[#6D2DB5]/30 bg-[#6D2DB5]/5" :
                        item.target_type === "report"  ? "text-red-400 border-red-400/30 bg-red-400/5" :
                        "text-[#1C9C95] border-[#1C9C95]/30 bg-[#1C9C95]/5"
                      }`}>{cfg.label}</span>
                      <span className="font-mono text-[10px] text-[#F3EADB]/25">{item.target_id.slice(0,8).toUpperCase()}</span>
                    </div>
                    {item.reason && (
                      <p className="font-hanken text-xs text-[#F3EADB]/60 mt-1 truncate">{item.reason}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={10} className="text-[#F3EADB]/20" />
                      <span className="font-mono text-[9px] text-[#F3EADB]/25">
                        {new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {item.mod_status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(isSelected ? null : item); setNotesInput(""); }}
                        className="p-2 rounded-lg border border-[#F3EADB]/10 text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors">
                        <Eye size={13} />
                      </button>
                      <button
                        disabled={!!actionLoading}
                        onClick={() => handleAction(item.id, "reject")}
                        className="p-2 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-40">
                        <XCircle size={13} />
                      </button>
                      <button
                        disabled={!!actionLoading}
                        onClick={() => handleAction(item.id, "approve")}
                        className="p-2 rounded-lg border border-green-500/20 text-green-400/60 hover:text-green-400 hover:border-green-500/40 transition-colors disabled:opacity-40">
                        <CheckCircle size={13} />
                      </button>
                    </div>
                  ) : (
                    <span className={`font-mono text-[10px] px-2 py-1 rounded-full ${
                      item.mod_status === "approved"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {item.mod_status === "approved" ? "Approuvé" : "Rejeté"}
                    </span>
                  )}
                </div>

                {/* Expanded panel */}
                {isSelected && (
                  <div className="px-4 pb-4 border-t border-[#F3EADB]/6 pt-4">
                    <textarea
                      value={notesInput}
                      onChange={e => setNotesInput(e.target.value)}
                      placeholder="Notes de modération (optionnel)…"
                      rows={2}
                      className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-2 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/50 resize-none mb-3" />
                    <div className="flex gap-2">
                      <button
                        disabled={!!actionLoading}
                        onClick={() => handleAction(item.id, "reject")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-hanken text-sm hover:bg-red-500/20 transition-colors disabled:opacity-40">
                        <XCircle size={13} /> Rejeter
                      </button>
                      <button
                        disabled={!!actionLoading}
                        onClick={() => handleAction(item.id, "approve")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-hanken text-sm hover:bg-green-500/20 transition-colors disabled:opacity-40">
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
