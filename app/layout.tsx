import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { LocaleProvider } from "@/contexts/locale-context"
import LanguageRedirect from "./language-redirect"
import LiveChat from "@/components/live-chat"
import { MobileNavigationBar } from "@/components/mobile-navigation-bar"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Spectrum Marketplace | Plateforme Inclusive",
  description: "La marketplace #1 pour la communauté LGBTQ+ en France",
  keywords: [
    // Mots-clés principaux
    "marketplace queer",
    "boutique LGBTQ+",
    "mode inclusive",
    "créateurs queer",
    "produits inclusifs",
    "communauté LGBTQ",

    // Mots-clés longue traîne
    "acheter produits queer en ligne",
    "marketplace inclusive France",
    "boutique en ligne LGBTQ+ française",
    "créateurs artisans queer",
    "mode non-binaire",
    "bijoux inclusifs",
    "art queer français",

    // Mots-clés géographiques
    "marketplace queer Paris",
    "boutique LGBTQ+ Lyon",
    "créateurs queer Marseille",
    "produits inclusifs Toulouse",

    // Mots-clés de niche
    "drag queen accessoires",
    "pride merchandise",
    "rainbow fashion",
    "gender neutral clothing",
    "queer art prints",
    "LGBTQ+ home decor",
  ].join(", "),
  authors: [{ name: "Spectrum Team", url: "https://spectrum-marketplace.vercel.app" }],
  creator: "Spectrum Marketplace",
  publisher: "Spectrum For Us",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: "https://spectrum-marketplace.vercel.app/",
    title: "Spectrum Marketplace | Plateforme Inclusive",
    description: "La marketplace #1 pour la communauté LGBTQ+ en France",
    siteName: "Spectrum Marketplace",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spectrum Marketplace - Plateforme Queer & Inclusive",
      },
      {
        url: "/images/logo.png",
        width: 800,
        height: 400,
        alt: "Logo Spectrum Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@spectrumforus",
    creator: "@spectrumforus",
    title: "Spectrum Marketplace | Plateforme Inclusive",
    description: "La marketplace #1 pour la communauté LGBTQ+ en France",
    images: ["/images/og-image.jpg"],
  },
  verification: {
    google: "votre-code-google-search-console",
    yandex: "votre-code-yandex",
    yahoo: "votre-code-yahoo",
  },
  alternates: {
    canonical: "https://spectrum-marketplace.vercel.app/",
    languages: {
      "fr-FR": "https://spectrum-marketplace.vercel.app/",
      "en-US": "https://spectrum-marketplace.vercel.app/en",
    },
  },
  category: "E-commerce",
  classification: "Marketplace Inclusive",
  manifest: "/manifest.json",
  other: {
    "google-site-verification": "votre-code-verification-google",
    "msvalidate.01": "votre-code-bing",
    "facebook-domain-verification": "votre-code-facebook",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7c3aed" />

        {/* SEO Technique Avancé */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Spectrum Marketplace",
              alternateName: "Spectrum For Us",
              url: "https://spectrum-marketplace.vercel.app/",
              description: "La marketplace #1 pour la communauté LGBTQ+ en France",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://spectrum-marketplace.vercel.app/recherche?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              sameAs: [
                "https://www.facebook.com/profile.php?id=61565067524779",
                "https://www.instagram.com/spectrum.forus/",
                "https://www.tiktok.com/@spectrumforus",
                "https://www.pinterest.com/spectrumforus",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          <LocaleProvider>
            <LanguageRedirect />
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={null}>
                <Header />
              </Suspense>
              <Suspense fallback={null}>
                <main className="flex-grow pb-20 md:pb-0">{children}</main>
              </Suspense>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
              <Suspense fallback={null}>
                <LiveChat />
              </Suspense>
              <Suspense fallback={null}>
                <MobileNavigationBar />
              </Suspense>
              <Suspense fallback={null}>
                <Toaster />
              </Suspense>
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
