"use client";
import { useState } from "react";
import { useI18n, type Currency } from "@/contexts/I18nContext";
import { ChevronDown, Check } from "lucide-react";

const T = { ink: "#1A1612", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF3D7F", teal: "#1C9C95" };

const LOCALES = [
  { code: "fr" as const, label: "Français", flag: "🇫🇷", sub: "Langue par défaut" },
  { code: "en" as const, label: "English",  flag: "🇬🇧", sub: "International" },
  { code: "ar" as const, label: "عربي",     flag: "🇹🇳", sub: "النسخة العربية" },
] as const;

const CURRENCY_GROUPS = [
  { label: "Europe", items: [
    { code: "EUR" as Currency, symbol: "€", name: "Euro", flag: "🇪🇺" },
    { code: "GBP" as Currency, symbol: "£", name: "Livre sterling", flag: "🇬🇧" },
    { code: "CHF" as Currency, symbol: "Fr", name: "Franc suisse", flag: "🇨🇭" },
  ]},
  { label: "Amériques", items: [
    { code: "USD" as Currency, symbol: "$", name: "Dollar US", flag: "🇺🇸" },
    { code: "CAD" as Currency, symbol: "CA$", name: "Dollar canadien", flag: "🇨🇦" },
    { code: "AUD" as Currency, symbol: "A$", name: "Dollar australien", flag: "🇦🇺" },
  ]},
  { label: "Maghreb & Moyen-Orient", items: [
    { code: "TND" as Currency, symbol: "DT", name: "Dinar tunisien", flag: "🇹🇳" },
    { code: "MAD" as Currency, symbol: "MAD", name: "Dirham marocain", flag: "🇲🇦" },
    { code: "DZD" as Currency, symbol: "DA", name: "Dinar algérien", flag: "🇩🇿" },
    { code: "SAR" as Currency, symbol: "﷼", name: "Riyal saoudien", flag: "🇸🇦" },
    { code: "AED" as Currency, symbol: "AED", name: "Dirham EAU", flag: "🇦🇪" },
    { code: "EGP" as Currency, symbol: "EGP", name: "Livre égyptienne", flag: "🇪🇬" },
  ]},
  { label: "Afrique", items: [
    { code: "XOF" as Currency, symbol: "CFA", name: "Franc CFA", flag: "🌍" },
  ]},
] as const;

export function LocaleSwitcher({ variant = "header" }: { variant?: "header" | "footer" }) {
  const { locale, currency, setLocale, setCurrency } = useI18n();
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState<"lang" | "currency">("lang");

  const currentLocale = LOCALES.find(l => l.code === locale) ?? LOCALES[0];
  const allCurrencies = CURRENCY_GROUPS.flatMap(g => [...g.items]);
  const currentCurrency = allCurrencies.find(c => c.code === currency);

  const up = variant === "footer";

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} aria-haspopup="true" aria-expanded={open}
        className="flex items-center gap-2 rounded-full px-3 py-2 transition-colors"
        style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}>
        <span className="text-base leading-none">{currentLocale.flag}</span>
        <span className="font-hanken text-[13px]">{locale.toUpperCase()}</span>
        <span className="font-mono text-[12px]" style={{ color: T.faint }}>· {currentCurrency?.symbol}</span>
        <ChevronDown size={13} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute right-0 z-50 rounded-2xl overflow-hidden ${up ? "bottom-full mb-2" : "top-full mt-2"}`}
            style={{ width: "270px", background: "#fff", boxShadow: "0 18px 50px rgba(26,22,18,.16), inset 0 0 0 1px " + T.line }}>
            <div className="flex" style={{ borderBottom: `1px solid ${T.line}` }}>
              {([["lang", "🌐 Langue"], ["currency", "💱 Devise"]] as const).map(([key, lbl]) => (
                <button key={key} onClick={() => setTab(key)}
                  className="flex-1 py-3 font-hanken text-[13px] transition-colors"
                  style={tab === key ? { color: T.mag, borderBottom: `2px solid ${T.mag}` } : { color: T.faint }}>
                  {lbl}
                </button>
              ))}
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {tab === "lang" ? (
                <div className="space-y-1">
                  {LOCALES.map(l => (
                    <button key={l.code} onClick={() => { setLocale(l.code); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-[#FBF9F5]"
                      style={locale === l.code ? { background: "#FBF9F5" } : undefined}>
                      <span className="text-xl leading-none">{l.flag}</span>
                      <div className="flex-1 text-left">
                        <p className="font-hanken text-[14px]" style={{ color: locale === l.code ? T.mag : T.ink }}>{l.label}</p>
                        <p className="font-mono text-[10px]" style={{ color: T.faint }}>{l.sub}</p>
                      </div>
                      {locale === l.code && <Check size={13} style={{ color: T.mag }} />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {CURRENCY_GROUPS.map(group => (
                    <div key={group.label}>
                      <p className="font-mono text-[9px] tracking-wide px-2 mb-1" style={{ color: T.faint }}>{group.label}</p>
                      <div className="space-y-0.5">
                        {group.items.map(c => (
                          <button key={c.code} onClick={() => { setCurrency(c.code); setOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors hover:bg-[#FBF9F5]"
                            style={currency === c.code ? { background: "#FBF9F5" } : undefined}>
                            <span className="text-base leading-none">{c.flag}</span>
                            <span className="font-mono text-xs font-bold w-9" style={{ color: currency === c.code ? T.teal : T.soft }}>{c.symbol}</span>
                            <span className="font-hanken text-[13px] flex-1 text-left" style={{ color: currency === c.code ? T.ink : T.soft }}>{c.name}</span>
                            {currency === c.code && <Check size={12} style={{ color: T.teal }} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2.5" style={{ borderTop: `1px solid ${T.line}` }}>
              <p className="font-hanken text-[10px] text-center" style={{ color: T.faint }}>
                Langue et devise appliquées à tout le site
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
