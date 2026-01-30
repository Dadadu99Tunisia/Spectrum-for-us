export const languages = {
  en: { name: "English", flag: "🇬🇧", dir: "ltr", code: "en-US" },
  fr: { name: "Français", flag: "🇫🇷", dir: "ltr", code: "fr-FR" },
  ar: { name: "العربية", flag: "🇹🇳", dir: "rtl", code: "ar-TN" },
  es: { name: "Español", flag: "🇪🇸", dir: "ltr", code: "es-ES" },
  de: { name: "Deutsch", flag: "🇩🇪", dir: "ltr", code: "de-DE" },
  it: { name: "Italiano", flag: "🇮🇹", dir: "ltr", code: "it-IT" },
  pt: { name: "Português", flag: "🇵🇹", dir: "ltr", code: "pt-PT" },
  nl: { name: "Nederlands", flag: "🇳🇱", dir: "ltr", code: "nl-NL" },
  ru: { name: "Русский", flag: "🇷🇺", dir: "ltr", code: "ru-RU" },
  zh: { name: "中文", flag: "🇨🇳", dir: "ltr", code: "zh-CN" },
  ja: { name: "日本語", flag: "🇯🇵", dir: "ltr", code: "ja-JP" },
  ko: { name: "한국어", flag: "🇰🇷", dir: "ltr", code: "ko-KR" },
} as const

export type Language = keyof typeof languages

export const defaultLanguage: Language = "fr"

export const currencies = {
  EUR: { symbol: "€", name: "Euro", countries: ["FR", "DE", "IT", "ES", "PT", "NL", "BE", "AT", "IE", "GR"] },
  USD: { symbol: "$", name: "US Dollar", countries: ["US", "PR", "GU", "VI"] },
  GBP: { symbol: "£", name: "British Pound", countries: ["GB"] },
  CAD: { symbol: "C$", name: "Canadian Dollar", countries: ["CA"] },
  AUD: { symbol: "A$", name: "Australian Dollar", countries: ["AU"] },
  JPY: { symbol: "¥", name: "Japanese Yen", countries: ["JP"] },
  CNY: { symbol: "¥", name: "Chinese Yuan", countries: ["CN"] },
  CHF: { symbol: "CHF", name: "Swiss Franc", countries: ["CH"] },
  SEK: { symbol: "kr", name: "Swedish Krona", countries: ["SE"] },
  NOK: { symbol: "kr", name: "Norwegian Krone", countries: ["NO"] },
  DKK: { symbol: "kr", name: "Danish Krone", countries: ["DK"] },
  PLN: { symbol: "zł", name: "Polish Zloty", countries: ["PL"] },
  CZK: { symbol: "Kč", name: "Czech Koruna", countries: ["CZ"] },
  HUF: { symbol: "Ft", name: "Hungarian Forint", countries: ["HU"] },
  RUB: { symbol: "₽", name: "Russian Ruble", countries: ["RU"] },
  TRY: { symbol: "₺", name: "Turkish Lira", countries: ["TR"] },
  BRL: { symbol: "R$", name: "Brazilian Real", countries: ["BR"] },
  MXN: { symbol: "MX$", name: "Mexican Peso", countries: ["MX"] },
  ARS: { symbol: "AR$", name: "Argentine Peso", countries: ["AR"] },
  CLP: { symbol: "CL$", name: "Chilean Peso", countries: ["CL"] },
  INR: { symbol: "₹", name: "Indian Rupee", countries: ["IN"] },
  KRW: { symbol: "₩", name: "South Korean Won", countries: ["KR"] },
  SGD: { symbol: "S$", name: "Singapore Dollar", countries: ["SG"] },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar", countries: ["HK"] },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar", countries: ["NZ"] },
  ZAR: { symbol: "R", name: "South African Rand", countries: ["ZA"] },
  THB: { symbol: "฿", name: "Thai Baht", countries: ["TH"] },
  MYR: { symbol: "RM", name: "Malaysian Ringgit", countries: ["MY"] },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah", countries: ["ID"] },
  PHP: { symbol: "₱", name: "Philippine Peso", countries: ["PH"] },
  AED: { symbol: "د.إ", name: "UAE Dirham", countries: ["AE"] },
  SAR: { symbol: "﷼", name: "Saudi Riyal", countries: ["SA"] },
  ILS: { symbol: "₪", name: "Israeli Shekel", countries: ["IL"] },
  EGP: { symbol: "E£", name: "Egyptian Pound", countries: ["EG"] },
  MAD: { symbol: "د.م.", name: "Moroccan Dirham", countries: ["MA"] },
  TND: { symbol: "د.ت", name: "Tunisian Dinar", countries: ["TN"] },
} as const

export type Currency = keyof typeof currencies

export async function detectUserCurrency(): Promise<Currency> {
  try {
    // Try to get user's country from IP geolocation
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    const countryCode = data.country_code

    // Find currency for this country
    for (const [currencyCode, currency] of Object.entries(currencies)) {
      if (currency.countries.includes(countryCode)) {
        return currencyCode as Currency
      }
    }
  } catch (error) {
    console.log("[v0] Currency detection failed, using default")
  }

  // Fallback to EUR
  return "EUR"
}

export function detectUserLanguage(): Language {
  if (typeof window === "undefined") return defaultLanguage

  const browserLang = navigator.language.split("-")[0]

  // Check if we support this language
  if (browserLang in languages) {
    return browserLang as Language
  }

  return defaultLanguage
}
