import { NextRequest } from "next/server";
import { claudeChat, anthropicConfigured } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

// ─── Agent definitions ────────────────────────────────────────────────────────
const AGENTS = {
  aria: {
    name: "Aria",
    role: "Agente Croissance & CRM",
    color: "#FF2DA0",
    system: `Tu es Aria, agente Croissance & CRM de Spectrum For Us · la première marketplace queer.
Tu analyses le pipeline commercial, les leads, les opportunités de croissance et tu conseilles l'équipe.
Ton ton : direct, stratégique, bienveillant. Tu parles en français. Tu utilises les données réelles fournies.
Tu peux donner des rapports structurés, des recommandations d'action, analyser les étapes du pipeline.
Ne réponds jamais avec des tableaux markdown complexes · utilise des listes claires et des chiffres précis.`,
    fetchData: async (supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>) => {
      const [contacts, recentContacts] = await Promise.all([
        supabase.from("crm_contacts").select("stage, contact_type, tags, created_at"),
        supabase.from("crm_contacts").select("name, company, stage, contact_type, created_at")
          .order("created_at", { ascending: false }).limit(10),
      ]);

      const stageCount: Record<string, number> = {};
      const typeCount:  Record<string, number> = {};
      let scoreSum = 0, scoreCount = 0;

      for (const c of contacts.data ?? []) {
        stageCount[c.stage] = (stageCount[c.stage] ?? 0) + 1;
        typeCount[c.contact_type] = (typeCount[c.contact_type] ?? 0) + 1;
        const tag = (c.tags ?? []).find((t: string) => t.startsWith("ai-score:"));
        if (tag) { scoreSum += Number(tag.split(":")[1]); scoreCount++; }
      }

      return `
DONNÉES CRM EN TEMPS RÉEL (${new Date().toLocaleDateString("fr-FR")}) :
Total contacts : ${contacts.data?.length ?? 0}
Score IA moyen : ${scoreCount > 0 ? (scoreSum / scoreCount).toFixed(1) : "N/A"}/5 (${scoreCount} scorés)

Pipeline par étape :
${Object.entries(stageCount).map(([s, n]) => `  • ${s}: ${n}`).join("\n")}

Types de contacts :
${Object.entries(typeCount).map(([t, n]) => `  • ${t}: ${n}`).join("\n")}

10 derniers contacts ajoutés :
${(recentContacts.data ?? []).map(c => `  • ${c.name}${c.company ? ` (${c.company})` : ""} · ${c.stage} / ${c.contact_type}`).join("\n")}
`.trim();
    },
  },

  fina: {
    name: "Fina",
    role: "Agente Finance & Revenus",
    color: "#2323C4",
    system: `Tu es Fina, agente Finance & Revenus de Spectrum For Us.
Tu analyses les chiffres de la marketplace : revenus, commissions, tendances, performances vendeur·ses.
Ton ton : précis, factuel, rassurant. Tu parles en français. Tu travailles avec les données réelles.
Tu donnes des insights actionnables sur la santé financière de la plateforme.`,
    fetchData: async (supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>) => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const yearStart  = new Date(now.getFullYear(), 0, 1).toISOString();

      const [allOrders, monthOrders, yearOrders, statusBreakdown] = await Promise.all([
        supabase.from("orders").select("total_amount, status").limit(1000),
        supabase.from("orders").select("total_amount").eq("status", "paid").gte("created_at", monthStart),
        supabase.from("orders").select("total_amount").eq("status", "paid").gte("created_at", yearStart),
        supabase.from("orders").select("status"),
      ]);

      const sum = (rows: { total_amount: number }[] | null) =>
        (rows ?? []).reduce((s, r) => s + Number(r.total_amount || 0), 0);

      const statusCounts: Record<string, number> = {};
      for (const o of statusBreakdown.data ?? []) {
        statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
      }

      const revenueMonth = sum(monthOrders.data);
      const revenueYear  = sum(yearOrders.data);
      const commission   = 15; // %

      return `
DONNÉES FINANCE EN TEMPS RÉEL (${new Date().toLocaleDateString("fr-FR")}) :
Total commandes : ${allOrders.data?.length ?? 0}
Répartition par statut :
${Object.entries(statusCounts).map(([s, n]) => `  • ${s}: ${n}`).join("\n")}

Revenus ce mois : ${revenueMonth.toFixed(2)} €
Revenus cette année : ${revenueYear.toFixed(2)} €
Commissions estimées (${commission}%) ce mois : ${(revenueMonth * 0.15).toFixed(2)} €
Commissions estimées (${commission}%) cette année : ${(revenueYear * 0.15).toFixed(2)} €
`.trim();
    },
  },

  koda: {
    name: "Koda",
    role: "Agent Opérations & Support",
    color: "#FFD400",
    system: `Tu es Koda, agent Opérations & Support de Spectrum For Us.
Tu supervises les commandes, la logistique, les tickets support et la santé opérationnelle de la plateforme.
Ton ton : calme, efficace, solution-oriented. Tu parles en français.
Tu identifies les blocages, les retards, les anomalies et proposes des actions concrètes.`,
    fetchData: async (supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>) => {
      const [orders, vendors] = await Promise.all([
        supabase.from("orders").select("status, created_at, total_amount").order("created_at", { ascending: false }).limit(50),
        supabase.from("profiles").select("role, created_at").eq("role", "vendor"),
      ]);

      const statusCounts: Record<string, number> = {};
      for (const o of orders.data ?? []) {
        statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
      }

      const recentOrders = (orders.data ?? []).slice(0, 5);

      return `
DONNÉES OPÉRATIONS EN TEMPS RÉEL (${new Date().toLocaleDateString("fr-FR")}) :
Commandes (50 dernières) :
${Object.entries(statusCounts).map(([s, n]) => `  • ${s}: ${n}`).join("\n")}

5 dernières commandes :
${recentOrders.map(o => `  • ${o.status} · ${Number(o.total_amount).toFixed(2)} € · ${new Date(o.created_at).toLocaleDateString("fr-FR")}`).join("\n")}

Vendeur·ses inscrits : ${vendors.data?.length ?? 0}
`.trim();
    },
  },

  mira: {
    name: "Mira",
    role: "Agente Stratégie & Rapports",
    color: "#7A2BF0",
    system: `Tu es Mira, agente Stratégie & Rapports de Spectrum For Us.
Tu as une vue d'ensemble de toute la plateforme et tu produis des rapports synthétiques pour l'équipe dirigeante.
Ton ton : analytique, visionnaire, précis. Tu parles en français.
Tu croises les données CRM, finance et opérations pour donner une vision stratégique claire.
Quand on te demande un rapport, tu structures avec : Résumé exécutif → Chiffres clés → Alertes → Recommandations.`,
    fetchData: async (supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>) => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const yearStart  = new Date(now.getFullYear(), 0, 1).toISOString();

      const [orders, monthRevenue, yearRevenue, crm, vendors, moderation] = await Promise.all([
        supabase.from("orders").select("status"),
        supabase.from("orders").select("total_amount").eq("status", "paid").gte("created_at", monthStart),
        supabase.from("orders").select("total_amount").eq("status", "paid").gte("created_at", yearStart),
        supabase.from("crm_contacts").select("stage"),
        supabase.from("profiles").select("id").eq("role", "vendor"),
        supabase.from("moderation_queue").select("mod_status").eq("mod_status", "pending"),
      ]);

      const sum = (rows: { total_amount: number }[] | null) =>
        (rows ?? []).reduce((s, r) => s + Number(r.total_amount || 0), 0);

      const crmStages: Record<string, number> = {};
      for (const c of crm.data ?? []) crmStages[c.stage] = (crmStages[c.stage] ?? 0) + 1;

      const orderStatus: Record<string, number> = {};
      for (const o of orders.data ?? []) orderStatus[o.status] = (orderStatus[o.status] ?? 0) + 1;

      return `
VUE D'ENSEMBLE PLATEFORME (${new Date().toLocaleDateString("fr-FR")}) :

COMMERCE :
  Total commandes : ${orders.data?.length ?? 0}
  Statuts : ${Object.entries(orderStatus).map(([s,n])=>`${s}=${n}`).join(", ")}
  Revenu ce mois : ${sum(monthRevenue.data).toFixed(2)} €
  Revenu cette année : ${sum(yearRevenue.data).toFixed(2)} €
  Commission Spectrum (15%) annuelle : ${(sum(yearRevenue.data) * 0.15).toFixed(2)} €

CRM :
  Total contacts : ${crm.data?.length ?? 0}
  Pipeline : ${Object.entries(crmStages).map(([s,n])=>`${s}=${n}`).join(", ")}

ÉCOSYSTÈME :
  Vendeur·ses actif·ves : ${vendors.data?.length ?? 0}
  Éléments en modération : ${moderation.data?.length ?? 0}
`.trim();
    },
  },
} as const;

type AgentId = keyof typeof AGENTS;

// ─── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo", "marketing", "commercial"]);
  if ("error" in auth) return auth.error;

  if (!anthropicConfigured()) return apiError("ANTHROPIC_API_KEY manquant", 503);

  const body = await req.json() as {
    agent: AgentId;
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const { agent: agentId, messages } = body;
  const agent = AGENTS[agentId];
  if (!agent) return apiError("Agent inconnu", 400);

  const supabase = await createClient();
  const context  = await agent.fetchData(supabase as Parameters<typeof agent.fetchData>[0]);

  const systemPrompt = `${agent.system}\n\n${context}`;

  // Derniers échanges, en s'assurant que l'historique commence par un message "user"
  // (requis par l'API Claude).
  const history = messages.slice(-10).filter(m => m.content?.trim());
  while (history.length && history[0].role !== "user") history.shift();

  const reply = (await claudeChat({ system: systemPrompt, messages: history, maxTokens: 1024 }))
    || "Aucune réponse.";
  return apiResponse({ reply, agent: agentId });
}
