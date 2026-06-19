"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { useBanner } from "@/contexts/BannerContext";

const PRIDE_DATE = new Date("2026-06-27T00:00:00");

function getTimeLeft() {
  const diff = PRIDE_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export function PrideCountdown() {
  const { visible, hide } = useBanner();
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!visible || !time) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-2.5 text-white text-sm"
      style={{ background: "linear-gradient(90deg, #7A2BF0 0%, #FF2DA0 50%, #FFD400 100%)" }}
    >
      <div className="w-6 shrink-0" />

      <div className="flex items-center gap-3 flex-wrap justify-center text-center">
        <span className="font-mono text-xs tracking-wide opacity-90">
          🏳️‍🌈 Lancement Pride
        </span>
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <span className="bg-white/15 rounded px-1.5 py-0.5">{time.days}j</span>
          <span className="opacity-60">:</span>
          <span className="bg-white/15 rounded px-1.5 py-0.5">{pad(time.hours)}h</span>
          <span className="opacity-60">:</span>
          <span className="bg-white/15 rounded px-1.5 py-0.5">{pad(time.minutes)}m</span>
          <span className="opacity-60">:</span>
          <span className="bg-white/15 rounded px-1.5 py-0.5">{pad(time.seconds)}s</span>
        </div>
        <Link
          href="/rejoindre"
          className="hidden sm:inline-flex items-center gap-1 font-hanken text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-full px-3 py-1 transition-colors"
        >
          Rejoindre maintenant <ArrowRight size={11} />
        </Link>
      </div>

      <button onClick={hide} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}
