"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send, Sparkles, TrendingUp, DollarSign, Package, BarChart3,
  RefreshCw, Copy, CheckCheck, ChevronDown, Trash2, Zap,
} from "lucide-react";

// ─── Agent config (mirrors API) ────────────────────────────────────────────────
const AGENTS = [
  {
    id:          "aria",
    name:        "Aria",
    role:        "Croissance & CRM",
    color:       "#E0337E",
    bg:          "rgba(224,51,126,.08)",
    icon:        TrendingUp,
    description: "Pipeline CRM, leads, opportunités de croissance et recommandations commerciales.",
    starters: [
      "Donne-moi un rapport complet du pipeline CRM",
      "Quels leads devraient être relancés en priorité ?",
      "Combien de contacts sont en phase identified ?",
      "Quelle est la santé globale du pipeline ?",
    ],
  },
  {
    id:          "fina",
    name:        "Fina",
    role:        "Finance & Revenus",
    color:       "#1C9C95",
    bg:          "rgba(28,156,149,.08)",
    icon:        DollarSign,
    description: "Revenus, commissions, tendances financières et performance des ventes.",
    starters: [
      "Quel est le revenu ce mois-ci ?",
      "Donne-moi le rapport financier complet",
      "Combien on a généré de commissions cette année ?",
      "Quelle est la tendance des commandes ?",
    ],
  },
  {
    id:          "koda",
    name:        "Koda",
    role:        "Opérations & Support",
    color:       "#E0901E",
    bg:          "rgba(224,144,30,.08)",
    icon:        Package,
    description: "Commandes, logistique, vendeur·ses et santé opérationnelle de la plateforme.",
    starters: [
      "Y a-t-il des commandes bloquées ?",
      "Rapport des opérations du jour",
      "Combien de vendeur·ses sont inscrit·es ?",
      "Quels sont les derniers problèmes opérationnels ?",
    ],
  },
  {
    id:          "mira",
    name:        "Mira",
    role:        "Stratégie & Rapports",
    color:       "#6D2DB5",
    bg:          "rgba(109,45,181,.08)",
    icon:        BarChart3,
    description: "Vision globale, rapports exécutifs et recommandations stratégiques croisées.",
    starters: [
      "Génère le rapport hebdomadaire complet",
      "Quelle est la santé globale de Spectrum ?",
      "Quelles sont les priorités de la semaine ?",
      "Croiser les données CRM et finance",
    ],
  },
] as const;

type AgentId = typeof AGENTS[number]["id"];

type Message = {
  id:      string;
  role:    "user" | "assistant";
  content: string;
  ts:      Date;
};

