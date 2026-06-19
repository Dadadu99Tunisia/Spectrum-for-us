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
  const [wantStudio, setWantStudio] = useState(false);
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

  const handleSubscribe = async (plan: "solo" | "studio" = "solo") => {
    if (!shop) return;
    setSubscribing(true); setError("");
    try {
      const res = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          priceId: plan === "studio"
            ? process.env.NEXT_PUBLIC_STRIPE_STUDIO_PRICE_ID
            : process.env.NEXT_PUBLIC_STRIPE_VENDOR_PRICE_ID,
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

  useEffect(() => {
    try { setWantStudio(new URLSearchParams(window.location.search).get("upgrade") === "studio"); } catch {}
  }, []);

  const isActive = shop?.subscription_status === "active";
  const STUDIO_FEATURES = ["Activités / marques illimitées", "Analytics par marque", "Mise en avant éditoriale prioritaire", "Codes promo illimités"];

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
                onClick={() => handleSubscribe("solo")}
                disabled={subscribing}
                className="w-full py-4 rounded-xl bg-[#FF2DA0] text-white font-hanken font-semibold hover:bg-[#FF2DA0]/80 transition-all disabled:opacity-50"
              >
                {subscribing ? "Redirection vers Stripe…" : "S'abonner maintenant · 9,90€/mois"}
              </button>
            </>
          )}
        </div>

        {/* Forfait Studio · multi-marques (toujours visible : info tarifaire) */}
        <div className={`rounded-3xl border p-8 mb-6 transition-all ${wantStudio ? "border-[#6A44D6] bg-[#6A44D6]/[0.06] ring-2 ring-[#6A44D6]/30" : "border-[#6A44D6]/30 bg-[#6A44D6]/[0.04]"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#6A44D6]">Forfait Studio</span>
            {wantStudio && <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#6A44D6]/15 text-[#6A44D6]">requis pour une 2ᵉ activité</span>}
          </div>
          <div className="flex items-end gap-2 mb-5">
            <span className="font-fraunces text-5xl">19,90</span>
            <div className="pb-1.5"><span className="font-fraunces text-xl text-[#6A44D6]">€</span><span className="font-mono text-xs text-[#101014]/40 block">/mois</span></div>
          </div>
          <p className="font-hanken text-sm text-[#101014]/60 mb-5">Gère plusieurs marques sous un seul compte et un seul compte Stripe. Même commission que Solo.</p>
          <div className="space-y-2.5 mb-7">
            {STUDIO_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#6A44D6]/15 flex items-center justify-center flex-shrink-0 text-[#6A44D6] text-[11px]">✦</div>
                <span className="font-hanken text-sm text-[#101014]/80">{f}</span>
              </div>
            ))}
          </div>
          {founderFree ? (
            <div className="w-full py-3.5 rounded-xl bg-green-500/15 text-green-700 font-hanken font-semibold text-center text-sm">
              ✦ Multi-activités inclus pendant ta période fondateur·ice
            </div>
          ) : !user ? (
            <button onClick={() => router.push("/auth?mode=vendor")}
              className="w-full py-4 rounded-xl bg-[#6A44D6] text-white font-hanken font-semibold hover:bg-[#6A44D6]/85 transition-all">
              Créer mon compte vendeur·euse
            </button>
          ) : !shop ? (
            <button onClick={() => router.push("/vendeur/onboarding")}
              className="w-full py-4 rounded-xl bg-[#6A44D6] text-white font-hanken font-semibold hover:bg-[#6A44D6]/85 transition-all">
              Créer ma boutique d&apos;abord →
            </button>
          ) : (
            <button onClick={() => handleSubscribe("studio")} disabled={subscribing}
              className="w-full py-4 rounded-xl bg-[#6A44D6] text-white font-hanken font-semibold hover:bg-[#6A44D6]/85 transition-all disabled:opacity-50">
              {subscribing ? "Redirection vers Stripe…" : "Passer en Studio · 19,90€/mois"}
            </button>
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
