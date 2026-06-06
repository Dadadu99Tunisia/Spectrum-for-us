"use client";
import { useState } from "react";
import { useI18n, type Currency } from "@/contexts/I18nContext";
import { Globe, ChevronDown, Check } from "lucide-react";

const LOCALES = [
  { code: "fr" as const, label: "Français",  flag: "🇫🇷", sub: "Langue par défaut" },
  { code: "en" as const, label: "English",   flag: "🇬🇧", sub: "International" },
  { code: "ar" as const, label: "عربي",      flag: "🇹🇳", sub: "النسخة العربية" },
] as const;

const CURRENCY_GROUPS = [
  {
    label: "Europe",
    items: [
      { code: "EUR" as Currency, symbol: "€", name: "Euro",          flag: "🇪🇺" },
      { code: "GBP" as Currency, symbol: "£", name: "Livre sterling", flag: "🇬🇧" },
      { code: "CHF" as Currency, symbol: "Fr", name: "Franc suisse",  flag: "🇨🇭" },
    ],
  },
  {
    label: "Amériques",
    items: [
      { code: "USD" as Currency, symbol: "$",    name: "Dollar US",       flag: "🇺🇸" },
      { code: "CAD" as Currency, symbol: "CA$",  name: "Dollar canadien", flag: "🇨🇦" },
      { code: "AUD" as Currency, symbol: "A$",   name: "Dollar australien",flag: "🇦🇺" },
    ],
  },
  {
    label: "Maghreb & Moyen-Orient",
    items: [
      { code: "TND" as Currency, symbol: "DT",  name: "Dinar tunisien",   flag: "🇹🇳" },
      { code: "MAD" as Currency, symbol: "MAD", name: "Dirham marocain",  flag: "🇲🇦" },
      { code: "DZD" as Currency, symbol: "DA",  name: "Dinar algérien",   flag: "🇩🇿" },
      { code: "SAR" as Currency, symbol: "﷼",   name: "Riyal saoudien",   flag: "🇸🇦" },
      { code: "AED" as Currency, symbol: "AED", name: "Dirham EAU",       flag: "🇦🇪" },
      { code: "EGP" as Currency, symbol: "EGP", name: "Livre égyptienne", flag: "🇪🇬" },
    ],
  },
  {
    label: "Afrique",
    items: [
      { code: "XOF" as Currency, symbol: "CFA", name: "Franc CFA",        flag: "🌍" },
    ],
  },
] as const;

export function LocaleSwitcher() {
  const { locale, currency, setLocale, setCurrency } = useI18n();
  const [open, setOpen]   = useState(false);
  const [tab, setTab]     = useState<"lang" | "currency">("lang");

  const currentLocale = LOCALES.find(l => l.code === locale) ?? LOCALES[0];
  const allCurrencies = CURRENCY_GROUPS.flatMap(g => [...g.items]);
  const currentCurrency = allCurrencies.find(c => c.code === currency);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#F3EADB]/60 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-all"
        aria-haspopup="true" aria-expanded={open}
      >
        <span className="text-base leading-none">{currentLocale.flag}</span>
        <span className="font-mono text-[11px] hidden sm:block">{locale.toUpperCase()}</span>
        <span className="font-mono text-[10px] text-[#F3EADB]/30 hidden md:block">
          {currentCurrency?.symbol}
        </span>
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-[#2d1a47] border border-[#F3EADB]/12 rounded-2xl shadow-2xl overflow-hidden"
            style={{ width: "260px", boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>

            {/* Tabs */}
            <div className="flex border-b border-[#F3EADB]/8">
              {([["lang", "🌐 Langue"], ["currency", "💱 Devise"]] as const).map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 font-mono text-[10px] tracking-wide transition-colors ${
                    tab === t ? "text-[#E0337E] border-b-2 border-[#E0337E]" : "text-[#F3EADB]/35 hover:text-[#F3EADB]/60"
                  }`}>
                  {l}
                </button>
              ))}
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {tab === "lang" ? (
                /* ── Language tab ── */
                <div className="space-y-1">
                  {LOCALES.map(l => (
                    <button key={l.code}
                      onClick={() => { setLocale(l.code); setOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        locale === l.code
                          ? "bg-[#E0337E]/15 border border-[#E0337E]/25"
                          : "hover:bg-[#F3EADB]/5 border border-transparent"
                      }`}>
                      <span className="text-xl leading-none">{l.flag}</span>
                      <div className="flex-1 text-left">
                        <p className={`font-hanken text-sm ${locale === l.code ? "text-[#E0337E]" : "text-[#F3EADB]/80"}`}>
                          {l.label}
                        </p>
                        <p className="font-mono text-[9px] text-[#F3EADB]/28">{l.sub}</p>
                      </div>
                      {locale === l.code && <Check size={12} className="text-[#E0337E] shrink-0" />}
                    </button>
                  ))}
                </div>
              ) : (
                /* ── Currency tab ── */
                <div className="space-y-3">
                  {CURRENCY_GROUPS.map(group => (
                    <div key={group.label}>
                      <p className="font-mono text-[8px] tracking-wide text-[#F3EADB]/22 px-2 mb-1">
                        {group.label}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map(c => (
                          <button key={c.code}
                            onClick={() => { setCurrency(c.code); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                              currency === c.code
                                ? "bg-[#1C9C95]/15 border border-[#1C9C95]/25"
                                : "hover:bg-[#F3EADB]/5 border border-transparent"
                            }`}>
                            <span className="text-base leading-none">{c.flag}</span>
                            <span className={`font-mono text-xs font-bold w-8 ${currency === c.code ? "text-[#1C9C95]" : "text-[#F3EADB]/50"}`}>
                              {c.symbol}
                            </span>
                            <span className={`font-hanken text-xs flex-1 text-left ${currency === c.code ? "text-[#F3EADB]/90" : "text-[#F3EADB]/50"}`}>
                              {c.name}
                            </span>
                            {currency === c.code && <Check size={11} className="text-[#1C9C95] shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="px-4 py-2.5 border-t border-[#F3EADB]/6 bg-[#F3EADB]/[0.02]">
              <p className="font-mono text-[8.5px] text-[#F3EADB]/20 text-center">
                Détection automatique basée sur ta localisation
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
