import { EditorialPage } from "@/components/EditorialPage";

export const metadata = {
  title: "Comment ça marche - Spectrum For Us",
  description: "Acheter, vendre et soutenir la communauté sur Spectrum For Us.",
};

export default function CommentCaMarchePage() {
  return (
    <EditorialPage
      eyebrow="Comment ça marche"
      title="Acheter, vendre, soutenir"
      scatterWord="soutenir"
      lead="Spectrum For Us réunit créations, prestataires, associations et événements queer au même endroit. Voici comment en profiter."
      sections={[
        { h: "Pour acheter", p: [
          "Parcourez la marketplace, les services et les événements. Filtrez par catégorie, ville ou pays.",
          "Ajoutez au panier et payez en toute sécurité via Stripe. Les prix s'affichent dans votre devise ; le paiement est traité en euros.",
          "Retrouvez vos favoris et vos commandes depuis votre compte.",
        ]},
        { h: "Pour vendre", p: [
          "Ouvrez votre boutique en quelques minutes : créez votre profil, ajoutez vos produits ou services et publiez.",
          "Commission réduite les premiers mois grâce au programme fondateur, et paiements reversés automatiquement.",
        ]},
        { h: "Pour les associations", p: [
          "Référencez gratuitement votre organisation dans l'annuaire LGBTQIA+ pour gagner en visibilité.",
          "Écrivez-nous à hello@spectrumforus.com pour être ajouté·e ou mettre à jour votre fiche.",
        ]},
      ]}
    />
  );
}
