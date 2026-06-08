import { ComingSoon } from "@/components/ComingSoon";
import { Users } from "lucide-react";
export const metadata = { title: "Communauté · Spectrum For Us" };
export default function CommunautePage() {
  return (
    <ComingSoon
      icon={Users}
      label="Communauté"
      title="Connecte-toi à ta communauté"
      scatterWord="communauté"
      subtitle="Associations, collectifs, groupes locaux, réseaux militants, activités sportives et culturelles. L'écosystème queer."
      accent="#FF2DA0"
      features={["Associations", "Collectifs artistiques", "Groupes locaux", "Réseaux militants", "Activités", "Entraide"]}
      ctaLabel="Rejoindre le mouvement"
      ctaHref="/auth"
    />
  );
}
