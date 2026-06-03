import type { Metadata } from "next";
import { Fraunces, Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { PrismParticles } from "@/components/animations/PrismParticles";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { Suspense } from "react";
import { ReferralTracker } from "@/components/ReferralTracker";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "600", "700", "900"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spectrumforus.com"),
  title: {
    default: "Spectrum For Us — B(u)y us, for us.",
    template: "%s | Spectrum For Us",
  },
  description:
    "La première marketplace queer francophone. Créations, services et événements par et pour la communauté LGBTQIA+. Mode non-genrée, art, beauté, bien-être.",
  keywords: [
    "marketplace queer", "LGBTQIA+", "mode non-genrée", "artisans queer",
    "boutique inclusive", "communauté queer", "spectrum for us",
    "mode inclusive", "créateurs queer", "shop queer france",
  ],
  authors: [{ name: "Spectrum For Us", url: "https://spectrumforus.com" }],
  creator: "Spectrum For Us",
  publisher: "Spectrum For Us",
  openGraph: {
    title: "Spectrum For Us — B(u)y us, for us.",
    description: "La première marketplace queer francophone. Des créations faites avec amour, pour tout le spectre.",
    url: "https://spectrumforus.com",
    siteName: "Spectrum For Us",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spectrum For Us — B(u)y us, for us.",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectrum For Us — B(u)y us, for us.",
    description: "La première marketplace queer francophone.",
    images: ["/og-image.jpg"],
    creator: "@spectrumforus",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://spectrumforus.com",
    languages: {
      "fr-FR": "https://spectrumforus.com",
      "en-GB": "https://spectrumforus.com",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${bricolage.variable} ${hanken.variable} ${spaceMono.variable}`}
    >
      <body className="bg-[#1C0E29] text-[#F3EADB] antialiased cursor-none">
        <CustomCursor />
        <PrismParticles />
        <AuthProvider>
          <I18nProvider>
            <Suspense fallback={null}>
              <ReferralTracker />
            </Suspense>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
