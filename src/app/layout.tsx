import type { Metadata } from "next";
import { Fraunces, Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { PrismParticles } from "@/components/animations/PrismParticles";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";

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
  title: "Spectrum For Us — B(u)y us, for us.",
  description:
    "La première marketplace queer francophone. Créations, services et événements par et pour la communauté LGBTQIA+.",
  openGraph: {
    title: "Spectrum For Us",
    description: "B(u)y us, for us.",
    siteName: "Spectrum For Us",
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
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
