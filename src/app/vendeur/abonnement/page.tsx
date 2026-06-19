"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Check, Zap, Shield, BarChart3, HeadphonesIcon, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const FEATURES = [
  { icon: Zap, text: "Boutique personnalisée avec ton identité visuelle" },
  { icon: Shield, text: "Produits & services illimités" },
  { icon: BarChart3, text: "Dashboard analytics temps réel" },
  { icon: HeadphonesIcon, text: "Support prioritaire communauté" },
  { icon: Star, text: "Mise en avant sur la homepage" },
  { icon: Check, text: "Zéro commission les 3 premiers mois" },
];

export default function AbonnementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState<{ id: string; subscription_status: string; name: string } | null>(null);
  const [subFreeUntil, setSubFreeUntil] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    // L'abonnement est au niveau SELLER (couvre toutes les activités). On charge le statut du seller,
    // et l'activité primaire seulement pour fournir un shopId au checkout.
    Promise.all([
      supabase.from("shops").select("id,name").eq("owner_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle(),
      supabase.from("sellers").select("subscription_status").maybeSingle(),
    ]).then(([{ data: sh }, { data: sel }]) => {
      setShop(sh ? { ...sh, subscription_status: sel?.subscription_status ?? "none" } : null);
      setLoading(false);
    });
    supabase.from("founder_program_members").select("subscription_free_until").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setSubFreeUntil(data?.subscription_free_until ?? null));
  }, [user]);

  const founderFree = !!subFreeUntil && new Date(subFreeUntil).getTime() > Date.now();
  const freeDate = subFreeUntil ? new Date(subFreeUntil).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

  const handleSubscribe = async () => {
    if (!shop) return;
    setSubscribing(true); setError("");
    try {
      const res = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_VENDOR_PRICE_ID,
          shopId: shop.id,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Erreur lors de la création de l'abonnement");
    } catch {
      setError("Erreur réseau");
    }
    setSubscribing(false);
  };

  const isActive = shop?.subscription_status === "active";

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        <div className="text-center mb-10">
          <p className="font-mono text-xs tracking-widest text-[#FF2DA0] uppercase mb-3">Vendeur·euse</p>
          <h1 className="font-fraunces text-4xl font-light mb-3">
            {founderFree ? "Ton abonnement est offert ✦" : isActive ? "Ton abonnement est actif ✓" : "Active ta boutique"}
          </h1>
          <p className="font-hanken text-[#101014]/60">
            {founderFree
              ? `Avantage fondateur·ice : rien à payer jusqu'au ${freeDate}.`
              : isActive
              ? `Boutique "${shop?.name}" · abonnement actif`
              : "Un abonnement mensuel pour vendre sur Spectrum For Us."}
          </p>
        </div>

        {/* Pricing card */}
        <div className={`rounded-3xl border p-8 mb-6 ${founderFree || isActive ? "border-green-500/30 bg-green-500/5" : "border-[#FF2DA0]/30 bg-[#FF2DA0]/5"}`}>
          <div className="flex items-end gap-2 mb-6">
            {founderFree ? (
              <>
                <span className="font-fraunces text-6xl text-green-600">0 €</span>
                <div className="pb-2"><span className="font-mono text-sm text-[#101014]/40 block">offert · fondateur·ice</span></div>
                <span className="font-fraunces text-2xl text-[#101014]/25 line-through ml-2 pb-2">9,90 €</span>
              </>
            ) : (
              <>
                <span className="font-fraunces text-6xl">9,90</span>
                <div className="pb-2">
                  <span className="font-fraunces text-2xl text-[#FF2DA0]">€</span>
                  <span className="font-mono text-sm text-[#101014]/40 block">/mois</span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 mb-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF2DA0]/20 flex items-center justify-center flex-shrink-0">
                  <f.icon size={11} className="text-[#FF2DA0]" />
                </div>
                <span className="font-hanken text-sm text-[#101014]/80">{f.text}</span>
              </div>
            ))}
          </div>

          {founderFree ? (
            <div className="w-full py-4 rounded-xl bg-green-500/15 text-green-700 font-hanken font-semibold text-center">
              ✦ Offert grâce au programme fondateur · rien à payer
            </div>
          ) : !user ? (
            <button onClick={() => router.push("/auth?mode=vendor")}
              className="w-full py-4 rounded-xl bg-[#FF2DA0] text-white font-hanken font-semibold hover:bg-[#FF2DA0]/80 transition-all">
              Créer mon compte vendeur·euse
            </button>
          ) : !shop ? (
            <button onClick={() => router.push("/vendeur/onboarding")}
              className="w-full py-4 rounded-xl bg-[#FF2DA0] text-white font-hanken font-semibold hover:bg-[#FF2DA0]/80 transition-all">
              Créer ma boutique d'abord →
            </button>
          ) : isActive ? (
            <div className="w-full py-4 rounded-xl bg-green-500/20 text-green-400 font-hanken font-semibold text-center">
              ✓ Abonnement actif
            </div>
          ) : (
            <>
              {error && <p className="text-red-400 font-hanken text-sm mb-3">{error}</p>}
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full py-4 rounded-xl bg-[#FF2DA0] text-white font-hanken font-semibold hover:bg-[#FF2DA0]/80 transition-all disabled:opacity-50"
              >
                {subscribing ? "Redirection vers Stripe…" : "S'abonner maintenant · 9,90€/mois"}
              </button>
            </>
          )}
        </div>

        <p className="text-center font-hanken text-xs text-[#101014]/30">
          {founderFree
            ? "Ton avantage fondateur·ice s'applique automatiquement. Tu seras prévenu·e avant toute facturation."
            : "Résiliation possible à tout moment."}
        </p>
      </div>
    </div>
  );
}
