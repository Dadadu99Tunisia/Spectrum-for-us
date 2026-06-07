"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Sparkles, TrendingUp, DollarSign, Package, BarChart3,
  RefreshCw, Copy, CheckCheck, Trash2, Zap, Play, CheckCircle2,
  AlertCircle, Clock, ChevronRight, ArrowRight, Users, FileText,
  Mail, ShieldCheck, Bot, Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TaskStatus = "idle" | "running" | "done" | "error";
type Message = { id: string; role: "user" | "assistant"; content: string; ts: Date };

type AgentTask = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => Promise<string>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (d: Date) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

// ─── Bubble ───────────────────────────────────────────────────────────────────
function Bubble({ msg, color, initial }: { msg: Message; color: string; initial: string }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = async () => { await navigator.clipboard.writeText(msg.content); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  const parts = msg.content.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} style={{ color }} className="font-semibold">{p.slice(2,-2)}</strong>
      : <span key={i}>{p}</span>
  );

  return (
    <div className={`flex gap-2.5 group ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-fraunces text-xs font-bold mt-0.5"
          style={{ background: `${color}18`, color }}>
          {initial}
        </div>
      )}
      <div className={`max-w-[85%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed font-hanken ${
          isUser ? "bg-[#FF3D7F] text-white rounded-tr-sm" : "bg-[#1A1612]/[0.055] border border-[#1A1612]/8 text-[#1A1612]/80 rounded-tl-sm"
        }`}>
          <p className="whitespace-pre-wrap">{parts}</p>
        </div>
        <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="font-mono text-[9px] text-[#1A1612]/18">{fmt(msg.ts)}</span>
          <button onClick={copy} className="font-mono text-[9px] text-[#1A1612]/22 hover:text-[#1A1612]/60 flex items-center gap-1 transition-colors">
            {copied ? <><CheckCheck size={8} className="text-[#34d399]" /> copié</> : <><Copy size={8} /> copier</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Button ──────────────────────────────────────────────────────────────
function TaskButton({ task, onResult }: { task: AgentTask; onResult: (result: string) => void }) {
  const [status, setStatus] = useState<TaskStatus>("idle");

  const run = async () => {
    setStatus("running");
    try {
      const result = await task.action();
      onResult(result);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button onClick={run} disabled={status === "running"}
      className={`flex items-center gap-2.5 w-full px-3.5 py-3 rounded-xl border text-left transition-all group ${
        status === "done"  ? "border-[#34d399]/30 bg-[#34d399]/5" :
        status === "error" ? "border-[#f87171]/25 bg-[#f87171]/5" :
        "border-[#1A1612]/8 bg-[#1A1612]/[0.02] hover:border-[#1A1612]/16 hover:bg-[#1A1612]/[0.04]"
      } disabled:opacity-50`}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[#1A1612]/30 group-hover:text-[#1A1612]/60 transition-colors">
        {status === "running" ? <Loader2 size={14} className="animate-spin text-[#a78bfa]" />
         : status === "done"  ? <CheckCircle2 size={14} className="text-[#34d399]" />
         : status === "error" ? <AlertCircle size={14} className="text-[#f87171]" />
         : task.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-hanken text-sm ${status === "done" ? "text-[#34d399]" : status === "error" ? "text-[#f87171]" : "text-[#1A1612]/70"}`}>
          {status === "running" ? "En cours…" : status === "done" ? "Terminé ✓" : status === "error" ? "Erreur" : task.label}
        </p>
        <p className="font-mono text-[9px] text-[#1A1612]/22 truncate">{task.description}</p>
      </div>
      {status === "idle" && <Play size={11} className="text-[#1A1612]/15 group-hover:text-[#1A1612]/40 shrink-0 transition-colors" />}
    </button>
  );
}

