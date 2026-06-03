import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Politique de confidentialité — Spectrum For Us" };

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité">

      <h2>1. Qui sommes-nous ?</h2>
      <p>
        Spectrum For Us (spectrumforus.com) est le responsable du traitement de vos données personnelles,
        au sens du Règlement Général sur la Protection des Données (RGPD — UE 2016/679).
        Contact DPO : <a href="mailto:privacy@spectrumforus.com">privacy@spectrumforus.com</a>
      </p>

      <h2>2. Données collectées</h2>
      <h3>Lors de l'inscription</h3>
      <ul>
        <li>Adresse email</li>
        <li>Prénom, nom (optionnel)</li>
        <li>Pronoms (optionnel)</li>
        <li>Photo de profil (optionnel)</li>
        <li>Préférences de langue et devise</li>
      </ul>
      <h3>Lors des transactions</h3>
      <ul>
        <li>Adresse de livraison</li>
        <li>Données de paiement (traitées par Stripe, jamais stockées par nous)</li>
        <li>Historique des commandes</li>
      </ul>
      <h3>Données techniques</h3>
      <ul>
        <li>Adresse IP (anonymisée)</li>
        <li>Type de navigateur et appareil</li>
        <li>Pages visitées et durée des sessions</li>
        <li>Code de parrainage ambassadeur·rice (cookie 30 jours)</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <ul>
        <li><strong>Gestion du compte</strong> : authentification, personnalisation, préférences</li>
        <li><strong>Transactions</strong> : traitement des commandes, facturation, remboursements</li>
        <li><strong>Communication</strong> : newsletter (avec consentement), notifications transactionnelles</li>
        <li><strong>Sécurité</strong> : prévention de la fraude, protection de la plateforme</li>
        <li><strong>Amélioration du service</strong> : analytics anonymisés, tests A/B</li>
        <li><strong>Obligations légales</strong> : conformité fiscale et réglementaire</li>
      </ul>

      <h2>4. Base légale</h2>
      <ul>
        <li><strong>Exécution du contrat</strong> : pour les données nécessaires à la gestion des commandes</li>
        <li><strong>Consentement</strong> : pour la newsletter et les cookies non essentiels</li>
        <li><strong>Intérêt légitime</strong> : pour la sécurité et l'amélioration du service</li>
        <li><strong>Obligation légale</strong> : pour la facturation et la comptabilité</li>
      </ul>

      <h2>5. Conservation des données</h2>
      <ul>
        <li>Données de compte : pendant la durée du compte + 3 ans après la clôture</li>
        <li>Données de transaction : 10 ans (obligation comptable)</li>
        <li>Données de newsletter : jusqu'au désabonnement</li>
        <li>Données techniques : 13 mois maximum</li>
      </ul>

      <h2>6. Partage des données</h2>
      <p>Vos données peuvent être partagées avec :</p>
      <ul>
        <li><strong>Stripe</strong> : traitement des paiements (États-Unis, certifié PCI-DSS)</li>
        <li><strong>Supabase</strong> : hébergement de la base de données (Singapour, conforme RGPD)</li>
        <li><strong>Vercel</strong> : hébergement du site (États-Unis, Privacy Shield)</li>
      </ul>
      <p>
        Nous ne vendons jamais vos données à des tiers.
        Aucune donnée n'est partagée à des fins publicitaires sans votre consentement explicite.
      </p>

      <h2>7. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
        <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
        <li><strong>Droit à l'effacement</strong> : supprimer vos données ("droit à l'oubli")</li>
        <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format lisible</li>
        <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements</li>
        <li><strong>Droit à la limitation</strong> : restreindre le traitement de vos données</li>
      </ul>
      <p>
        Pour exercer ces droits : <a href="mailto:privacy@spectrumforus.com">privacy@spectrumforus.com</a>
        <br />Réponse garantie sous 30 jours. En cas de réclamation non résolue, vous pouvez saisir la{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
        chiffrement HTTPS/TLS, authentification sécurisée, accès restreint aux données sensibles,
        surveillance des accès inhabituels. En cas de violation de données, vous serez notifié·e
        dans les 72 heures si votre sécurité est compromise.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Notre politique relative aux cookies est détaillée dans notre{" "}
        <a href="/legal/cookies">Politique cookies</a>.
      </p>

      <h2>10. Modifications</h2>
      <p>
        Cette politique peut être mise à jour. En cas de modification substantielle,
        vous serez notifié·e par email. La version en vigueur est toujours accessible sur cette page.
      </p>
    </LegalPage>
  );
}
