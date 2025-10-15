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

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spectrum | Un marketplace inclusif et diversifié",
  description:
    "Un espace inclusif pour la communauté queer où l'expression, la créativité et la diversité sont célébrées.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider>
            <LanguageRedirect />
            <Header />
            {children}
            <Footer />
            <Toaster />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
