"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStripe } from "@/lib/stripe";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { generateSlots, type AvailabilityRule, type Slot } from "@/lib/slots";
import { CalendarClock, Lock, Check, Loader2 } from "lucide-react";

function PayForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState("");

  const pay = async () => {
    if (!stripe || !elements) return;
    setProcessing(true); setErr("");
    const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (error) { setErr(error.message ?? "Paiement refusé"); setProcessing(false); return; }
    if (paymentIntent?.status === "succeeded") onSuccess();
    else setProcessing(false);
  };

  return (
    <div className="space-y-3">
      <PaymentElement />
      {err && <p className="font-hanken text-sm text-red-500">{err}</p>}
      <button onClick={pay} disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#FF2DA0] text-white font-hanken font-semibold hover:brightness-110 disabled:opacity-50">
        <Lock size={14} /> {processing ? "Traitement…" : `Payer ${amount.toFixed(2)} € et réserver`}
      </button>
    </div>
  );
}

export function BookingWidget({ productId, price }: { productId: string; price: number }) {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [blackouts, setBlackouts] = useState<string[]>([]);
  const [booked, setBooked] = useState<{ start: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState(price);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [{ data: av }, { data: bl }, { data: bk }] = await Promise.all([
        supabase.from("service_availability").select("weekday, specific_date, start_time, end_time, slot_minutes").eq("product_id", productId),
        supabase.from("service_blackouts").select("date").eq("product_id", productId),
        supabase.from("booked_slots").select("start_at").eq("product_id", productId),
      ]);
      setRules((av ?? []) as AvailabilityRule[]);
      setBlackouts((bl ?? []).map(b => b.date as string));
      setBooked((bk ?? []).map(b => ({ start: new Date(b.start_at as string).getTime() })));
      setLoading(false);
    })();
  }, [productId]);

  const slotsByDay = useMemo(() => generateSlots({ rules, blackouts, booked, fromDate: new Date(), days: 30 }), [rules, blackouts, booked]);
  const days = Object.keys(slotsByDay);

  const startBooking = async () => {
    if (!slot) return;
    setCreating(true); setErr("");
    const res = await fetch("/api/bookings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, start_at: slot.start.toISOString(), name }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setErr(data.error ?? "Erreur"); return; }
    setClientSecret(data.clientSecret); setAmount(data.amount ?? price);
  };

  if (loading) return <div className="rounded-2xl border border-[#101014]/10 p-4 text-[#101014]/40 font-hanken text-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Chargement des disponibilités…</div>;

  if (done) return (
    <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5 text-center">
      <Check size={28} className="text-green-600 mx-auto mb-2" />
      <p className="font-fraunces text-lg text-[#101014]">Réservation confirmée ✓</p>
      <p className="font-hanken text-sm text-[#101014]/55 mt-1">Tu reçois un e-mail de confirmation. Retrouve-la dans « Mes réservations ».</p>
    </div>
  );

  if (days.length === 0) return (
    <div className="rounded-2xl border border-[#101014]/10 p-4 text-[#101014]/50 font-hanken text-sm">
      Aucun créneau disponible pour le moment. Reviens bientôt.
    </div>
  );

  // Étape paiement
  if (clientSecret) return (
    <div className="rounded-2xl border border-[#FF2DA0]/25 bg-white p-4">
      <p className="font-bricolage font-semibold text-sm text-[#101014] mb-1">Confirme et paie</p>
      {slot && <p className="font-hanken text-xs text-[#101014]/55 mb-3">{slot.start.toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>}
      <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: "stripe" } }}>
        <PayForm amount={amount} onSuccess={() => setDone(true)} />
      </Elements>
    </div>
  );

  // Étape sélection
  return (
    <div className="rounded-2xl border border-[#101014]/12 bg-white p-4">
      <p className="font-bricolage font-semibold text-sm text-[#101014] mb-3 flex items-center gap-2"><CalendarClock size={15} /> Réserver un créneau</p>

      {/* Jours */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
        {days.map(d => {
          const dt = new Date(d + "T12:00");
          const active = day === d;
          return (
            <button key={d} onClick={() => { setDay(d); setSlot(null); }}
              className={`shrink-0 px-3 py-2 rounded-xl border text-center transition-colors ${active ? "border-[#FF2DA0] bg-[#FF2DA0]/10 text-[#FF2DA0]" : "border-[#101014]/12 text-[#101014]/60"}`}>
              <div className="font-mono text-[9px] uppercase">{dt.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
              <div className="font-fraunces text-base leading-tight">{dt.getDate()}</div>
              <div className="font-mono text-[9px]">{dt.toLocaleDateString("fr-FR", { month: "short" })}</div>
            </button>
          );
        })}
      </div>

      {/* Créneaux */}
      {day && (
        <div className="flex flex-wrap gap-2 mb-3">
          {(slotsByDay[day] ?? []).map(s => {
            const active = slot?.start.getTime() === s.start.getTime();
            return (
              <button key={s.start.getTime()} onClick={() => setSlot(s)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-colors ${active ? "border-[#FF2DA0] bg-[#FF2DA0] text-white" : "border-[#101014]/15 text-[#101014]/70 hover:border-[#FF2DA0]/50"}`}>
                {s.start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </button>
            );
          })}
        </div>
      )}

      {slot && (
        <>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ton nom (facultatif)"
            className="w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm mb-2 focus:outline-none focus:border-[#FF2DA0]/50" />
          {err && <p className="font-hanken text-sm text-red-500 mb-2">{err}</p>}
          <button onClick={startBooking} disabled={creating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#101014] text-white font-hanken font-semibold hover:brightness-125 disabled:opacity-50">
            {creating ? <Loader2 size={14} className="animate-spin" /> : <CalendarClock size={14} />}
            Continuer · {price.toFixed(2)} €
          </button>
        </>
      )}
    </div>
  );
}
