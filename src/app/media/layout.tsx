import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Média Spectrum · Histoires, cultures et actualités queer",
  description: "Articles, guides, portraits et actualités de la communauté LGBTQIA+. Éditorial engagé, culture queer, mode inclusive.",
  openGraph: {
    title: "Média Spectrum For Us",
    description: "Histoires, modes de vie et actualités queer. Un média par et pour la communauté.",
    images: [{ url: "/og-media.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  alternates: { canonical: "https://spectrumforus.com/media" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
