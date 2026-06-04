"use client";
import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Search, Star, CheckCircle, XCircle, ExternalLink, MapPin, Clock, RefreshCw } from "lucide-react";
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
  pending:  { label: "En attente", color: "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20" },
  approved: { label: "Approuvé",   color: "text-green-400 bg-green-400/10 border-green-400/20" },
  rejected: { label: "Rejeté",     color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export default function EvenementsPage() {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modFilter, setModFilter] = useState("pending");
  const [total, setTotal]     = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast]     = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase.from("queer_events").select("*", { count: "exact" })
      .order("date_start", { ascending: true });
    if (modFilter) q = q.eq("moderation", modFilter);
    if (search)    q = q.ilike("title", `%${search}%`);
    const { data, count } = await q.limit(50);
    setEvents(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
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

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("queer_events").update({ is_featured: !current }).eq("id", id);
    showToast(!current ? "Mis en avant ✓" : "Retiré de la une");
    fetch_();
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#E0337E] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Événements</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">{total} événement{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={fetch_} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.14] text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors text-sm">
          <RefreshCw size={13} />
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un événement…"
            className="w-full pl-9 pr-4 py-2 bg-white/[0.09] border border-white/[0.14] rounded-lg font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
        </div>
        <div className="flex gap-1 p-1 bg-white/[0.08] rounded-lg">
          {[["pending","En attente"],["approved","Approuvés"],["rejected","Rejetés"],["","Tous"]].map(([v,l]) => (
            <button key={v} onClick={() => setModFilter(v)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${modFilter === v ? "bg-[#E0337E] text-white" : "text-[#F3EADB]/40 hover:text-[#F3EADB]"}`}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20"><CalendarDays size={40} className="mx-auto mb-3 text-[#F3EADB]/10" /><p className="font-hanken text-[#F3EADB]/30">Aucun événement</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map(ev => {
            const modUi = MOD_CONFIG[ev.moderation] ?? MOD_CONFIG.pending;
            const isPast = ev.date_start && new Date(ev.date_start) < new Date();
            return (
              <div key={ev.id} className={`rounded-2xl border overflow-hidden transition-all ${isPast ? "opacity-50 border-[#F3EADB]/5" : "border-white/[0.13] hover:border-[#F3EADB]/20"}`}>
                {ev.image_url ? (
                  <img src={ev.image_url} alt={ev.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-[#E0337E]/10 to-[#6D2DB5]/10 flex items-center justify-center">
                    <CalendarDays size={28} className="text-[#F3EADB]/15" />
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-fraunces text-sm text-[#F3EADB] leading-snug flex-1">{ev.title}</h3>
                    <button onClick={() => toggleFeatured(ev.id, ev.is_featured)}
                      className={`flex-shrink-0 p-1 rounded transition-colors ${ev.is_featured ? "text-[#E0901E]" : "text-[#F3EADB]/15 hover:text-[#E0901E]"}`}>
                      <Star size={13} fill={ev.is_featured ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#F3EADB]/35">
                      <Clock size={9} />
                      {new Date(ev.date_start).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    {ev.city && (
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#F3EADB]/35">
                        <MapPin size={9} /> {ev.city}{ev.venue ? ` · ${ev.venue}` : ""}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.12]">
                    <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${modUi.color}`}>{modUi.label}</span>
                    <div className="flex gap-1">
                      {ev.url && (
                        <a href={ev.url} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-lg text-[#F3EADB]/25 hover:text-[#F3EADB] border border-transparent hover:border-white/[0.14] transition-colors">
                          <ExternalLink size={11} />
                        </a>
                      )}
                      {ev.moderation === "pending" && (
                        <>
                          <button onClick={() => moderate(ev.id, "rejected")} disabled={actionLoading === ev.id}
                            className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-colors disabled:opacity-40">
                            <XCircle size={11} />
                          </button>
                          <button onClick={() => moderate(ev.id, "approved")} disabled={actionLoading === ev.id}
                            className="p-1.5 rounded-lg text-green-400/50 hover:text-green-400 border border-transparent hover:border-green-500/20 transition-colors disabled:opacity-40">
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
