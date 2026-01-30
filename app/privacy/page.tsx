import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l'accueil
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Politique de Confidentialité</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          Dernière mise à jour :{" "}
          {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-8">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Cette politique de confidentialité est conforme au Règlement Général sur la Protection des Données (RGPD) de
            l'Union Européenne, à la Loi Informatique et Libertés française, ainsi qu'aux principales réglementations
            internationales sur la protection des données.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Chez Spectrum, nous accordons une grande importance à la protection de vos données personnelles. Cette
          politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos
          informations lorsque vous utilisez notre site web et nos services.
        </p>
        <p>
          Spectrum, dont le siège social est situé au 123 Rue de la Diversité, 75001 Paris, France, agit en tant que
          responsable du traitement de vos données personnelles.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Définitions</h2>
        <p>Aux fins de cette politique de confidentialité :</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Données personnelles</strong> : toute information se rapportant à une personne physique identifiée
            ou identifiable.
          </li>
          <li className="mb-2">
            <strong>Traitement</strong> : toute opération effectuée sur des données personnelles, telle que la collecte,
            l'enregistrement, l'organisation, la structuration, la conservation, l'adaptation ou la modification,
            l'extraction, la consultation, l'utilisation, la communication, la diffusion, l'effacement ou la
            destruction.
          </li>
          <li className="mb-2">
            <strong>Responsable du traitement</strong> : la personne physique ou morale qui détermine les finalités et
            les moyens du traitement des données personnelles.
          </li>
          <li className="mb-2">
            <strong>Sous-traitant</strong> : la personne physique ou morale qui traite des données personnelles pour le
            compte du responsable du traitement.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Informations que nous collectons</h2>
        <p>Nous collectons les types d'informations suivants :</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Informations personnelles</strong> : nom, adresse e-mail, numéro de téléphone, adresse postale,
            informations de paiement lorsque vous créez un compte, effectuez un achat ou utilisez nos services.
          </li>
          <li className="mb-2">
            <strong>Informations d'utilisation</strong> : données sur la façon dont vous interagissez avec notre site, y
            compris les pages visitées, les produits consultés, le temps passé sur le site, et d'autres statistiques.
          </li>
          <li className="mb-2">
            <strong>Informations de l'appareil</strong> : type d'appareil, système d'exploitation, type de navigateur,
            adresse IP, et identifiants uniques de l'appareil.
          </li>
          <li className="mb-2">
            <strong>Données de localisation</strong> : informations sur votre localisation géographique approximative
            basées sur votre adresse IP ou, avec votre consentement explicite, votre localisation précise via GPS.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Base légale du traitement</h2>
        <p>Nous traitons vos données personnelles sur les bases légales suivantes :</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Exécution d'un contrat</strong> : lorsque le traitement est nécessaire à l'exécution d'un contrat
            auquel vous êtes partie ou à l'exécution de mesures précontractuelles prises à votre demande.
          </li>
          <li className="mb-2">
            <strong>Consentement</strong> : lorsque vous avez donné votre consentement explicite au traitement de vos
            données personnelles pour une ou plusieurs finalités spécifiques.
          </li>
          <li className="mb-2">
            <strong>Intérêts légitimes</strong> : lorsque le traitement est nécessaire aux fins des intérêts légitimes
            poursuivis par nous ou par un tiers, à moins que ne prévalent vos intérêts ou vos libertés et droits
            fondamentaux.
          </li>
          <li className="mb-2">
            <strong>Obligation légale</strong> : lorsque le traitement est nécessaire au respect d'une obligation légale
            à laquelle nous sommes soumis.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Finalités du traitement</h2>
        <p>Nous utilisons vos informations pour :</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Fournir, maintenir et améliorer nos services</li>
          <li className="mb-2">Traiter vos transactions et gérer votre compte</li>
          <li className="mb-2">
            Communiquer avec vous concernant votre compte, nos services, promotions et événements
          </li>
          <li className="mb-2">Personnaliser votre expérience et vous proposer des contenus et produits adaptés</li>
          <li className="mb-2">Détecter, prévenir et résoudre les problèmes techniques ou de sécurité</li>
          <li className="mb-2">Respecter nos obligations légales</li>
          <li className="mb-2">
            Analyser et améliorer nos services et développer de nouveaux produits et fonctionnalités
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Durée de conservation des données</h2>
        <p>
          Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les finalités pour
          lesquelles elles ont été collectées, y compris pour satisfaire à toute exigence légale, comptable ou de
          déclaration.
        </p>
        <p>
          Pour déterminer la période de conservation appropriée, nous prenons en compte la quantité, la nature et la
          sensibilité des données personnelles, le risque potentiel de préjudice résultant d'une utilisation ou d'une
          divulgation non autorisée, les finalités pour lesquelles nous traitons vos données personnelles et si nous
          pouvons atteindre ces finalités par d'autres moyens.
        </p>
        <p>Périodes de conservation spécifiques :</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Données de compte</strong> : conservées tant que votre compte est actif. Après la fermeture du
            compte, certaines données peuvent être conservées pendant une période supplémentaire pour des raisons
            légales ou administratives.
          </li>
          <li className="mb-2">
            <strong>Données de transaction</strong> : conservées pendant 10 ans conformément aux obligations légales en
            matière fiscale et comptable.
          </li>
          <li className="mb-2">
            <strong>Données de communication</strong> : conservées pendant 3 ans à compter de votre dernière interaction
            avec nous.
          </li>
          <li className="mb-2">
            <strong>Cookies et données d'analyse</strong> : conservées pendant une période maximale de 13 mois.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Partage de vos informations</h2>
        <p>
          Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations dans les circonstances
          suivantes :
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Avec les vendeurs</strong> : pour faciliter les transactions et la livraison des produits que vous
            achetez.
          </li>
          <li className="mb-2">
            <strong>Avec nos prestataires de services</strong> : qui nous aident à fournir nos services (traitement des
            paiements, hébergement, analyse de données, service client).
          </li>
          <li className="mb-2">
            <strong>Pour des raisons légales</strong> : si nous sommes tenus de le faire par la loi ou en réponse à des
            demandes légales valides.
          </li>
          <li className="mb-2">
            <strong>En cas de réorganisation d'entreprise</strong> : en cas de fusion, acquisition ou vente d'actifs.
          </li>
        </ul>
        <p>
          Tous nos prestataires de services sont tenus de respecter la confidentialité et la sécurité de vos données
          personnelles et de les traiter conformément à la loi applicable.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Transferts internationaux de données</h2>
        <p>
          Vos données personnelles peuvent être transférées et traitées dans des pays autres que celui dans lequel vous
          résidez. Ces pays peuvent avoir des lois sur la protection des données différentes de celles de votre pays.
        </p>
        <p>
          Lorsque nous transférons vos données personnelles en dehors de l'Espace Économique Européen (EEE), nous nous
          assurons qu'un niveau de protection similaire leur est accordé en veillant à ce qu'au moins l'une des
          garanties suivantes soit mise en œuvre :
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            Transfert vers des pays reconnus par la Commission européenne comme assurant un niveau de protection adéquat
            des données personnelles.
          </li>
          <li className="mb-2">Utilisation de clauses contractuelles types approuvées par la Commission européenne.</li>
          <li className="mb-2">
            Mise en œuvre de règles d'entreprise contraignantes pour les transferts entre entités d'un même groupe.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos
          données personnelles contre la perte accidentelle, l'accès non autorisé, l'altération ou la divulgation. Ces
          mesures comprennent :
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Le chiffrement des données sensibles</li>
          <li className="mb-2">La mise en œuvre de contrôles d'accès stricts</li>
          <li className="mb-2">Des audits de sécurité réguliers</li>
          <li className="mb-2">
            La formation de notre personnel aux bonnes pratiques en matière de protection des données
          </li>
          <li className="mb-2">Des procédures de gestion des incidents de sécurité</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Notification des violations de données</h2>
        <p>
          En cas de violation de données susceptible d'entraîner un risque élevé pour vos droits et libertés, nous vous
          en informerons dans les meilleurs délais, conformément à nos obligations légales. Nous notifierons également
          l'autorité de contrôle compétente (la CNIL en France) dans les 72 heures suivant la découverte de la
          violation, sauf si celle-ci n'est pas susceptible d'engendrer un risque pour vos droits et libertés.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Vos droits en matière de protection des données</h2>
        <p>
          Conformément au RGPD et aux lois applicables sur la protection des données, vous disposez des droits suivants
          :
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Droit d'accès</strong> : vous avez le droit d'obtenir la confirmation que vos données personnelles
            sont traitées et d'accéder à ces données.
          </li>
          <li className="mb-2">
            <strong>Droit de rectification</strong> : vous avez le droit de faire rectifier les données personnelles
            inexactes vous concernant et de faire compléter les données personnelles incomplètes.
          </li>
          <li className="mb-2">
            <strong>Droit à l'effacement (droit à l'oubli)</strong> : vous avez le droit d'obtenir l'effacement de vos
            données personnelles dans certaines circonstances.
          </li>
          <li className="mb-2">
            <strong>Droit à la limitation du traitement</strong> : vous avez le droit d'obtenir la limitation du
            traitement de vos données personnelles dans certaines circonstances.
          </li>
          <li className="mb-2">
            <strong>Droit à la portabilité des données</strong> : vous avez le droit de recevoir les données
            personnelles vous concernant dans un format structuré, couramment utilisé et lisible par machine, et de les
            transmettre à un autre responsable du traitement.
          </li>
          <li className="mb-2">
            <strong>Droit d'opposition</strong> : vous avez le droit de vous opposer au traitement de vos données
            personnelles dans certaines circonstances, notamment lorsque nous traitons vos données sur la base de nos
            intérêts légitimes ou à des fins de marketing direct.
          </li>
          <li className="mb-2">
            <strong>Droit de retirer votre consentement</strong> : lorsque le traitement est fondé sur votre
            consentement, vous avez le droit de retirer ce consentement à tout moment.
          </li>
          <li className="mb-2">
            <strong>
              Droit de ne pas faire l'objet d'une décision fondée exclusivement sur un traitement automatisé
            </strong>{" "}
            : vous avez le droit de ne pas faire l'objet d'une décision fondée exclusivement sur un traitement
            automatisé, y compris le profilage, produisant des effets juridiques vous concernant ou vous affectant de
            manière significative.
          </li>
        </ul>
        <p>
          Pour exercer ces droits, veuillez nous contacter à l'adresse indiquée dans la section "Nous contacter"
          ci-dessous. Nous répondrons à votre demande dans un délai d'un mois, qui peut être prolongé de deux mois
          supplémentaires si nécessaire, compte tenu de la complexité et du nombre de demandes.
        </p>
        <p>
          Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le
          droit d'introduire une réclamation auprès d'une autorité de contrôle, notamment dans l'État membre de votre
          résidence habituelle, de votre lieu de travail ou du lieu où la violation aurait été commise. En France,
          l'autorité de contrôle est la Commission Nationale de l'Informatique et des Libertés (CNIL) - www.cnil.fr.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Cookies et technologies similaires</h2>
        <p>
          Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site,
          analyser comment vous utilisez notre site, et personnaliser notre offre.
        </p>
        <p>Types de cookies que nous utilisons :</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Cookies strictement nécessaires</strong> : essentiels au fonctionnement du site.
          </li>
          <li className="mb-2">
            <strong>Cookies de performance</strong> : collectent des informations anonymes sur la façon dont les
            visiteurs utilisent notre site.
          </li>
          <li className="mb-2">
            <strong>Cookies de fonctionnalité</strong> : permettent au site de se souvenir des choix que vous faites.
          </li>
          <li className="mb-2">
            <strong>Cookies de ciblage</strong> : enregistrent votre visite sur notre site, les pages que vous avez
            visitées et les liens que vous avez suivis pour vous proposer des publicités plus pertinentes.
          </li>
        </ul>
        <p>
          Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour indiquer quand un cookie est
          envoyé. Cependant, certaines fonctionnalités de notre site peuvent ne pas fonctionner correctement si vous
          désactivez les cookies.
        </p>
        <p>
          Lors de votre première visite sur notre site, nous vous demanderons votre consentement pour l'utilisation de
          cookies non essentiels. Vous pouvez modifier vos préférences à tout moment en accédant aux paramètres des
          cookies sur notre site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Protection des données des mineurs</h2>
        <p>
          Nos services ne s'adressent pas aux personnes âgées de moins de 16 ans, et nous ne collectons pas sciemment
          des données personnelles auprès de personnes de moins de 16 ans. Si vous êtes un parent ou un tuteur et que
          vous savez que votre enfant nous a fourni des données personnelles, veuillez nous contacter. Si nous apprenons
          que nous avons collecté des données personnelles auprès d'un mineur sans vérification du consentement
          parental, nous prenons des mesures pour supprimer ces informations de nos serveurs.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">14. Modifications de cette politique</h2>
        <p>
          Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout
          changement important en publiant la nouvelle politique sur cette page et en mettant à jour la date de
          "dernière mise à jour". Si les modifications sont significatives, nous vous fournirons une notification plus
          visible, comme un e-mail ou une notification sur notre site.
        </p>
        <p>
          Nous vous encourageons à consulter régulièrement cette politique pour rester informé de la façon dont nous
          protégeons vos informations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">15. Délégué à la protection des données</h2>
        <p>
          Nous avons nommé un Délégué à la Protection des Données (DPO) qui est responsable de superviser les questions
          relatives à cette politique de confidentialité. Si vous avez des questions sur cette politique ou sur la façon
          dont nous traitons vos données personnelles, veuillez contacter notre DPO à l'adresse suivante :
        </p>
        <p className="mb-6">
          <strong>Email</strong> : dpo@spectrumforus.com
          <br />
          <strong>Adresse</strong> : Délégué à la Protection des Données, Spectrum For Us, 123 Rue de la Diversité,
          75001 Paris, France
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">16. Nous contacter</h2>
        <p>
          Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de
          protection des données, veuillez nous contacter à :
        </p>
        <p className="mb-6">
          <strong>Email</strong> : privacy@spectrumforus.com
          <br />
          <strong>Adresse</strong> : Spectrum For Us, 123 Rue de la Diversité, 75001 Paris, France
          <br />
          <strong>Téléphone</strong> : +33 1 23 45 67 89
        </p>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Spectrum. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}
