import { EditorialPage } from "@/components/EditorialPage";

export const metadata = {
  title: "Accessibilité - Spectrum For Us",
  description: "Notre déclaration d'accessibilité : un site pensé pour tout le monde.",
};

export default function AccessibilitePage() {
  return (
    <EditorialPage
      eyebrow="Aide & accessibilité"
      title="Accessibilité"
      lead="Spectrum For Us doit être utilisable par tout le monde, quelles que soient les capacités, le matériel ou le contexte. Voici nos engagements et comment nous joindre."
      sections={[
        { h: "Nos engagements", p: [
          "Navigation complète au clavier, focus visibles et structure de titres cohérente.",
          "Contrastes respectant les recommandations WCAG AA, textes redimensionnables sans perte de contenu.",
          "Alternatives textuelles sur les images informatives et libellés explicites sur les boutons et liens.",
        ]},
        { h: "Outils intégrés", p: [
          "Une barre d'accessibilité est disponible en bas de chaque page : taille du texte, contraste renforcé et réduction des animations.",
          "Le site s'adapte à la langue et à la devise choisies, sur ordinateur comme sur mobile.",
        ]},
        { h: "Un souci ? On corrige", p: [
          "Si une page vous bloque ou si une information n'est pas accessible, écrivez-nous : nous traitons chaque signalement en priorité.",
          "Contact : accessibilite@spectrumforus.com",
        ]},
      ]}
    />
  );
}
