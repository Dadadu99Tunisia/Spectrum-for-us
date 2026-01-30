import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import "./accessibility.css"
import EditorialHeader from "@/components/editorial-header"
import EditorialFooter from "@/components/editorial-footer"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { LocaleProvider } from "@/contexts/locale-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-serif",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Spectrum For Us - Community Marketplace",
    template: "%s | Spectrum",
  },
  description:
    "An avant-garde, community-driven marketplace celebrating queer creativity, artistry, and authentic expression. For Us, By Us.",
  keywords: ["marketplace", "LGBTQIA+", "queer", "art", "community", "creators"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://spectrum-marketplace.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Spectrum For Us - Community Marketplace",
    description: "An avant-garde marketplace celebrating queer creativity and authentic expression.",
    siteName: "Spectrum For Us",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <LocaleProvider>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <EditorialHeader />
                <main className="flex-1">{children}</main>
                <EditorialFooter />
              </div>
              <Toaster />
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
