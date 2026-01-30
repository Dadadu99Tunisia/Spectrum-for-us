import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Nunito } from "next/font/google"

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"]
})
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AccessibilityWidget } from "@/components/accessibility-widget"
import { I18nProvider } from "@/lib/i18n/context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Spectrum For Us | B(u)y us, for us - Marketplace Queer & Inclusif",
  description:
    "B(u)y us, for us : découvrez Spectrum For Us, la marketplace queer où acheter mode non-genrée, art, bijoux, bien-être et culture créés par et pour la communauté LGBTQIA+. Soutenez des créateur·rice·s authentiques.",
  keywords: [
    "marketplace queer",
    "buy us for us",
    "b(u)y us for us",
    "LGBTQIA+",
    "produits inclusifs",
    "mode non-genrée",
    "commerce queer",
    "artisans queer",
    "communauté LGBTQIA+",
    "spectrum for us",
    "marketplace inclusive",
    "créateurs queer",
    "shopping éthique",
    "diversité",
  ],
  authors: [{ name: "Spectrum For Us" }],
  creator: "Spectrum For Us",
  publisher: "Spectrum For Us",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://spectrumforus.com"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
      "en-US": "/en",
    },
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
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Spectrum For Us",
    title: "Spectrum For Us | B(u)y us, for us - Marketplace Queer & Inclusif",
    description:
      "B(u)y us, for us : la marketplace queer où acheter mode, art, bijoux et culture créés par et pour la communauté LGBTQIA+. Soutenez des créateur·rice·s authentiques.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spectrum For Us - B(u)y us, for us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectrum For Us | B(u)y us, for us",
    description:
      "Marketplace queer inclusif - Mode, art, bijoux et culture par et pour la communauté LGBTQIA+. B(u)y us, for us.",
    images: ["/og-image.jpg"],
    creator: "@spectrumforus",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Spectrum For Us",
              alternateName: "B(u)y us, for us",
              url: "https://spectrumforus.com",
              description:
                "Marketplace queer inclusif où acheter des produits et services créés par et pour la communauté LGBTQIA+",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://spectrumforus.com/products?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Spectrum For Us",
              slogan: "B(u)y us, for us",
              url: "https://spectrumforus.com",
              logo: "https://spectrumforus.com/logo-spectrum.png",
              description:
                "Marketplace queer inclusif proposant mode, art, bijoux, bien-être et culture créés par et pour la communauté LGBTQIA+",
              sameAs: [
                "https://instagram.com/spectrumforus",
                "https://twitter.com/spectrumforus",
                "https://facebook.com/spectrumforus",
              ],
            }),
          }}
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${nunito.variable} font-sans antialiased flex flex-col min-h-screen bg-cream`}>
        <I18nProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
          <AccessibilityWidget />
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  )
}
