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
import { Analytics } from "@/components/analytics"
import { PreloadResources } from "@/components/preload-resources"
import { Suspense } from "react"

// Optimisation du chargement des polices
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Spectrum | Une marketplace inclusive et diversifiée",
  description:
    "Une marketplace inclusive et diversifiée célébrant la communauté queer avec des produits uniques et créatifs.",
  keywords: "marketplace, inclusif, diversité, queer, LGBTQ+, créateurs, artisans, boutique en ligne",
  authors: [{ name: "Spectrum Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://spectrum-marketplace.vercel.app/",
    title: "Spectrum | Une marketplace inclusive et diversifiée",
    description:
      "Une marketplace inclusive et diversifiée célébrant la communauté queer avec des produits uniques et créatifs.",
    siteName: "Spectrum Marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectrum | Une marketplace inclusive et diversifiée",
    description:
      "Une marketplace inclusive et diversifiée célébrant la communauté queer avec des produits uniques et créatifs.",
  },
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.className}>
      <head>
        <link rel="icon" href="/images/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider>
            <LanguageRedirect />

            {/* --- TOUT est désormais sous Suspense --- */}
            <Suspense fallback={null}>
              <div className="flex flex-col min-h-screen">
                <Header />

                {/* zone de contenu des pages */}
                <main className="flex-grow pb-20 md:pb-0">{children}</main>

                <Footer />
                <LiveChat />
                <MobileNavigationBar />
                <Toaster />
                <PreloadResources />
              </div>
            </Suspense>
            {/* ----------------------------------------- */}
          </LocaleProvider>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}
