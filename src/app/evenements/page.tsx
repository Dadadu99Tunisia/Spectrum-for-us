"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalendarDays, MapPin, ExternalLink, Search, X, Sparkles, LayoutGrid, CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { ScatterText } from "@/components/ui/ScatterText";
import Link from "next/link";

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
  image_position?: string;
  price?: string;
  category?: string;
  tags?: string[];
  source?: string;
  organizer?: string;
  is_featured?: boolean;
  internal?: boolean;   // événement vendu sur Spectrum (billetterie interne)
  slug?: string;        // pour le lien produit interne
  capacity?: number | null;
  kind?: string;        // 'event' | 'workshop'
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
    "inter-lgbt": "Inter-LGBT", tetu: "Têtu", facebook: "Facebook", manual: "Spectrum", spectrum: "Spectrum",
  };
  return map[source ?? ""] ?? source ?? "";
}

function sourceBadgeColor(source?: string): string {
  const map: Record<string, string> = {
    eventbrite: "#F93C2C", shotgun: "#7A2BF0", timeout: "#FFD400",
    "inter-lgbt": "#FF2DA0", tetu: "#FF2DA0", facebook: "#2323C4", manual: "#FF2DA0", spectrum: "#7A2BF0",
  };
  return map[source ?? ""] ?? "#101014";
}

