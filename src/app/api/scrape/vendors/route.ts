import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FoundVendor {
  name: string;
  platform: string;
  profile_url: string;
  instagram_handle?: string;
  description?: string;
  category?: string;
  followers_count?: number;
  email?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractText(html: string, regex: RegExp): string {
  const m = html.match(regex);
  return m ? m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : "";
}

// ─── Instagram public hashtag search ──────────────────────────────────────────

async function searchInstagramHashtags(): Promise<FoundVendor[]> {
  const vendors: FoundVendor[] = [];
  const hashtags = ["createurqueer", "modenongenree", "queerfashionfrance", "artqueer", "bijouqueer", "creationqueer", "modequeer", "pridecollection"];

  for (const tag of hashtags) {
    try {
      // Use Instagram's public API endpoint (no auth for basic data)
      const res = await fetch(
        `https://www.instagram.com/explore/tags/${tag}/?__a=1&__d=dis`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
            "Accept": "application/json",
            "x-ig-app-id": "936619743392459",
          },
          signal: AbortSignal.timeout(8000),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const posts = data.graphql?.hashtag?.edge_hashtag_to_media?.edges || data.data?.recent?.sections || [];

      for (const edge of posts.slice(0, 10)) {
        const node = edge.node || edge;
        const owner = node.owner;
        if (!owner?.username) continue;
        vendors.push({
          name: owner.full_name || owner.username,
          platform: "instagram",
          profile_url: `https://www.instagram.com/${owner.username}/`,
          instagram_handle: owner.username,
          description: node.edge_media_to_caption?.edges?.[0]?.node?.text?.slice(0, 200),
          category: inferCategory(tag),
          followers_count: owner.edge_followed_by?.count,
        });
      }
    } catch { /* blocked / rate limited */ }
  }
  return vendors;
}

// ─── Etsy search (public pages) ───────────────────────────────────────────────

async function searchEtsy(): Promise<FoundVendor[]> {
  const vendors: FoundVendor[] = [];
  const queries = ["queer fashion france", "mode non genree", "bijou queer", "art queer", "zine queer france"];

  for (const q of queries) {
    try {
      const url = `https://www.etsy.com/fr/search?q=${encodeURIComponent(q)}&ship_to=FR`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9",
          "Accept": "text/html",
        },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const html = await res.text();

      // Extract shop names from Etsy search results
      const shopMatches = [...html.matchAll(/etsy\.com\/fr\/shop\/([a-zA-Z0-9_]+)/g)];
      const seen = new Set<string>();
      for (const m of shopMatches) {
        const shop = m[1];
        if (seen.has(shop) || shop.length < 3) continue;
        seen.add(shop);
        vendors.push({
          name: shop,
          platform: "etsy",
          profile_url: `https://www.etsy.com/fr/shop/${shop}`,
          category: inferCategory(q),
          description: `Boutique Etsy — trouvée via "${q}"`,
        });
      }
    } catch { /* network */ }
  }
  return vendors;
}

// ─── French queer directories ─────────────────────────────────────────────────

async function searchDirectories(): Promise<FoundVendor[]> {
  const vendors: FoundVendor[] = [];

  // Annuaire-asso.fr — associations LGBTQ+ en France
  try {
    const res = await fetch(
      "https://www.annuaire-asso.fr/associations/?q=lgbt&type=association",
      {
        headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "fr-FR" },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (res.ok) {
      const html = await res.text();
      const nameMatches = [...html.matchAll(/class="[^"]*title[^"]*"[^>]*>([^<]{5,80})<\//g)];
      const linkMatches = [...html.matchAll(/href="(\/association\/[^"]+)"/g)];
      nameMatches.forEach((m, i) => {
        const name = m[1].trim();
        if (!name) return;
        vendors.push({
          name,
          platform: "annuaire-asso",
          profile_url: linkMatches[i] ? `https://www.annuaire-asso.fr${linkMatches[i][1]}` : "",
          category: "Association",
          description: "Association LGBTQIA+ référencée sur annuaire-asso.fr",
        });
      });
    }
  } catch { /* network */ }

  return vendors;
}

function inferCategory(hint: string): string {
  if (/bijou|jewelry|ring/.test(hint)) return "Bijoux";
  if (/mode|fashion|vêt|cloth/.test(hint)) return "Mode non-genrée";
  if (/art|print|illustration/.test(hint)) return "Art & Culture";
  if (/zine|book|édit/.test(hint)) return "Zines & Édition";
  if (/soin|beauté|beauty|care/.test(hint)) return "Corps & Soin";
  return "Créateur·ice indépendant·e";
}

// ─── Email template generator ─────────────────────────────────────────────────

export function generateOutreachEmail(vendor: FoundVendor): string {
  const firstName = vendor.name.split(/[\s_]/)[0];
  return `Objet : Rejoins Spectrum For Us — la 1ère marketplace queer francophone 🌈

Bonjour ${firstName},

Je m'appelle Dada, fondateur·ice de Spectrum For Us (spectrumforus.com) — la première marketplace queer francophone.

J'ai découvert ta création sur ${vendor.platform === "instagram" ? `Instagram (@${vendor.instagram_handle || vendor.name})` : `Etsy (${vendor.name})`} et ton univers correspond exactement à ce qu'on construit ensemble : un espace où les créateur·ices LGBTQIA+ peuvent vendre à une communauté qui les comprend et les soutient.

✨ Ce qu'on t'offre :
• Zéro commission les 3 premiers mois
• Abonnement vendeur·se à 9,90€/mois (sans frais cachés)
• Accès à une communauté queer francophone engagée
• Outils de gestion boutique intégrés

${vendor.category ? `Ta catégorie "${vendor.category}" est l'une des plus recherchées chez nous.` : ""}

Pour rejoindre l'aventure : spectrumforus.com/vendeur/onboarding

À très bientôt,
Dada Azouz
Spectrum For Us — B(u)y us, for us. 🌈
hello@spectrumforus.com`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const sources: string[] = body.sources || ["instagram", "etsy", "directories"];

  const results = await Promise.allSettled([
    sources.includes("instagram") ? searchInstagramHashtags() : Promise.resolve([]),
    sources.includes("etsy") ? searchEtsy() : Promise.resolve([]),
    sources.includes("directories") ? searchDirectories() : Promise.resolve([]),
  ]);

  const all: FoundVendor[] = [];
  const stats: Record<string, number> = {};
  ["instagram", "etsy", "directories"].forEach((name, i) => {
    const r = results[i];
    if (r.status === "fulfilled") { stats[name] = r.value.length; all.push(...r.value); }
    else stats[name] = 0;
  });

  // Upsert into vendor_outreach
  const seen = new Set<string>();
  let inserted = 0;
  for (const v of all) {
    const key = v.profile_url || v.name;
    if (seen.has(key)) continue;
    seen.add(key);
    const { error } = await supabase.from("vendor_outreach").upsert({
      ...v,
      outreach_status: "identified",
    }, { onConflict: "profile_url", ignoreDuplicates: true });
    if (!error) inserted++;
  }

  // Return with generated email templates for first 5
  const withEmails = all.slice(0, 5).map(v => ({
    ...v,
    email_template: generateOutreachEmail(v),
  }));

  return NextResponse.json({ success: true, stats, total: all.length, inserted, preview: withEmails });
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to trigger vendor search" });
}
