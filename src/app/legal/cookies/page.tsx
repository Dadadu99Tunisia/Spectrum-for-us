import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Politique cookies — Spectrum For Us" };

export default function Cookies() {
  return (
    <LegalPage title="Politique cookies">

      <h2>Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite.
        Il permet de mémoriser des informations pour améliorer votre expérience et le fonctionnement du site.
      </p>

      <h2>Cookies que nous utilisons</h2>

      <h3>Cookies essentiels (toujours actifs)</h3>
      <p>Indispensables au fonctionnement du site :</p>
      <ul>
        <li><strong>sb-auth-token</strong> — Session d'authentification Supabase (durée : session)</li>
        <li><strong>spectrum-cart</strong> — Contenu de votre panier (localStorage, 30 jours)</li>
        <li><strong>spectrum-locale</strong> — Langue préférée (localStorage, permanent)</li>
        <li><strong>spectrum-currency</strong> — Devise préférée (localStorage, permanent)</li>
      </ul>

      <h3>Cookies fonctionnels</h3>
      <ul>
        <li><strong>spectrum_ref</strong> — Code de parrainage ambassadeur·rice (30 jours)</li>
      </ul>

      <h3>Cookies analytiques (avec consentement)</h3>
      <p>
        Nous n'utilisons pas de cookies analytiques tiers (pas de Google Analytics, pas de Facebook Pixel).
        Les statistiques de visite sont calculées de façon anonyme côté serveur.
      </p>

      <h3>Cookies tiers</h3>
      <ul>
        <li>
          <strong>Stripe</strong> : lors du paiement, Stripe dépose des cookies nécessaires
          à la sécurité et à la prévention de la fraude.
          Voir la <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer">
          politique de Stripe</a>.
        </li>
      </ul>

      <h2>Gestion des cookies</h2>
      <p>
        Vous pouvez configurer votre navigateur pour refuser les cookies ou être alerté·e
        lorsqu'un cookie est déposé. Notez que certaines fonctionnalités du site
        (panier, connexion) ne fonctionneront pas sans les cookies essentiels.
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
        <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer">Firefox</a></li>
        <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Les cookies de session expirent à la fermeture du navigateur.
        Les autres cookies ont une durée maximale de 30 jours, sauf les préférences
        de langue et devise qui sont conservées indéfiniment dans le localStorage.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question sur notre utilisation des cookies :{" "}
        <a href="mailto:privacy@spectrumforus.com">privacy@spectrumforus.com</a>
      </p>
    </LegalPage>
  );
}
