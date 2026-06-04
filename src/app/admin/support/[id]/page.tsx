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
  urgent: "text-red-400 bg-red-400/10 border-red-400/20",
  high:   "text-[#CF3F7C] bg-[#CF3F7C]/10 border-[#CF3F7C]/20",
  medium: "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20",
  low:    "text-[#F3EADB]/40 bg-[#F3EADB]/5 border-[#F3EADB]/10",
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
    const res  = await fetch(`/api/admin/support/${id}`);
    const json = await res.json();
    setTicket(json.data?.ticket);
    setMessages(json.data?.messages ?? []);
    setLoading(false);
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
      <div className="w-6 h-6 rounded-full border-2 border-[#E0337E] border-t-transparent animate-spin" />
    </div>
  );
  if (!ticket) return null;

  const slaBreached = ticket.sla_due_at ? new Date(ticket.sla_due_at) < new Date() : false;
  const transitions = STATUS_TRANSITIONS[ticket.ticket_status] ?? [];

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#E0337E] text-white font-hanken text-sm shadow-xl">{toast}</div>
      )}

      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors font-hanken text-sm">
        <ArrowLeft size={14} /> Retour
      </button>

      {/* Header */}
      <div className="p-5 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02] space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-[10px] text-[#F3EADB]/25">{ticket.ticket_number}</span>
              {ticket.category && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#F3EADB]/5 text-[#F3EADB]/30 uppercase">{ticket.category}</span>
              )}
              {slaBreached && (
                <span className="flex items-center gap-1 font-mono text-[9px] text-red-400">
                  <AlertTriangle size={9} /> SLA dépassé
                </span>
              )}
            </div>
            <h1 className="font-fraunces text-xl text-[#F3EADB]">{ticket.subject}</h1>
          </div>
          <span className={`font-mono text-[9px] px-2 py-1 rounded-full border flex-shrink-0 ${PRIORITY_BG[ticket.priority] ?? ""}`}>
            {ticket.priority.toUpperCase()}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-6 flex-wrap text-[#F3EADB]/30">
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <User size={10} /> {ticket.profiles?.full_name ?? "Anonyme"}
            {ticket.profiles?.email && <span className="text-[#F3EADB]/20">· {ticket.profiles.email}</span>}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <Clock size={10} /> {new Date(ticket.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
          </span>
          {ticket.sla_due_at && (
            <span className={`flex items-center gap-1.5 font-mono text-[10px] ${slaBreached ? "text-red-400" : ""}`}>
              SLA : {new Date(ticket.sla_due_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/* Status actions */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F3EADB]/6">
          <span className="font-mono text-[10px] text-[#F3EADB]/25 mr-1">Statut :</span>
          {transitions.map(s => (
            <button key={s} onClick={() => changeStatus(s)}
              className="px-3 py-1.5 rounded-lg border border-[#F3EADB]/10 font-mono text-[10px] text-[#F3EADB]/50 hover:text-[#F3EADB] hover:border-[#F3EADB]/25 transition-colors">
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
                isAdmin ? "bg-[#E0337E]/15 text-[#E0337E] border border-[#E0337E]/20" : "bg-[#F3EADB]/8 text-[#F3EADB]/60 border border-[#F3EADB]/10"
              }`}>
                {(msg.profiles?.full_name ?? "?")[0].toUpperCase()}
              </div>
              <div className={`flex-1 max-w-xl ${isAdmin ? "items-end" : ""}`}>
                <div className={`flex items-center gap-2 mb-1 ${isAdmin ? "flex-row-reverse" : ""}`}>
                  <span className="font-mono text-[10px] text-[#F3EADB]/30">{msg.profiles?.full_name ?? "Utilisateur"}</span>
                  <span className="font-mono text-[9px] text-[#F3EADB]/20">
                    {new Date(msg.created_at).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {msg.is_internal && (
                    <span className="flex items-center gap-1 font-mono text-[9px] text-[#6D2DB5]/70 bg-[#6D2DB5]/10 px-1.5 py-0.5 rounded">
                      <Lock size={8} /> interne
                    </span>
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl font-hanken text-sm ${
                  msg.is_internal
                    ? "bg-[#6D2DB5]/10 border border-[#6D2DB5]/20 text-[#F3EADB]/70"
                    : isAdmin
                    ? "bg-[#E0337E]/10 border border-[#E0337E]/20 text-[#F3EADB]"
                    : "bg-[#F3EADB]/5 border border-[#F3EADB]/8 text-[#F3EADB]/80"
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
        <div className="rounded-2xl border border-[#F3EADB]/8 p-4 space-y-3 bg-[#F3EADB]/[0.02]">
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder={isInternal ? "Note interne (invisible pour le client)…" : "Réponse au client…"}
            rows={4}
            className={`w-full bg-[#F3EADB]/5 border rounded-xl px-4 py-3 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none resize-none transition-colors ${
              isInternal ? "border-[#6D2DB5]/30 focus:border-[#6D2DB5]/60" : "border-[#F3EADB]/10 focus:border-[#E0337E]/50"
            }`} />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-[#6D2DB5]" />
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#F3EADB]/40">
                <Lock size={10} /> Note interne
              </span>
            </label>
            <button onClick={sendMessage} disabled={!reply.trim() || sending}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-hanken text-sm transition-all disabled:opacity-40 ${
                isInternal
                  ? "bg-[#6D2DB5]/20 border border-[#6D2DB5]/30 text-[#6D2DB5]"
                  : "bg-[#E0337E] text-white hover:bg-[#E0337E]/90"
              }`}>
              <Send size={13} /> {sending ? "Envoi…" : isInternal ? "Ajouter la note" : "Envoyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
