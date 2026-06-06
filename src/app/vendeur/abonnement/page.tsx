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
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from("shops").select("id,name,subscription_status").eq("owner_id", user.id).single()
      .then(({ data }) => { setShop(data); setLoading(false); });
  }, [user]);

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
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1612]">
      <Header />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        <div className="text-center mb-10">
          <p className="font-mono text-xs tracking-widest text-[#FF3D7F] uppercase mb-3">Vendeur·euse</p>
          <h1 className="font-fraunces text-4xl font-light mb-3">
            {isActive ? "Ton abonnement est actif ✓" : "Active ta boutique"}
          </h1>
          <p className="font-hanken text-[#1A1612]/60">
            {isActive
              ? `Boutique "${shop?.name}" · abonnement actif`
              : "Un abonnement mensuel pour vendre sur Spectrum For Us."}
          </p>
        </div>

        {/* Pricing card */}
        <div className={`rounded-3xl border p-8 mb-6 ${isActive ? "border-green-500/30 bg-green-500/5" : "border-[#FF3D7F]/30 bg-[#FF3D7F]/5"}`}>
          <div className="flex items-end gap-2 mb-6">
            <span className="font-fraunces text-6xl">9,90</span>
            <div className="pb-2">
              <span className="font-fraunces text-2xl text-[#FF3D7F]">€</span>
              <span className="font-mono text-sm text-[#1A1612]/40 block">/mois</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF3D7F]/20 flex items-center justify-center flex-shrink-0">
                  <f.icon size={11} className="text-[#FF3D7F]" />
                </div>
                <span className="font-hanken text-sm text-[#1A1612]/80">{f.text}</span>
              </div>
            ))}
          </div>

          {!user ? (
            <button onClick={() => router.push("/auth?mode=vendor")}
              className="w-full py-4 rounded-xl bg-[#FF3D7F] text-white font-hanken font-semibold hover:bg-[#FF3D7F]/80 transition-all">
              Créer mon compte vendeur·euse
            </button>
          ) : !shop ? (
            <button onClick={() => router.push("/vendeur/onboarding")}
              className="w-full py-4 rounded-xl bg-[#FF3D7F] text-white font-hanken font-semibold hover:bg-[#FF3D7F]/80 transition-all">
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
                className="w-full py-4 rounded-xl bg-[#FF3D7F] text-white font-hanken font-semibold hover:bg-[#FF3D7F]/80 transition-all disabled:opacity-50"
              >
                {subscribing ? "Redirection vers Stripe…" : "S'abonner maintenant · 9,90€/mois"}
              </button>
            </>
          )}
        </div>

        <p className="text-center font-hanken text-xs text-[#1A1612]/30">
          Résiliation possible à tout moment. Premier paiement à la création de la boutique.
        </p>
      </div>
    </div>
  );
}
