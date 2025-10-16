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
  title: "Spectrum for Us - B(u)y us, for us",
  description:
    "A vibrant queer-owned marketplace offering products and services, created by and for the LGBTQIA+ community.",
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
