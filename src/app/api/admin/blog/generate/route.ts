import { NextRequest } from "next/server";
import OpenAI from "openai";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

// Générateur d'article de blog trilingue (FR/EN/AR) pour Spectrum For Us.
// Renvoie tous les champs de la table `articles` prêts à éditer/publier.

const SYSTEM = `
Tu es la plume éditoriale de Spectrum For Us — la première marketplace queer & inclusive ("B(u)y us, for us.").
Ton : chaleureux, militant-joyeux, fier, accessible, jamais corporate ni larmoyant. Tu écris pour la communauté LGBTQIA+ et ses allié·es.
Tu utilises l'écriture inclusive en français (point médian : créateur·ices, allié·es), un anglais inclusif et naturel, et un arabe standard moderne respectueux et clair.

Tu écris un article de blog éditorial COMPLET, dans les TROIS langues : français, anglais, arabe.
Chaque version doit être une vraie rédaction native (pas une traduction littérale) : adapte les références culturelles à chaque langue.
Contenu en **markdown** : un chapô, des sous-titres (##), des paragraphes, éventuellement une liste. 450 à 700 mots par langue.
Évite les clichés, les promesses commerciales agressives et le name-dropping de marques externes.

Réponds UNIQUEMENT en JSON valide (pas de markdown autour), avec EXACTEMENT cette forme :
{
  "title_fr": string, "title_en": string, "title_ar": string,
  "excerpt_fr": string, "excerpt_en": string, "excerpt_ar": string,   // 1 à 2 phrases d'accroche par langue
  "content_fr": string, "content_en": string, "content_ar": string,   // markdown, 450-700 mots
  "tags": string[]                                                     // 3 à 6 tags courts, en minuscules, sans #
}
`.trim();

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return apiError("OPENAI_API_KEY manquant dans les variables d'environnement", 503);

  let body: { topic?: string; category?: string; angle?: string };
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }
  const topic = (body.topic ?? "").trim();
  if (!topic) return apiError("Indique un sujet d'article");

  const userMsg = `Sujet : ${topic}
${body.angle ? `Angle souhaité : ${body.angle}` : ""}
Catégorie éditoriale : ${body.category ?? "editorial"}
Rédige l'article complet dans les trois langues.`;

  try {
    const client = new OpenAI({ apiKey });
    const msg = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 4096,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userMsg },
      ],
    });

    const raw = msg.choices[0]?.message?.content ?? "{}";
    const data = JSON.parse(raw);
    // Garde-fous minimaux
    const out = {
      title_fr: String(data.title_fr ?? ""), title_en: String(data.title_en ?? ""), title_ar: String(data.title_ar ?? ""),
      excerpt_fr: String(data.excerpt_fr ?? ""), excerpt_en: String(data.excerpt_en ?? ""), excerpt_ar: String(data.excerpt_ar ?? ""),
      content_fr: String(data.content_fr ?? ""), content_en: String(data.content_en ?? ""), content_ar: String(data.content_ar ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map((t: unknown) => String(t)).slice(0, 6) : [],
    };
    if (!out.title_fr || !out.content_fr) return apiError("Génération incomplète, réessaie.", 502);
    return apiResponse(out);
  } catch (e) {
    return apiError("Échec de la génération : " + (e instanceof Error ? e.message : "erreur IA"), 502);
  }
}
