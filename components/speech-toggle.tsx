"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { Translate } from "@/components/translate"
import { useToast } from "@/components/ui/use-toast"
import SpeechService from "@/lib/speech-service"

export function SpeechToggle() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  // Vérifier si nous sommes côté client
  useEffect(() => {
    setIsClient(true)

    // Initialiser l'état avec la valeur stockée
    const speechService = SpeechService.getInstance()
    setIsEnabled(speechService.isActive())
  }, [])

  const toggleSpeech = () => {
    if (!isClient) return

    const speechService = SpeechService.getInstance()
    const newState = speechService.toggle()
    setIsEnabled(newState)

    // Annoncer le changement d'état
    if (newState) {
      speechService.speak("Narration vocale activée")
      toast({
        title: <Translate text="Narration vocale activée" />,
        description: <Translate text="Le contenu du site sera lu à haute voix" />,
      })
    } else {
      toast({
        title: <Translate text="Narration vocale désactivée" />,
      })
    }
  }

  if (!isClient) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSpeech}
      aria-pressed={isEnabled}
      aria-label={isEnabled ? "Désactiver la narration vocale" : "Activer la narration vocale"}
      title={isEnabled ? "Désactiver la narration vocale" : "Activer la narration vocale"}
    >
      {isEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </Button>
  )
}
