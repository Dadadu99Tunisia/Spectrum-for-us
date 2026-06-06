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
    eventbrite: "#E0533A", shotgun: "#6D2DB5", timeout: "#E0901E",
    "inter-lgbt": "#E0337E", tetu: "#CF3F7C", facebook: "#1C9C95", manual: "#E0337E",
  };
  return map[source ?? ""] ?? "#F3EADB";
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
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#1C9C95] block mb-2">Agenda</span>
            <h1 className="font-fraunces text-4xl md:text-5xl text-[#F3EADB] mb-3">
              Événements <span className="italic text-[#F2B79E]">queer</span>
            </h1>
            <p className="font-hanken text-[#F3EADB]/60 max-w-xl">
              Soirées, festivals, expos, ateliers, Pride... Tous les événements LGBTQIA+ de France centralisés.
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex-1 min-w-[220px] relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F3EADB]/30" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Chercher un événement, un organisateur…"
                className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-full pl-10 pr-4 py-2.5 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/30 focus:outline-none focus:border-[#1C9C95]/50 transition-colors" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 hover:text-[#F3EADB]/60"><X size={13} /></button>}
            </div>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-full px-4 py-2.5 text-[#F3EADB]/70 font-hanken text-sm focus:outline-none focus:border-[#1C9C95]/50 transition-colors">
              {CITIES.map(c => <option key={c} value={c} className="bg-[#3D1F5C]">{c}</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-full px-4 py-2.5 text-[#F3EADB]/70 font-hanken text-sm focus:outline-none focus:border-[#1C9C95]/50 transition-colors">
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#3D1F5C]">{c}</option>)}
            </select>
          </div>

          <p className="font-mono text-xs text-[#F3EADB]/30 mb-8">
            {loading ? "Chargement…" : `${filtered.length} événement${filtered.length > 1 ? "s" : ""}`}
          </p>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#F3EADB]/8 overflow-hidden">
                  <div className="h-44 bg-[#F3EADB]/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-[#F3EADB]/8 rounded w-3/4" />
                    <div className="h-3 bg-[#F3EADB]/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No events yet */}
          {!loading && events.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-3xl bg-[#1C9C95]/10 border border-[#1C9C95]/20 flex items-center justify-center mx-auto mb-6">
                <CalendarDays size={36} className="text-[#1C9C95]" />
              </div>
              <p className="font-fraunces text-2xl text-[#F3EADB]/40 mb-3">Agenda en cours de construction</p>
              <p className="font-hanken text-sm text-[#F3EADB]/30 max-w-sm mx-auto">
                Les événements sont en cours d&apos;intégration. Reviens très bientôt !
              </p>
            </div>
          )}

          {/* Featured events */}
          {featured.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={14} className="text-[#E0337E]" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#E0337E]">À la une</span>
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
              <p className="font-fraunces text-2xl text-[#F3EADB]/30 mb-2">Aucun résultat</p>
              <p className="font-hanken text-sm text-[#F3EADB]/25">Essaie une autre ville ou catégorie.</p>
            </div>
          )}

          {/* Submit CTA */}
          <div className="mt-16 p-8 rounded-2xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.02] text-center">
            <h3 className="font-fraunces text-2xl text-[#F3EADB] mb-2">Tu organises un événement ?</h3>
            <p className="font-hanken text-sm text-[#F3EADB]/50 mb-6">Soumets-le ici pour le faire apparaître dans l&apos;agenda.</p>
            <a href="mailto:hello@spectrumforus.com?subject=Soumettre un événement&body=Nom de l'événement :%0ADate :%0ALieu :%0ADescription :%0AURL :"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C9C95] text-[#F3EADB] font-hanken font-medium text-sm hover:brightness-110 transition-all">
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
    <div className={`rounded-2xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.02] overflow-hidden group hover:border-[#F3EADB]/20 transition-all duration-300 ${featured ? "sm:col-span-1" : ""}`}>
      {/* Image / placeholder */}
      <div className="relative h-44 overflow-hidden bg-[#2d1545] flex items-center justify-center">
        {e.image_url ? (
          <img src={e.image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 40% 40%, ${accent}25, transparent 70%)` }} />
        )}
        {/* Source badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase"
            style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}>
            {sourceLabel(e.source)}
          </span>
        </div>
        {/* Price badge */}
        {e.price && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase bg-[#F3EADB]/10 text-[#F3EADB]/70 border border-[#F3EADB]/15">
              {e.price}
            </span>
          </div>
        )}
        {!e.image_url && (
          <span className="font-fraunces text-5xl text-[#F3EADB]/10 select-none relative z-10">(u)</span>
        )}
      </div>

      <div className="p-4">
        {e.category && <Tag variant="teal" className="mb-2 text-[9px]">{e.category}</Tag>}
        <h3 className="font-fraunces text-lg text-[#F3EADB] leading-tight mb-2 line-clamp-2">{e.title}</h3>

        {dateStr && (
          <div className="flex items-center gap-1.5 text-[#F3EADB]/50 mb-1.5">
            <CalendarDays size={12} className="shrink-0" />
            <span className="font-mono text-[11px] capitalize">{dateStr}</span>
          </div>
        )}
        {(e.venue || e.city) && (
          <div className="flex items-center gap-1.5 text-[#F3EADB]/50 mb-3">
            <MapPin size={12} className="shrink-0" />
            <span className="font-hanken text-xs">{[e.venue, e.city].filter(Boolean).join(" · ")}</span>
          </div>
        )}

        {e.description && (
          <p className="font-hanken text-xs text-[#F3EADB]/40 line-clamp-2 mb-3">{e.description}</p>
        )}

        {e.url && (
          <a href={e.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-[#1C9C95] hover:text-[#F3EADB] transition-colors">
            Voir l&apos;événement <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}
