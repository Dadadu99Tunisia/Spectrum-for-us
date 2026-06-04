"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Locale = "fr" | "en" | "ar";
type Currency = "EUR" | "USD" | "GBP" | "MAD" | "TND";

const RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  MAD: 10.8,
  TND: 3.35,
};

const SYMBOLS: Record<Currency, string> = {
  EUR: "€", USD: "$", GBP: "£", MAD: "MAD", TND: "TND",
};

interface I18nContextType {
  locale: Locale;
  currency: Currency;
  setLocale: (l: Locale) => void;
  setCurrency: (c: Currency) => void;
  t: (key: string) => string;
  formatPrice: (eurAmount: number) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages: Record<Locale, any> = { fr: {}, en: {}, ar: {} };

async function loadMessages(locale: Locale) {
  if (Object.keys(messages[locale]).length > 0) return;
  try {
    const mod = await import(`../../messages/${locale}.json`);
    messages[locale] = mod.default;
  } catch { /* fallback to fr */ }
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

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [, forceRender] = useState(0);

  useEffect(() => {
    const VALID_LOCALES: Locale[] = ["fr", "en", "ar"];
    const VALID_CURRENCIES: Currency[] = ["EUR", "USD", "GBP", "MAD", "TND"];
    const rawLocale = localStorage.getItem("spectrum-locale");
    const rawCurrency = localStorage.getItem("spectrum-currency");
    const savedLocale = VALID_LOCALES.includes(rawLocale as Locale) ? (rawLocale as Locale) : "fr";
    const savedCurrency = VALID_CURRENCIES.includes(rawCurrency as Currency) ? (rawCurrency as Currency) : "EUR";
    // Clean up corrupted values
    if (rawLocale && !VALID_LOCALES.includes(rawLocale as Locale)) localStorage.setItem("spectrum-locale", "fr");
    if (rawCurrency && !VALID_CURRENCIES.includes(rawCurrency as Currency)) localStorage.setItem("spectrum-currency", "EUR");
    setLocaleState(savedLocale);
    setCurrencyState(savedCurrency);
    loadMessages(savedLocale).then(() => forceRender(n => n + 1));
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("spectrum-locale", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    loadMessages(l).then(() => forceRender(n => n + 1));
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("spectrum-currency", c);
  }, []);

  const t = useCallback((key: string): string => {
    const msg = messages[locale];
    if (Object.keys(msg).length === 0) return getNestedValue(messages["fr"], key);
    return getNestedValue(msg, key);
  }, [locale]);

  const formatPrice = useCallback((eurAmount: number): string => {
    const converted = eurAmount * RATES[currency];
    return `${converted.toFixed(2)} ${SYMBOLS[currency]}`;
  }, [currency]);

  return (
    <I18nContext.Provider value={{
      locale, currency, setLocale, setCurrency, t, formatPrice,
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
