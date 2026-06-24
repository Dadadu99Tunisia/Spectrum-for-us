import { NextRequest } from "next/server";
import { claudeText, parseJsonLoose, anthropicConfigured } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

// Veille éditoriale : suggère des sujets d'articles, ancrés sur les vrais
// événements queer à venir (table queer_events) + les temps forts du moment.

const SYSTEM = `
Tu es responsable de la veille éditoriale de Spectrum For Us, marketplace queer & inclusive.
Tu proposes des idées d'articles de blog pertinentes pour la communauté LGBTQIA+ : culture, fierté, mode non-genrée,
artistes et créateur·ices queer, bien-être, visibilité trans, histoire des luttes, guides pratiques, mises en avant de la communauté.
Tu t'appuies sur les événements à venir fournis et sur la saisonnalité.

Réponds UNIQUEMENT en JSON valide : { "ideas": [ { "title": string, "angle": string, "category": "editorial"|"lifestyle"|"culture"|"news"|"guide" } ] }.
Donne 6 idées variées, percutantes, non génériques.
`.trim();

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;

  if (!anthropicConfigured()) return apiError("ANTHROPIC_API_KEY manquant dans les variables d'environnement", 503);

  let body: { theme?: string } = {};
  try { body = await req.json(); } catch { /* optionnel */ }

  // Veille réelle : on récupère les prochains événements queer publiés.
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data: events } = await supabase
    .from("queer_events")
    .select("title, city, date_start, category")
    .gte("date_start", nowIso)
    .order("date_start", { ascending: true })
    .limit(12);

  const eventsBlock = (events ?? []).length
    ? (events ?? []).map(e => `- ${e.title}${e.city ? ` (${e.city})` : ""} · ${String(e.date_start).slice(0, 10)}`).join("\n")
    : "(aucun événement à venir en base)";

  const userMsg = `Mois en cours : ${new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.
${body.theme ? `Thème prioritaire : ${body.theme}.` : ""}
Événements queer à venir (pour ancrer la veille) :
${eventsBlock}

Propose 6 idées d'articles.`;

  try {
    const raw = await claudeText({ system: SYSTEM, user: userMsg, maxTokens: 1500, json: true });
    const data = parseJsonLoose(raw);
    const ideas = Array.isArray(data.ideas) ? data.ideas.slice(0, 8).map((i: { title?: unknown; angle?: unknown; category?: unknown }) => ({
      title: String(i.title ?? ""), angle: String(i.angle ?? ""), category: String(i.category ?? "editorial"),
    })).filter((i: { title: string }) => i.title) : [];
    return apiResponse({ ideas, eventsUsed: (events ?? []).length });
  } catch (e) {
    return apiError("Échec de la veille : " + (e instanceof Error ? e.message : "erreur IA"), 502);
  }
}
