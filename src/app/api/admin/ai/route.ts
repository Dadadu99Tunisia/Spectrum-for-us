import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAdmin, apiError } from "@/lib/admin/rbac";
import { createClient } from "@/lib/supabase/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Contextes pré-définis avec leurs system prompts
const CONTEXTS: Record<string, { label: string; system: string }> = {
  general: {
    label: "Assistant général",
    system: `Tu es l'IA interne de Spectrum For Us, une marketplace queer & inclusive basée en France.
Tu aides l'équipe admin à prendre des décisions, analyser des données et rédiger du contenu.
Réponds en français, de manière concise et professionnelle.
Tu as accès au contexte de la plateforme : vendeurs LGBTQIA+, produits artisanaux, communauté queer.`,
  },
  sales: {
    label: "Analyse des ventes",
    system: `Tu es un analyste financier de Spectrum For Us.
Tu aides à interpréter les KPIs, identifier des tendances et formuler des recommandations business.
Réponds avec des insights actionnables, utilise des métriques concrètes.
Vocabulaire : CA (chiffre d'affaires), panier moyen, taux de conversion, LTV, churn.`,
  },
  newsletter: {
    label: "Rédaction newsletter",
    system: `Tu es le copywriter de Spectrum For Us.
Tu rédiges des newsletters inclusives, engageantes et authentiques pour la communauté queer.
Ton de voix : chaleureux, engagé, inclusif. Utilise le pronom "tu".
Formate en sections claires : accroche, contenu, CTA.`,
  },
  social: {
    label: "Posts réseaux sociaux",
    system: `Tu es le social media manager de Spectrum For Us.
Tu crées des posts pour Instagram, TikTok et LinkedIn adaptés à chaque plateforme.
Style : authentique, inclusif, avec des hashtags pertinents.
Instagram : visuel + émotions. TikTok : court et percutant. LinkedIn : professionnel mais humain.`,
  },
  vendor: {
    label: "Réponse vendeur",
    system: `Tu es le support vendeur de Spectrum For Us.
Tu rédiges des réponses professionnelles et empathiques aux vendeurs de la plateforme.
Sois clair sur les règles, encourageant, et oriente vers les ressources disponibles.
Rappelle-toi que nos vendeurs sont des créateur·rices indépendant·es, souvent en solo.`,
  },
  moderation: {
    label: "Aide à la modération",
    system: `Tu es l'assistant de modération de Spectrum For Us.
Tu aides l'équipe à évaluer si un contenu respecte les chartes, rédiger des notifications de rejet,
et formuler des politiques de modération inclusives.
Notre communauté est queer & safe. Tolérance zéro pour le hate speech.`,
  },
};

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { messages, context = "general", conversationId, stream = false } = body;

  if (!messages?.length) return apiError("messages required");

  const ctx = CONTEXTS[context] ?? CONTEXTS.general;

  // Sauvegarder dans ai_conversations si conversationId fourni
  const supabase = await createClient();

  if (stream) {
    // Streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const streamResp = await client.messages.stream({
            model: "claude-opus-4-5",
            max_tokens: 2048,
            system: ctx.system,
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
          });

          for await (const chunk of streamResp) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
            }
          }

          const finalMsg = await streamResp.finalMessage();
          // Sauvegarder la conversation
          if (conversationId) {
            await supabase.from("ai_messages").insert([
              { conversation_id: conversationId, role: "user",      content: messages[messages.length - 1].content, tokens_used: 0 },
              { conversation_id: conversationId, role: "assistant", content: finalMsg.content[0].type === "text" ? finalMsg.content[0].text : "", tokens_used: finalMsg.usage.output_tokens },
            ]);
          }

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  // Non-streaming
  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    system: ctx.system,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  return Response.json({
    data: {
      text,
      usage: response.usage,
      model: response.model,
      context: ctx.label,
    },
    error: null,
  });
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  return Response.json({
    data: {
      contexts: Object.entries(CONTEXTS).map(([key, v]) => ({ key, label: v.label })),
      model: "claude-opus-4-5",
    },
    error: null,
  });
}
