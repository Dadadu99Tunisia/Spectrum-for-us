"use client"

import { useEffect, useRef } from "react"
import SpeechService from "@/lib/speech-service"

export function useSpeech(
  text: string,
  options?: {
    enabled?: boolean
    delay?: number
    condition?: boolean
  },
) {
  const speechServiceRef = useRef<typeof SpeechService | null>(null)
  const { enabled = true, delay = 0, condition = true } = options || {}

  useEffect(() => {
    // Initialiser le service de synthèse vocale
    speechServiceRef.current = SpeechService.getInstance()

    // Nettoyer lors du démontage
    return () => {
      // Pas besoin d'arrêter ici car c'est un singleton
    }
  }, [])

  useEffect(() => {
    // Ne rien faire si désactivé ou si la condition n'est pas remplie
    if (!enabled || !condition || !text) return

    // Attendre le délai spécifié avant de lire
    const timer = setTimeout(() => {
      if (speechServiceRef.current?.isActive()) {
        speechServiceRef.current.speak(text)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [text, enabled, delay, condition])
}
