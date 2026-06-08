import { ComingSoon } from "@/components/ComingSoon";
import { Palette } from "lucide-react";
export const metadata = { title: "Art & Culture · Spectrum For Us" };
export default function ArtPage() {
  return (
    <ComingSoon
      icon={Palette}
      label="Art & Culture"
      title="L'art queer a sa scène"
      subtitle="Œuvres originales, tirages, illustrations, performances, zines, musique... La création queer dans toute sa diversité."
      accent="#7A2BF0"
      features={["Œuvres originales", "Tirages d'art", "Zines & Édition", "Performances", "Musique", "Art numérique"]}
      ctaLabel="Exposer mon œuvre"
      ctaHref="/vendeur/onboarding"
    />
  );
}
