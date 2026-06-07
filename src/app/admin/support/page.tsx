"use client";
import { useEffect, useState, useCallback } from "react";
import { MessageSquare, Clock, AlertTriangle, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Ticket = {
  id: string;
  ticket_number: string;
  subject: string;
  category: string | null;
  priority: string;
  ticket_status: string;
  created_at: string;
  sla_due_at: string | null;
  profiles: { id: string; full_name: string | null } | null;
  assigned: { id: string; full_name: string | null } | null;
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low:    { label: "Basse",   color: "text-[#1A1612]/40 border-[#1A1612]/[0.14]" },
  medium: { label: "Moyenne", color: "text-[#E0901E] border-[#E0901E]/20" },
  high:   { label: "Haute",   color: "text-[#CF3F7C] border-[#CF3F7C]/20" },
  urgent: { label: "Urgent",  color: "text-red-600 border-red-400/30" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open:        { label: "Ouvert",      color: "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20" },
  assigned:    { label: "Assigné",     color: "text-[#6D2DB5] bg-[#6D2DB5]/10 border-[#6D2DB5]/20" },
  in_progress: { label: "En cours",    color: "text-[#1C9C95] bg-[#1C9C95]/10 border-[#1C9C95]/20" },
  waiting:     { label: "En attente",  color: "text-[#1A1612]/40 bg-[#1A1612]/[0.09] border-[#1A1612]/[0.14]" },
  resolved:    { label: "Résolu",      color: "text-green-600 bg-green-400/10 border-green-400/20" },
  closed:      { label: "Fermé",       color: "text-[#1A1612]/20 bg-[#1A1612]/3 border-[#1A1612]/5" },
};

const STATUS_TABS = ["open","in_progress","waiting","resolved","closed",""];

export default function SupportPage() {
  const [tickets, setTickets]   = useState<Ticket[]>([]);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState("open");
  const [priority, setPriority] = useState("");
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const LIMIT = 20;

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (status)   params.set("status", status);
    if (priority) params.set("priority", priority);
    try {
      const res  = await fetch(`/api/admin/support?${params}`);
      const json = await res.json();
      setTickets(json.data ?? []);
      setTotal(json.meta?.total ?? 0);
    } catch {
      // silently fail · show empty state
    } finally {
      setLoading(false);
    }
  }, [page, status, priority]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);
  useEffect(() => { setPage(1); }, [status, priority]);

  const isSlaBreached = (sla: string | null) =>
    sla ? new Date(sla) < new Date() : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl text-[#1A1612]">Support</h1>
        <p className="font-hanken text-sm text-[#1A1612]/40 mt-0.5">{total} ticket{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-[#1A1612]/[0.08] rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all ${
              status === s ? "bg-[#FF3D7F] text-white" : "text-[#1A1612]/40 hover:text-[#1A1612]"
            }`}>
            {s === "" ? "Tous" : STATUS_CONFIG[s]?.label ?? s}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <div className="flex gap-2">
        {[["","Toutes"],["urgent","Urgent"],["high","Haute"],["medium","Moyenne"],["low","Basse"]].map(([v, l]) => (
          <button key={v} onClick={() => setPriority(v)}
            className={`px-3 py-1 rounded-lg font-mono text-[10px] transition-all border ${
              priority === v
                ? "bg-[#1A1612]/10 text-[#1A1612] border-[#1A1612]/20"
                : "text-[#1A1612]/30 border-transparent hover:text-[#1A1612]/60"
            }`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare size={40} className="mx-auto mb-3 text-[#1A1612]/10" />
          <p className="font-hanken text-[#1A1612]/30">Aucun ticket</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {tickets.map(ticket => {
              const slaBreached = isSlaBreached(ticket.sla_due_at);
              const priUi = PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.medium;
              const statUi = STATUS_CONFIG[ticket.ticket_status] ?? STATUS_CONFIG.open;
              return (
                <Link key={ticket.id} href={`/admin/support/${ticket.id}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[#1A1612]/15 group ${
                    slaBreached ? "border-red-500/20 bg-red-500/3" : "border-[#1A1612]/[0.13] bg-[#1A1612]/[0.01]"
                  }`}>
                  {/* Priority dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    ticket.priority === "urgent" ? "bg-red-400 animate-pulse" :
                    ticket.priority === "high"   ? "bg-[#CF3F7C]" :
                    ticket.priority === "medium" ? "bg-[#E0901E]" : "bg-[#1A1612]/[0.07]"
                  }`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[10px] text-[#1A1612]/25">{ticket.ticket_number}</span>
                      {ticket.category && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1A1612]/[0.09] text-[#1A1612]/30 uppercase">
                          {ticket.category}
                        </span>
                      )}
                      {slaBreached && (
                        <span className="flex items-center gap-1 font-mono text-[9px] text-red-600">
                          <AlertTriangle size={9} /> SLA dépassé
                        </span>
                      )}
                    </div>
                    <p className="font-hanken text-sm text-[#1A1612] truncate">{ticket.subject}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {ticket.profiles?.full_name && (
                        <span className="flex items-center gap-1 font-mono text-[9px] text-[#1A1612]/25">
                          <User size={9} /> {ticket.profiles.full_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono text-[9px] text-[#1A1612]/20">
                        <Clock size={9} /> {new Date(ticket.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${statUi.color}`}>
                      {statUi.label}
                    </span>
                    <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${priUi.color}`}>
                      {priUi.label}
                    </span>
                    {ticket.assigned && (
                      <span className="font-mono text-[9px] text-[#1A1612]/25">{ticket.assigned.full_name}</span>
                    )}
                    <ChevronRight size={12} className="text-[#1A1612]/20 group-hover:text-[#1A1612]/50 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>

          {total > LIMIT && (
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#1A1612]/25">
                {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)} sur {total}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#1A1612]/[0.14] font-mono text-[10px] text-[#1A1612]/40 hover:text-[#1A1612] disabled:opacity-30 transition-colors">← Préc.</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
                  className="px-3 py-1.5 rounded-lg border border-[#1A1612]/[0.14] font-mono text-[10px] text-[#1A1612]/40 hover:text-[#1A1612] disabled:opacity-30 transition-colors">Suiv. →</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
