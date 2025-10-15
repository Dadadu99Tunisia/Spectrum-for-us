"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Currency = {
  code: string
  symbol: string
  name: string
}

type Language = {
  code: string
  name: string
  flag: string
}

export const currencies: Currency[] = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "Dollar américain" },
  { code: "GBP", symbol: "£", name: "Livre sterling" },
  { code: "CAD", symbol: "C$", name: "Dollar canadien" },
  { code: "CHF", symbol: "CHF", name: "Franc suisse" },
]

export const languages: Language[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
]

// Ajouter les traductions
export type Translations = {
  [key: string]: string
}

export type TranslationsSet = {
  [locale: string]: Translations
}

type LocaleContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(currencies[0])
  const [language, setLanguage] = useState<Language>(languages[0])
  const [translations, setTranslations] = useState<TranslationsSet>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Fonction de traduction
  const t = (key: string): string => {
    if (!isLoaded || !translations[language.code]) {
      return key
    }
    return translations[language.code][key] || translations["fr"][key] || key
  }

  // Charger les traductions
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Dans une application réelle, ces traductions seraient chargées depuis des fichiers JSON
        const translationsData: TranslationsSet = {
          fr: {
            // Navigation
            home: "Accueil",
            categories: "Catégories",
            new_arrivals: "Nouveautés",
            sellers: "Vendeurs",
            about: "À Propos",
            search: "Rechercher...",

            // Catégories
            clothing: "Vêtements",
            jewelry: "Bijoux",
            art: "Art",
            beauty: "Beauté",
            home_decor: "Décoration",
            books: "Livres",
            accessories: "Accessoires",
            craft: "Artisanat",
            view_all_categories: "Voir toutes les catégories",

            // Actions utilisateur
            favorites: "Favoris",
            cart: "Panier",
            login: "Connexion",
            register: "Inscription",
            become_seller: "Devenir Vendeur",
            sell: "Vendre",
            light_mode: "Mode clair",
            dark_mode: "Mode sombre",

            // Autres
            close_menu: "Fermer le menu",
            open_menu: "Ouvrir le menu",
          },
          en: {
            // Navigation
            home: "Home",
            categories: "Categories",
            new_arrivals: "New Arrivals",
            sellers: "Sellers",
            about: "About",
            search: "Search...",

            // Catégories
            clothing: "Clothing",
            jewelry: "Jewelry",
            art: "Art",
            beauty: "Beauty",
            home_decor: "Home Decor",
            books: "Books",
            accessories: "Accessories",
            craft: "Craft",
            view_all_categories: "View all categories",

            // Actions utilisateur
            favorites: "Favorites",
            cart: "Cart",
            login: "Login",
            register: "Register",
            become_seller: "Become a Seller",
            sell: "Sell",
            light_mode: "Light Mode",
            dark_mode: "Dark Mode",

            // Autres
            close_menu: "Close menu",
            open_menu: "Open menu",
          },
          es: {
            // Navigation
            home: "Inicio",
            categories: "Categorías",
            new_arrivals: "Novedades",
            sellers: "Vendedores",
            about: "Acerca de",
            search: "Buscar...",

            // Catégories
            clothing: "Ropa",
            jewelry: "Joyería",
            art: "Arte",
            beauty: "Belleza",
            home_decor: "Decoración",
            books: "Libros",
            accessories: "Accesorios",
            craft: "Artesanía",
            view_all_categories: "Ver todas las categorías",

            // Actions utilisateur
            favorites: "Favoritos",
            cart: "Carrito",
            login: "Iniciar sesión",
            register: "Registrarse",
            become_seller: "Convertirse en vendedor",
            sell: "Vender",
            light_mode: "Modo claro",
            dark_mode: "Modo oscuro",

            // Autres
            close_menu: "Cerrar menú",
            open_menu: "Abrir menú",
          },
          de: {
            // Navigation
            home: "Startseite",
            categories: "Kategorien",
            new_arrivals: "Neuheiten",
            sellers: "Verkäufer",
            about: "Über uns",
            search: "Suchen...",

            // Catégories
            clothing: "Kleidung",
            jewelry: "Schmuck",
            art: "Kunst",
            beauty: "Schönheit",
            home_decor: "Dekoration",
            books: "Bücher",
            accessories: "Accessoires",
            craft: "Handwerk",
            view_all_categories: "Alle Kategorien anzeigen",

            // Actions utilisateur
            favorites: "Favoriten",
            cart: "Warenkorb",
            login: "Anmelden",
            register: "Registrieren",
            become_seller: "Verkäufer werden",
            sell: "Verkaufen",
            light_mode: "Heller Modus",
            dark_mode: "Dunkler Modus",

            // Autres
            close_menu: "Menü schließen",
            open_menu: "Menü öffnen",
          },
          it: {
            // Navigation
            home: "Home",
            categories: "Categorie",
            new_arrivals: "Novità",
            sellers: "Venditori",
            about: "Chi siamo",
            search: "Cerca...",

            // Catégories
            clothing: "Abbigliamento",
            jewelry: "Gioielli",
            art: "Arte",
            beauty: "Bellezza",
            home_decor: "Decorazione",
            books: "Libri",
            accessories: "Accessori",
            craft: "Artigianato",
            view_all_categories: "Vedi tutte le categorie",

            // Actions utilisateur
            favorites: "Preferiti",
            cart: "Carrello",
            login: "Accedi",
            register: "Registrati",
            become_seller: "Diventa venditore",
            sell: "Vendi",
            light_mode: "Modalità chiara",
            dark_mode: "Modalità scura",

            // Autres
            close_menu: "Chiudi menu",
            open_menu: "Apri menu",
          },
        }

        setTranslations(translationsData)
        setIsLoaded(true)
      } catch (error) {
        console.error("Erreur lors du chargement des traductions:", error)
      }
    }

    loadTranslations()
  }, [])

  // Charger les préférences depuis localStorage au chargement
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency")
    const savedLanguage = localStorage.getItem("language")

    if (savedCurrency) {
      const foundCurrency = currencies.find((c) => c.code === savedCurrency)
      if (foundCurrency) setCurrency(foundCurrency)
    }

    if (savedLanguage) {
      const foundLanguage = languages.find((l) => l.code === savedLanguage)
      if (foundLanguage) setLanguage(foundLanguage)
    }
  }, [])

  // Sauvegarder les préférences dans localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem("currency", currency.code)
  }, [currency])

  useEffect(() => {
    localStorage.setItem("language", language.code)
    // Changer la langue de l'interface
    document.documentElement.lang = language.code

    // Mettre à jour le titre de la page selon la langue
    if (isLoaded && translations[language.code]) {
      const siteName = "Spectrum"
      let title = ""

      switch (language.code) {
        case "en":
          title = `${siteName} | An inclusive and diverse marketplace`
          break
        case "es":
          title = `${siteName} | Un mercado inclusivo y diverso`
          break
        case "de":
          title = `${siteName} | Ein inklusiver und vielfältiger Marktplatz`
          break
        case "it":
          title = `${siteName} | Un mercato inclusivo e diversificato`
          break
        default:
          title = `${siteName} | Un marketplace inclusif et diversifié`
      }

      document.title = title
    }
  }, [language, isLoaded, translations])

  return (
    <LocaleContext.Provider value={{ currency, setCurrency, language, setLanguage, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
