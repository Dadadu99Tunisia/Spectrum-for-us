import { NextRequest } from "next/server";
import { claudeText, anthropicConfigured } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

const SYSTEM = `
Tu rédiges des messages de prise de contact pour Spectrum For Us, une marketplace queer.
Le ton : humain, chaleureux, pas corporate. Pas de "Bonjour Madame/Monsieur". Pas de template robotique.
Longueur : 4 à 6 lignes max. Tutoiement.
Inclure : pourquoi on les contacte (leur univers colle à Spectrum), ce qu'on propose (vendre sur la plateforme), call to action simple.
NE PAS mentionner de prix, commissions ou contrats.
Langue : français uniquement.
`.trim();

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing", "commercial"]);
  if ("error" in auth) return auth.error;

  if (!anthropicConfigured()) return apiError("ANTHROPIC_API_KEY manquant dans les variables d'environnement", 503);

  const { id } = await params;
  const supabase = await createClient();

  const { data: lead, error: fetchErr } = await supabase
    .from("crm_contacts")
    .select("id,name,email,company,contact_type,stage,notes")
    .eq("id", id)
    .single();

  if (fetchErr || !lead) return apiError("Contact introuvable", 404);

  const userMsg = `Rédige un message de prise de contact pour ce profil :
- Nom/marque : ${lead.company ?? lead.name}
- Contact : ${lead.name}
- Univers : ${lead.contact_type ?? "créateur indépendant"}
- Infos supplémentaires : ${lead.notes ?? "-"}

Objectif : les inviter à rejoindre Spectrum For Us pour vendre leurs créations.`;

  let message = await claudeText({ system: SYSTEM, user: userMsg, maxTokens: 600 });
  if (message.length > 600) message = message.slice(0, 600).trimEnd() + "…";

  const dateStr   = new Date().toLocaleDateString("fr-FR");
  const noteEntry = `\n\n[MESSAGE PRÊT · ${dateStr}]\n${message}`;
  const newNotes  = lead.notes ? `${lead.notes}${noteEntry}` : noteEntry.trim();

  const { data: updated, error: updateErr } = await supabase
    .from("crm_contacts")
    .update({
      notes:      newNotes,
      stage:      lead.stage === "qualified" ? "contacted" : lead.stage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id).select().single();

  if (updateErr) return apiError(updateErr.message);

  // Journalise dans la timeline (non bloquant).
  await supabase.from("crm_interactions").insert({
    contact_id: id, user_id: auth.user.id, type: "outreach",
    subject: "Message d'approche généré", content: message,
  });

  return apiResponse({ message, contact: updated });
}
