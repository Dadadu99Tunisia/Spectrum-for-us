import { ComingSoon } from "@/components/ComingSoon";
import { Briefcase } from "lucide-react";
export const metadata = { title: "Services · Spectrum For Us" };
export default function ServicesPage() {
  return (
    <ComingSoon
      icon={Briefcase}
      label="Services"
      title={"Trouve le bon\nprofessionnel queer"}
      scatterWord="queer"
      subtitle="Coaching, thérapie, design, juridique, événementiel... Des professionnel·les engagé·es pour toi et ta communauté."
      accent="#FF2DA0"
      features={["Coaching & Psy", "Création & Freelance", "Événementiel", "Juridique & Admin", "Thérapie & Santé", "Formation"]}
      ctaLabel="Proposer mon service"
      ctaHref="/vendeur/onboarding"
    />
  );
}
