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
  low:    { label: "Basse",   color: "text-[#101014]/40 border-[#101014]/[0.14]" },
  medium: { label: "Moyenne", color: "text-[#FFD400] border-[#FFD400]/20" },
  high:   { label: "Haute",   color: "text-[#FF2DA0] border-[#FF2DA0]/20" },
  urgent: { label: "Urgent",  color: "text-red-600 border-red-400/30" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open:        { label: "Ouvert",      color: "text-[#FFD400] bg-[#FFD400]/10 border-[#FFD400]/20" },
  assigned:    { label: "Assigné",     color: "text-[#7A2BF0] bg-[#7A2BF0]/10 border-[#7A2BF0]/20" },
  in_progress: { label: "En cours",    color: "text-[#2323C4] bg-[#2323C4]/10 border-[#2323C4]/20" },
  waiting:     { label: "En attente",  color: "text-[#101014]/40 bg-[#101014]/[0.09] border-[#101014]/[0.14]" },
  resolved:    { label: "Résolu",      color: "text-green-600 bg-green-400/10 border-green-400/20" },
  closed:      { label: "Fermé",       color: "text-[#101014]/20 bg-[#101014]/3 border-[#101014]/5" },
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
        <h1 className="font-fraunces text-2xl text-[#101014]">Support</h1>
        <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">{total} ticket{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-[#101014]/[0.08] rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all ${
              status === s ? "bg-[#FF2DA0] text-white" : "text-[#101014]/40 hover:text-[#101014]"
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
                ? "bg-[#101014]/10 text-[#101014] border-[#101014]/20"
                : "text-[#101014]/30 border-transparent hover:text-[#101014]/60"
            }`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare size={40} className="mx-auto mb-3 text-[#101014]/10" />
          <p className="font-hanken text-[#101014]/30">Aucun ticket</p>
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
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[#101014]/15 group ${
                    slaBreached ? "border-red-500/20 bg-red-500/3" : "border-[#101014]/[0.13] bg-[#101014]/[0.01]"
                  }`}>
                  {/* Priority dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    ticket.priority === "urgent" ? "bg-red-400 animate-pulse" :
                    ticket.priority === "high"   ? "bg-[#FF2DA0]" :
                    ticket.priority === "medium" ? "bg-[#FFD400]" : "bg-[#101014]/[0.07]"
                  }`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[10px] text-[#101014]/25">{ticket.ticket_number}</span>
                      {ticket.category && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#101014]/[0.09] text-[#101014]/30 uppercase">
                          {ticket.category}
                        </span>
                      )}
                      {slaBreached && (
                        <span className="flex items-center gap-1 font-mono text-[9px] text-red-600">
                          <AlertTriangle size={9} /> SLA dépassé
                        </span>
                      )}
                    </div>
                    <p className="font-hanken text-sm text-[#101014] truncate">{ticket.subject}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {ticket.profiles?.full_name && (
                        <span className="flex items-center gap-1 font-mono text-[9px] text-[#101014]/25">
                          <User size={9} /> {ticket.profiles.full_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono text-[9px] text-[#101014]/20">
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
                      <span className="font-mono text-[9px] text-[#101014]/25">{ticket.assigned.full_name}</span>
                    )}
                    <ChevronRight size={12} className="text-[#101014]/20 group-hover:text-[#101014]/50 transition-colors" />
                  </div>
                </Link>
              );
            })}
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
    </div>
  );
}
