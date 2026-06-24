import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

// Génère une image de couverture éditoriale (DALL·E 3) et l'upload dans le
// storage Supabase pour obtenir une URL persistante (les URLs OpenAI expirent).
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return apiError("OPENAI_API_KEY manquant dans les variables d'environnement", 503);

  let body: { title?: string; topic?: string };
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }
  const subject = (body.title || body.topic || "").trim();
  if (!subject) return apiError("Indique un titre/sujet pour la couverture");

  const prompt = `Illustration éditoriale moderne pour un blog queer & inclusif (Spectrum For Us), sujet : "${subject}".
Style : illustration vectorielle vibrante, palette prisme/arc-en-ciel douce (magenta, violet, bleu, jaune), formes abstraites et organiques, lumineux, optimiste, contemporain 2026.
SANS aucun texte, lettre, logo ni filigrane. Pas de visages réalistes de personnes réelles. Composition de couverture horizontale, élégante.`;

  try {
    const client = new OpenAI({ apiKey });
    const img = await client.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1792x1024",
      response_format: "b64_json",
      n: 1,
    });
    const b64 = img.data?.[0]?.b64_json;
    if (!b64) return apiError("Image non générée, réessaie.", 502);

    const buffer = Buffer.from(b64, "base64");
    const admin = createAdminClient();
    const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.png`;
    const { error: upErr } = await admin.storage.from("event-images").upload(path, buffer, {
      contentType: "image/png", upsert: false,
    });
    if (upErr) return apiError("Upload de la couverture échoué : " + upErr.message, 500);
    const { data: pub } = admin.storage.from("event-images").getPublicUrl(path);
    return apiResponse({ cover_url: pub.publicUrl });
  } catch (e) {
    return apiError("Échec de la couverture : " + (e instanceof Error ? e.message : "erreur IA"), 502);
  }
}
