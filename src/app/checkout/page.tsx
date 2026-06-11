"use client";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { getStripe } from "@/lib/stripe";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import { Lock, Check, ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { ShippingStep, type ShipmentSelection } from "@/components/checkout/ShippingStep";
import { TrustBadges } from "@/components/ui/TrustBadges";
import Link from "next/link";
import type { Address } from "@/lib/types/address";

const COUNTRY_NAME: Record<string, string> = { FR: "France", BE: "Belgique", CH: "Suisse", CA: "Canada", LU: "Luxembourg" };

const STEPS = ["Livraison", "Paiement", "Confirmation"] as const;
type Step = typeof STEPS[number];

// ─── Stripe Payment Form ──────────────────────────────────────
function StripeForm({ totalCents, onSuccess, onBack }: {
  totalCents: number;
  onSuccess: (piId?: string) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true); setError("");

    const { error: submitErr } = await elements.submit();
    if (submitErr) { setError(submitErr.message ?? "Erreur"); setProcessing(false); return; }

    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout?step=confirmation` },
      redirect: "if_required",
    });

    if (confirmErr) {
      setError(confirmErr.message ?? "Paiement refusé. Vérifie tes informations.");
      setProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setError("Statut inattendu. Contacte le support.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 rounded-xl border border-[#101014]/10 bg-[#101014]/[0.02] flex items-start gap-3">
        <Lock size={14} className="text-[#2323C4] mt-0.5 shrink-0" />
        <p className="font-hanken text-xs text-[#101014]/50 leading-relaxed">
          Paiement sécurisé via <strong className="text-[#101014]/70">Stripe</strong>. Tes données bancaires sont chiffrées et ne nous parviennent jamais.
        </p>
      </div>

      <div className="rounded-xl border border-[#101014]/15 p-4 bg-[#101014]/[0.02]">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {error && (
        <div role="alert" className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#FF2DA0] text-white font-hanken font-semibold text-base hover:brightness-110 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed sticky bottom-3 md:static z-30 shadow-lg shadow-[#FF2DA0]/20 md:shadow-none"
      >
        <Lock size={14} />
        {processing ? "Traitement en cours…" : `Payer ${(totalCents / 100).toFixed(2)} €`}
      </button>

      <p className="text-center font-hanken text-[11px] text-[#101014]/35 leading-relaxed px-2">
        En validant ta commande, tu acceptes les{" "}
        <a href="/legal/cgv" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#101014]/60">Conditions Générales de Vente</a>.
        Droit de rétractation 14 jours (hors exceptions légales).
      </p>

      <button type="button" onClick={onBack}
        className="w-full text-center font-mono text-xs text-[#101014]/25 hover:text-[#101014]/50 transition-colors">
        ← Modifier la livraison
      </button>
    </form>
  );
}

// ─── Main Checkout ────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("Livraison");
  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", zip: "", country: "France", discrete: false,
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerSession, setCustomerSession] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [stripeReady, setStripeReady] = useState(false);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [shipSel, setShipSel] = useState<ShipmentSelection[]>([]);
  const [shipTotal, setShipTotal] = useState(0);
  const [shipComplete, setShipComplete] = useState(false);
  const onShipping = useCallback((s: ShipmentSelection[], t: number, c: boolean) => {
    setShipSel(s); setShipTotal(t); setShipComplete(c);
  }, []);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const applyAddress = useCallback((a: Address) => {
    setForm((f) => ({
      ...f,
      name: a.full_name,
      address: a.line1 + (a.line2 ? `, ${a.line2}` : ""),
      city: a.city,
      zip: a.zip,
      country: COUNTRY_NAME[a.country] ?? a.country,
    }));
  }, []);

  // Charge les adresses enregistrées + pré-remplit avec celle par défaut
  useEffect(() => {
    if (!user) return;
    createClient().from("addresses").select("*").eq("user_id", user.id)
      .order("is_default", { ascending: false }).order("created_at", { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as Address[];
        setAddresses(list);
        const def = list.find((a) => a.is_default) ?? list[0];
        if (def) applyAddress(def);
      });
  }, [user, applyAddress]);

  // Pre-fill email from user session
  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, email: f.email || user.email! }));
  }, [user]);

  // Load Stripe asap
  useEffect(() => {
    getStripe().then(() => setStripeReady(true));
  }, []);

  // Payment intent créé AVEC le panier et les infos de livraison · total recalculé côté serveur
  const createPaymentIntent = useCallback(async () => {
    if (total() <= 0) return;
    if (!user) { setIntentError("Connecte-toi pour payer."); return; }
    setLoadingIntent(true); setIntentError("");
    try {
      const res = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, type: i.type })),
          currency: "eur",
          shipping: form.name ? {
            name: form.name, email: form.email,
            address: form.address, city: form.city,
            zip: form.zip, country: form.country,
          } : undefined,
          shipping_selections: shipSel.map(s => ({ shop_id: s.shop_id, method_id: s.method_id, relay_point: s.relay_point })),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setIntentError(data.error);
      } else {
        setClientSecret(data.clientSecret);
        setCustomerSession(data.customerSessionClientSecret ?? null);
        // Mettre à jour le total avec celui recalculé serveur
        if (data.serverTotal) setServerTotal(data.serverTotal);
      }
    } catch {
      setIntentError("Erreur réseau. Réessaie.");
    }
    setLoadingIntent(false);
  }, [total, user, items, form, shipSel]);

  const handleGoToPayment = async () => {
    // Recréer le payment intent avec les infos de livraison à jour
    await createPaymentIntent();
    setStep("Paiement");
  };

  // La commande est créée par le webhook Stripe · on attend juste la confirmation Stripe
  const handlePaymentSuccess = async (piId?: string) => {
    // Polling léger pour attendre que le webhook crée la commande (max 10s)
    if (piId) {
      let attempts = 0;
      const poll = async (): Promise<string | null> => {
        if (attempts++ > 10) return null;
        const supabase = createClient();
        const { data } = await supabase
          .from("orders")
          .select("id")
          .eq("payment_intent_id", piId)
          .maybeSingle();
        if (data?.id) return data.id;
        await new Promise(r => setTimeout(r, 1000));
        return poll();
      };
      const oId = await poll();
      setOrderId(oId);
    }
    clear();
    setConfirmed(true);
  };

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const deliveryComplete = form.name && form.email && form.address && form.city && form.zip;
  const totalCents = Math.round(total() * 100);

  // ─ Confirmation screen
  if (confirmed) return (
    <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[#2323C4]/10 border border-[#2323C4]/30 flex items-center justify-center mx-auto mb-6 animate-[pulseWarm_1.5s_ease-in-out]">
          <Check size={32} className="text-[#2323C4]" />
        </div>
        <h1 className="font-fraunces text-4xl text-[#101014] mb-3">Commande confirmée ✦</h1>
        {orderId && <p className="font-mono text-xs text-[#101014]/30 mb-4">#{orderId.slice(0, 8).toUpperCase()}</p>}
        <p className="font-hanken text-[#101014]/55 mb-8 leading-relaxed">
          Un e-mail de confirmation t&apos;a été envoyé. Merci de faire partie du spectre.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="primary" href="/">Continuer les achats</Button>
          {user && <Button variant="secondary" href="/compte">Mes commandes</Button>}
        </div>
      </div>
    </div>
  );

  // ─ Empty cart guard
  if (items.length === 0 && !confirmed) return (
    <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="font-fraunces text-2xl text-[#101014] mb-4">Ton panier est vide</h2>
        <Button variant="primary" href="/decouvrir">Explorer la marketplace</Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block"><Header /></div>
      {/* Barre mobile */}
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 h-14 border-b" style={{ background: "rgba(251,250,248,0.95)", backdropFilter: "blur(10px)", borderColor: "#ECE6DB" }}>
        <Link href="/panier" aria-label="Retour au panier" className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full"><ArrowLeft size={20} /></Link>
        <span className="font-bricolage font-bold text-[17px]">Commander</span>
      </div>
      <main className="min-h-screen pt-6 md:pt-24 pb-28 md:pb-20 px-4 md:px-6 bg-[#FBFAF8] text-[#101014]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-2 hidden md:block">
            <span className="font-mono text-[11px] tracking-wide text-[#FF2DA0]">Checkout</span>
          </div>
          <h1 className="font-fraunces text-2xl md:text-4xl text-[#101014] mb-6 md:mb-8 hidden md:block">Commander</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6 md:mb-10 flex-wrap">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 transition-colors ${s === step ? "text-[#101014]" : STEPS.indexOf(step) > i ? "text-[#2323C4]" : "text-[#101014]/25"}`}>
                  <span className={`w-6 h-6 rounded-full border text-xs font-mono flex items-center justify-center transition-all ${
                    s === step ? "border-[#FF2DA0] text-[#FF2DA0]"
                    : STEPS.indexOf(step) > i ? "border-[#2323C4] bg-[#2323C4]/10 text-[#2323C4]"
                    : "border-[#101014]/15"}`}>
                    {STEPS.indexOf(step) > i ? "✓" : i + 1}
                  </span>
                  <span className="font-hanken text-sm">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-8 h-px ${STEPS.indexOf(step) > i ? "bg-[#2323C4]" : "bg-[#101014]/15"}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-8">
            {/* Form col */}
            <div className="lg:col-span-3 space-y-4">
              {!clientSecret && step !== "Confirmation" && (
                <>
                  {addresses.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-mono text-[10px] tracking-wide text-[#101014]/40">Adresses enregistrées</label>
                        <Link href="/compte/adresses" className="font-mono text-[10px] text-[#FF2DA0]">Gérer</Link>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {addresses.map((a) => (
                          <button key={a.id} type="button" onClick={() => applyAddress(a)}
                            className="shrink-0 text-left rounded-xl px-3.5 py-2.5 border transition-colors"
                            style={{ borderColor: form.zip === a.zip && form.city === a.city ? "#FF2DA0" : "#ECE6DB", background: form.zip === a.zip && form.city === a.city ? "#FF2DA00D" : "#fff" }}>
                            <span className="flex items-center gap-1.5 font-bricolage font-semibold text-[13.5px] text-[#101014]"><MapPin size={12} /> {a.label || a.full_name}</span>
                            <span className="block text-[12px] text-[#101014]/45 max-w-[180px] truncate">{a.line1}, {a.zip} {a.city}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {[
                    { k: "name" as const, label: "Nom / Pseudo", ph: "Ton nom ou pseudo", type: "text" },
                    { k: "email" as const, label: "E-mail", ph: "ton@email.com", type: "email" },
                    { k: "address" as const, label: "Adresse", ph: "1 rue de la Lumière", type: "text" },
                  ].map(({ k, label, ph, type }) => (
                    <div key={k}>
                      <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{label} *</label>
                      <input type={type} required value={form[k] as string} onChange={(e) => set(k, e.target.value)} placeholder={ph}
                        className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    {[{ k: "city" as const, label: "Ville", ph: "Paris" }, { k: "zip" as const, label: "Code postal", ph: "75001" }].map(({ k, label, ph }) => (
                      <div key={k}>
                        <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{label} *</label>
                        <input type="text" required value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph}
                          className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Pays</label>
                    <select value={form.country} onChange={(e) => set("country", e.target.value)}
                      className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/60 transition-colors">
                      {["France", "Belgique", "Suisse", "Canada", "Luxembourg", "Autre"].map((c) => (
                        <option key={c} value={c} className="bg-[#FBFAF8]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.discrete} onChange={(e) => set("discrete", e.target.checked)} className="w-4 h-4 rounded accent-[#FF2DA0]" />
                    <span className="font-hanken text-sm text-[#101014]/60 group-hover:text-[#101014]/80 leading-relaxed">
                      Colis discret · aucune mention Spectrum à l&apos;extérieur
                    </span>
                  </label>

                  {/* Modes de livraison · par boutique */}
                  <ShippingStep items={items} onChange={onShipping} />

                  {intentError && (
                    <div className="text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 font-hanken">
                      ⚠️ {intentError}
                    </div>
                  )}

                  <button
                    onClick={handleGoToPayment}
                    disabled={!deliveryComplete || !shipComplete || loadingIntent}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#FF2DA0] text-white font-hanken font-semibold hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingIntent ? "Préparation…" : <><span>Continuer vers le paiement</span><ArrowRight size={14} /></>}
                  </button>
                </>
              )}

              {clientSecret && step !== "Confirmation" && (
                <>
                  {/* Adresse repliée · même page */}
                  <div className="flex items-start justify-between gap-3 rounded-xl p-4 mb-1" style={{ background: "#fff", boxShadow: "inset 0 0 0 1px #ECE6DB" }}>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] tracking-wide text-[#101014]/40 mb-0.5">Livrer à</p>
                      <p className="font-hanken text-[14px] text-[#101014] truncate">{form.name} · {form.address}, {form.zip} {form.city}</p>
                    </div>
                    <button onClick={() => { setClientSecret(null); setStep("Livraison"); }} className="shrink-0 font-mono text-[11px] text-[#FF2DA0]">Modifier</button>
                  </div>
                  {clientSecret && stripeReady ? (
                    <Elements
                      stripe={getStripe()}
                      options={{
                        clientSecret,
                        ...(customerSession ? { customerSessionClientSecret: customerSession } : {}),
                        appearance: {
                          theme: "stripe",
                          variables: {
                            colorPrimary: "#FF2DA0",
                            colorBackground: "#ffffff",
                            colorText: "#101014",
                            colorDanger: "#f87171",
                            fontFamily: "sans-serif",
                            borderRadius: "12px",
                          },
                        },
                      }}
                    >
                      <StripeForm
                        totalCents={serverTotal !== null ? Math.round(serverTotal * 100) : totalCents}
                        onSuccess={handlePaymentSuccess}
                        onBack={() => { setClientSecret(null); setStep("Livraison"); }}
                      />
                    </Elements>
                  ) : intentError ? (
                    <div className="space-y-4">
                      <div className="p-5 rounded-xl border border-amber-400/30 bg-amber-400/5">
                        <p className="font-bricolage font-bold text-[#101014] mb-2">Paiement indisponible</p>
                        <p className="font-hanken text-sm text-[#101014]/65 leading-relaxed">{intentError}</p>
                      </div>
                      <button onClick={() => setStep("Livraison")} className="flex items-center gap-2 font-mono text-xs text-[#101014]/30 hover:text-[#101014]/60 transition-colors">
                        <ArrowLeft size={12} /> Retour
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <SpectrumLoader size="md" />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl border border-[#101014]/10 bg-[#101014]/[0.025] p-5">
                <div className="prism-line mb-4" />
                <h2 className="font-bricolage font-bold text-[#101014] mb-4">Récapitulatif</h2>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-2 text-sm">
                      <span className="font-hanken text-[#101014]/70 truncate">{item.name} ×{item.quantity}</span>
                      <span className="font-mono text-[#101014] shrink-0">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#101014]/10 pt-3 mb-1 space-y-1.5">
                  <div className="flex justify-between text-sm font-hanken text-[#101014]/60">
                    <span>Sous-total</span><span className="font-mono">{total().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm font-hanken text-[#101014]/60">
                    <span>Frais de port</span>
                    <span className="font-mono">{shipComplete ? (shipTotal === 0 ? "Offert" : `${shipTotal.toFixed(2)} €`) : <span className="text-[#2323C4]">À choisir</span>}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bricolage font-bold text-[#101014] text-lg mt-2">
                  <span>Total</span>
                  <span>{serverTotal !== null ? serverTotal.toFixed(2) : (total() + shipTotal).toFixed(2)} €</span>
                </div>
                {serverTotal !== null && Math.abs(serverTotal - total()) > 0.01 && (
                  <p className="font-hanken text-[10px] text-amber-400/70 mt-1 text-right">
                    Total ajusté par le serveur
                  </p>
                )}
                <TrustBadges variant="list" className="mt-4 pt-3 border-t border-[#101014]/10" />
                <p className="mt-2 font-mono text-[9px] text-[#101014]/30 text-center">Carte · Apple Pay · Google Pay acceptés</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
