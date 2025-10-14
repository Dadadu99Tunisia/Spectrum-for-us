"use client"

import { useLocale } from "@/contexts/locale-context"

interface FormattedPriceProps {
  amount: number
  className?: string
}

export function FormattedPrice({ amount, className }: FormattedPriceProps) {
  const { currency } = useLocale()

  // Fonction pour formater le prix selon la devise
  const formatPrice = (price: number) => {
    // Taux de change fictifs (dans une application réelle, ces taux seraient récupérés d'une API)
    const exchangeRates = {
      EUR: 1,
      USD: 1.09,
      GBP: 0.85,
      CAD: 1.47,
      CHF: 0.96,
    }

    // Convertir le prix selon la devise
    const convertedPrice = price * exchangeRates[currency.code as keyof typeof exchangeRates]

    // Formater le prix selon la locale et la devise
    const localeMap = {
      EUR: "fr-FR",
      USD: "en-US",
      GBP: "en-GB",
      CAD: "en-CA",
      CHF: "de-CH",
    }

    return new Intl.NumberFormat(localeMap[currency.code as keyof typeof localeMap], {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedPrice)
  }

  return <span className={className}>{formatPrice(amount)}</span>
}

