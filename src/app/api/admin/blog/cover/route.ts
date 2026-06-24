import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

// Couverture éditoriale générative à la charte Spectrum (prisme abstrait).
// Plus de DALL·E : on génère un SVG vectoriel déterministe (varié selon le
// sujet) et on l'upload dans le storage Supabase → URL persistante, zéro coût.
const PALETTE = ["#FF2DA0", "#7A2BF0", "#2323C4", "#F93C2C", "#FFD400"];

function seedFrom(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function buildCoverSvg(subject: string): string {
  const rnd = seedFrom(subject || "spectrum");
  const W = 1792, H = 1024;
  const blobs = Array.from({ length: 6 }, (_, i) => {
    const cx = Math.round(rnd() * W), cy = Math.round(rnd() * H);
    const r = Math.round(220 + rnd() * 360);
    const color = PALETTE[Math.floor(rnd() * PALETTE.length)];
    const op = (0.28 + rnd() * 0.4).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${op}" filter="url(#b)"/>`;
  }).join("");
  const stripeY = H - 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="90"/></filter></defs>
<rect width="${W}" height="${H}" fill="#FBFAF8"/>
${blobs}
<rect x="0" y="${stripeY}" width="${W}" height="10" fill="none"/>
<g>${PALETTE.map((c, i) => `<rect x="${(W / PALETTE.length) * i}" y="${stripeY}" width="${W / PALETTE.length}" height="10" fill="${c}"/>`).join("")}</g>
</svg>`;
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "marketing"]);
  if ("error" in auth) return auth.error;

  let body: { title?: string; topic?: string };
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }
  const subject = (body.title || body.topic || "").trim();
  if (!subject) return apiError("Indique un titre/sujet pour la couverture");

  try {
    const svg = buildCoverSvg(subject);
    const admin = createAdminClient();
    const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.svg`;
    const { error: upErr } = await admin.storage.from("event-images").upload(path, Buffer.from(svg), {
      contentType: "image/svg+xml", upsert: false,
    });
    if (upErr) return apiError("Upload de la couverture échoué : " + upErr.message, 500);
    const { data: pub } = admin.storage.from("event-images").getPublicUrl(path);
    return apiResponse({ cover_url: pub.publicUrl });
  } catch (e) {
    return apiError("Échec de la couverture : " + (e instanceof Error ? e.message : "erreur"), 502);
  }
}
