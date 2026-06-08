"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalendarDays, MapPin, ExternalLink, Search, X, Sparkles } from "lucide-react";
import { Tag } from "@/components/ui/Tag";

type QueerEvent = {
  id: string;
  title: string;
  description?: string;
  date_start?: string;
  date_end?: string;
  city?: string;
  venue?: string;
  location?: string;
  url?: string;
  image_url?: string;
  price?: string;
  category?: string;
  tags?: string[];
  source?: string;
  organizer?: string;
  is_featured?: boolean;
};

const CITIES = ["Toutes", "Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Lille", "France"];
const CATEGORIES = ["Tous", "Soirée & Clubbing", "Événement LGBTQIA+", "Militant & Associatif", "Art & Culture", "Festival", "Pride"];

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

function sourceLabel(source?: string) {
  const map: Record<string, string> = {
    eventbrite: "Eventbrite", shotgun: "Shotgun", timeout: "Time Out",
    "inter-lgbt": "Inter-LGBT", tetu: "Têtu", facebook: "Facebook", manual: "Spectrum",
  };
  return map[source ?? ""] ?? source ?? "";
}

function sourceBadgeColor(source?: string): string {
  const map: Record<string, string> = {
    eventbrite: "#F93C2C", shotgun: "#7A2BF0", timeout: "#FFD400",
    "inter-lgbt": "#FF2DA0", tetu: "#FF2DA0", facebook: "#2323C4", manual: "#FF2DA0",
  };
  return map[source ?? ""] ?? "#101014";
}

