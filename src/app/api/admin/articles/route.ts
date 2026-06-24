import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Création d'article côté serveur (admin client → bypass RLS).
// L'admin est reconnu par email allowlist mais n'a pas forcément de ligne
// `profiles`, donc l'insert direct côté client était bloqué par la RLS.
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }

  const title_fr = String(body.title_fr ?? "").trim();
  if (!title_fr) return apiError("Le titre français est obligatoire");

  const publish = Boolean(body.published);
  const rawTags = body.tags;
  const tags = Array.isArray(rawTags)
    ? rawTags.map(t => String(t).trim()).filter(Boolean)
    : String(rawTags ?? "").split(",").map(t => t.trim()).filter(Boolean);

  const admin = createAdminClient();
  const row = {
    slug: slugify(title_fr) || `article-${Date.now()}`,
    title_fr,
    title_en: String(body.title_en ?? "") || null,
    title_ar: String(body.title_ar ?? "") || null,
    excerpt_fr: String(body.excerpt_fr ?? "") || null,
    excerpt_en: String(body.excerpt_en ?? "") || null,
    excerpt_ar: String(body.excerpt_ar ?? "") || null,
    content_fr: String(body.content_fr ?? "") || null,
    content_en: String(body.content_en ?? "") || null,
    content_ar: String(body.content_ar ?? "") || null,
    cover_url: String(body.cover_url ?? "") || null,
    category: String(body.category ?? "editorial"),
    tags,
    published: publish,
    published_at: publish ? new Date().toISOString() : null,
    author_id: auth.user.id,
  };

  const { data, error } = await admin.from("articles").insert(row).select("id, slug").single();
  if (error) return apiError("Enregistrement échoué : " + error.message, 500);
  return apiResponse({ id: data.id, slug: data.slug });
}
