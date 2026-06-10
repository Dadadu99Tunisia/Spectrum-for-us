"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { CalendarClock, Plus, Trash2, Loader2, Check, Ban } from "lucide-react";

type Service = { id: string; name: string | null; title: string | null };
type Rule = { id?: string; weekday: number; start_time: string; end_time: string; slot_minutes: number; enabled: boolean };
type DateRow = { id: string; date: string };
type Booking = { id: string; start_at: string; status: string; customer_name: string | null };

const DAYS = [
  { wd: 1, label: "Lundi" }, { wd: 2, label: "Mardi" }, { wd: 3, label: "Mercredi" },
  { wd: 4, label: "Jeudi" }, { wd: 5, label: "Vendredi" }, { wd: 6, label: "Samedi" }, { wd: 7, label: "Dimanche" },
];
const blankRule = (wd: number): Rule => ({ weekday: wd, start_time: "14:00", end_time: "18:00", slot_minutes: 60, enabled: false });

export function ServiceAvailability({ shopId }: { shopId: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [pid, setPid] = useState<string>("");
  const [rules, setRules] = useState<Rule[]>(DAYS.map(d => blankRule(d.wd)));
  const [extraDates, setExtraDates] = useState<DateRow[]>([]);
  const [blackouts, setBlackouts] = useState<DateRow[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newExtra, setNewExtra] = useState("");
  const [newBlackout, setNewBlackout] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Charger les services de la boutique
  useEffect(() => {
    const supabase = createClient();
    supabase.from("products").select("id, name, title").eq("shop_id", shopId).eq("type", "service")
      .then(({ data }) => { setServices(data ?? []); if (data?.[0]) setPid(data[0].id); });
  }, [shopId]);

  const loadFor = useCallback(async (productId: string) => {
    const supabase = createClient();
    const [{ data: av }, { data: bl }, { data: bk }] = await Promise.all([
      supabase.from("service_availability").select("*").eq("product_id", productId),
      supabase.from("service_blackouts").select("id, date").eq("product_id", productId).order("date"),
      supabase.from("bookings").select("id, start_at, status, customer_name").eq("product_id", productId).gte("start_at", new Date().toISOString()).order("start_at").limit(20),
    ]);
    // récurrents → fusionner dans la grille 7 jours
    const byDay = new Map<number, Rule>();
    (av ?? []).filter(a => a.weekday != null).forEach(a => byDay.set(a.weekday, {
      id: a.id, weekday: a.weekday, start_time: (a.start_time as string).slice(0, 5), end_time: (a.end_time as string).slice(0, 5), slot_minutes: a.slot_minutes, enabled: true,
    }));
    setRules(DAYS.map(d => byDay.get(d.wd) ?? blankRule(d.wd)));
    setExtraDates((av ?? []).filter(a => a.specific_date).map(a => ({ id: a.id, date: a.specific_date })));
    setBlackouts((bl ?? []) as DateRow[]);
    setBookings((bk ?? []) as Booking[]);
  }, []);

  useEffect(() => { if (pid) loadFor(pid); }, [pid, loadFor]);

  const patchRule = (wd: number, p: Partial<Rule>) => setRules(rs => rs.map(r => r.weekday === wd ? { ...r, ...p } : r));

  const saveRecurring = async () => {
    setSaving(true); setSaved(false);
    const supabase = createClient();
    // remplacer toutes les règles récurrentes du service
    await supabase.from("service_availability").delete().eq("product_id", pid).not("weekday", "is", null);
    const rows = rules.filter(r => r.enabled).map(r => ({
      product_id: pid, shop_id: shopId, weekday: r.weekday,
      start_time: r.start_time, end_time: r.end_time, slot_minutes: r.slot_minutes,
    }));
    if (rows.length) await supabase.from("service_availability").insert(rows);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    loadFor(pid);
  };

  const addExtraDate = async () => {
    if (!newExtra) return;
    const supabase = createClient();
    await supabase.from("service_availability").insert({ product_id: pid, shop_id: shopId, specific_date: newExtra, start_time: "14:00", end_time: "18:00", slot_minutes: 60 });
    setNewExtra(""); loadFor(pid);
  };
  const addBlackout = async () => {
    if (!newBlackout) return;
    const supabase = createClient();
    await supabase.from("service_blackouts").insert({ product_id: pid, shop_id: shopId, date: newBlackout });
    setNewBlackout(""); loadFor(pid);
  };
  const delRow = async (table: string, id: string) => {
    const supabase = createClient();
    await supabase.from(table).delete().eq("id", id);
    loadFor(pid);
  };

  if (services.length === 0) return (
    <div className="max-w-xl">
      <h2 className="font-fraunces text-2xl text-[#101014] mb-2">Agenda & disponibilités</h2>
      <p className="font-hanken text-sm text-[#101014]/55">Tu n'as pas encore de <strong>service</strong>. Crée un produit de type « Service (sur rendez-vous) » pour gérer tes créneaux ici.</p>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <h2 className="font-fraunces text-2xl text-[#101014] mb-1 flex items-center gap-2"><CalendarClock size={18} /> Agenda & disponibilités</h2>
        <p className="font-hanken text-sm text-[#101014]/50">Définis quand tu es disponible. Les client·es réserveront un créneau libre.</p>
      </div>

      {/* Choix du service */}
      <select value={pid} onChange={e => setPid(e.target.value)} className="mb-6 bg-white border border-[#101014]/15 rounded-xl px-3 py-2.5 font-hanken text-sm">
        {services.map(s => <option key={s.id} value={s.id}>{s.name || s.title}</option>)}
      </select>

      {/* Récurrent hebdo */}
      <div className="rounded-2xl border border-[#101014]/12 bg-white p-4 mb-4">
        <p className="font-bricolage font-semibold text-sm text-[#101014] mb-3">Horaires hebdomadaires</p>
        <div className="space-y-2">
          {rules.map(r => {
            const day = DAYS.find(d => d.wd === r.weekday)!;
            return (
              <div key={r.weekday} className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-2 w-28 shrink-0">
                  <input type="checkbox" checked={r.enabled} onChange={e => patchRule(r.weekday, { enabled: e.target.checked })} className="accent-[#FF2DA0]" />
                  <span className="font-hanken text-sm text-[#101014]/70">{day.label}</span>
                </label>
                {r.enabled && (
                  <>
                    <input type="time" value={r.start_time} onChange={e => patchRule(r.weekday, { start_time: e.target.value })} className="bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2 py-1 font-mono text-xs" />
                    <span className="text-[#101014]/30">→</span>
                    <input type="time" value={r.end_time} onChange={e => patchRule(r.weekday, { end_time: e.target.value })} className="bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2 py-1 font-mono text-xs" />
                    <select value={r.slot_minutes} onChange={e => patchRule(r.weekday, { slot_minutes: parseInt(e.target.value) })} className="bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2 py-1 font-mono text-xs">
                      {[30, 45, 60, 90, 120].map(m => <option key={m} value={m}>{m} min</option>)}
                    </select>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={saveRecurring} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101014] text-white font-hanken text-sm hover:brightness-125 disabled:opacity-40">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Enregistrer
          </button>
          {saved && <span className="font-hanken text-sm text-green-600">Enregistré ✓</span>}
        </div>
      </div>

      {/* Dates ponctuelles + blocages */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#101014]/12 bg-white p-4">
          <p className="font-bricolage font-semibold text-sm text-[#101014] mb-2">Dates ponctuelles (en plus)</p>
          <div className="flex gap-2 mb-2">
            <input type="date" value={newExtra} onChange={e => setNewExtra(e.target.value)} className="flex-1 bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2 py-1.5 font-mono text-xs" />
            <button onClick={addExtraDate} className="px-2.5 rounded-lg bg-[#FF2DA0] text-white"><Plus size={14} /></button>
          </div>
          {extraDates.map(d => (
            <div key={d.id} className="flex items-center justify-between py-1 font-mono text-xs text-[#101014]/60">
              {new Date(d.date + "T12:00").toLocaleDateString("fr-FR")}
              <button onClick={() => delRow("service_availability", d.id)} className="text-[#101014]/25 hover:text-red-500"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#101014]/12 bg-white p-4">
          <p className="font-bricolage font-semibold text-sm text-[#101014] mb-2 flex items-center gap-1"><Ban size={13} /> Jours bloqués</p>
          <div className="flex gap-2 mb-2">
            <input type="date" value={newBlackout} onChange={e => setNewBlackout(e.target.value)} className="flex-1 bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2 py-1.5 font-mono text-xs" />
            <button onClick={addBlackout} className="px-2.5 rounded-lg bg-[#101014] text-white"><Plus size={14} /></button>
          </div>
          {blackouts.map(d => (
            <div key={d.id} className="flex items-center justify-between py-1 font-mono text-xs text-[#101014]/60">
              {new Date(d.date + "T12:00").toLocaleDateString("fr-FR")}
              <button onClick={() => delRow("service_blackouts", d.id)} className="text-[#101014]/25 hover:text-red-500"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Réservations à venir */}
      <div className="mt-6">
        <p className="font-bricolage font-semibold text-sm text-[#101014] mb-2">Prochaines réservations</p>
        {bookings.length === 0 ? (
          <p className="font-hanken text-sm text-[#101014]/40">Aucune réservation à venir.</p>
        ) : (
          <div className="space-y-1.5">
            {bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-[#101014]/10 bg-white px-3 py-2">
                <span className="font-hanken text-sm text-[#101014]">{new Date(b.start_at).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#101014]/45">{b.customer_name ?? ""} · {b.status === "confirmed" ? "confirmé" : b.status === "pending" ? "en attente" : b.status}</span>
                  {b.status !== "cancelled" && (
                    <button onClick={async () => {
                      if (!confirm("Annuler cette réservation ? Le·la client·e sera remboursé·e.")) return;
                      const res = await fetch("/api/bookings/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booking_id: b.id }) });
                      if (res.ok) loadFor(pid); else { const j = await res.json().catch(() => ({})); alert("Erreur : " + (j.error ?? res.status)); }
                    }} className="font-mono text-[10px] text-[#101014]/35 hover:text-red-500">Annuler</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
