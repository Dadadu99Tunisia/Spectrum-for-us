import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScrapedEvent {
  title: string;
  description?: string;
  date_start?: string;
  date_end?: string;
  location?: string;
  city?: string;
  venue?: string;
  url?: string;
  image_url?: string;
  price?: string;
  category?: string;
  tags?: string[];
  source: string;
  source_id: string;
  organizer?: string;
  organizer_url?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractText(html: string, regex: RegExp): string {
  const m = html.match(regex);
  return m ? m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim() : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ─── Eventbrite ───────────────────────────────────────────────────────────────

async function scrapeEventbrite(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];
  const queries = ["LGBT+", "queer", "pride", "LGBTQIA", "trans pride", "drag"];
  const seen = new Set<string>();

  for (const q of queries) {
    try {
      const url = `https://www.eventbrite.fr/d/france/${encodeURIComponent(q)}/?sort=date`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9",
          "Accept": "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const html = await res.text();

      // Extract JSON-LD structured data
      const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      for (const match of jsonLdMatches) {
        try {
          const data = JSON.parse(match[1]);
          const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
          for (const item of items) {
            if (item["@type"] !== "Event") continue;
            const id = item.url?.split("/").filter(Boolean).pop() || item.identifier;
            if (!id || seen.has(id)) continue;
            seen.add(id);
            events.push({
              title: item.name || "",
              description: item.description ? stripHtml(item.description).slice(0, 500) : "",
              date_start: item.startDate,
              date_end: item.endDate,
              location: item.location?.address?.streetAddress || item.location?.name,
              city: item.location?.address?.addressLocality || "France",
              venue: item.location?.name,
              url: item.url,
              image_url: item.image?.url || item.image,
              price: item.offers?.[0]?.price === "0" ? "Gratuit" : item.offers?.[0]?.price ? `${item.offers[0].price} €` : "Voir le site",
              category: "Événement LGBTQIA+",
              tags: ["queer", "lgbtqia+"],
              source: "eventbrite",
              source_id: id,
              organizer: item.organizer?.name,
              organizer_url: item.organizer?.url,
            });
          }
        } catch { /* skip malformed */ }
      }
    } catch { /* timeout or network error */ }
  }
  return events;
}

// ─── Shotgun ──────────────────────────────────────────────────────────────────

async function scrapeShotgun(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];
  try {
    // Shotgun has a public API endpoint for event search
    const res = await fetch(
      "https://api.shotgun.live/v1/events?search=queer&country=FR&limit=50&sort=date_asc",
      {
        headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!res.ok) throw new Error("shotgun api failed");
    const data = await res.json();
    const items = data.data || data.events || data.results || [];
    for (const item of items) {
      if (!item.id) continue;
      events.push({
        title: item.name || item.title || "",
        description: (item.description || "").slice(0, 500),
        date_start: item.starts_at || item.start_date,
        date_end: item.ends_at || item.end_date,
        city: item.city || item.location?.city || "France",
        venue: item.venue?.name || item.venue_name,
        location: item.address || item.venue?.address,
        url: `https://shotgun.live/events/${item.slug || item.id}`,
        image_url: item.cover_url || item.image,
        price: item.min_price === 0 ? "Gratuit" : item.min_price ? `À partir de ${item.min_price} €` : "Voir le site",
        category: "Soirée & Clubbing",
        tags: ["queer", "nightlife"],
        source: "shotgun",
        source_id: String(item.id),
        organizer: item.organizer?.name,
      });
    }
  } catch { /* Shotgun API may differ */ }
  return events;
}

// ─── Shotgun HTML fallback ─────────────────────────────────────────────────────

async function scrapeShotgunHTML(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];
  try {
    const res = await fetch("https://shotgun.live/fr/search?q=queer&country=France", {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", "Accept-Language": "fr-FR" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return events;
    const html = await res.text();
    const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1]);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item["@type"] !== "Event" || !item.name) continue;
          const id = item.url?.split("/").pop() || item.identifier;
          if (!id) continue;
          events.push({
            title: item.name,
            description: item.description ? stripHtml(item.description).slice(0, 500) : "",
            date_start: item.startDate,
            date_end: item.endDate,
            city: item.location?.address?.addressLocality || "France",
            venue: item.location?.name,
            location: item.location?.address?.streetAddress,
            url: item.url,
            image_url: item.image?.url || item.image,
            price: "Voir le site",
            category: "Soirée & Clubbing",
            tags: ["queer", "nightlife"],
            source: "shotgun",
            source_id: id,
          });
        }
      } catch { /* skip */ }
    }
  } catch { /* network */ }
  return events;
}

