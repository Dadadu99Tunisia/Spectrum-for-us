"use client";
import { ShieldCheck, Lock, RefreshCw } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, label: "Achat protégé", sub: "Remboursé si problème" },
  { icon: Lock, label: "Paiement sécurisé", sub: "Crypté via Stripe" },
  { icon: RefreshCw, label: "Retours 14 jours", sub: "Droit de rétractation" },
];

/** Bandeau de réassurance acheteur·se (confiance). variant: "row" (3 colonnes) ou "list". */
export function TrustBadges({ variant = "row", className = "" }: { variant?: "row" | "list"; className?: string }) {
  if (variant === "list") {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {ITEMS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={14} className="text-[#1B8155] shrink-0" />
            <span className="font-hanken text-[12.5px] text-[#101014]/70"><strong className="text-[#101014]">{label}</strong> · {sub}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {ITEMS.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-center text-center gap-1 rounded-xl border border-[#ECE6DB] bg-white p-2.5">
          <Icon size={18} className="text-[#1B8155]" strokeWidth={1.8} />
          <span className="font-hanken text-[11px] font-semibold text-[#101014] leading-tight">{label}</span>
          <span className="font-mono text-[8.5px] text-[#101014]/40 leading-tight">{sub}</span>
        </div>
      ))}
    </div>
  );
}
