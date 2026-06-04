import { ComingSoon } from "@/components/ComingSoon";
import { MapPin } from "lucide-react";
export const metadata = { title: "Annuaire Queer-Friendly — Spectrum For Us" };
export default function AnnuairePage() {
  return (
    <ComingSoon
      icon={MapPin}
      label="Annuaire"
      title="Les adresses qui nous accueillent"
      subtitle="Commerces, restos, bars, cafés, galeries, prestataires... Un annuaire des espaces queer-friendly construits ensemble."
      accent="#E0901E"
      features={["Restaurants", "Bars & Cafés", "Librairies", "Galeries", "Commerces", "Prestataires", "Coworking"]}
      ctaLabel="Référencer mon adresse"
      ctaHref="/vendeur/onboarding"
    />
  );
}
