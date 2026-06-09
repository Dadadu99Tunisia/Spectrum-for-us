"use client";
import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Search, Star, CheckCircle, XCircle, ExternalLink, MapPin, Clock, RefreshCw, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date_start: string;
  date_end: string | null;
  city: string | null;
  venue: string | null;
  url: string | null;
  image_url: string | null;
  price: number | null;
  category: string | null;
  source: string | null;
  moderation: string;
  is_featured: boolean;
  organizer: string | null;
  created_at: string;
};

const MOD_CONFIG: Record<string, { label: string; color: string }> = {
  pending:  { label: "En attente", color: "text-[#FFD400] bg-[#FFD400]/10 border-[#FFD400]/20" },
  approved: { label: "Approuvé",   color: "text-green-600 bg-green-400/10 border-green-400/20" },
  rejected: { label: "Rejeté",     color: "text-red-600 bg-red-400/10 border-red-400/20" },
};

const CATEGORIES = ["Soirée & Clubbing", "Événement LGBTQIA+", "Militant & Associatif", "Art & Culture", "Festival", "Pride"];

const EMPTY_FORM = { title: "", date_start: "", date_end: "", city: "", venue: "", category: "", price: "", url: "", image_url: "", organizer: "", description: "", is_featured: false };

export default function EvenementsPage() {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modFilter, setModFilter] = useState("pending");
  const [total, setTotal]     = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast]     = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let q = supabase.from("queer_events").select("*", { count: "exact" })
        .order("date_start", { ascending: true });
      if (modFilter) q = q.eq("moderation", modFilter);
      if (search)    q = q.ilike("title", `%${search}%`);
      const { data, count } = await q.limit(50);
      setEvents(data ?? []);
      setTotal(count ?? 0);
    } catch {
      // silently fail · show empty state
    } finally {
      setLoading(false);
    }
  }, [modFilter, search]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const moderate = async (id: string, action: "approved" | "rejected") => {
    setActionLoading(id);
    const supabase = createClient();
    await supabase.from("queer_events").update({ moderation: action }).eq("id", id);
    setActionLoading(null);
    showToast(action === "approved" ? "Événement approuvé ✓" : "Événement rejeté");
    fetch_();
  };

  const createEvent = async () => {
    if (!form.title.trim() || !form.date_start) { showToast("Titre et date de début requis"); return; }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("queer_events").insert({
      title: form.title.trim(),
      date_start: new Date(form.date_start).toISOString(),
      date_end: form.date_end ? new Date(form.date_end).toISOString() : null,
      city: form.city.trim() || null,
      venue: form.venue.trim() || null,
      category: form.category || null,
      price: form.price.trim() || null,
      url: form.url.trim() || null,
      image_url: form.image_url.trim() || null,
      organizer: form.organizer.trim() || null,
      description: form.description.trim() || null,
      is_featured: form.is_featured,
      source: "manual",
      moderation: "approved",
    });
    setSaving(false);
    if (error) { showToast("Erreur : " + error.message); return; }
    showToast("Événement ajouté ✓");
    setForm(EMPTY_FORM); setShowForm(false); setModFilter("approved"); fetch_();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("queer_events").update({ is_featured: !current }).eq("id", id);
    showToast(!current ? "Mis en avant ✓" : "Retiré de la une");
    fetch_();
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#FF2DA0] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#101014]">Événements</h1>
          <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">{total} événement{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF2DA0] text-white hover:brightness-110 transition-all text-sm font-hanken">
            <Plus size={14} /> Ajouter
          </button>
          <button onClick={fetch_} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#101014]/[0.14] text-[#101014]/40 hover:text-[#101014] transition-colors text-sm">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="rounded-2xl border border-[#FF2DA0]/30 bg-[#FF2DA0]/[0.03] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-fraunces text-lg text-[#101014]">Nouvel événement</h2>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="text-[#101014]/30 hover:text-[#101014]"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Titre *" full><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Soirée…" /></Field>
            <Field label="Début *"><input type="datetime-local" value={form.date_start} onChange={e => setForm({ ...form, date_start: e.target.value })} className={inputCls} /></Field>
            <Field label="Fin"><input type="datetime-local" value={form.date_end} onChange={e => setForm({ ...form, date_end: e.target.value })} className={inputCls} /></Field>
            <Field label="Ville"><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputCls} placeholder="Paris" /></Field>
            <Field label="Lieu / Salle"><input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className={inputCls} placeholder="La Machine du Moulin Rouge" /></Field>
            <Field label="Catégorie">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                <option value="">—</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Prix"><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={inputCls} placeholder="Gratuit · 12€…" /></Field>
            <Field label="Organisateur·ice"><input value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} className={inputCls} placeholder="Assoc…" /></Field>
            <Field label="Lien billetterie / infos"><input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className={inputCls} placeholder="https://…" /></Field>
            <Field label="Image (URL)" full><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://…" /></Field>
            <Field label="Description" full><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} placeholder="Quelques mots…" /></Field>
          </div>
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 font-hanken text-sm text-[#101014]/60 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="accent-[#FF2DA0]" />
              Mettre à la une
            </label>
            <button onClick={createEvent} disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#101014] text-white font-hanken text-sm hover:brightness-125 transition-all disabled:opacity-40">
              {saving ? "Ajout…" : "Publier l'événement"}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101014]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un événement…"
            className="w-full pl-9 pr-4 py-2 bg-[#101014]/[0.09] border border-[#101014]/[0.14] rounded-lg font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
        </div>
        <div className="flex gap-1 p-1 bg-[#101014]/[0.08] rounded-lg">
          {[["pending","En attente"],["approved","Approuvés"],["rejected","Rejetés"],["","Tous"]].map(([v,l]) => (
            <button key={v} onClick={() => setModFilter(v)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${modFilter === v ? "bg-[#FF2DA0] text-white" : "text-[#101014]/40 hover:text-[#101014]"}`}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20"><CalendarDays size={40} className="mx-auto mb-3 text-[#101014]/10" /><p className="font-hanken text-[#101014]/30">Aucun événement</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map(ev => {
            const modUi = MOD_CONFIG[ev.moderation] ?? MOD_CONFIG.pending;
            const isPast = ev.date_start && new Date(ev.date_start) < new Date();
            return (
              <div key={ev.id} className={`rounded-2xl border overflow-hidden transition-all ${isPast ? "opacity-50 border-[#101014]/5" : "border-[#101014]/[0.13] hover:border-[#101014]/20"}`}>
                {ev.image_url ? (
                  <img src={ev.image_url} alt={ev.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-[#FF2DA0]/10 to-[#7A2BF0]/10 flex items-center justify-center">
                    <CalendarDays size={28} className="text-[#101014]/15" />
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-fraunces text-sm text-[#101014] leading-snug flex-1">{ev.title}</h3>
                    <button onClick={() => toggleFeatured(ev.id, ev.is_featured)}
                      className={`flex-shrink-0 p-1 rounded transition-colors ${ev.is_featured ? "text-[#FFD400]" : "text-[#101014]/15 hover:text-[#FFD400]"}`}>
                      <Star size={13} fill={ev.is_featured ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#101014]/35">
                      <Clock size={9} />
                      {new Date(ev.date_start).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    {ev.city && (
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#101014]/35">
                        <MapPin size={9} /> {ev.city}{ev.venue ? ` · ${ev.venue}` : ""}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#101014]/[0.12]">
                    <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${modUi.color}`}>{modUi.label}</span>
                    <div className="flex gap-1">
                      {ev.url && (
                        <a href={ev.url} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-lg text-[#101014]/25 hover:text-[#101014] border border-transparent hover:border-[#101014]/[0.14] transition-colors">
                          <ExternalLink size={11} />
                        </a>
                      )}
                      {ev.moderation === "pending" && (
                        <>
                          <button onClick={() => moderate(ev.id, "rejected")} disabled={actionLoading === ev.id}
                            className="p-1.5 rounded-lg text-red-600/50 hover:text-red-600 border border-transparent hover:border-red-500/20 transition-colors disabled:opacity-40">
                            <XCircle size={11} />
                          </button>
                          <button onClick={() => moderate(ev.id, "approved")} disabled={actionLoading === ev.id}
                            className="p-1.5 rounded-lg text-green-600/50 hover:text-green-600 border border-transparent hover:border-green-500/20 transition-colors disabled:opacity-40">
                            <CheckCircle size={11} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 bg-white border border-[#101014]/[0.14] rounded-lg font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/50 transition-colors";

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block font-mono text-[10px] tracking-wide text-[#101014]/35 mb-1">{label}</label>
      {children}
    </div>
  );
}
