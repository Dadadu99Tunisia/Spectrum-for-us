"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accessibility, Eye, Palette, Type, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ColorBlindnessMode = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"
type TextSize = "normal" | "large" | "x-large"
type ContrastMode = "normal" | "high"

interface AccessibilitySettings {
  colorBlindnessMode: ColorBlindnessMode
  textSize: TextSize
  contrastMode: ContrastMode
  reduceMotion: boolean
  screenReader: boolean
  fontFamily: "default" | "dyslexic" | "sans-serif"
}

const defaultSettings: AccessibilitySettings = {
  colorBlindnessMode: "normal",
  textSize: "normal",
  contrastMode: "normal",
  reduceMotion: false,
  screenReader: false,
  fontFamily: "default",
}

export function AccessibilityMenu() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isOpen, setIsOpen] = useState(false)

  // Charger les paramètres depuis localStorage au chargement
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Erreur lors du chargement des paramètres d'accessibilité:", e)
      }
    }
  }, [])

  // Appliquer les paramètres lorsqu'ils changent
  useEffect(() => {
    // Sauvegarder dans localStorage
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings))

    // Appliquer les classes CSS au document
    const htmlElement = document.documentElement

    // Gestion de la taille du texte
    htmlElement.classList.remove("text-size-normal", "text-size-large", "text-size-x-large")
    htmlElement.classList.add(`text-size-${settings.textSize}`)

    // Gestion du mode daltonien
    htmlElement.classList.remove(
      "color-normal",
      "color-protanopia",
      "color-deuteranopia",
      "color-tritanopia",
      "color-achromatopsia",
    )
    htmlElement.classList.add(`color-${settings.colorBlindnessMode}`)

    // Gestion du contraste
    htmlElement.classList.toggle("high-contrast", settings.contrastMode === "high")

    // Gestion des animations
    htmlElement.classList.toggle("reduce-motion", settings.reduceMotion)

    // Gestion de la police
    htmlElement.classList.remove("font-default", "font-dyslexic", "font-sans-serif")
    htmlElement.classList.add(`font-${settings.fontFamily}`)

    // Ajouter des styles spécifiques pour chaque mode
    const styleId = "accessibility-styles"
    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    // Définir les styles CSS pour chaque mode
    styleElement.textContent = `
      /* Taille du texte */
      .text-size-normal { font-size: 1rem; }
      .text-size-large { font-size: 1.25rem; }
      .text-size-x-large { font-size: 1.5rem; }
      
      /* Modes daltoniens */
      .color-protanopia {
        filter: url('#protanopia-filter');
      }
      .color-deuteranopia {
        filter: url('#deuteranopia-filter');
      }
      .color-tritanopia {
        filter: url('#tritanopia-filter');
      }
      .color-achromatopsia {
        filter: grayscale(100%);
      }
      
      /* Contraste élevé */
      .high-contrast {
        filter: contrast(1.5);
      }
      
      /* Réduction des animations */
      .reduce-motion * {
        animation-duration: 0.001s !important;
        transition-duration: 0.001s !important;
      }
      
      /* Polices */
      .font-dyslexic {
        font-family: 'OpenDyslexic', sans-serif !important;
      }
      .font-sans-serif {
        font-family: Arial, Helvetica, sans-serif !important;
      }
    `
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <>
      {/* SVG Filters pour les modes daltoniens */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0, 0.242, 0.758, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0, 0, 0
                      0.7, 0.3, 0, 0, 0
                      0, 0.3, 0.7, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05, 0, 0, 0
                      0, 0.433, 0.567, 0, 0
                      0, 0.475, 0.525, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Options d'accessibilité">
            <Accessibility className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Options d'accessibilité</DialogTitle>
            <DialogDescription>
              Personnalisez l'apparence du site selon vos besoins pour une meilleure expérience.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="vision" className="mt-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="vision" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Vision</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span>Texte</span>
              </TabsTrigger>
              <TabsTrigger value="motion" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span>Mouvement</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Thème</span>
              </TabsTrigger>
            </TabsList>

            {/* Onglet Vision */}
            <TabsContent value="vision" className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mode daltonien</h3>
                <RadioGroup
                  value={settings.colorBlindnessMode}
                  onValueChange={(value) => updateSetting("colorBlindnessMode", value as ColorBlindnessMode)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="protanopia" id="protanopia" />
                    <Label htmlFor="protanopia">Protanopie (rouge-vert)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deuteranopia" id="deuteranopia" />
                    <Label htmlFor="deuteranopia">Deutéranopie (vert-rouge)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tritanopia" id="tritanopia" />
                    <Label htmlFor="tritanopia">Tritanopie (bleu-jaune)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="achromatopsia" id="achromatopsia" />
                    <Label htmlFor="achromatopsia">Achromatopsie (noir et blanc)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Contraste élevé</h3>
                  <Switch
                    checked={settings.contrastMode === "high"}
                    onCheckedChange={(checked) => updateSetting("contrastMode", checked ? "high" : "normal")}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Augmente le contraste des couleurs pour améliorer la lisibilité.
                </p>
              </div>
            </TabsContent>

            {/* Onglet Texte */}
            <TabsContent value="text" className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Taille du texte</h3>
                <RadioGroup
                  value={settings.textSize}
                  onValueChange={(value) => updateSetting("textSize", value as TextSize)}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="text-normal" />
                    <Label htmlFor="text-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="text-large" />
                    <Label htmlFor="text-large">Grand</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="x-large" id="text-x-large" />
                    <Label htmlFor="text-x-large">Très grand</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Police de caractères</h3>
                <RadioGroup
                  value={settings.fontFamily}
                  onValueChange={(value) => updateSetting("fontFamily", value as "default" | "dyslexic" | "sans-serif")}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="font-default" />
                    <Label htmlFor="font-default">Par défaut</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dyslexic" id="font-dyslexic" />
                    <Label htmlFor="font-dyslexic">Dyslexie</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sans-serif" id="font-sans-serif" />
                    <Label htmlFor="font-sans-serif">Sans-serif</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            {/* Onglet Mouvement */}
            <TabsContent value="motion" className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Réduire les animations</h3>
                  <Switch
                    checked={settings.reduceMotion}
                    onCheckedChange={(checked) => updateSetting("reduceMotion", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Désactive ou réduit les animations et transitions pour limiter les distractions visuelles.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Support lecteur d'écran</h3>
                  <Switch
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => updateSetting("screenReader", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimise le site pour une meilleure compatibilité avec les lecteurs d'écran.
                </p>
              </div>
            </TabsContent>

            {/* Onglet Thème */}
            <TabsContent value="theme" className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Thèmes inclusifs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className={cn(
                      "h-20 w-full rounded-md border-2",
                      "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
                    )}
                    onClick={() => {
                      document.documentElement.style.setProperty("--primary", "270 75% 60%")
                      document.documentElement.style.setProperty("--primary-foreground", "0 0% 98%")
                    }}
                  >
                    Pride
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-20 w-full rounded-md border-2",
                      "bg-gradient-to-r from-pink-400 via-white to-blue-400 text-black",
                    )}
                    onClick={() => {
                      document.documentElement.style.setProperty("--primary", "330 80% 60%")
                      document.documentElement.style.setProperty("--primary-foreground", "0 0% 98%")
                    }}
                  >
                    Trans
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-20 w-full rounded-md border-2",
                      "bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white",
                    )}
                    onClick={() => {
                      document.documentElement.style.setProperty("--primary", "290 70% 50%")
                      document.documentElement.style.setProperty("--primary-foreground", "0 0% 98%")
                    }}
                  >
                    Lesbien
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-20 w-full rounded-md border-2",
                      "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white",
                    )}
                    onClick={() => {
                      document.documentElement.style.setProperty("--primary", "250 70% 50%")
                      document.documentElement.style.setProperty("--primary-foreground", "0 0% 98%")
                    }}
                  >
                    Bisexuel
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={resetSettings}>
              Réinitialiser
            </Button>
            <Button onClick={() => setIsOpen(false)}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

