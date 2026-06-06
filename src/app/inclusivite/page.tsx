import { EditorialPage } from "@/components/EditorialPage";

export const metadata = {
  title: "Inclusivité - Spectrum For Us",
  description: "Notre engagement et notre charte d'inclusivité.",
};

export default function InclusivitePage() {
  return (
    <EditorialPage
      eyebrow="Notre engagement"
      title="Inclusivité"
      lead="Spectrum For Us est tenu par et pour les communautés queer. L'inclusivité n'est pas une option : c'est la raison d'être de la plateforme."
      sections={[
        { h: "Par et pour la communauté", p: [
          "Nous priorisons les créateur·ices, prestataires et associations LGBTQIA+, en particulier les personnes trans, intersexes, racisées et en situation de précarité.",
          "Chaque vendeur·se garde la maîtrise de son identité, de son langage et de sa visibilité.",
        ]},
        { h: "Charte d'inclusivité", p: [
          "Aucune tolérance pour les propos et comportements LGBTQIA+phobes, racistes, validistes, sexistes ou grossophobes.",
          "Un langage respectueux et non genré par défaut, des formulations inclusives dans toute l'interface.",
          "Une modération à l'écoute, des recours clairs et un droit de réponse pour les personnes concernées.",
        ]},
        { h: "Accessibilité comme priorité", p: [
          "L'inclusivité passe aussi par l'accessibilité technique : voir notre page dédiée pour le détail de nos engagements.",
          "Vous constatez un manquement ? Écrivez-nous à hello@spectrumforus.com, nous agissons.",
        ]},
      ]}
    />
  );
}
