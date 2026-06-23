"use client";

/**
 * LaunchBanner · bandeau fixe en haut avec compte à rebours jusqu'au
 * lancement officiel. Branché sur BannerContext pour que le Header se décale
 * (top-10) tant qu'il est visible. Dismissible.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Rocket } from "lucide-react";
import { useBanner } from "@/contexts/BannerContext";
import { useI18n } from "@/contexts/I18nContext";

const BANNER_TX = {
  fr: { launched: "C'est lancé ! Bienvenue sur Spectrum For Us 🎉", countdown: "Lancement officiel dans", short: "J-",
    becomeFounder: "Devenir fondateur·ice", close: "Fermer la bannière", d: "j", h: "h", m: "m", s: "s" },
  en: { launched: "We're live! Welcome to Spectrum For Us 🎉", countdown: "Official launch in", short: "D-",
    becomeFounder: "Become a founder", close: "Close banner", d: "d", h: "h", m: "m", s: "s" },
} as const;

// 🚀 Date du lancement officiel (Europe/Paris)
const LAUNCH = new Date("2026-06-27T10:00:00+02:00");

function diff() {
  const ms = LAUNCH.getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function LaunchBanner() {
  const { visible, hide } = useBanner();
  const { locale } = useI18n();
  const C = BANNER_TX[locale === "en" ? "en" : "fr"];
  const pathname = usePathname();
  const [t, setT] = useState<ReturnType<typeof diff>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  // Pas de bannière marketing dans l'admin / l'espace vendeur
  const hidden = pathname?.startsWith("/admin") || pathname?.startsWith("/vendeur");
  if (hidden || !visible || !mounted) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  const launched = t === null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 flex items-center justify-center px-10 text-white"
      style={{ background: "linear-gradient(90deg,#101014,#3a1f2e)" }}>
      <div className="flex items-center gap-2.5 text-[13px] font-hanken">
        <Rocket size={14} className="text-[#FF2DA0] shrink-0" />
        {launched ? (
          <span className="font-semibold">{C.launched}</span>
        ) : (
          <>
            <span className="hidden sm:inline">{C.countdown}</span>
            <span className="sm:hidden">{C.short}</span>
            <span className="flex items-center gap-1 font-mono font-semibold tabular-nums">
              <Seg v={t!.d} l={C.d} />
              <span className="opacity-40">:</span>
              <Seg v={pad(t!.h)} l={C.h} />
              <span className="opacity-40">:</span>
              <Seg v={pad(t!.m)} l={C.m} />
              <span className="opacity-40">:</span>
              <Seg v={pad(t!.s)} l={C.s} />
            </span>
          </>
        )}
        <Link href="/vendeur/onboarding"
          className="ml-1 hidden sm:inline-flex items-center rounded-full px-3 py-0.5 text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#FF2DA0" }}>
          {C.becomeFounder}
        </Link>
      </div>
      <button onClick={hide} aria-label={C.close}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity">
        <X size={15} />
      </button>
    </div>
  );
}

function Seg({ v, l }: { v: string | number; l: string }) {
  return (
    <span>{v}<span className="opacity-50 text-[10px] ml-0.5">{l}</span></span>
  );
}
