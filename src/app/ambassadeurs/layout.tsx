import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programme Ambassadeur·rice · Gagne 10% de commission",
  description: "Rejoins le programme ambassadeur·rice de Spectrum For Us. Partage ton lien unique et touche 10% de commission sur chaque vente générée.",
  openGraph: {
    title: "Programme Ambassadeur·rice · Spectrum For Us",
    description: "Gagne 10% de commission en partageant Spectrum For Us à ta communauté.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://spectrumforus.com/ambassadeurs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
