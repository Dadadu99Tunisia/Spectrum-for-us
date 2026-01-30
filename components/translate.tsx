"use client"

import { useLocale } from "@/contexts/locale-context"

interface TranslateProps {
  text: string
  className?: string
}

export function Translate({ text, className }: TranslateProps) {
  const { t } = useLocale()

  return <span className={className}>{t(text)}</span>
}
