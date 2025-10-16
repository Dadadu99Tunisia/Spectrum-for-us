"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type Language,
  type Currency,
  defaultLanguage,
  languages,
  detectUserCurrency,
  detectUserLanguage,
} from "./config"
import { translations } from "./translations"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  currency: Currency
  setCurrency: (curr: Currency) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
  formatPrice: (amount: number) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [currency, setCurrencyState] = useState<Currency>("EUR")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeSettings = async () => {
      const savedLang = localStorage.getItem("language") as Language
      const savedCurr = localStorage.getItem("currency") as Currency

      if (savedLang && languages[savedLang]) {
        setLanguageState(savedLang)
        document.documentElement.dir = languages[savedLang].dir
        document.documentElement.lang = savedLang
      } else {
        // Auto-detect language
        const detectedLang = detectUserLanguage()
        setLanguageState(detectedLang)
        document.documentElement.dir = languages[detectedLang].dir
        document.documentElement.lang = detectedLang
        localStorage.setItem("language", detectedLang)
      }

      if (savedCurr) {
        setCurrencyState(savedCurr)
      } else {
        // Auto-detect currency
        const detectedCurr = await detectUserCurrency()
        setCurrencyState(detectedCurr)
        localStorage.setItem("currency", detectedCurr)
      }

      setIsInitialized(true)
    }

    initializeSettings()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.dir = languages[lang].dir
    document.documentElement.lang = lang
  }

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr)
    localStorage.setItem("currency", curr)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat(languages[language].code, {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const dir = languages[language].dir

  if (!isInitialized) {
    return null // or a loading spinner
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, currency, setCurrency, t, dir, formatPrice }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}
