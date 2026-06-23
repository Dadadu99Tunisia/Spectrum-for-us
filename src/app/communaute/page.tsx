"use client";

import { ComingSoon } from "@/components/ComingSoon";
import { useI18n } from "@/contexts/I18nContext";

const CONTENT = {
  fr: {
    label: "Communauté",
    title: "Connecte-toi à ta communauté",
    scatterWord: "communauté",
    subtitle: "Associations, collectifs, groupes locaux, réseaux militants, activités sportives et culturelles. L'écosystème queer.",
    features: ["Associations", "Collectifs artistiques", "Groupes locaux", "Réseaux militants", "Activités", "Entraide"],
    ctaLabel: "Rejoindre le mouvement",
  },
  en: {
    label: "Community",
    title: "Connect with your community",
    scatterWord: "community",
    subtitle: "Associations, collectives, local groups, activist networks, sports and cultural activities. The queer ecosystem.",
    features: ["Associations", "Art collectives", "Local groups", "Activist networks", "Activities", "Mutual aid"],
    ctaLabel: "Join the movement",
  },
} as const;

export default function CommunautePage() {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  return (
    <ComingSoon
      icon="Users"
      label={C.label}
      title={C.title}
      scatterWord={C.scatterWord}
      subtitle={C.subtitle}
      accent="#FF2DA0"
      features={[...C.features]}
      ctaLabel={C.ctaLabel}
      ctaHref="/auth"
    />
  );
}
