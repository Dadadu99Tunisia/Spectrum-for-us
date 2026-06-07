"use client";
import { useEffect, useState, useCallback } from "react";
import { Sparkles, Search, Star, Globe, EyeOff, CheckCircle, XCircle, RefreshCw, MapPin, Clock, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Workshop = {
  id: string;
  title: string | null;
  name: string | null;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  location_address: string | null;
  city: string | null;
  category: string | null;
  max_participants: number | null;
  is_active: boolean;
  listing_status: string | null;
  is_featured: boolean;
  created_at: string;
  vendor_id: string | null;
};

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  active:   { label: "Actif",      color: "text-green-600 bg-green-400/10 border-green-400/20" },
  pending:  { label: "En attente", color: "text-[#E0901E] bg-[#E0901E]/10 border-[#E0901E]/20" },
  inactive: { label: "Inactif",    color: "text-[#1A1612]/30 bg-[#1A1612]/5 border-[#1A1612]/10" },
  rejected: { label: "Rejeté",     color: "text-red-600 bg-red-400/10 border-red-400/20" },
};

export default function ServicesPage() {
  const [items, setItems]     = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal]     = useState(0);
  const [toast, setToast]     = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let q = supabase.from("workshops").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (statusFilter) q = q.eq("listing_status", statusFilter);
      if (search) q = q.or(`title.ilike.%${search}%,name.ilike.%${search}%,city.ilike.%${search}%`);
      const { data, count } = await q.limit(60);
      setItems(data ?? []);
      setTotal(count ?? 0);
    } catch {
      // silently fail · show empty state
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("workshops").update({ is_featured: !current }).eq("id", id);
    showToast(!current ? "Mis en avant ✓" : "Retiré de la une");
    fetch_();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("workshops").update({ is_active: !current, listing_status: !current ? "active" : "inactive" }).eq("id", id);
    showToast(!current ? "Service activé ✓" : "Service désactivé");
    fetch_();
  };

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.from("workshops").update({ listing_status: status, is_active: status === "active" }).eq("id", id);
    showToast("Statut mis à jour ✓");
    fetch_();
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#FF3D7F] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#1A1612]">Services & Ateliers</h1>
          <p className="font-hanken text-sm text-[#1A1612]/40 mt-0.5">{total} service{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={fetch_} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1A1612]/10 text-[#1A1612]/40 hover:text-[#1A1612] transition-colors">
          <RefreshCw size={13} />
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1612]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un service…"
            className="w-full pl-9 pr-4 py-2 bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-lg font-hanken text-sm text-[#1A1612] placeholder-[#1A1612]/25 focus:outline-none focus:border-[#FF3D7F]/50 transition-colors" />
        </div>
        <div className="flex gap-1 p-1 bg-[#1A1612]/4 rounded-lg">
          {[["","Tous"],["active","Actifs"],["pending","En attente"],["inactive","Inactifs"],["rejected","Rejetés"]].map(([v,l]) => (
            <button key={v} onClick={() => setStatusFilter(v)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${statusFilter === v ? "bg-[#FF3D7F] text-white" : "text-[#1A1612]/40 hover:text-[#1A1612]"}`}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20"><Sparkles size={40} className="mx-auto mb-3 text-[#1A1612]/10" /><p className="font-hanken text-[#1A1612]/30">Aucun service</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(w => {
            const status = w.listing_status ?? (w.is_active ? "active" : "inactive");
            const cfg = STATUS_CFG[status] ?? STATUS_CFG.inactive;
            const displayTitle = w.title || w.name || "(Sans titre)";
            return (
              <div key={w.id} className="p-5 rounded-2xl border border-[#1A1612]/8 hover:border-[#1A1612]/15 transition-all space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#6D2DB5]/10 border border-[#6D2DB5]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={15} className="text-[#6D2DB5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-hanken text-sm text-[#1A1612] font-medium truncate">{displayTitle}</p>
                    {w.category && <p className="font-mono text-[9px] text-[#1A1612]/35 uppercase mt-0.5">{w.category}</p>}
                  </div>
                  <button onClick={() => toggleFeatured(w.id, w.is_featured)}
                    className={`flex-shrink-0 p-1 rounded transition-colors ${w.is_featured ? "text-[#E0901E]" : "text-[#1A1612]/15 hover:text-[#E0901E]"}`}>
                    <Star size={13} fill={w.is_featured ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {w.city && (
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#1A1612]/35">
                      <MapPin size={9} /> {w.city}
                    </div>
                  )}
                  {w.duration_minutes && (
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#1A1612]/35">
                      <Clock size={9} /> {w.duration_minutes >= 60 ? `${Math.floor(w.duration_minutes/60)}h${w.duration_minutes%60 ? w.duration_minutes%60 : ""}` : `${w.duration_minutes}min`}
                    </div>
                  )}
                  {w.max_participants && (
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#1A1612]/35">
                      <Users size={9} /> max {w.max_participants} participants
                    </div>
                  )}
                </div>

                {w.price !== null && (
                  <p className="font-fraunces text-base text-[#1A1612]">
                    {w.price === 0 ? <span className="text-green-600">Gratuit</span> : `${w.price.toFixed(2)} €`}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#1A1612]/6">
                  <span className={`font-mono text-[8px] px-2 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                  <div className="flex gap-1">
                    <button onClick={() => toggleActive(w.id, w.is_active)}
                      className={`p-1.5 rounded-lg border border-transparent transition-colors ${w.is_active ? "text-green-600/60 hover:text-red-600 hover:border-red-400/20" : "text-[#1A1612]/20 hover:text-green-600 hover:border-green-400/20"}`}
                      title={w.is_active ? "Désactiver" : "Activer"}>
                      {w.is_active ? <EyeOff size={11} /> : <Globe size={11} />}
                    </button>
                    {status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(w.id, "rejected")}
                          className="p-1.5 rounded-lg text-red-600/50 hover:text-red-600 border border-transparent hover:border-red-500/20 transition-colors">
                          <XCircle size={11} />
                        </button>
                        <button onClick={() => updateStatus(w.id, "active")}
                          className="p-1.5 rounded-lg text-green-600/50 hover:text-green-600 border border-transparent hover:border-green-500/20 transition-colors">
                          <CheckCircle size={11} />
                        </button>
                      </>
                    )}
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
