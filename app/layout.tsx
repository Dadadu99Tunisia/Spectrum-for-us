import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AccessibilityWidget } from "@/components/accessibility-widget"
import { I18nProvider } from "@/lib/i18n/context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Spectrum For Us | B(u)y us, for us - Marketplace Queer Inclusif",
  description:
    "Spectrum For Us : la première marketplace queer où acheter des produits et services créés par et pour la communauté LGBTQIA+. Mode, art, bien-être, culture - b(u)y us, for us.",
  keywords: [
    "marketplace queer",
    "LGBTQIA+",
    "produits inclusifs",
    "commerce queer",
    "artisans queer",
    "mode non-genrée",
    "communauté LGBTQIA+",
    "buy us for us",
    "spectrum for us",
  ],
  authors: [{ name: "Spectrum For Us" }],
  creator: "Spectrum For Us",
  publisher: "Spectrum For Us",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://spectrumforus.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Spectrum For Us",
    title: "Spectrum For Us | B(u)y us, for us",
    description:
      "La première marketplace queer où acheter des produits et services créés par et pour la communauté LGBTQIA+. Mode, art, bien-être, culture.",
    images: [
      {
        url: "/logo-spectrum.png",
        width: 1200,
        height: 630,
        alt: "Spectrum For Us - B(u)y us, for us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectrum For Us | B(u)y us, for us",
    description: "Marketplace queer inclusif - Produits et services par et pour la communauté LGBTQIA+",
    images: ["/logo-spectrum.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/logo-spectrum.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
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
