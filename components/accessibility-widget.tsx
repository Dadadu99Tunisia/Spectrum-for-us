"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accessibility, X, Plus, Minus, Eye, Keyboard, Volume2, MousePointer } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [largePointer, setLargePointer] = useState(false)
  const [textToSpeech, setTextToSpeech] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setFontSize(settings.fontSize || 100)
      setHighContrast(settings.highContrast || false)
      setDyslexiaFont(settings.dyslexiaFont || false)
      setScreenReader(settings.screenReader || false)
      setLargePointer(settings.largePointer || false)
      setTextToSpeech(settings.textToSpeech || false)
      applySettings(settings)
    }

    const announcePageChange = () => {
      const announcement = document.createElement("div")
      announcement.setAttribute("role", "status")
      announcement.setAttribute("aria-live", "polite")
      announcement.className = "sr-only"
      announcement.textContent = `Page chargée: ${document.title}`
      document.body.appendChild(announcement)
      setTimeout(() => announcement.remove(), 1000)
    }

    announcePageChange()
  }, [])

  const applySettings = (settings: any) => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`

    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    if (settings.dyslexiaFont) {
      document.documentElement.classList.add("dyslexia-font")
    } else {
      document.documentElement.classList.remove("dyslexia-font")
    }

    if (settings.largePointer) {
      document.documentElement.classList.add("large-pointer")
    } else {
      document.documentElement.classList.remove("large-pointer")
    }

    if (settings.screenReader) {
      document.documentElement.setAttribute("data-screen-reader", "true")
    } else {
      document.documentElement.removeAttribute("data-screen-reader")
    }
  }

  const saveSettings = (newSettings: any) => {
    localStorage.setItem("accessibility", JSON.stringify(newSettings))
    applySettings(newSettings)
  }

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 200)
    setFontSize(newSize)
    saveSettings({ fontSize: newSize, highContrast, dyslexiaFont, screenReader, largePointer, textToSpeech })
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80)
    setFontSize(newSize)
    saveSettings({ fontSize: newSize, highContrast, dyslexiaFont, screenReader, largePointer, textToSpeech })
  }

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    saveSettings({ fontSize, highContrast: newValue, dyslexiaFont, screenReader, largePointer, textToSpeech })
  }

  const toggleDyslexiaFont = () => {
    const newValue = !dyslexiaFont
    setDyslexiaFont(newValue)
    saveSettings({ fontSize, highContrast, dyslexiaFont: newValue, screenReader, largePointer, textToSpeech })
  }

  const toggleScreenReader = () => {
    const newValue = !screenReader
    setScreenReader(newValue)
    saveSettings({ fontSize, highContrast, dyslexiaFont, screenReader: newValue, largePointer, textToSpeech })

    if (newValue) {
      speak("Mode lecteur d'écran activé. Toutes les actions seront annoncées.")
    }
  }

  const toggleLargePointer = () => {
    const newValue = !largePointer
    setLargePointer(newValue)
    saveSettings({ fontSize, highContrast, dyslexiaFont, screenReader, largePointer: newValue, textToSpeech })
  }

  const toggleTextToSpeech = () => {
    const newValue = !textToSpeech
    setTextToSpeech(newValue)
    saveSettings({ fontSize, highContrast, dyslexiaFont, screenReader, largePointer, textToSpeech: newValue })

    if (newValue) {
      speak("Synthèse vocale activée")
    } else {
      window.speechSynthesis.cancel()
    }
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "fr-FR"
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const resetSettings = () => {
    setFontSize(100)
    setHighContrast(false)
    setDyslexiaFont(false)
    setScreenReader(false)
    setLargePointer(false)
    setTextToSpeech(false)
    saveSettings({
      fontSize: 100,
      highContrast: false,
      dyslexiaFont: false,
      screenReader: false,
      largePointer: false,
      textToSpeech: false,
    })
    window.speechSynthesis.cancel()
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
        aria-label="Ouvrir les options d'accessibilité"
        aria-expanded={isOpen}
      >
        <Accessibility className="h-6 w-6 text-white" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 p-6 shadow-2xl border-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Accessibilité
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le panneau d'accessibilité"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-2 block">Taille du texte</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 80}
                  aria-label="Diminuer la taille du texte"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="flex-1 text-center text-sm font-semibold">{fontSize}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 200}
                  aria-label="Augmenter la taille du texte"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* High Contrast */}
            <Button
              variant={highContrast ? "default" : "outline"}
              className="w-full justify-start"
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
            >
              <Eye className="h-4 w-4 mr-2" />
              Contraste élevé
            </Button>

            {/* Dyslexia Font */}
            <Button
              variant={dyslexiaFont ? "default" : "outline"}
              className="w-full justify-start"
              onClick={toggleDyslexiaFont}
              aria-pressed={dyslexiaFont}
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Police dyslexie
            </Button>

            {/* Screen Reader Mode */}
            <Button
              variant={screenReader ? "default" : "outline"}
              className="w-full justify-start"
              onClick={toggleScreenReader}
              aria-pressed={screenReader}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Mode lecteur d'écran
            </Button>

            {/* Text to Speech */}
            <Button
              variant={textToSpeech ? "default" : "outline"}
              className="w-full justify-start"
              onClick={toggleTextToSpeech}
              aria-pressed={textToSpeech}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Synthèse vocale
            </Button>

            {/* Large Pointer */}
            <Button
              variant={largePointer ? "default" : "outline"}
              className="w-full justify-start"
              onClick={toggleLargePointer}
              aria-pressed={largePointer}
            >
              <MousePointer className="h-4 w-4 mr-2" />
              Curseur agrandi
            </Button>

            {/* Reset */}
            <Button variant="secondary" className="w-full mt-4" onClick={resetSettings}>
              Réinitialiser
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}
