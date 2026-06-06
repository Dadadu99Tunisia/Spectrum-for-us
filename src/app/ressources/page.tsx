import { ComingSoon } from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";
export const metadata = { title: "Ressources & Guides · Spectrum For Us" };
export default function RessourcesPage() {
  return (
    <ComingSoon
      icon={BookOpen}
      label="Ressources & Guides"
      title="L'info queer, accessible"
      subtitle="Guides trans, coming-out, PMA, droits, santé, famille... Des ressources fiables rédigées par et pour la communauté."
      accent="#F2B79E"
      features={["Guides trans", "Coming-out", "PMA & Famille", "Droits & Juridique", "Santé LGBTQIA+", "Parentalité"]}
      ctaLabel="Contribuer"
      ctaHref="/auth"
    />
  );
}
