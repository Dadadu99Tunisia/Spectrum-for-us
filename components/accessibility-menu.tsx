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
import {
  Accessibility,
  Eye,
  Type,
  Volume2,
  Keyboard,
  Monitor,
  CreditCard,
  Store,
  Users,
  HandMetal,
  Braces,
  FileText,
  Video,
  Wallet,
  ShieldCheck,
  Headphones,
  Sparkles,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { useLocale } from "@/contexts/locale-context"

type ColorBlindnessMode = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"
type TextSize = "normal" | "large" | "x-large"
type ContrastMode = "normal" | "high"
type ReadingMode = "normal" | "easy-read" | "dyslexic"

interface AccessibilitySettings {
  // WCAG 2.1 AA
  colorBlindnessMode: ColorBlindnessMode
  textSize: TextSize
  contrastMode: ContrastMode
  reduceMotion: boolean
  screenReader: boolean
  fontFamily: "default" | "dyslexic" | "sans-serif"
  keyboardNavigation: boolean
  ariaEnhanced: boolean

  // Expérience utilisateur
  simplifiedInterface: boolean
  signLanguage: boolean
  easyReadMode: ReadingMode
  accessibleProductFilter: boolean

  // Paiements et services
  simplifiedPayment: boolean
  alternativePayments: boolean
  inclusiveSupport: boolean

  // Expérience vendeurs
  accessibleDashboard: boolean
  inclusiveDescriptionTools: boolean
  accessibilityLabel: boolean

  // Paramètres avancés
  lineSpacing: number
  letterSpacing: number
  paragraphSpacing: number
  wordSpacing: number
  focusIndicator: boolean
  autoplay: boolean
  flashReduction: boolean
}

const defaultSettings: AccessibilitySettings = {
  colorBlindnessMode: "normal",
  textSize: "normal",
  contrastMode: "normal",
  reduceMotion: false,
  screenReader: false,
  fontFamily: "default",
  keyboardNavigation: false,
  ariaEnhanced: false,

  simplifiedInterface: false,
  signLanguage: false,
  easyReadMode: "normal",
  accessibleProductFilter: false,

  simplifiedPayment: false,
  alternativePayments: false,
  inclusiveSupport: false,

  accessibleDashboard: false,
  inclusiveDescriptionTools: false,
  accessibilityLabel: false,

  lineSpacing: 1.5,
  letterSpacing: 0,
  paragraphSpacing: 1,
  wordSpacing: 0,
  focusIndicator: false,
  autoplay: true,
  flashReduction: false,
}

export function AccessibilityMenu() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLocale()

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

    // Gestion de l'interface simplifiée
    htmlElement.classList.toggle("simplified-interface", settings.simplifiedInterface)

    // Gestion du mode de lecture facile
    htmlElement.classList.remove("reading-normal", "reading-easy", "reading-dyslexic")
    htmlElement.classList.add(`reading-${settings.easyReadMode}`)

    // Gestion des espacements
    document.documentElement.style.setProperty("--line-spacing", `${settings.lineSpacing}`)
    document.documentElement.style.setProperty("--letter-spacing", `${settings.letterSpacing}px`)
    document.documentElement.style.setProperty("--paragraph-spacing", `${settings.paragraphSpacing}rem`)
    document.documentElement.style.setProperty("--word-spacing", `${settings.wordSpacing}px`)

    // Gestion des indicateurs de focus
    htmlElement.classList.toggle("enhanced-focus", settings.focusIndicator)

    // Gestion de la réduction des flashs
    htmlElement.classList.toggle("reduce-flash", settings.flashReduction)

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
      
      /* Interface simplifiée */
      .simplified-interface .decoration-only {
        display: none !important;
      }
      .simplified-interface .complex-ui {
        display: none !important;
      }
      .simplified-interface .simplified-alternative {
        display: block !important;
      }
      
      /* Modes de lecture */
      .reading-easy {
        font-family: Arial, sans-serif !important;
        line-height: 1.8 !important;
        letter-spacing: 0.12em !important;
      }
      .reading-dyslexic {
        font-family: 'OpenDyslexic', sans-serif !important;
        line-height: 1.8 !important;
        letter-spacing: 0.12em !important;
      }
      
      /* Espacement */
      body {
        line-height: var(--line-spacing, 1.5);
        letter-spacing: var(--letter-spacing, 0);
        word-spacing: var(--word-spacing, 0);
      }
      p {
        margin-bottom: var(--paragraph-spacing, 1rem);
      }
      
      /* Focus amélioré */
      .enhanced-focus :focus {
        outline: 3px solid #ff00ff !important;
        outline-offset: 3px !important;
      }
      
      /* Réduction des flashs */
      .reduce-flash img, 
      .reduce-flash video {
        animation: none !important;
        transition: none !important;
      }
      .reduce-flash * {
        animation-duration: 0.001s !important;
        animation-iteration-count: 1 !important;
      }
    `

    // Appliquer les paramètres ARIA améliorés
    if (settings.ariaEnhanced) {
      document.querySelectorAll("img").forEach((img) => {
        if (!img.hasAttribute("alt")) {
          img.setAttribute("alt", img.getAttribute("src")?.split("/").pop() || "Image")
        }
      })

      document.querySelectorAll("button").forEach((button) => {
        if (!button.hasAttribute("aria-label") && !button.textContent?.trim()) {
          button.setAttribute("aria-label", "Bouton")
        }
      })
    }

    // Activer la navigation clavier
    if (settings.keyboardNavigation) {
      document.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((el) => {
        if (el instanceof HTMLElement && el.tabIndex < 0) {
          el.tabIndex = 0
        }
      })
    }
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
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Options d'accessibilité</DialogTitle>
            <DialogDescription>
              Personnalisez l'apparence et les fonctionnalités du site selon vos besoins pour une meilleure expérience.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="wcag" className="mt-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="wcag" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Accessibilité Web</span>
              </TabsTrigger>
              <TabsTrigger value="ux" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Expérience Utilisateur</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>Paiements & Services</span>
              </TabsTrigger>
              <TabsTrigger value="sellers" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span>Expérience Vendeurs</span>
              </TabsTrigger>
            </TabsList>

            {/* Onglet Accessibilité Web (WCAG 2.1 AA) */}
            <TabsContent value="wcag" className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Vision
                  </h3>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Mode daltonien</h4>
                    <RadioGroup
                      value={settings.colorBlindnessMode}
                      onValueChange={(value) => updateSetting("colorBlindnessMode", value as ColorBlindnessMode)}
                      className="grid grid-cols-2 gap-2"
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

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Contraste élevé</h4>
                      <Switch
                        checked={settings.contrastMode === "high"}
                        onCheckedChange={(checked) => updateSetting("contrastMode", checked ? "high" : "normal")}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Augmente le contraste des couleurs pour améliorer la lisibilité.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Réduction des flashs</h4>
                      <Switch
                        checked={settings.flashReduction}
                        onCheckedChange={(checked) => updateSetting("flashReduction", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Réduit les animations clignotantes et les effets visuels intenses.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Texte et lecture
                  </h3>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Taille du texte</h4>
                    <RadioGroup
                      value={settings.textSize}
                      onValueChange={(value) => updateSetting("textSize", value as TextSize)}
                      className="grid grid-cols-3 gap-2"
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

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Police de caractères</h4>
                    <RadioGroup
                      value={settings.fontFamily}
                      onValueChange={(value) =>
                        updateSetting("fontFamily", value as "default" | "dyslexic" | "sans-serif")
                      }
                      className="grid grid-cols-3 gap-2"
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

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Espacement des lignes</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">1.0</span>
                      <Slider
                        value={[settings.lineSpacing]}
                        min={1.0}
                        max={2.5}
                        step={0.1}
                        onValueChange={(value) => updateSetting("lineSpacing", value[0])}
                      />
                      <span className="text-xs">2.5</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Espacement des lettres</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">0px</span>
                      <Slider
                        value={[settings.letterSpacing]}
                        min={0}
                        max={5}
                        step={0.5}
                        onValueChange={(value) => updateSetting("letterSpacing", value[0])}
                      />
                      <span className="text-xs">5px</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Audio et mouvement
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Réduire les animations</h4>
                      <Switch
                        checked={settings.reduceMotion}
                        onCheckedChange={(checked) => updateSetting("reduceMotion", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Désactive ou réduit les animations et transitions pour limiter les distractions visuelles.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Support lecteur d'écran</h4>
                      <Switch
                        checked={settings.screenReader}
                        onCheckedChange={(checked) => updateSetting("screenReader", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Optimise le site pour une meilleure compatibilité avec les lecteurs d'écran.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Lecture automatique des médias</h4>
                      <Switch
                        checked={settings.autoplay}
                        onCheckedChange={(checked) => updateSetting("autoplay", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active ou désactive la lecture automatique des vidéos et audios.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Keyboard className="h-5 w-5" />
                    Navigation et interaction
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Navigation clavier améliorée</h4>
                      <Switch
                        checked={settings.keyboardNavigation}
                        onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Améliore la navigation au clavier pour une utilisation sans souris.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Attributs ARIA améliorés</h4>
                      <Switch
                        checked={settings.ariaEnhanced}
                        onCheckedChange={(checked) => updateSetting("ariaEnhanced", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ajoute des attributs ARIA supplémentaires pour améliorer la compatibilité avec les technologies
                      d'assistance.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Indicateurs de focus améliorés</h4>
                      <Switch
                        checked={settings.focusIndicator}
                        onCheckedChange={(checked) => updateSetting("focusIndicator", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rend les indicateurs de focus plus visibles lors de la navigation au clavier.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Expérience Utilisateur */}
            <TabsContent value="ux" className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Interface et navigation
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Interface simplifiée</h4>
                      <Switch
                        checked={settings.simplifiedInterface}
                        onCheckedChange={(checked) => updateSetting("simplifiedInterface", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Simplifie l'interface en réduisant les éléments décoratifs et les distractions visuelles.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Mode de lecture</h4>
                    <RadioGroup
                      value={settings.easyReadMode}
                      onValueChange={(value) => updateSetting("easyReadMode", value as ReadingMode)}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="read-normal" />
                        <Label htmlFor="read-normal">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy-read" id="read-easy" />
                        <Label htmlFor="read-easy">Facile à lire (FALC)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dyslexic" id="read-dyslexic" />
                        <Label htmlFor="read-dyslexic">Adapté à la dyslexie</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <HandMetal className="h-5 w-5" />
                    Langue des signes et communication
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Assistance en langue des signes</h4>
                      <Switch
                        checked={settings.signLanguage}
                        onCheckedChange={(checked) => updateSetting("signLanguage", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active l'assistance en langue des signes via un avatar virtuel ou un chatbot vidéo.
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Langue des signes préférée</h4>
                    <RadioGroup defaultValue="lsf" className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lsf" id="lsf" />
                        <Label htmlFor="lsf">LSF (Française)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asl" id="asl" />
                        <Label htmlFor="asl">ASL (Américaine)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bsl" id="bsl" />
                        <Label htmlFor="bsl">BSL (Britannique)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lsq" id="lsq" />
                        <Label htmlFor="lsq">LSQ (Québécoise)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Contenu et filtres
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Filtres de produits accessibles</h4>
                      <Switch
                        checked={settings.accessibleProductFilter}
                        onCheckedChange={(checked) => updateSetting("accessibleProductFilter", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Permet de filtrer les produits et services adaptés aux personnes en situation de handicap.
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Filtres d'accessibilité</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="filter-mobility" />
                        <label htmlFor="filter-mobility" className="text-sm">
                          Mobilité réduite
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="filter-vision" />
                        <label htmlFor="filter-vision" className="text-sm">
                          Déficience visuelle
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="filter-hearing" />
                        <label htmlFor="filter-hearing" className="text-sm">
                          Déficience auditive
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="filter-cognitive" />
                        <label htmlFor="filter-cognitive" className="text-sm">
                          Troubles cognitifs
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="filter-sensory" />
                        <label htmlFor="filter-sensory" className="text-sm">
                          Hypersensibilité sensorielle
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Médias et sous-titres
                  </h3>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Options de sous-titres</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="caption-size" className="text-sm">
                          Taille des sous-titres
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Petit</span>
                          <Slider id="caption-size" defaultValue={[100]} min={75} max={200} step={25} />
                          <span className="text-xs">Grand</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="caption-bg" className="text-sm">
                          Arrière-plan des sous-titres
                        </Label>
                        <RadioGroup id="caption-bg" defaultValue="semi" className="grid grid-cols-3 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="bg-none" />
                            <Label htmlFor="bg-none">Aucun</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="semi" id="bg-semi" />
                            <Label htmlFor="bg-semi">Semi-transparent</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="bg-full" />
                            <Label htmlFor="bg-full">Opaque</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="transcription" defaultChecked />
                        <label htmlFor="transcription" className="text-sm">
                          Afficher les transcriptions quand disponibles
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Paiements et Services */}
            <TabsContent value="payments" className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Paiements simplifiés
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Processus de paiement simplifié</h4>
                      <Switch
                        checked={settings.simplifiedPayment}
                        onCheckedChange={(checked) => updateSetting("simplifiedPayment", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Simplifie le processus de paiement en réduisant les étapes et en évitant les captchas complexes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Moyens de paiement alternatifs</h4>
                      <Switch
                        checked={settings.alternativePayments}
                        onCheckedChange={(checked) => updateSetting("alternativePayments", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Propose des moyens de paiement alternatifs adaptés aux personnes non bancarisées.
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Méthodes de paiement préférées</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-card" defaultChecked />
                        <label htmlFor="payment-card" className="text-sm">
                          Carte bancaire
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-transfer" />
                        <label htmlFor="payment-transfer" className="text-sm">
                          Virement bancaire
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-paypal" />
                        <label htmlFor="payment-paypal" className="text-sm">
                          PayPal
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-mobile" />
                        <label htmlFor="payment-mobile" className="text-sm">
                          Paiement mobile
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-crypto" />
                        <label htmlFor="payment-crypto" className="text-sm">
                          Cryptomonnaies
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Service client inclusif
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Support client inclusif</h4>
                      <Switch
                        checked={settings.inclusiveSupport}
                        onCheckedChange={(checked) => updateSetting("inclusiveSupport", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active les options de support client adaptées à différents besoins (chat écrit, support vocal,
                      LSF).
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Préférences de contact</h4>
                    <RadioGroup defaultValue="chat" className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="chat" id="contact-chat" />
                        <Label htmlFor="contact-chat">Chat écrit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="voice" id="contact-voice" />
                        <Label htmlFor="contact-voice">Support vocal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="contact-video" />
                        <Label htmlFor="contact-video">Vidéo avec interprète LSF</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="contact-email" />
                        <Label htmlFor="contact-email">Email</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Délai de réponse préféré</h4>
                    <RadioGroup defaultValue="standard" className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="response-standard" />
                        <Label htmlFor="response-standard">Standard (24-48h)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="priority" id="response-priority" />
                        <Label htmlFor="response-priority">Prioritaire (2-4h)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="immediate" id="response-immediate" />
                        <Label htmlFor="response-immediate">Immédiat (assistance dédiée)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Expérience Vendeurs */}
            <TabsContent value="sellers" className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Dashboard vendeur
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Dashboard accessible</h4>
                      <Switch
                        checked={settings.accessibleDashboard}
                        onCheckedChange={(checked) => updateSetting("accessibleDashboard", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active une version simplifiée et accessible du dashboard vendeur.
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Préférences du dashboard</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dash-simplified" defaultChecked />
                        <label htmlFor="dash-simplified" className="text-sm">
                          Interface simplifiée
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dash-keyboard" defaultChecked />
                        <label htmlFor="dash-keyboard" className="text-sm">
                          Navigation clavier optimisée
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dash-voice" />
                        <label htmlFor="dash-voice" className="text-sm">
                          Commandes vocales
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dash-screen-reader" />
                        <label htmlFor="dash-screen-reader" className="text-sm">
                          Optimisé pour lecteur d'écran
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Braces className="h-5 w-5" />
                    Outils et descriptions
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Outils de description inclusive</h4>
                      <Switch
                        checked={settings.inclusiveDescriptionTools}
                        onCheckedChange={(checked) => updateSetting("inclusiveDescriptionTools", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active des outils pour créer des descriptions de produits inclusives et accessibles.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Label "Handi-friendly"</h4>
                      <Switch
                        checked={settings.accessibilityLabel}
                        onCheckedChange={(checked) => updateSetting("accessibilityLabel", checked)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Permet d'obtenir et d'afficher un label "Handi-friendly" pour les vendeurs respectant des critères
                      d'accessibilité.
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Critères d'accessibilité</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="criteria-desc" defaultChecked />
                        <label htmlFor="criteria-desc" className="text-sm">
                          Descriptions détaillées des produits
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="criteria-alt" defaultChecked />
                        <label htmlFor="criteria-alt" className="text-sm">
                          Textes alternatifs pour toutes les images
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="criteria-contact" defaultChecked />
                        <label htmlFor="criteria-contact" className="text-sm">
                          Multiples options de contact
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="criteria-training" />
                        <label htmlFor="criteria-training" className="text-sm">
                          Formation en accessibilité suivie
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="criteria-feedback" />
                        <label htmlFor="criteria-feedback" className="text-sm">
                          Retours positifs d'utilisateurs en situation de handicap
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Ressources et formation
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="text-sm font-medium mb-2">Guide d'accessibilité</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Guide complet pour rendre vos produits et services accessibles à tous.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Consulter le guide
                      </Button>
                    </div>

                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="text-sm font-medium mb-2">Formation en ligne</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Modules de formation sur l'accessibilité et l'inclusion.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Accéder aux formations
                      </Button>
                    </div>

                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="text-sm font-medium mb-2">Communauté d'entraide</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Échangez avec d'autres vendeurs sur les bonnes pratiques d'accessibilité.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Rejoindre la communauté
                      </Button>
                    </div>
                  </div>
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