export default function EvenementsPage() {
  const [events, setEvents] = useState<QueerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Toutes");
  const [category, setCategory] = useState("Tous");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("queer_events")
      .select("*")
      .eq("moderation", "approved")
      .order("date_start", { ascending: true })
      .then(({ data }) => { setEvents(data ?? []); setLoading(false); });
  }, []);

  const filtered = events.filter(e => {
    const matchSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.organizer ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "Toutes" || (e.city ?? "").toLowerCase().includes(city.toLowerCase());
    const matchCat = category === "Tous" || e.category === category;
    return matchSearch && matchCity && matchCat;
  });

  const featured = filtered.filter(e => e.is_featured);
  const regular = filtered.filter(e => !e.is_featured);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-6 bg-[#FBFAF8]">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <span className="font-mono text-[11px] tracking-wide text-[#2323C4] block mb-2">Agenda</span>
            <h1 className="font-fraunces text-4xl md:text-5xl text-[#101014] mb-3">
              Événements <span className="italic text-[#FF2DA0]">queer</span>
            </h1>
            <p className="font-hanken text-[#101014]/60 max-w-xl">
              Soirées, festivals, expos, ateliers, Pride... Tous les événements LGBTQIA+ de France centralisés.
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex-1 min-w-[220px] relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#101014]/30" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Chercher un événement, un organisateur…"
                className="w-full bg-white border border-[#ECE6DB] rounded-full pl-10 pr-4 py-2.5 text-[#101014] font-hanken text-sm placeholder-[#101014]/30 focus:outline-none focus:border-[#2323C4]/50 transition-colors" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#101014]/30 hover:text-[#101014]/60"><X size={13} /></button>}
            </div>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="bg-white border border-[#ECE6DB] rounded-full px-4 py-2.5 text-[#101014]/70 font-hanken text-sm focus:outline-none focus:border-[#2323C4]/50 transition-colors">
              {CITIES.map(c => <option key={c} value={c} className="bg-white">{c}</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="bg-white border border-[#ECE6DB] rounded-full px-4 py-2.5 text-[#101014]/70 font-hanken text-sm focus:outline-none focus:border-[#2323C4]/50 transition-colors">
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-white">{c}</option>)}
            </select>
          </div>

          <p className="font-mono text-xs text-[#101014]/30 mb-8">
            {loading ? "Chargement…" : `${filtered.length} événement${filtered.length > 1 ? "s" : ""}`}
          </p>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#ECE6DB] overflow-hidden">
                  <div className="h-44 bg-white" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-[#101014]/8 rounded w-3/4" />
                    <div className="h-3 bg-white rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No events yet */}
          {!loading && events.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-3xl bg-[#2323C4]/10 border border-[#2323C4]/20 flex items-center justify-center mx-auto mb-6">
                <CalendarDays size={36} className="text-[#2323C4]" />
              </div>
              <p className="font-fraunces text-2xl text-[#101014]/40 mb-3">Agenda en cours de construction</p>
              <p className="font-hanken text-sm text-[#101014]/30 max-w-sm mx-auto">
                Les événements sont en cours d&apos;intégration. Reviens très bientôt !
              </p>
            </div>
          )}

          {/* Featured events */}
          {featured.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={14} className="text-[#FF2DA0]" />
                <span className="font-mono text-[10px] tracking-wide text-[#FF2DA0]">À la une</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {featured.map(e => <EventCard key={e.id} event={e} featured />)}
              </div>
            </div>
          )}

          {/* Regular grid */}
          {regular.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {regular.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )}

          {/* No results after filter */}
          {!loading && events.length > 0 && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-fraunces text-2xl text-[#101014]/30 mb-2">Aucun résultat</p>
              <p className="font-hanken text-sm text-[#101014]/25">Essaie une autre ville ou catégorie.</p>
            </div>
          )}

          {/* Submit CTA */}
          <div className="mt-16 p-8 rounded-2xl border border-[#ECE6DB] bg-white text-center">
            <h3 className="font-fraunces text-2xl text-[#101014] mb-2">Tu organises un événement ?</h3>
            <p className="font-hanken text-sm text-[#101014]/50 mb-6">Soumets-le ici pour le faire apparaître dans l&apos;agenda.</p>
            <a href="mailto:hello@spectrumforus.com?subject=Soumettre un événement&body=Nom de l'événement :%0ADate :%0ALieu :%0ADescription :%0AURL :"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2323C4] text-white font-hanken font-medium text-sm hover:brightness-110 transition-all">
              <CalendarDays size={15} /> Soumettre mon événement
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function EventCard({ event: e, featured }: { event: QueerEvent; featured?: boolean }) {
  const dateStr = formatDate(e.date_start);
  const accent = sourceBadgeColor(e.source);

  return (
    <div className={`rounded-2xl border border-[#ECE6DB] bg-white overflow-hidden group hover:border-[#ECE6DB] transition-all duration-300 ${featured ? "sm:col-span-1" : ""}`}>
      {/* Image / placeholder */}
      <div className="relative h-44 overflow-hidden bg-[#F1ECE3] flex items-center justify-center">
        {e.image_url ? (
          <img src={e.image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 40% 40%, ${accent}25, transparent 70%)` }} />
        )}
        {/* Source badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-[9px] font-mono tracking-wide"
            style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}>
            {sourceLabel(e.source)}
          </span>
        </div>
        {/* Price badge */}
        {e.price && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-[9px] font-mono tracking-wide bg-[#101014]/5 text-[#101014]/70 border border-[#ECE6DB]">
              {e.price}
            </span>
          </div>
        )}
        {!e.image_url && (
          <span className="font-fraunces text-5xl text-[#101014]/10 select-none relative z-10">(u)</span>
        )}
      </div>

      <div className="p-4">
        {e.category && <Tag variant="teal" className="mb-2 text-[9px]">{e.category}</Tag>}
        <h3 className="font-fraunces text-lg text-[#101014] leading-tight mb-2 line-clamp-2">{e.title}</h3>

        {dateStr && (
          <div className="flex items-center gap-1.5 text-[#101014]/50 mb-1.5">
            <CalendarDays size={12} className="shrink-0" />
            <span className="font-mono text-[11px] capitalize">{dateStr}</span>
          </div>
        )}
        {(e.venue || e.city) && (
          <div className="flex items-center gap-1.5 text-[#101014]/50 mb-3">
            <MapPin size={12} className="shrink-0" />
            <span className="font-hanken text-xs">{[e.venue, e.city].filter(Boolean).join(" · ")}</span>
          </div>
        )}

        {e.description && (
          <p className="font-hanken text-xs text-[#101014]/40 line-clamp-2 mb-3">{e.description}</p>
        )}

        {e.url && (
          <a href={e.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#2323C4] hover:text-[#101014] transition-colors">
            Voir l&apos;événement <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}