// ─── Time Out Paris ───────────────────────────────────────────────────────────

async function scrapeTimeOut(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];
  const urls = [
    "https://www.timeout.fr/paris/gay-lesbian",
    "https://www.timeout.fr/paris/agenda/soirees-lgbt",
  ];
  for (const pageUrl of urls) {
    try {
      const res = await fetch(pageUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", "Accept-Language": "fr-FR" },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const html = await res.text();

      // Extract JSON-LD
      const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      for (const match of jsonLdMatches) {
        try {
          const data = JSON.parse(match[1]);
          const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
          for (const item of items) {
            if (!["Event", "SocialEvent"].includes(item["@type"]) || !item.name) continue;
            const id = item.url?.split("/").filter(Boolean).pop();
            if (!id) continue;
            events.push({
              title: item.name,
              description: item.description ? stripHtml(item.description).slice(0, 500) : "",
              date_start: item.startDate,
              date_end: item.endDate,
              city: "Paris",
              venue: item.location?.name,
              location: item.location?.address?.streetAddress || item.location?.address,
              url: item.url,
              image_url: item.image?.url || item.image,
              price: "Voir le site",
              category: "Soirée & Culture",
              tags: ["queer", "paris", "lgbtqia+"],
              source: "timeout",
              source_id: `timeout-${id}`,
              organizer: item.organizer?.name,
            });
          }
        } catch { /* skip */ }
      }
    } catch { /* network */ }
  }
  return events;
}

// ─── InterLGBT / French associations ──────────────────────────────────────────

async function scrapeAssociations(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];

  // Inter-LGBT agenda
  try {
    const res = await fetch("https://www.inter-lgbt.org/agenda/", {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", "Accept-Language": "fr-FR" },
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      const html = await res.text();
      // Extract article cards
      const articleMatches = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/g)];
      for (const article of articleMatches) {
        const content = article[1];
        const title = extractText(content, /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/);
        const link = extractText(content, /href="(https?:\/\/www\.inter-lgbt\.org\/[^"]+)"/);
        const date = extractText(content, /datetime="([^"]+)"/);
        const img = extractText(content, /src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/);
        if (!title || !link) continue;
        const id = link.split("/").filter(Boolean).pop() || link;
        events.push({
          title,
          date_start: date || undefined,
          city: "France",
          url: link,
          image_url: img || undefined,
          price: "Voir le site",
          category: "Militant & Associatif",
          tags: ["inter-lgbt", "associatif", "france"],
          source: "inter-lgbt",
          source_id: id,
          organizer: "Inter-LGBT",
          organizer_url: "https://www.inter-lgbt.org",
        });
      }
    }
  } catch { /* network */ }

  // Têtu agenda
  try {
    const res = await fetch("https://tetu.com/category/agenda/", {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", "Accept-Language": "fr-FR" },
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      const html = await res.text();
      const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      for (const match of jsonLdMatches) {
        try {
          const data = JSON.parse(match[1]);
          const items = Array.isArray(data) ? data : [data];
          for (const item of items) {
            if (item["@type"] !== "Event" || !item.name) continue;
            const id = item.url?.split("/").filter(Boolean).pop();
            if (!id) continue;
            events.push({
              title: item.name,
              description: item.description ? stripHtml(item.description).slice(0, 500) : "",
              date_start: item.startDate,
              city: item.location?.address?.addressLocality || "France",
              venue: item.location?.name,
              url: item.url,
              image_url: item.image?.url || item.image,
              price: "Voir le site",
              category: "Événement LGBTQIA+",
              tags: ["têtu", "lgbtqia+"],
              source: "tetu",
              source_id: id,
            });
          }
        } catch { /* skip */ }
      }
    }
  } catch { /* network */ }

  return events;
}