// ─── Agent Panel ──────────────────────────────────────────────────────────────
function AgentPanel({ agent }: { agent: AgentConfig }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const endRef                  = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const pushAssistant = (content: string) => {
    setMessages(prev => [...prev, { id: uid(), role: "assistant", content, ts: new Date() }]);
  };

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    setInput("");
    const userMsg: Message = { id: uid(), role: "user", content, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res  = await fetch("/api/admin/agents/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: agent.id, messages: history }),
      });
      const json = await res.json();
      pushAssistant(json.data?.reply ?? "Aucune réponse.");
    } catch {
      pushAssistant("Erreur de connexion. Vérifie OPENAI_API_KEY.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loading, messages, agent.id]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const Icon = agent.icon;

  return (
    <div className="flex flex-col h-full">
      {/* Agent identity */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#1A1612]/6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${agent.color}15` }}>
          <Icon size={20} style={{ color: agent.color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-fraunces text-lg" style={{ color: agent.color }}>{agent.name}</p>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: `${agent.color}12`, color: agent.color }}>
              <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: agent.color }} />
              disponible
            </span>
          </div>
          <p className="font-mono text-[10px] text-[#1A1612]/30">{agent.jobTitle}</p>
        </div>
      </div>

      {/* Tasks */}
      <div className="mb-4">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/22 mb-2.5 flex items-center gap-1.5">
          <Zap size={8} /> T-ches assignées
        </p>
        <div className="space-y-1.5">
          {agent.tasks(pushAssistant).map(task => (
            <TaskButton key={task.id} task={task} onResult={pushAssistant} />
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#1A1612]/[0.015] rounded-xl border border-[#1A1612]/6 overflow-hidden">
        <div className="px-3 py-2 border-b border-[#1A1612]/5 flex items-center justify-between">
          <p className="font-mono text-[9px] text-[#1A1612]/25 uppercase tracking-widest flex items-center gap-1.5">
            <Bot size={8} /> Instructions directes
          </p>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="font-mono text-[9px] text-[#1A1612]/18 hover:text-[#f87171]/60 flex items-center gap-1 transition-colors">
              <Trash2 size={8} /> effacer
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <p className="font-hanken text-xs text-[#1A1612]/20 leading-relaxed">
                Donne une instruction à {agent.name}<br />
                <span className="text-[#1A1612]/12">ou lance une t-che ci-dessus</span>
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {agent.starters.map((s, i) => (
                  <button key={i} onClick={() => send(s)}
                    className="font-mono text-[9px] px-2.5 py-1.5 rounded-lg border border-[#1A1612]/8 text-[#1A1612]/30 hover:text-[#1A1612]/60 hover:border-[#1A1612]/16 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map(m => <Bubble key={m.id} msg={m} color={agent.color} initial={agent.name[0]} />)}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-fraunces text-xs"
                style={{ background: `${agent.color}18`, color: agent.color }}>{agent.name[0]}</div>
              <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-[#1A1612]/[0.055] border border-[#1A1612]/8 flex items-center gap-1.5">
                {[0,1,2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: agent.color, animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-3 py-2.5 border-t border-[#1A1612]/5 flex gap-2 items-end">
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown} rows={1} disabled={loading}
            placeholder={`Instruction pour ${agent.name}…`}
            className="flex-1 bg-transparent font-hanken text-sm text-[#1A1612] placeholder-[#1A1612]/18 focus:outline-none resize-none disabled:opacity-40 max-h-20 overflow-y-auto" />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-25"
            style={{ background: agent.color }}>
            {loading ? <Loader2 size={12} className="text-white animate-spin" /> : <Send size={12} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Agent Config ─────────────────────────────────────────────────────────────
type AgentConfig = {
  id: string;
  name: string;
  jobTitle: string;
  color: string;
  icon: React.ElementType;
  starters: string[];
  tasks: (pushMsg: (s: string) => void) => AgentTask[];
};

const buildAgents = (): AgentConfig[] => [
  {
    id: "aria",
    name: "Aria",
    jobTitle: "Responsable Croissance & Partenariats",
    color: "#FF3D7F",
    icon: TrendingUp,
    starters: ["Rapport pipeline du jour", "Qui relancer cette semaine ?", "Analyse les leads à fort potentiel"],
    tasks: (push) => [
      {
        id: "qualify-all",
        label: "Qualifier tous les leads identifiés",
        description: "Score IA sur chaque nouveau lead en stage identified",
        icon: <Sparkles size={14} />,
        action: async () => {
          // Fetch all identified leads
          const res  = await fetch("/api/admin/crm?stage=identified");
          const json = await res.json();
          const leads: { id: string; name: string }[] = json.data ?? [];
          if (!leads.length) return "Aucun lead en stage identified à qualifier.";

          // Qualify each (limit to 10 at a time to avoid rate limits)
          const batch = leads.slice(0, 10);
          const results = await Promise.allSettled(
            batch.map(l => fetch(`/api/admin/crm/${l.id}/qualify`, { method: "POST" }).then(r => r.json()))
          );
          const success = results.filter(r => r.status === "fulfilled").length;
          const names   = batch.map(l => l.name).join(", ");
          return `✅ **${success}/${batch.length} leads qualifiés**\n\n${names}\n\nLes scores IA et les nouveaux stages ont été mis à jour dans le CRM.`;
        },
      },
      {
        id: "outreach-qualified",
        label: "Générer messages pour leads qualifiés",
        description: "Rédige un message personnalisé pour chaque lead qualifié",
        icon: <Mail size={14} />,
        action: async () => {
          const res  = await fetch("/api/admin/crm?stage=qualified");
          const json = await res.json();
          const leads: { id: string; name: string }[] = json.data ?? [];
          if (!leads.length) return "Aucun lead qualifié sans message. Lance d'abord la qualification.";

          const batch = leads.slice(0, 5);
          await Promise.allSettled(
            batch.map(l => fetch(`/api/admin/crm/${l.id}/outreach`, { method: "POST" }))
          );
          return `✅ **${batch.length} messages rédigés** pour :\n\n${batch.map(l => `• ${l.name}`).join("\n")}\n\nLes messages sont disponibles dans chaque fiche CRM (section Notes).`;
        },
      },
      {
        id: "pipeline-report",
        label: "Rapport pipeline complet",
        description: "Vue d'ensemble du CRM avec recommandations",
        icon: <BarChart3 size={14} />,
        action: async () => {
          const res  = await fetch("/api/admin/agents/chat", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              agent: "aria",
              messages: [{ role: "user", content: "Génère un rapport complet du pipeline CRM avec recommandations d'actions prioritaires." }],
            }),
          });
          const json = await res.json();
          return json.data?.reply ?? "Impossible de générer le rapport.";
        },
      },
    ],
  },

  {
    id: "fina",
    name: "Fina",
    jobTitle: "Responsable Finance & Revenus",
    color: "#1C9C95",
    icon: DollarSign,
    starters: ["Rapport mensuel", "Analyse les commissions", "Tendance des ventes"],
    tasks: (push) => [
      {
        id: "monthly-report",
        label: "Rapport financier du mois",
        description: "Revenus, commissions, croissance vs mois précédent",
        icon: <FileText size={14} />,
        action: async () => {
          const res  = await fetch("/api/admin/finance/summary");
          const json = await res.json();
          const d    = json.data;
          if (!d) return "Impossible de récupérer les données financières.";
          return `📊 **RAPPORT FINANCIER · ${new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }).toUpperCase()}**

**Revenus ce mois :** ${d.revenueThisMonth.toLocaleString("fr-FR")} €
**Revenus mois précédent :** ${d.revenuePrevMonth.toLocaleString("fr-FR")} €
**Croissance :** ${d.monthGrowthPct > 0 ? "+" : ""}${d.monthGrowthPct.toFixed(1)}%
**Revenus cette année :** ${d.revenueYear.toLocaleString("fr-FR")} €
**Commissions Spectrum (15%) :** ${d.estimatedCommissions.toLocaleString("fr-FR")} €

**Top vendeurs·ses ce mois :**
${(d.topVendors ?? []).slice(0, 5).map((v: { shop_name: string; revenue: number }, i: number) => `${i + 1}. ${v.shop_name} · ${v.revenue.toLocaleString("fr-FR")} €`).join("\n")}`;
        },
      },
      {
        id: "order-analysis",
        label: "Analyse statuts commandes",
        description: "Répartition pending / paid / shipped / litige",
        icon: <Package size={14} />,
        action: async () => {
          const res  = await fetch("/api/admin/finance/summary");
          const json = await res.json();
          const sb   = json.data?.statusBreakdown ?? {};
          const lines = Object.entries(sb)
            .sort(([,a], [,b]) => (b as { count: number }).count - (a as { count: number }).count)
            .map(([status, v]) => {
              const val = v as { count: number; revenue: number };
              return `• **${status}** : ${val.count} commande${val.count > 1 ? "s" : ""} (${val.revenue.toLocaleString("fr-FR")} €)`;
            });
          if (!lines.length) return "Aucune donnée de commandes.";
          return `📦 **STATUTS COMMANDES**\n\n${lines.join("\n")}`;
        },
      },
    ],
  },

  {
    id: "koda",
    name: "Koda",
    jobTitle: "Responsable Opérations & Vendeurs",
    color: "#E0901E",
    icon: Package,
    starters: ["Commandes en attente ?", "Vendeurs à approuver ?", "Problèmes du jour"],
    tasks: (_push) => [
      {
        id: "pending-orders",
        label: "Vérifier commandes bloquées",
        description: "Commandes pending depuis plus de 24h",
        icon: <AlertCircle size={14} />,
        action: async () => {
          const res  = await fetch("/api/admin/orders?status=pending&limit=20");
          const json = await res.json();
          const orders = json.data ?? [];
          if (!orders.length) return "✅ Aucune commande bloquée en ce moment.";
          const lines = orders.slice(0, 10).map((o: { id: string; total_amount: number; created_at: string }) =>
            `• #${o.id.slice(0, 8)} · ${Number(o.total_amount).toFixed(2)} € · créée le ${new Date(o.created_at).toLocaleDateString("fr-FR")}`
          );
          return `⚠️ **${orders.length} commande(s) en attente**\n\n${lines.join("\n")}\n\nVa dans Commandes pour les traiter.`;
        },
      },
      {
        id: "vendor-report",
        label: "Rapport vendeurs·ses",
        description: "Boutiques actives, en attente d'approbation",
        icon: <Users size={14} />,
        action: async () => {
          const res  = await fetch("/api/admin/agents/chat", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              agent: "koda",
              messages: [{ role: "user", content: "Donne-moi un rapport sur les vendeurs·ses et les opérations en cours. Identifie les points d'attention." }],
            }),
          });
          const json = await res.json();
          return json.data?.reply ?? "Impossible de générer le rapport.";
        },
      },
      {
        id: "moderation-check",
        label: "Vérifier file de modération",
        description: "Contenus en attente de validation",
        icon: <ShieldCheck size={14} />,
        action: async () => {
          const res  = await fetch("/api/admin/moderation?status=pending&limit=5");
          const json = await res.json();
          const items = json.data ?? [];
          if (!items.length) return "✅ File de modération vide · tout est à jour.";
          return `🔍 **${items.length} élément(s) en attente de modération**\n\nVa dans la section Modération pour les traiter.`;
        },
      },
    ],
  },

  {
    id: "mira",
    name: "Mira",
    jobTitle: "Directrice Générale IA",
    color: "#6D2DB5",
    icon: BarChart3,
    starters: ["Rapport hebdomadaire", "Priorités de la semaine", "Santé globale de la plateforme"],
    tasks: (_push) => [
      {
        id: "weekly-report",
        label: "Rapport hebdomadaire complet",
        description: "Finance + CRM + Ops + recommandations stratégiques",
        icon: <FileText size={14} />,
        action: async () => {
          const res  = await fetch("/api/admin/agents/chat", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              agent: "mira",
              messages: [{ role: "user", content: "Génère le rapport hebdomadaire complet : résumé exécutif, chiffres clés, alertes, 3 priorités actionnables pour cette semaine." }],
            }),
          });
          const json = await res.json();
          return json.data?.reply ?? "Impossible de générer le rapport.";
        },
      },
      {
        id: "launch-all-agents",
        label: "Lancer toutes les t-ches automatiques",
        description: "Qualification leads + rapport financier en parallèle",
        icon: <Zap size={14} />,
        action: async () => {
          const [qualifyRes, financeRes] = await Promise.allSettled([
            fetch("/api/admin/crm?stage=identified").then(r => r.json()),
            fetch("/api/admin/finance/summary").then(r => r.json()),
          ]);

          let report = "🚀 **BILAN AUTOMATIQUE**\n\n";

          if (qualifyRes.status === "fulfilled") {
            const leads = qualifyRes.value.data ?? [];
            report += `**CRM :** ${leads.length} lead(s) en attente de qualification\n`;
          }

          if (financeRes.status === "fulfilled") {
            const d = financeRes.value.data;
            report += `**Finance :** ${d?.revenueThisMonth?.toFixed(2) ?? 0} € ce mois · ${d?.monthGrowthPct > 0 ? "+" : ""}${d?.monthGrowthPct?.toFixed(1) ?? 0}% vs mois dernier\n`;
          }

          report += "\n➡ Lance chaque agent individuellement pour exécuter leurs t-ches.";
          return report;
        },
      },
    ],
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [activeId, setActiveId] = useState("mira");
  const agents = buildAgents();
  const agent  = agents.find(a => a.id === activeId)!;
  const Icon   = agent.icon;

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)]">

      {/* ── Left: agent roster ── */}
      <div className="w-52 flex-shrink-0 flex flex-col gap-2">
        <div className="mb-1">
          <h1 className="font-fraunces text-xl text-[#1A1612]">Équipe IA</h1>
          <p className="font-mono text-[10px] text-[#1A1612]/28 mt-0.5">Tes salarié·es virtuels</p>
        </div>

        {agents.map(a => {
          const AIcon = a.icon;
          const active = a.id === activeId;
          return (
            <button key={a.id} onClick={() => setActiveId(a.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                active ? "" : "border-[#1A1612]/6 hover:border-[#1A1612]/12 hover:bg-[#1A1612]/[0.02]"
              }`}
              style={active ? { borderColor: `${a.color}35`, background: `${a.color}08` } : {}}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: active ? `${a.color}18` : "rgba(243,234,219,.04)", color: a.color }}>
                  <AIcon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-hanken text-sm font-medium truncate" style={{ color: active ? a.color : "#1A1612" }}>
                    {a.name}
                  </p>
                  <p className="font-mono text-[8.5px] text-[#1A1612]/25 truncate leading-tight mt-0.5">{a.jobTitle}</p>
                </div>
                {active && <ChevronRight size={11} style={{ color: `${a.color}60` }} className="shrink-0" />}
              </div>
            </button>
          );
        })}

        {/* Team note */}
        <div className="mt-auto p-3 rounded-xl bg-[#1A1612]/[0.025] border border-[#1A1612]/6">
          <p className="font-mono text-[9px] text-[#1A1612]/22 leading-relaxed">
            Chaque agent a accès aux données en temps réel et peut exécuter des t-ches réelles.
          </p>
        </div>
      </div>

      {/* ── Right: active agent ── */}
      <div className="flex-1 min-w-0 p-5 rounded-2xl border overflow-hidden flex flex-col"
        style={{ borderColor: `${agent.color}20`, background: `${agent.color}04` }}>
        <AgentPanel key={activeId} agent={agent} />
      </div>
    </div>
  );
}
