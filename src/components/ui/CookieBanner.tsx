"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const COOKIE_KEY = "sfu_cookie_consent";

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  accepted_at: string;
};

export function getCookieConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) setVisible(true);
  }, []);

  const save = (analyticsVal: boolean, marketingVal: boolean) => {
    const consent: ConsentState = {
      analytics: analyticsVal,
      marketing: marketingVal,
      accepted_at: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gestion des cookies"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
    >
      <div className="max-w-2xl mx-auto bg-[#FFFFFF] border border-[#101014]/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Prism line */}
        <div className="h-[3px] bg-gradient-to-r from-[#F93C2C] via-[#FF2DA0] to-[#2323C4]" />

        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-fraunces text-[#101014] text-lg font-light">Tes cookies, ton choix ✦</p>
              <p className="font-hanken text-[#101014]/55 text-sm mt-1 leading-relaxed">
                On utilise des cookies essentiels au fonctionnement du site. Tu peux aussi accepter les cookies analytiques pour nous aider à améliorer l&apos;expérience.{" "}
                <a href="/legal/confidentialite" className="text-[#FF2DA0] hover:underline">En savoir plus</a>
              </p>
            </div>
            <button
              onClick={() => save(false, false)}
              aria-label="Refuser et fermer"
              className="text-[#101014]/30 hover:text-[#101014] transition-colors flex-shrink-0 mt-0.5"
            >
              <X size={18} />
            </button>
          </div>

          {showDetails && (
            <div className="mb-5 space-y-3 p-4 rounded-xl bg-[#101014]/4 border border-[#101014]/8">
              {/* Essentiels · toujours on */}
              <label className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-hanken text-sm text-[#101014]/80 font-medium">Essentiels</p>
                  <p className="font-hanken text-xs text-[#101014]/40">Authentification, panier, sécurité. Requis.</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-[#FF2DA0] opacity-50 cursor-not-allowed relative flex-shrink-0">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                </div>
              </label>

              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <p className="font-hanken text-sm text-[#101014]/80 font-medium">Analytiques</p>
                  <p className="font-hanken text-xs text-[#101014]/40">Mesure d'audience anonymisée pour améliorer le site.</p>
                </div>
                <button
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics(v => !v)}
                  className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${analytics ? "bg-[#FF2DA0]" : "bg-[#101014]/15"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${analytics ? "right-0.5" : "left-0.5"}`} />
                </button>
              </label>

              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <p className="font-hanken text-sm text-[#101014]/80 font-medium">Marketing</p>
                  <p className="font-hanken text-xs text-[#101014]/40">Publicités personnalisées et réseaux sociaux.</p>
                </div>
                <button
                  role="switch"
                  aria-checked={marketing}
                  onClick={() => setMarketing(v => !v)}
                  className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${marketing ? "bg-[#FF2DA0]" : "bg-[#101014]/15"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${marketing ? "right-0.5" : "left-0.5"}`} />
                </button>
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => save(true, true)}
              className="px-5 py-2.5 bg-[#FF2DA0] text-[#101014] rounded-full font-hanken text-sm font-medium hover:bg-[#FF2DA0] transition-colors"
            >
              Tout accepter
            </button>
            <button
              onClick={() => save(false, false)}
              className="px-5 py-2.5 bg-[#101014]/8 text-[#101014]/70 rounded-full font-hanken text-sm hover:bg-[#101014]/12 transition-colors"
            >
              Essentiels uniquement
            </button>
            {showDetails ? (
              <button
                onClick={() => save(analytics, marketing)}
                className="px-5 py-2.5 bg-[#101014]/8 text-[#101014]/70 rounded-full font-hanken text-sm hover:bg-[#101014]/12 transition-colors"
              >
                Enregistrer mes choix
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="px-5 py-2.5 text-[#101014]/40 font-hanken text-sm hover:text-[#101014]/70 transition-colors"
              >
                Personnaliser
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