// ─── Facebook public pages ─────────────────────────────────────────────────────

async function scrapeFacebookPublic(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];
  const pages = [
    { handle: "MaraisGayParis", name: "Le Marais Gay Paris" },
    { handle: "InterLGBT", name: "Inter-LGBT" },
    { handle: "FiereteParis", name: "Fierté Paris" },
  ];

  for (const page of pages) {
    try {
      // Use Facebook's public event search via mbasic (mobile basic · less JS required)
      const res = await fetch(`https://mbasic.facebook.com/${page.handle}/events`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
          "Accept-Language": "fr-FR",
        },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;
      const html = await res.text();

      // Extract event links from mbasic HTML
      const eventLinks = [...html.matchAll(/href="\/events\/(\d+)[^"]*"/g)];
      const seen = new Set<string>();
      for (const match of eventLinks) {
        const eid = match[1];
        if (seen.has(eid)) continue;
        seen.add(eid);

        // Extract title near the link
        const ctx = html.slice(Math.max(0, html.indexOf(eid) - 200), html.indexOf(eid) + 200);
        const title = extractText(ctx, /<[^>]+>([^<]{5,80})<\/[^>]+>/);
        if (!title) continue;

        events.push({
          title,
          city: "France",
          url: `https://www.facebook.com/events/${eid}`,
          price: "Voir sur Facebook",
          category: "Événement LGBTQIA+",
          tags: ["facebook", "lgbtqia+", page.handle.toLowerCase()],
          source: "facebook",
          source_id: eid,
          organizer: page.name,
          organizer_url: `https://www.facebook.com/${page.handle}`,
        });
      }
    } catch { /* blocked or network error */ }
  }
  return events;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const sources: string[] = body.sources || ["eventbrite", "shotgun", "timeout", "associations", "facebook"];

  // Run all scrapers in parallel
  const results = await Promise.allSettled([
    sources.includes("eventbrite") ? scrapeEventbrite() : Promise.resolve([]),
    sources.includes("shotgun") ? Promise.all([scrapeShotgun(), scrapeShotgunHTML()]).then(([a, b]) => [...a, ...b]) : Promise.resolve([]),
    sources.includes("timeout") ? scrapeTimeOut() : Promise.resolve([]),
    sources.includes("associations") ? scrapeAssociations() : Promise.resolve([]),
    sources.includes("facebook") ? scrapeFacebookPublic() : Promise.resolve([]),
  ]);

  const allEvents: ScrapedEvent[] = [];
  const sourceNames = ["eventbrite", "shotgun", "timeout", "associations", "facebook"];
  const stats: Record<string, number> = {};

  results.forEach((r, i) => {
    const name = sourceNames[i];
    if (r.status === "fulfilled") {
      stats[name] = r.value.length;
      allEvents.push(...r.value);
    } else {
      stats[name] = 0;
    }
  });

  // Deduplicate by source+source_id and upsert
  const toInsert = allEvents.filter(e => e.title && e.source_id);
  let inserted = 0;
  let skipped = 0;

  for (const event of toInsert) {
    const { error } = await supabase
      .from("queer_events")
      .upsert({
        ...event,
        moderation: "pending",
        updated_at: new Date().toISOString(),
      }, { onConflict: "source,source_id", ignoreDuplicates: true });
    if (!error) inserted++;
    else skipped++;
  }

  return NextResponse.json({
    success: true,
    stats,
    total_found: allEvents.length,
    inserted,
    skipped,
  });
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to trigger scraping" });
}
