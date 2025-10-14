import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./accessibility.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MobileNavigationBar from "@/components/mobile-navigation-bar"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: "Spectrum - Marketplace Inclusif",
    template: "%s | Spectrum",
  },
  description:
    "Découvrez Spectrum, la première marketplace inclusive dédiée à la diversité et à l'inclusion. Trouvez des produits authentiques créés par et pour les communautés LGBTQIA+, les personnes en situation de handicap et tous ceux qui célèbrent la différence.",
  keywords: [
    "marketplace",
    "inclusif",
    "LGBTQIA+",
    "diversité",
    "inclusion",
    "produits éthiques",
    "commerce équitable",
  ],
  authors: [{ name: "Spectrum Team" }],
  creator: "Spectrum",
  publisher: "Spectrum",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://spectrum-marketplace.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "Spectrum - Marketplace Inclusif",
    description: "La première marketplace inclusive dédiée à la diversité et à l'inclusion.",
    siteName: "Spectrum",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spectrum Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectrum - Marketplace Inclusif",
    description: "La première marketplace inclusive dédiée à la diversité et à l'inclusion.",
    images: ["/og-image.jpg"],
  },
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileNavigationBar />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
