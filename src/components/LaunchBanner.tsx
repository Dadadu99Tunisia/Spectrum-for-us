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

// 🚀 Date du lancement officiel (Europe/Paris)
const LAUNCH = new Date("2026-06-28T10:00:00+02:00");

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
      style={{ background: "linear-gradient(90deg,#1A1612,#3a1f2e)" }}>
      <div className="flex items-center gap-2.5 text-[13px] font-hanken">
        <Rocket size={14} className="text-[#FF3D7F] shrink-0" />
        {launched ? (
          <span className="font-semibold">C&apos;est lancé&nbsp;! Bienvenue sur Spectrum For Us 🎉</span>
        ) : (
          <>
            <span className="hidden sm:inline">Lancement officiel dans</span>
            <span className="sm:hidden">J-</span>
            <span className="flex items-center gap-1 font-mono font-semibold tabular-nums">
              <Seg v={t!.d} l="j" />
              <span className="opacity-40">:</span>
              <Seg v={pad(t!.h)} l="h" />
              <span className="opacity-40">:</span>
              <Seg v={pad(t!.m)} l="m" />
              <span className="opacity-40">:</span>
              <Seg v={pad(t!.s)} l="s" />
            </span>
          </>
        )}
        <Link href="/vendeur/onboarding"
          className="ml-1 hidden sm:inline-flex items-center rounded-full px-3 py-0.5 text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#FF3D7F" }}>
          Devenir fondateur·ice
        </Link>
      </div>
      <button onClick={hide} aria-label="Fermer la bannière"
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
