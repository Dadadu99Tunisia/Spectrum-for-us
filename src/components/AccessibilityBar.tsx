"use client";
import { useState } from "react";
import { Eye, Type, Palette, Volume2, ChevronUp, ChevronDown } from "lucide-react";

type Mode = "dyslexia" | "contrast" | "colorblind" | "deaf";

const MODES: { key: Mode; icon: React.ElementType; label: string; detail: string }[] = [
  { key: "dyslexia", icon: Type, label: "Dyslexie", detail: "Police & espacement adaptés" },
  { key: "contrast", icon: Eye, label: "Contraste élevé", detail: "Filtre haute lisibilité" },
  { key: "colorblind", icon: Palette, label: "Daltonien·ne", detail: "Couleurs accessibles" },
  { key: "deaf", icon: Volume2, label: "Sourd·e", detail: "Sous-titres systématiques" },
];

export function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Set<Mode>>(new Set());

  const toggle = (mode: Mode) => {
    const html = document.documentElement;
    const next = new Set(active);
    if (next.has(mode)) {
      next.delete(mode);
      html.classList.remove(`mode-${mode}`);
    } else {
      next.add(mode);
      html.classList.add(`mode-${mode}`);
    }
    setActive(next);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-5 py-2 bg-[#1C0E29] border border-[#F3EADB]/15 border-b-0 rounded-t-xl text-[#F3EADB]/50 hover:text-[#F3EADB] transition-colors text-xs font-mono tracking-widest uppercase"
          aria-label="Options d'accessibilité"
          aria-expanded={open}
        >
          <span>Accessibilité</span>
          {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
      </div>

      {/* Panel */}
      <div
        className="bg-[#1C0E29]/95 backdrop-blur-md border-t border-[#F3EADB]/10 transition-all duration-300 overflow-hidden"
        style={{ maxHeight: open ? "120px" : "0px" }}
      >
        <div className="max-w-2xl mx-auto px-6 py-4 flex flex-wrap gap-3 justify-center">
          {MODES.map(({ key, icon: Icon, label, detail }) => {
            const isActive = active.has(key);
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                title={detail}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-hanken transition-all duration-200 ${
                  isActive
                    ? "border-[#E0337E] text-[#E0337E] bg-[#E0337E]/10"
                    : "border-[#F3EADB]/15 text-[#F3EADB]/50 hover:border-[#F3EADB]/30 hover:text-[#F3EADB]/70"
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
