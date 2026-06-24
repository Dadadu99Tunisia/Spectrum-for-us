import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

// Chargement + mise à jour d'un article côté serveur (admin client → bypass RLS).
const EDITABLE = [
  "title_fr", "title_en", "title_ar",
  "excerpt_fr", "excerpt_en", "excerpt_ar",
  "content_fr", "content_en", "content_ar",
  "cover_url", "cover_position", "category",
] as const;

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const admin = createAdminClient();
  const { data, error } = await admin.from("articles").select("*").eq("id", id).single();
  if (error || !data) return apiError("Article introuvable", 404);
  return apiResponse(data);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }

  const patch: Record<string, unknown> = {};
  for (const k of EDITABLE) {
    if (k in body) patch[k] = body[k] === "" ? null : body[k];
  }
  if ("tags" in body) {
    const raw = body.tags;
    patch.tags = Array.isArray(raw)
      ? raw.map((t) => String(t).trim()).filter(Boolean)
      : String(raw ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  }
  if ("published" in body) {
    patch.published = Boolean(body.published);
    patch.published_at = body.published ? new Date().toISOString() : null;
  }
  if (!Object.keys(patch).length) return apiError("Rien à mettre à jour");

  const admin = createAdminClient();
  const { error } = await admin.from("articles").update(patch).eq("id", id);
  if (error) return apiError("Mise à jour échouée : " + error.message, 500);
  return apiResponse({ ok: true });
}
