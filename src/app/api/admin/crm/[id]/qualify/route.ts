import { NextRequest } from "next/server";
import { claudeText, anthropicConfigured } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

const SYSTEM = `
Tu es un analyste de croissance pour Spectrum For Us, la première marketplace queer.
Tu évalues des leads (marques, créateurs, prestataires) pour savoir s'ils sont pertinents.

Critères de scoring (1 à 5) :
  5 · Parfait : brand queer, inclusive, lgbtqia+, art, mode non-genrée, bijoux, cosmétique inclusive
  4 · Très bon : créateur indépendant FR/BE/CH dans la mode, beauté, art, bien-être, édition
  3 · Potentiel : marque lifestyle éthique ou jeune créateur sans positionnement clair
  2 · Faible : trop mainstream, pas de lien avec la communauté
  1 · Hors scope : corporate, luxe établi, pas FR, service B2B pur

Réponds UNIQUEMENT en JSON valide, sans markdown.
Format : { "score": number, "decision": "accept"|"follow_up"|"reject", "reason": string (1 phrase max) }
`.trim();

function parseResult(raw: string) {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const p = JSON.parse(cleaned);
    const score = Number(p.score);
    const decision = p.decision as string;
    if (!score || !["accept", "follow_up", "reject"].includes(decision)) throw new Error("bad");
    return { score, decision: decision as "accept" | "follow_up" | "reject", reason: String(p.reason ?? "") };
  } catch {
    const m = raw.match(/score["\s:]+(\d)/i);
    const score = m ? Number(m[1]) : 2;
    return {
      score,
      decision: score >= 4 ? "accept" as const : score >= 3 ? "follow_up" as const : "reject" as const,
      reason: "Analyse partielle",
    };
  }
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing", "commercial"]);
  if ("error" in auth) return auth.error;

  if (!anthropicConfigured()) return apiError("ANTHROPIC_API_KEY manquant dans les variables d'environnement", 503);

  const { id } = await params;
  const supabase = await createClient();

  const { data: lead, error: fetchErr } = await supabase
    .from("crm_contacts")
    .select("id,name,email,company,contact_type,stage,source,notes,tags")
    .eq("id", id)
    .single();

  if (fetchErr || !lead) return apiError("Contact introuvable", 404);

  const userMsg = `Lead à qualifier :
- Nom : ${lead.name}
- Entreprise : ${lead.company ?? "-"}
- Type : ${lead.contact_type ?? "-"}
- Source : ${lead.source ?? "-"}
- Notes : ${lead.notes ?? "-"}`;

  const raw    = await claudeText({ system: SYSTEM, user: userMsg, maxTokens: 400 });
  const result = parseResult(raw);

  const stageMap = {
    accept:    "qualified",
    follow_up: "nurturing",
    reject:    "rejected",
  } as const;

  const newStage  = stageMap[result.decision];
  const existTags = Array.isArray(lead.tags) ? lead.tags.filter((t: string) => !t.startsWith("ai-score:")) : [];
  const newTags   = [...existTags, `ai-score:${result.score}`];
  const dateStr   = new Date().toLocaleDateString("fr-FR");
  const noteEntry = `\n[AI ${dateStr}] Score ${result.score}/5 · ${result.reason}`;
  const newNotes  = lead.notes ? `${lead.notes}${noteEntry}` : noteEntry.trim();

  const { data: updated, error: updateErr } = await supabase
    .from("crm_contacts")
    .update({ stage: newStage, tags: newTags, notes: newNotes, updated_at: new Date().toISOString() })
    .eq("id", id).select().single();

  if (updateErr) return apiError(updateErr.message);

  // Journalise dans la timeline (non bloquant).
  await supabase.from("crm_interactions").insert({
    contact_id: id, user_id: auth.user.id, type: "qualify",
    subject: `Score ${result.score}/5 → ${newStage}`, content: result.reason,
  });

  return apiResponse({ ...result, newStage, contact: updated });
}
