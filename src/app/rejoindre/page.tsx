import { redirect } from "next/navigation";

// Plus de candidature avec validation manuelle : on passe au self-service.
// Toute personne qui voulait « rejoindre » est envoyée vers la page de création
// de boutique (« Ouvrir ma boutique »), dont le CTA crée la boutique directement.
export default function RejoindreRedirect() {
  redirect("/vendre");
}
