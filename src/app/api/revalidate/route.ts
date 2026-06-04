import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/revalidate
 * Invalide le cache Next.js pour un chemin donné.
 * Appelé après mutation de produit/boutique pour forcer le refresh des OG images et sitemap.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  let body: { paths?: string[] };
  try { body = await req.json(); } catch { body = {}; }

  const allowedPrefixes = ["/boutique/", "/produit/", "/decouvrir", "/sitemap.xml"];
  const paths = (body.paths ?? []).filter((p: string) =>
    typeof p === "string" && allowedPrefixes.some(prefix => p.startsWith(prefix))
  );

  for (const path of paths) {
    revalidatePath(path);
  }

  // Toujours revalider le sitemap
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ revalidated: paths, ok: true });
}
