"use client";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { Globe, ChevronDown } from "lucide-react";

const LOCALES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "عربي", flag: "🇲🇦" },
] as const;

const CURRENCIES = [
  { code: "EUR", label: "€ EUR" },
  { code: "USD", label: "$ USD" },
  { code: "GBP", label: "£ GBP" },
  { code: "MAD", label: "MAD" },
  { code: "TND", label: "TND" },
] as const;

export function LocaleSwitcher() {
  const { locale, currency, setLocale, setCurrency } = useI18n();
  const [open, setOpen] = useState(false);

  const currentLocale = LOCALES.find(l => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[#F3EADB]/60 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-all text-sm"
      >
        <Globe size={14} />
        <span className="font-mono text-xs">{currentLocale?.flag} {locale.toUpperCase()}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-[#3D1F5C] border border-[#F3EADB]/10 rounded-xl p-3 min-w-[180px] shadow-2xl">
            <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase mb-2 tracking-widest">Langue</p>
            {LOCALES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLocale(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all ${
                  locale === l.code ? "bg-[#E0337E]/20 text-[#E0337E]" : "text-[#F3EADB]/70 hover:bg-[#F3EADB]/5"
                }`}
              >
                <span>{l.flag}</span>
                <span className="font-hanken">{l.label}</span>
              </button>
            ))}

            <div className="h-px bg-[#F3EADB]/8 my-2" />
            <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase mb-2 tracking-widest">Devise</p>
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all ${
                  currency === c.code ? "bg-[#E0337E]/20 text-[#E0337E]" : "text-[#F3EADB]/70 hover:bg-[#F3EADB]/5"
                }`}
              >
                <span className="font-mono text-xs font-semibold">{c.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
