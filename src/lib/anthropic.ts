import Anthropic from "@anthropic-ai/sdk";

// Couche IA centralisée — passée d'OpenAI à Claude (Anthropic).
// Modèle par défaut : Claude Opus 4.8. Pour réduire les coûts sur les tâches
// simples, passe SPECTRUM_AI_MODEL=claude-haiku-4-5 (ou claude-sonnet-4-6) en env.

const MODEL = process.env.SPECTRUM_AI_MODEL || "claude-opus-4-8";

export function anthropicConfigured() {
  return !!process.env.ANTHROPIC_API_KEY;
}

type Msg = { role: "user" | "assistant"; content: string };

/** Appel Claude générique (system + historique de messages) → texte. */
export async function claudeChat(opts: {
  system: string;
  messages: Msg[];
  maxTokens?: number;
}): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 1024,
    system: opts.system,
    messages: opts.messages,
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

/** Raccourci system + un seul message utilisateur. `json: true` force une sortie JSON. */
export async function claudeText(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  json?: boolean;
}): Promise<string> {
  const system = opts.json
    ? `${opts.system}\n\nIMPORTANT : réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte ni balise markdown autour.`
    : opts.system;
  return claudeChat({
    system,
    messages: [{ role: "user", content: opts.user }],
    maxTokens: opts.maxTokens,
  });
}

/** Parse JSON tolérant (retire d'éventuelles balises ```json et le texte autour). */
export function parseJsonLoose(raw: string): Record<string, unknown> {
  let s = (raw ?? "").trim();
  if (s.startsWith("```")) s = s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a >= 0 && b > a) s = s.slice(a, b + 1);
  return JSON.parse(s);
}
