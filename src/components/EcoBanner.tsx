"use client";
import { useState } from "react";
import { X } from "lucide-react";

export function EcoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="w-full bg-[#F1ECE3] border-b border-[#1A1612]/8 py-2.5 px-4 flex items-center justify-center gap-3 relative"
      role="banner"
      aria-label="Engagement écologique"
    >
      {/* Leaf/eco icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#1C9C95] shrink-0"
        aria-hidden="true"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>

      <p className="font-hanken text-xs text-[#1A1612]/60 text-center">
        <span className="text-[#1C9C95] font-medium">Spectrum For Us est 100&nbsp;% en ligne</span>
        {" "}—{" "}
        <span>aucun stock physique, aucune boutique : une empreinte carbone réduite au minimum.</span>
      </p>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer ce message"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1612]/25 hover:text-[#1A1612]/60 transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
}
