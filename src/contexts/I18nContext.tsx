"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Locale   = "fr" | "en" | "ar";
export type Currency = "EUR" | "USD" | "GBP" | "TND" | "MAD" | "DZD" | "CAD" | "AUD" | "CHF" | "SAR" | "AED" | "EGP" | "XOF";

// Live-ish rates vs EUR (updated periodically in code · use exchange API in prod for real-time)
export const RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  CHF: 0.96,
  CAD: 1.47,
  AUD: 1.65,
  TND: 3.35,
  MAD: 10.8,
  DZD: 145,
  SAR: 4.05,
  AED: 3.97,
  EGP: 52,
  XOF: 655,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€", USD: "$", GBP: "£", CHF: "Fr", CAD: "CA$", AUD: "A$",
  TND: "DT", MAD: "MAD", DZD: "DA", SAR: "﷼", AED: "AED", EGP: "EGP", XOF: "CFA",
};

// Country code → [locale, currency]
const GEO_MAP: Record<string, [Locale, Currency]> = {
  // Francophone Europe
  FR: ["fr", "EUR"], BE: ["fr", "EUR"], LU: ["fr", "EUR"],
  CH: ["fr", "CHF"], MC: ["fr", "EUR"],
  // Anglophone
  GB: ["en", "GBP"], US: ["en", "USD"], CA: ["en", "CAD"],
  AU: ["en", "AUD"], NZ: ["en", "AUD"], IE: ["en", "EUR"],
  // Arabophone
  TN: ["ar", "TND"], MA: ["ar", "MAD"], DZ: ["ar", "DZD"],
  SA: ["ar", "SAR"], AE: ["ar", "AED"], EG: ["ar", "EGP"],
  LY: ["ar", "EUR"], IQ: ["ar", "EUR"], SY: ["ar", "EUR"],
  LB: ["ar", "EUR"], JO: ["ar", "EUR"], KW: ["ar", "EUR"],
  // Afrique subsaharienne francophone
  SN: ["fr", "XOF"], CI: ["fr", "XOF"], CM: ["fr", "XOF"],
  ML: ["fr", "XOF"], BF: ["fr", "XOF"], TG: ["fr", "XOF"],
  // Reste EU → EN + EUR par défaut
  DE: ["en", "EUR"], NL: ["en", "EUR"], IT: ["en", "EUR"],
  ES: ["en", "EUR"], PT: ["en", "EUR"], AT: ["en", "EUR"],
  PL: ["en", "EUR"], SE: ["en", "EUR"], DK: ["en", "EUR"],
  NO: ["en", "EUR"], FI: ["en", "EUR"],
};

interface I18nContextType {
  locale: Locale;
  currency: Currency;
  setLocale: (l: Locale) => void;
  setCurrency: (c: Currency) => void;
  t: (key: string) => string;
  formatPrice: (eurAmount: number) => string;
  dir: "ltr" | "rtl";
  geoDetected: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages: Record<Locale, any> = { fr: {}, en: {}, ar: {} };

async function loadMessages(locale: Locale) {
  if (Object.keys(messages[locale]).length > 0) return;
  try {
    const mod = await import(`../../messages/${locale}.json`);
    messages[locale] = mod.default;
  } catch { /* fallback */ }
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

const VALID_LOCALES: Locale[]   = ["fr", "en", "ar"];
const VALID_CURRENCIES: Currency[] = Object.keys(RATES) as Currency[];

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale,       setLocaleState]   = useState<Locale>("fr");
  const [currency,     setCurrencyState] = useState<Currency>("EUR");
  const [geoDetected,  setGeoDetected]   = useState(false);
  const [,             forceRender]      = useState(0);

  // On mount: restore saved prefs OR geolocate
  useEffect(() => {
    const savedLocale    = localStorage.getItem("spectrum-locale") as Locale | null;
    const savedCurrency  = localStorage.getItem("spectrum-currency") as Currency | null;
    const hasPrefs       = savedLocale && VALID_LOCALES.includes(savedLocale);

    if (hasPrefs) {
      // User has explicit preferences · honour them
      const loc = savedLocale as Locale;
      const cur = (savedCurrency && VALID_CURRENCIES.includes(savedCurrency)) ? savedCurrency as Currency : "EUR";
      setLocaleState(loc);
      setCurrencyState(cur);
      document.documentElement.lang = loc;
      document.documentElement.dir  = loc === "ar" ? "rtl" : "ltr";
      loadMessages(loc).then(() => forceRender(n => n + 1));
      setGeoDetected(true);
    } else {
      // First visit · geo-detect
      (async () => {
        try {
          // Try browser language first as fast path
          const browserLang = navigator.language?.split("-")[0]?.toLowerCase();
          let detectedLocale: Locale   = "fr";
          let detectedCurrency: Currency = "EUR";

          // IP geolocation
          const res  = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
          const geo  = await res.json() as { country_code?: string; currency?: string; languages?: string };

          const countryCode = geo.country_code ?? "";
          const mapped = GEO_MAP[countryCode];

          if (mapped) {
            [detectedLocale, detectedCurrency] = mapped;
          } else if (browserLang === "ar") {
            detectedLocale   = "ar";
          } else if (browserLang === "en") {
            detectedLocale   = "en";
            detectedCurrency = "USD";
          }
          // If geo returned a valid currency we know, prefer it
          if (geo.currency && VALID_CURRENCIES.includes(geo.currency as Currency)) {
            detectedCurrency = geo.currency as Currency;
          }

          setLocaleState(detectedLocale);
          setCurrencyState(detectedCurrency);
          localStorage.setItem("spectrum-locale",   detectedLocale);
          localStorage.setItem("spectrum-currency", detectedCurrency);
          document.documentElement.lang = detectedLocale;
          document.documentElement.dir  = detectedLocale === "ar" ? "rtl" : "ltr";
          await loadMessages(detectedLocale);
          forceRender(n => n + 1);
        } catch {
          // Fallback: fr + EUR
          await loadMessages("fr");
          forceRender(n => n + 1);
        } finally {
          setGeoDetected(true);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("spectrum-locale", l);
    document.documentElement.lang = l;
    document.documentElement.dir  = l === "ar" ? "rtl" : "ltr";
    loadMessages(l).then(() => forceRender(n => n + 1));
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("spectrum-currency", c);
  }, []);

  const t = useCallback((key: string): string => {
    const msg = messages[locale];
    if (!msg || Object.keys(msg).length === 0) {
      // Fallback to FR
      return getNestedValue(messages["fr"], key);
    }
    const val = getNestedValue(msg, key);
    // If not found in current locale, fallback to FR
    if (val === key && locale !== "fr") return getNestedValue(messages["fr"], key);
    return val;
  }, [locale]);

  const formatPrice = useCallback((eurAmount: number): string => {
    const converted = eurAmount * RATES[currency];
    const symbol    = CURRENCY_SYMBOLS[currency];
    // Format nicely
    const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-TN" : locale === "en" ? "en-US" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
    // Symbol placement
    const rightSymbols: Currency[] = ["TND","MAD","DZD","SAR","AED","EGP","XOF","CHF","CAD","AUD"];
    return rightSymbols.includes(currency) ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
  }, [currency, locale]);

  return (
    <I18nContext.Provider value={{
      locale, currency, setLocale, setCurrency, t, formatPrice, geoDetected,
      dir: locale === "ar" ? "rtl" : "ltr",
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
