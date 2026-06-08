"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Lock, User, Clock, AlertTriangle } from "lucide-react";

type Message = {
  id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  profiles: { id: string; full_name: string | null; role: string | null } | null;
};

type Ticket = {
  id: string;
  ticket_number: string;
  subject: string;
  category: string | null;
  priority: string;
  ticket_status: string;
  created_at: string;
  sla_due_at: string | null;
  resolved_at: string | null;
  profiles: { id: string; full_name: string | null; email: string | null } | null;
  assigned: { id: string; full_name: string | null } | null;
};

const PRIORITY_BG: Record<string, string> = {
  urgent: "text-red-600 bg-red-400/10 border-red-400/20",
  high:   "text-[#FF2DA0] bg-[#FF2DA0]/10 border-[#FF2DA0]/20",
  medium: "text-[#FFD400] bg-[#FFD400]/10 border-[#FFD400]/20",
  low:    "text-[#101014]/40 bg-[#101014]/5 border-[#101014]/10",
};
const STATUS_TRANSITIONS: Record<string, string[]> = {
  open:        ["in_progress","waiting","resolved","closed"],
  assigned:    ["in_progress","waiting","resolved","closed"],
  in_progress: ["waiting","resolved","closed"],
  waiting:     ["in_progress","resolved","closed"],
  resolved:    ["closed","open"],
  closed:      ["open"],
};
const STATUS_LABELS: Record<string, string> = {
  open:"Ouvert", assigned:"Assigné", in_progress:"En cours",
  waiting:"En attente", resolved:"Résolu", closed:"Fermé",
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket]     = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [reply, setReply]       = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending]   = useState(false);
  const [toast, setToast]       = useState<string | null>(null);

  const load = async () => {
    try {
      const res  = await fetch(`/api/admin/support/${id}`);
      const json = await res.json();
      setTicket(json.data?.ticket);
      setMessages(json.data?.messages ?? []);
    } catch {
      // silently fail · show empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const sendMessage = async () => {
    if (!reply.trim()) return;
    setSending(true);
    const res = await fetch(`/api/admin/support/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: reply, is_internal: isInternal }),
    });
    setSending(false);
    if (!res.ok) return;
    setReply("");
    load();
  };

  const changeStatus = async (newStatus: string) => {
    await fetch(`/api/admin/support/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_status: newStatus }),
    });
    showToast(`Statut → ${STATUS_LABELS[newStatus]}`);
    load();
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 border-[#FF2DA0] border-t-transparent animate-spin" />
    </div>
  );
  if (!ticket) return null;

  const slaBreached = ticket.sla_due_at ? new Date(ticket.sla_due_at) < new Date() : false;
  const transitions = STATUS_TRANSITIONS[ticket.ticket_status] ?? [];

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#FF2DA0] text-white font-hanken text-sm shadow-xl">{toast}</div>
      )}

      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-[#101014]/40 hover:text-[#101014] transition-colors font-hanken text-sm">
        <ArrowLeft size={14} /> Retour
      </button>

      {/* Header */}
      <div className="p-5 rounded-2xl border border-[#101014]/8 bg-[#101014]/[0.02] space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-[10px] text-[#101014]/25">{ticket.ticket_number}</span>
              {ticket.category && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#101014]/5 text-[#101014]/30 uppercase">{ticket.category}</span>
              )}
              {slaBreached && (
                <span className="flex items-center gap-1 font-mono text-[9px] text-red-600">
                  <AlertTriangle size={9} /> SLA dépassé
                </span>
              )}
            </div>
            <h1 className="font-fraunces text-xl text-[#101014]">{ticket.subject}</h1>
          </div>
          <span className={`font-mono text-[9px] px-2 py-1 rounded-full border flex-shrink-0 ${PRIORITY_BG[ticket.priority] ?? ""}`}>
            {ticket.priority.toUpperCase()}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-6 flex-wrap text-[#101014]/30">
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <User size={10} /> {ticket.profiles?.full_name ?? "Anonyme"}
            {ticket.profiles?.email && <span className="text-[#101014]/20">· {ticket.profiles.email}</span>}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <Clock size={10} /> {new Date(ticket.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
          </span>
          {ticket.sla_due_at && (
            <span className={`flex items-center gap-1.5 font-mono text-[10px] ${slaBreached ? "text-red-600" : ""}`}>
              SLA : {new Date(ticket.sla_due_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/* Status actions */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#101014]/6">
          <span className="font-mono text-[10px] text-[#101014]/25 mr-1">Statut :</span>
          {transitions.map(s => (
            <button key={s} onClick={() => changeStatus(s)}
              className="px-3 py-1.5 rounded-lg border border-[#101014]/10 font-mono text-[10px] text-[#101014]/50 hover:text-[#101014] hover:border-[#101014]/25 transition-colors">
              → {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {messages.map(msg => {
          const isAdmin = msg.profiles?.role && !["buyer","vendor"].includes(msg.profiles.role);
          return (
            <div key={msg.id} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-fraunces text-xs ${
                isAdmin ? "bg-[#FF2DA0]/15 text-[#FF2DA0] border border-[#FF2DA0]/20" : "bg-[#101014]/8 text-[#101014]/60 border border-[#101014]/10"
              }`}>
                {(msg.profiles?.full_name ?? "?")[0].toUpperCase()}
              </div>
              <div className={`flex-1 max-w-xl ${isAdmin ? "items-end" : ""}`}>
                <div className={`flex items-center gap-2 mb-1 ${isAdmin ? "flex-row-reverse" : ""}`}>
                  <span className="font-mono text-[10px] text-[#101014]/30">{msg.profiles?.full_name ?? "Utilisateur"}</span>
                  <span className="font-mono text-[9px] text-[#101014]/20">
                    {new Date(msg.created_at).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {msg.is_internal && (
                    <span className="flex items-center gap-1 font-mono text-[9px] text-[#7A2BF0]/70 bg-[#7A2BF0]/10 px-1.5 py-0.5 rounded">
                      <Lock size={8} /> interne
                    </span>
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl font-hanken text-sm ${
                  msg.is_internal
                    ? "bg-[#7A2BF0]/10 border border-[#7A2BF0]/20 text-[#101014]/70"
                    : isAdmin
                    ? "bg-[#FF2DA0]/10 border border-[#FF2DA0]/20 text-[#101014]"
                    : "bg-[#101014]/5 border border-[#101014]/8 text-[#101014]/80"
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply box */}
      {!["closed","resolved"].includes(ticket.ticket_status) && (
        <div className="rounded-2xl border border-[#101014]/8 p-4 space-y-3 bg-[#101014]/[0.02]">
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder={isInternal ? "Note interne (invisible pour la personne)…" : "Réponse à la personne…"}
            rows={4}
            className={`w-full bg-[#101014]/5 border rounded-xl px-4 py-3 font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none resize-none transition-colors ${
              isInternal ? "border-[#7A2BF0]/30 focus:border-[#7A2BF0]/60" : "border-[#101014]/10 focus:border-[#FF2DA0]/50"
            }`} />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-[#7A2BF0]" />
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#101014]/40">
                <Lock size={10} /> Note interne
              </span>
            </label>
            <button onClick={sendMessage} disabled={!reply.trim() || sending}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-hanken text-sm transition-all disabled:opacity-40 ${
                isInternal
                  ? "bg-[#7A2BF0]/20 border border-[#7A2BF0]/30 text-[#7A2BF0]"
                  : "bg-[#FF2DA0] text-white hover:bg-[#FF2DA0]/90"
              }`}>
              <Send size={13} /> {sending ? "Envoi…" : isInternal ? "Ajouter la note" : "Envoyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
