import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

const SYSTEM = `
Tu rédiges des messages de prise de contact pour Spectrum For Us, une marketplace queer francophone.
Le ton : humain, chaleureux, pas corporate. Pas de "Bonjour Madame/Monsieur". Pas de template robotique.
Longueur : 4 à 6 lignes max. Tutoiement.
Inclure : pourquoi on les contacte (leur univers colle à Spectrum), ce qu'on propose (vendre sur la plateforme), call to action simple.
NE PAS mentionner de prix, commissions ou contrats.
Langue : français uniquement.
`.trim();

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing", "commercial"]);
  if ("error" in auth) return auth.error;

  if (!process.env.OPENAI_API_KEY) {
    return apiError("OPENAI_API_KEY manquant dans les variables d'environnement", 503);
  }

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
- Infos supplémentaires : ${lead.notes ?? "—"}

Objectif : les inviter à rejoindre Spectrum For Us pour vendre leurs créations.`;

  const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user",   content: userMsg },
      ],
      temperature: 0.8,
      max_tokens: 300,
    }),
  });

  if (!oaRes.ok) {
    const err = await oaRes.text();
    return apiError(`OpenAI error: ${err}`, 502);
  }

  const oaJson  = await oaRes.json();
  let message   = oaJson.choices?.[0]?.message?.content?.trim() ?? "";
  if (message.length > 600) message = message.slice(0, 600).trimEnd() + "…";

  // Append message to notes
  const dateStr  = new Date().toLocaleDateString("fr-FR");
  const noteEntry = `\n\n[MESSAGE PRÊT — ${dateStr}]\n${message}`;
  const newNotes  = lead.notes ? `${lead.notes}${noteEntry}` : noteEntry.trim();

  const { data: updated, error: updateErr } = await supabase
    .from("crm_contacts")
    .update({
      notes:      newNotes,
      stage:      lead.stage === "qualified" ? "contacted" : lead.stage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateErr) return apiError(updateErr.message);

  return apiResponse({ message, contact: updated });
}
