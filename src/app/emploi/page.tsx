import { ComingSoon } from "@/components/ComingSoon";
import { Sparkles } from "lucide-react";
export const metadata = { title: "Emploi & Opportunités · Spectrum For Us" };
export default function EmploiPage() {
  return (
    <ComingSoon
      icon={Sparkles}
      label="Emploi & Opportunités"
      title="Travaille avec des gens qui te respectent"
      subtitle="Offres d'emploi, missions freelance, appels à projets... Dans des structures inclusives et des entreprises LGBTQIA+ friendly."
      accent="#E0533A"
      features={["Offres d'emploi", "Missions freelance", "Appels à projets", "Entreprises inclusives", "Bénévolat"]}
      ctaLabel="Publier une offre"
      ctaHref="/vendeur/onboarding"
    />
  );
}
