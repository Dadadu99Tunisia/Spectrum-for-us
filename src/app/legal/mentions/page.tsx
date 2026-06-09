import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Mentions légales · Spectrum For Us" };

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>spectrumforus.com</strong> (« Spectrum For Us ») est édité par :<br />
        <strong>Aïcha Chennaoui</strong> — Entrepreneur individuel (auto-entreprise)<br />
        SIREN : 894 102 912 · SIRET (siège) : 894 102 912 00017<br />
        Code APE/NAF : 7021Z (conseil en relations publiques et communication)<br />
        TVA non applicable, art. 293 B du CGI (franchise en base de TVA)<br />
        N° TVA intracommunautaire : FR49894102912<br />
        Adresse du siège : <strong>61 rue Lautréamont, 93300 Aubervilliers</strong><br />
        Directrice de la publication : <strong>Aïcha Chennaoui</strong><br />
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
