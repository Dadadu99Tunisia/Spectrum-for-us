import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_BUCKETS = ["shop-assets", "shop-images", "product-images", "kyc-documents"] as const;
type Bucket = typeof ALLOWED_BUCKETS[number];

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const formData = await req.formData();
  const file     = formData.get("file") as File | null;
  const bucket   = formData.get("bucket") as Bucket | null;
  const folder   = formData.get("folder") as string | null; // shop_id pour shop-assets

  if (!file)   return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  if (!bucket || !ALLOWED_BUCKETS.includes(bucket))
    return NextResponse.json({ error: "Bucket invalide" }, { status: 400 });

  // Taille max
  const MAX = bucket === "shop-assets" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > MAX)
    return NextResponse.json({ error: `Fichier trop lourd (max ${MAX / 1024 / 1024} Mo)` }, { status: 400 });

  // Types acceptés
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (bucket !== "kyc-documents" && !ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 });

  // Valider que folder appartient à l'utilisateur (évite path traversal / upload dans le dossier d'un autre)
  if (folder) {
    const isOwnId = folder === user.id;
    if (!isOwnId) {
      // Doit être un shop_id dont l'utilisateur est owner
      const { data: shop } = await supabase
        .from("shops").select("id").eq("id", folder).eq("owner_id", user.id).maybeSingle();
      if (!shop) {
        return NextResponse.json({ error: "Dossier non autorisé" }, { status: 403 });
      }
    }
  }

  // Chemin : {folder_ou_user_id}/{timestamp}-{nom_nettoyé}
  const prefix    = folder ?? user.id;
  const ext       = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const clean     = file.name.replace(/[^a-z0-9]/gi, "-").toLowerCase().slice(0, 40);
  const filename  = `${prefix}/${Date.now()}-${clean}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl, path: filename });
}
