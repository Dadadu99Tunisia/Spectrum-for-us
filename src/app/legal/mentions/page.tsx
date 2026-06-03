import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Mentions légales — Spectrum For Us" };

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>spectrumforus.com</strong> est édité par <strong>Spectrum For Us</strong>,
        marketplace queer francophone.<br />
        Directeur de publication : <strong>Dada Azouz</strong>, CEO & co-fondateur·rice.<br />
        Email : <a href="mailto:hello@spectrumforus.com">hello@spectrumforus.com</a>
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par :<br />
        <strong>Vercel Inc.</strong><br />
        340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis<br />
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
      </p>
      <p>
        Base de données hébergée par :<br />
        <strong>Supabase Inc.</strong><br />
        970 Toa Payoh North, #07-04, Singapour 318992<br />
        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur ce site (textes, images, logos, design, charte graphique)
        sont la propriété exclusive de Spectrum For Us, sauf mention contraire.
        Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.
      </p>
      <p>
        Les contenus publiés par les vendeur·se·s (produits, photos, descriptions)
        restent la propriété de leurs auteur·rice·s. En les publiant sur la plateforme,
        ils·elles accordent à Spectrum For Us une licence d'affichage non exclusive.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Spectrum For Us s'efforce d'assurer l'exactitude des informations publiées
        mais ne peut garantir leur exhaustivité. Les vendeur·se·s sont seul·e·s
        responsables des produits et services qu'ils·elles proposent.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Le présent site est soumis au droit français. Tout litige relatif à son utilisation
        sera soumis aux tribunaux compétents français.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question : <a href="mailto:hello@spectrumforus.com">hello@spectrumforus.com</a>
      </p>
    </LegalPage>
  );
}