export default function EvenementsPage() {
  const [events, setEvents] = useState<QueerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Toutes");
  const [category, setCategory] = useState("Tous");
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [{ data: ext }, { data: internal }] = await Promise.all([
        supabase.from("queer_events").select("*").eq("moderation", "approved"),
        supabase.from("products").select("id, name, title, description, price, slug, images, image_url, event_date, event_end, event_location, event_city, event_capacity, is_featured, shops(name)")
          .eq("type", "event").eq("is_active", true).not("event_date", "is", null),
      ]);
      const internalEvents: QueerEvent[] = (internal ?? []).map((p) => {
        const shop = Array.isArray(p.shops) ? p.shops[0] : p.shops;
        return {
          id: p.id, title: p.name || p.title, description: p.description ?? undefined,
          date_start: p.event_date ?? undefined, date_end: p.event_end ?? undefined,
          city: p.event_city ?? undefined, venue: p.event_location ?? undefined,
          image_url: (p.images?.[0] ?? p.image_url) ?? undefined,
          price: p.price ? `${Number(p.price).toFixed(0)} €` : "Gratuit",
          source: "spectrum", organizer: shop?.name, is_featured: p.is_featured ?? false,
          internal: true, slug: p.slug ?? undefined, capacity: p.event_capacity,
        };
      });
      const all = [...(ext ?? []) as QueerEvent[], ...internalEvents]
        .sort((a, b) => new Date(a.date_start ?? 0).getTime() - new Date(b.date_start ?? 0).getTime());
      setEvents(all);
      setLoading(false);
    })();
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
            <h1 className="font-fraunces font-extrabold text-4xl md:text-5xl text-[#101014] mb-3 leading-[1.15]">
              Événements <ScatterText text="queer" intensity={0.8} className="text-[#FF2DA0] align-baseline" />
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

          <div className="flex items-center justify-between gap-3 mb-8">
            <p className="font-mono text-xs text-[#101014]/30">
              {loading ? "Chargement…" : `${filtered.length} événement${filtered.length > 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center gap-1 bg-white border border-[#ECE6DB] rounded-full p-1">
              <button onClick={() => setView("list")} aria-pressed={view === "list"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wide transition-colors ${view === "list" ? "bg-[#101014] text-white" : "text-[#101014]/50"}`}>
                <LayoutGrid size={13} /> Liste
              </button>
              <button onClick={() => setView("calendar")} aria-pressed={view === "calendar"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wide transition-colors ${view === "calendar" ? "bg-[#101014] text-white" : "text-[#101014]/50"}`}>
                <CalendarRange size={13} /> Calendrier
              </button>
            </div>
          </div>

          {/* Vue calendrier */}
          {!loading && view === "calendar" && events.length > 0 && (
            <MonthCalendar events={filtered} />
          )}

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
          {view === "list" && featured.length > 0 && (
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
          {view === "list" && regular.length > 0 && (
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

          {/* Soumission directe */}
          <SubmitEventCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Vue calendrier mensuel ─────────────────────────────── */
const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function MonthCalendar({ events }: { events: QueerEvent[] }) {
  // Regroupe les événements par jour (clé locale YYYY-MM-DD)
  const byDay = new Map<string, QueerEvent[]>();
  for (const e of events) {
    if (!e.date_start) continue;
    const d = new Date(e.date_start);
    if (isNaN(d.getTime())) continue;
    const k = dayKey(d);
    (byDay.get(k) ?? byDay.set(k, []).get(k)!).push(e);
  }

  // Mois affiché par défaut : celui du premier événement à venir, sinon aujourd'hui
  const firstUpcoming = events.find(e => e.date_start && new Date(e.date_start).getTime() >= Date.now());
  const initial = firstUpcoming?.date_start ? new Date(firstUpcoming.date_start) : new Date();
  const [cursor, setCursor] = useState({ y: initial.getFullYear(), m: initial.getMonth() });
  const [selected, setSelected] = useState<string | null>(null);

  const first = new Date(cursor.y, cursor.m, 1);
  const startOffset = (first.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const todayKey = dayKey(new Date());

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.y, cursor.m, d));

  const move = (delta: number) => {
    const nm = cursor.m + delta;
    setCursor({ y: cursor.y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 });
    setSelected(null);
  };

  const selectedEvents = selected ? (byDay.get(selected) ?? []) : [];

  return (
    <div>
      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => move(-1)} aria-label="Mois précédent"
          className="w-9 h-9 rounded-full border border-[#ECE6DB] bg-white flex items-center justify-center text-[#101014]/60 hover:border-[#2323C4]/40 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <h2 className="font-fraunces text-xl md:text-2xl text-[#101014] capitalize">
          {MONTHS[cursor.m]} {cursor.y}
        </h2>
        <button onClick={() => move(1)} aria-label="Mois suivant"
          className="w-9 h-9 rounded-full border border-[#ECE6DB] bg-white flex items-center justify-center text-[#101014]/60 hover:border-[#2323C4]/40 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grille */}
      <div className="bg-white border border-[#ECE6DB] rounded-2xl p-2 sm:p-4">
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div key={i} className="text-center font-mono text-[10px] text-[#101014]/30 py-1">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const k = dayKey(d);
            const evs = byDay.get(k) ?? [];
            const has = evs.length > 0;
            const isToday = k === todayKey;
            const isSel = k === selected;
            return (
              <button key={i} disabled={!has} onClick={() => setSelected(isSel ? null : k)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors relative
                  ${isSel ? "bg-[#FF2DA0] text-white" : has ? "bg-[#FF2DA0]/8 hover:bg-[#FF2DA0]/15 text-[#101014]" : "text-[#101014]/25 cursor-default"}
                  ${isToday && !isSel ? "ring-1 ring-[#2323C4]/50" : ""}`}>
                <span className={`font-mono text-xs sm:text-sm ${isToday && !isSel ? "text-[#2323C4] font-bold" : ""}`}>{d.getDate()}</span>
                {has && (
                  <span className={`text-[8px] font-mono leading-none ${isSel ? "text-white/90" : "text-[#FF2DA0]"}`}>
                    {evs.length > 1 ? `${evs.length}●` : "●"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Détail du jour sélectionné */}
      {selected && selectedEvents.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-[11px] tracking-wide text-[#101014]/40 mb-3 capitalize">
            {new Date(selected + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            {" · "}{selectedEvents.length} événement{selectedEvents.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedEvents.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
      {!selected && (
        <p className="text-center font-hanken text-sm text-[#101014]/30 mt-6">
          Touche un jour surligné pour voir les événements.
        </p>
      )}
    </div>
  );
}

function SubmitEventCTA() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({ kind: "event", title: "", date_start: "", city: "", venue: "", url: "", organizer: "", category: "", description: "", capacity: "" });
  const set = (k: keyof typeof f, v: string) => setF(s => ({ ...s, [k]: v }));

  const submit = async () => {
    if (!f.title.trim() || !f.date_start) { setErr("Titre et date requis."); return; }
    setSaving(true); setErr("");
    const supabase = createClient();
    const { error } = await supabase.from("queer_events").insert({
      kind: f.kind,
      title: f.title.trim(),
      date_start: new Date(f.date_start).toISOString(),
      city: f.city.trim() || null, venue: f.venue.trim() || null,
      url: f.url.trim() || null, organizer: f.organizer.trim() || null,
      category: f.category || null, description: f.description.trim() || null,
      capacity: f.capacity ? parseInt(f.capacity) : null,
      source: "manual", moderation: "pending",
    });
    setSaving(false);
    if (error) { setErr(error.message); return; }
    setSent(true);
  };

  if (sent) return (
    <div className="mt-16 p-8 rounded-2xl border border-green-500/30 bg-green-500/5 text-center">
      <h3 className="font-fraunces text-2xl text-[#101014] mb-2">Merci ! 🎉</h3>
      <p className="font-hanken text-sm text-[#101014]/55">Ton événement a été soumis. Il apparaîtra dans l&apos;agenda après validation.</p>
    </div>
  );

  return (
    <div className="mt-16 p-6 md:p-8 rounded-2xl border border-[#ECE6DB] bg-white">
      <div className="text-center">
        <h3 className="font-fraunces text-2xl text-[#101014] mb-2">Tu organises un événement ou un atelier ?</h3>
        <p className="font-hanken text-sm text-[#101014]/50 mb-5">Soumets-le directement ici pour le faire apparaître dans l&apos;agenda.</p>
        {!open && (
          <button onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2323C4] text-white font-hanken font-medium text-sm hover:brightness-110 transition-all">
            <CalendarDays size={15} /> Soumettre un événement ou un atelier
          </button>
        )}
      </div>

      {open && (
        <div className="max-w-xl mx-auto mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {/* Type */}
          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] text-[#101014]/40 mb-1.5">C'est un…</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ v: "event", l: "🎉 Événement" }, { v: "workshop", l: "🛠️ Atelier" }].map(o => (
                <button key={o.v} type="button" onClick={() => set("kind", o.v)}
                  className={`px-3 py-2.5 rounded-xl border text-sm font-hanken transition-all ${f.kind === o.v ? "border-[#2323C4] bg-[#2323C4]/10 text-[#2323C4]" : "border-[#101014]/15 text-[#101014]/55 hover:border-[#101014]/30"}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <input value={f.title} onChange={e => set("title", e.target.value)} placeholder={f.kind === "workshop" ? "Nom de l'atelier *" : "Nom de l'événement *"} className={subInput + " sm:col-span-2"} />
          <input type="datetime-local" value={f.date_start} onChange={e => set("date_start", e.target.value)} className={subInput} />
          <select value={f.category} onChange={e => set("category", e.target.value)} className={subInput}>
            <option value="">Catégorie…</option>
            {CATEGORIES.filter(c => c !== "Tous").map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={f.venue} onChange={e => set("venue", e.target.value)} placeholder="Lieu / salle" className={subInput} />
          <input value={f.city} onChange={e => set("city", e.target.value)} placeholder="Ville" className={subInput} />
          <input value={f.organizer} onChange={e => set("organizer", e.target.value)} placeholder="Organisateur·ice" className={subInput} />
          <input type="number" min="1" value={f.capacity} onChange={e => set("capacity", e.target.value)}
            placeholder={f.kind === "workshop" ? "Nombre de places (atelier)" : "Nombre de places (facultatif)"} className={subInput} />
          <input value={f.url} onChange={e => set("url", e.target.value)} placeholder="Lien (billetterie / infos)" className={subInput + " sm:col-span-2"} />
          <textarea value={f.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Description" className={subInput + " sm:col-span-2"} />
          {err && <p className="sm:col-span-2 font-hanken text-sm text-red-500">{err}</p>}
          <div className="sm:col-span-2 flex items-center gap-3">
            <button onClick={submit} disabled={saving}
              className="px-5 py-2.5 rounded-full bg-[#2323C4] text-white font-hanken text-sm hover:brightness-110 disabled:opacity-40">
              {saving ? "Envoi…" : "Envoyer pour validation"}
            </button>
            <button onClick={() => setOpen(false)} className="font-mono text-xs text-[#101014]/35 hover:text-[#101014]/60">Annuler</button>
          </div>
          <p className="sm:col-span-2 font-mono text-[10px] text-[#101014]/35">
            Tu veux <strong>vendre des billets</strong> directement sur Spectrum ? <Link href="/vendeur/nouveau-produit" className="text-[#7A2BF0] underline">Crée un événement depuis ton espace vendeur·se</Link>.
          </p>
        </div>
      )}
    </div>
  );
}

const subInput = "w-full bg-[#101014]/[0.03] border border-[#ECE6DB] rounded-xl px-3.5 py-2.5 text-[#101014] font-hanken text-sm placeholder-[#101014]/30 focus:outline-none focus:border-[#2323C4]/50 transition-colors";

function EventCard({ event: e, featured }: { event: QueerEvent; featured?: boolean }) {
  const dateStr = formatDate(e.date_start);
  const accent = sourceBadgeColor(e.source);

  return (
    <div className={`rounded-2xl border border-[#ECE6DB] bg-white overflow-hidden group hover:border-[#ECE6DB] transition-all duration-300 ${featured ? "sm:col-span-1" : ""}`}>
      {/* Image / placeholder */}
      <div className="relative h-44 overflow-hidden bg-[#F1ECE3] flex items-center justify-center">
        {e.image_url ? (
          <img src={e.image_url} alt={e.title} style={{ objectPosition: e.image_position ?? "50% 50%" }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {e.kind === "workshop" && (
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#7A2BF0]/10 text-[#7A2BF0] border border-[#7A2BF0]/20">🛠️ Atelier</span>
          )}
          {e.category && <Tag variant="teal" className="text-[9px]">{e.category}</Tag>}
          {e.capacity ? <span className="font-mono text-[9px] text-[#101014]/40">{e.capacity} places</span> : null}
        </div>
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

        {e.internal && e.slug ? (
          <Link href={`/produit/${e.slug}`}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide px-3 py-1.5 rounded-full text-white"
            style={{ background: "#7A2BF0" }}>
            🎟️ Réserver
          </Link>
        ) : e.url ? (
          <a href={e.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#2323C4] hover:text-[#101014] transition-colors">
            Voir l&apos;événement <ExternalLink size={10} />
          </a>
        ) : null}
      </div>
    </div>
  );
}