type Conversation = {
  agentId:  AgentId;
  messages: Message[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(d: Date) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg, agentColor, agentName }: { msg: Message; agentColor: string; agentName: string }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Parse text with simple bold formatting (**text**)
  const formatted = msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: agentColor }} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });

  return (
    <div className={`flex gap-3 group ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-fraunces text-sm font-bold mt-0.5"
          style={{ background: `${agentColor}18`, color: agentColor }}>
          {agentName[0]}
        </div>
      )}

      <div className={`max-w-[82%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-hanken ${
          isUser
            ? "bg-[#E0337E] text-white rounded-tr-sm"
            : "bg-[#F3EADB]/[0.06] border border-[#F3EADB]/8 text-[#F3EADB]/85 rounded-tl-sm"
        }`} style={!isUser ? { borderLeftColor: `${agentColor}30` } : {}}>
          <p className="whitespace-pre-wrap">{formatted}</p>
        </div>
        <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="font-mono text-[9px] text-[#F3EADB]/18">{formatTime(msg.ts)}</span>
          <button onClick={copy} className="font-mono text-[9px] text-[#F3EADB]/22 hover:text-[#F3EADB]/60 flex items-center gap-1 transition-colors">
            {copied ? <><CheckCheck size={9} className="text-[#34d399]" /> copié</> : <><Copy size={9} /> copier</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Agent Card (sidebar) ─────────────────────────────────────────────────────
function AgentCard({
  agent, active, messageCount, onClick,
}: {
  agent: typeof AGENTS[number];
  active: boolean;
  messageCount: number;
  onClick: () => void;
}) {
  const Icon = agent.icon;
  return (
    <button onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all group ${
        active
          ? "border-opacity-40 bg-opacity-10"
          : "border-[#F3EADB]/6 bg-transparent hover:border-[#F3EADB]/12 hover:bg-[#F3EADB]/[0.02]"
      }`}
      style={active ? { borderColor: `${agent.color}40`, background: agent.bg } : {}}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
          style={{ background: active ? `${agent.color}20` : "rgba(243,234,219,.04)", color: agent.color }}>
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="font-hanken text-sm font-medium" style={{ color: active ? agent.color : "#F3EADB" }}>
              {agent.name}
            </p>
            {messageCount > 0 && (
              <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full"
                style={{ background: `${agent.color}18`, color: agent.color }}>
                {messageCount}
              </span>
            )}
          </div>
          <p className="font-mono text-[9px] text-[#F3EADB]/28 truncate">{agent.role}</p>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [activeId, setActiveId]               = useState<AgentId>("mira");
  const [conversations, setConversations]     = useState<Record<AgentId, Conversation>>(() => {
    const init = {} as Record<AgentId, Conversation>;
    for (const a of AGENTS) init[a.id] = { agentId: a.id, messages: [] };
    return init;
  });
  const [input, setInput]                     = useState("");
  const [loading, setLoading]                 = useState(false);
  const [showStarters, setShowStarters]       = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);

  const agent   = AGENTS.find(a => a.id === activeId)!;
  const convo   = conversations[activeId];
  const Icon    = agent.icon;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo.messages]);

  useEffect(() => {
    setShowStarters(convo.messages.length === 0);
    inputRef.current?.focus();
  }, [activeId, convo.messages.length]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    setInput("");
    setShowStarters(false);

    const userMsg: Message = { id: uid(), role: "user", content, ts: new Date() };

    setConversations(prev => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        messages: [...prev[activeId].messages, userMsg],
      },
    }));

    setLoading(true);
    try {
      const history = [...convo.messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res  = await fetch("/api/admin/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: activeId, messages: history }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");

      const assistantMsg: Message = {
        id: uid(), role: "assistant",
        content: json.data?.reply ?? "Aucune réponse.",
        ts: new Date(),
      };
      setConversations(prev => ({
        ...prev,
        [activeId]: {
          ...prev[activeId],
          messages: [...prev[activeId].messages, userMsg, assistantMsg].filter(
            (m, i, arr) => arr.findIndex(x => x.id === m.id) === i
          ),
        },
      }));
    } catch (err: unknown) {
      const errMsg: Message = {
        id: uid(), role: "assistant",
        content: `Erreur : ${err instanceof Error ? err.message : "Problème de connexion"}`,
        ts: new Date(),
      };
      setConversations(prev => ({
        ...prev,
        [activeId]: {
          ...prev[activeId],
          messages: [...prev[activeId].messages, errMsg],
        },
      }));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const clearConvo = () => {
    setConversations(prev => ({ ...prev, [activeId]: { agentId: activeId, messages: [] } }));
    setShowStarters(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const totalMessages = Object.values(conversations).reduce((s, c) => s + c.messages.length, 0);

  return (
    <div className="flex gap-4 h-[calc(100vh-7rem)]">

      {/* ── Sidebar ── */}
      <div className="w-56 flex-shrink-0 flex flex-col gap-2">
        <div className="mb-2">
          <h1 className="font-fraunces text-xl text-[#F3EADB]">Agents IA</h1>
          <p className="font-mono text-[10px] text-[#F3EADB]/28 mt-0.5">
            {totalMessages} message{totalMessages !== 1 ? "s" : ""} échangés
          </p>
        </div>

        <div className="space-y-1.5 flex-1">
          {AGENTS.map(a => (
            <AgentCard
              key={a.id}
              agent={a}
              active={activeId === a.id}
              messageCount={conversations[a.id].messages.filter(m => m.role === "assistant").length}
              onClick={() => setActiveId(a.id)}
            />
          ))}
        </div>

        {/* Info box */}
        <div className="p-3 rounded-xl bg-[#F3EADB]/[0.025] border border-[#F3EADB]/6">
          <p className="font-mono text-[9px] text-[#F3EADB]/25 leading-relaxed">
            Les agents ont accès aux données en temps réel de la plateforme.
          </p>
        </div>
      </div>

      {/* ── Chat ── */}
      <div className="flex-1 flex flex-col min-w-0 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.015] overflow-hidden">

        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3EADB]/6 shrink-0"
          style={{ borderBottomColor: `${agent.color}18` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: agent.bg }}>
              <Icon size={17} style={{ color: agent.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-fraunces text-base" style={{ color: agent.color }}>{agent.name}</p>
                <span className="flex items-center gap-1 font-mono text-[9px] text-[#34d399]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                  en ligne
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#F3EADB]/30">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {convo.messages.length > 0 && (
              <button onClick={clearConvo}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#F3EADB]/8 text-[#F3EADB]/25 hover:text-[#f87171]/70 hover:border-[#f87171]/20 font-hanken text-xs transition-all">
                <Trash2 size={11} /> Effacer
              </button>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {/* Agent intro */}
          {convo.messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: agent.bg }}>
                <Icon size={26} style={{ color: agent.color }} />
              </div>
              <p className="font-fraunces text-lg mb-1" style={{ color: agent.color }}>Bonjour, je suis {agent.name}</p>
              <p className="font-hanken text-sm text-[#F3EADB]/40 max-w-xs mx-auto leading-relaxed">
                {agent.description}
              </p>
            </div>
          )}

          {/* Starter questions */}
          {showStarters && convo.messages.length === 0 && (
            <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
              {agent.starters.map((s, i) => (
                <button key={i} onClick={() => send(s)}
                  className="text-left p-3 rounded-xl border border-[#F3EADB]/8 hover:border-opacity-40 bg-[#F3EADB]/[0.02] hover:bg-[#F3EADB]/[0.04] transition-all group"
                  style={{ borderColor: `${agent.color}15` }}>
                  <div className="flex items-start gap-2">
                    <Zap size={10} className="shrink-0 mt-0.5" style={{ color: `${agent.color}60` }} />
                    <p className="font-hanken text-xs text-[#F3EADB]/45 group-hover:text-[#F3EADB]/70 leading-relaxed transition-colors">
                      {s}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          {convo.messages.map(msg => (
            <Bubble key={msg.id} msg={msg} agentColor={agent.color} agentName={agent.name} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${agent.color}18`, color: agent.color }}>
                {agent.name[0]}
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#F3EADB]/[0.06] border border-[#F3EADB]/8 flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: agent.color, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="shrink-0 px-4 pb-4 pt-3 border-t border-[#F3EADB]/6">
          <div className="flex gap-2.5 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={`Message à ${agent.name}… (Entrée pour envoyer)`}
                rows={1}
                disabled={loading}
                className="w-full bg-[#F3EADB]/[0.04] border border-[#F3EADB]/10 rounded-xl px-4 py-3 pr-10 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/22 focus:outline-none transition-colors resize-none disabled:opacity-50 max-h-32 overflow-y-auto"
                onFocus={e => e.target.style.borderColor = `${agent.color}40`}
                onBlur={e => e.target.style.borderColor = "rgba(243,234,219,.1)"}
              />
            </div>
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
              style={{ background: agent.color }}>
              {loading
                ? <RefreshCw size={15} className="text-white animate-spin" />
                : <Send size={15} className="text-white" />}
            </button>
          </div>
          <p className="font-mono text-[9px] text-[#F3EADB]/15 mt-2 text-center">
            Données en temps réel · Shift+Entrée pour nouvelle ligne
          </p>
        </div>
      </div>

      {/* ── Agent detail sidebar (right) ── */}
      <div className="w-52 flex-shrink-0 hidden xl:flex flex-col gap-3">
        <div className="p-4 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: agent.bg, color: agent.color }}>
              <Icon size={15} />
            </div>
            <div>
              <p className="font-hanken text-sm" style={{ color: agent.color }}>{agent.name}</p>
              <p className="font-mono text-[9px] text-[#F3EADB]/25">{agent.role}</p>
            </div>
          </div>
          <p className="font-hanken text-xs text-[#F3EADB]/35 leading-relaxed">{agent.description}</p>
        </div>

        <div className="p-4 rounded-2xl border border-[#F3EADB]/8">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/22 mb-3 flex items-center gap-1.5">
            <Sparkles size={8} /> Questions suggérées
          </p>
          <div className="space-y-2">
            {agent.starters.map((s, i) => (
              <button key={i} onClick={() => send(s)}
                className="w-full text-left p-2.5 rounded-xl border border-[#F3EADB]/6 hover:border-opacity-40 bg-[#F3EADB]/[0.015] hover:bg-[#F3EADB]/[0.04] transition-all"
                style={{ borderColor: `${agent.color}12` }}>
                <p className="font-hanken text-[11px] text-[#F3EADB]/38 hover:text-[#F3EADB]/65 leading-snug transition-colors">{s}</p>
              </button>
            ))}
          </div>
        </div>

        {convo.messages.length > 0 && (
          <div className="p-3 rounded-xl border border-[#F3EADB]/6 bg-[#F3EADB]/[0.015]">
            <p className="font-mono text-[9px] text-[#F3EADB]/25 mb-2">Cette conversation</p>
            <p className="font-fraunces text-xl" style={{ color: agent.color }}>
              {convo.messages.filter(m => m.role === "assistant").length}
            </p>
            <p className="font-mono text-[9px] text-[#F3EADB]/22">réponses de {agent.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
