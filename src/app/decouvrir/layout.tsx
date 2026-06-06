import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Découvrir les créations",
  description: "Explore des créations uniques de créateur·rice·s queer : mode non-genrée, art, beauté, accessoires, services et expériences. Filtre, cherche, soutiens la communauté.",
  openGraph: {
    title: "Découvrir les créations · Spectrum For Us",
    description: "Mode, art, beauté, services et expériences queer. Filtre par catégorie et soutiens les créateur·rice·s.",
    images: [{ url: "/og-decouvrir.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://spectrumforus.com/decouvrir" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
