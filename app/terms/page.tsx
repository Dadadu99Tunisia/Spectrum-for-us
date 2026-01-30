import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l'accueil
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Conditions Générales d'Utilisation</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          Dernière mise à jour :{" "}
          {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-8">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Ces Conditions Générales d'Utilisation sont conformes aux réglementations françaises et européennes,
            notamment le Code de la consommation, le Code civil, la Directive 2000/31/CE sur le commerce électronique et
            le Règlement Général sur la Protection des Données (RGPD).
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Préambule</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation du site web
          Spectrum, de l'application mobile et des services associés (collectivement, les "Services") exploités par
          Spectrum For Us, société immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456
          789, dont le siège social est situé au 123 Rue de la Diversité, 75001 Paris, France.
        </p>
        <p>
          En accédant ou en utilisant nos Services, vous reconnaissez avoir lu, compris et accepté d'être lié par ces
          CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Définitions</h2>
        <p>Dans les présentes CGU, les termes suivants ont la signification qui leur est attribuée ci-dessous :</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>"Utilisateur"</strong> : toute personne qui accède à ou utilise les Services, qu'elle soit inscrite
            ou non.
          </li>
          <li className="mb-2">
            <strong>"Compte"</strong> : l'espace personnel créé par l'Utilisateur sur les Services.
          </li>
          <li className="mb-2">
            <strong>"Contenu"</strong> : tous les textes, images, vidéos, sons, données, informations ou autres
            matériels publiés sur les Services.
          </li>
          <li className="mb-2">
            <strong>"Vendeur"</strong> : tout Utilisateur qui propose des produits ou services à la vente sur les
            Services.
          </li>
          <li className="mb-2">
            <strong>"Acheteur"</strong> : tout Utilisateur qui achète des produits ou services sur les Services.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Inscription et compte utilisateur</h2>
        <p>
          3.1. Pour accéder à certaines fonctionnalités de nos Services, vous devrez créer un compte. Lors de
          l'inscription, vous vous engagez à fournir des informations exactes, complètes et à jour.
        </p>
        <p>
          3.2. Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités
          qui se produisent sous votre compte. Vous vous engagez à nous informer immédiatement de toute utilisation non
          autorisée de votre compte ou de toute autre violation de sécurité.
        </p>
        <p>
          3.3. Nous nous réservons le droit de suspendre ou de résilier votre compte si nous avons des raisons de croire
          que vous avez enfreint ces CGU ou si votre compte présente un risque pour la sécurité de nos Services.
        </p>
        <p>
          3.4. Vous devez être âgé d'au moins 16 ans pour créer un compte. Si vous avez entre 16 et 18 ans, vous
          déclarez avoir obtenu le consentement de vos parents ou tuteurs légaux pour utiliser nos Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Utilisation des Services</h2>
        <p>
          4.1. Vous acceptez d'utiliser nos Services uniquement à des fins légales et conformément à ces CGU. Vous vous
          engagez à ne pas :
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Violer les lois ou réglementations applicables</li>
          <li className="mb-2">Enfreindre les droits de propriété intellectuelle ou autres droits de tiers</li>
          <li className="mb-2">Transmettre des virus, des logiciels malveillants ou tout autre code nuisible</li>
          <li className="mb-2">Interférer avec le fonctionnement normal des Services</li>
          <li className="mb-2">
            Collecter ou stocker des données personnelles d'autres utilisateurs sans leur consentement
          </li>
          <li className="mb-2">Usurper l'identité d'une personne ou d'une entité</li>
          <li className="mb-2">Publier du contenu diffamatoire, obscène, menaçant, discriminatoire ou illégal</li>
          <li className="mb-2">
            Utiliser des robots, spiders, scrapers ou autres moyens automatisés pour accéder à nos Services
          </li>
          <li className="mb-2">
            Tenter de contourner les mesures de sécurité ou d'accéder à des zones non publiques des Services
          </li>
        </ul>
        <p>
          4.2. Nous nous réservons le droit de surveiller votre utilisation des Services pour assurer le respect de ces
          CGU.
        </p>
        <p>
          4.3. Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie des Services à tout
          moment, avec ou sans préavis.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contenu utilisateur</h2>
        <p>
          5.1. Vous conservez tous les droits sur le contenu que vous soumettez, publiez ou affichez sur ou via nos
          Services. En soumettant du contenu, vous nous accordez une licence mondiale, non exclusive, libre de
          redevance, transférable et pouvant faire l'objet d'une sous-licence pour utiliser, reproduire, modifier,
          adapter, publier, traduire, distribuer et afficher ce contenu dans le cadre de nos Services et de leur
          promotion.
        </p>
        <p>5.2. Vous déclarez et garantissez que :</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            Vous possédez ou avez obtenu tous les droits nécessaires pour le contenu que vous publiez
          </li>
          <li className="mb-2">
            Le contenu ne viole pas les droits de tiers, y compris les droits de propriété intellectuelle et les droits
            à la vie privée
          </li>
          <li className="mb-2">
            Le contenu n'est pas illégal, obscène, diffamatoire, menaçant, intimidant, harcelant, haineux, racialement
            ou ethniquement offensant
          </li>
        </ul>
        <p>
          5.3. Nous nous réservons le droit de supprimer tout contenu qui viole ces CGU ou que nous jugeons inapproprié,
          sans préavis et à notre seule discrétion.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Transactions commerciales</h2>
        <p>
          6.1. Spectrum est une plateforme qui permet aux Vendeurs de proposer des produits et services aux Acheteurs.
          Spectrum n'est pas partie aux transactions entre les Vendeurs et les Acheteurs.
        </p>
        <p>
          6.2. Les Vendeurs sont responsables de la description, du prix, de la qualité et de la conformité des produits
          et services qu'ils proposent. Les Acheteurs sont responsables de vérifier ces informations avant d'effectuer
          un achat.
        </p>
        <p>
          6.3. Si vous effectuez un achat via nos Services, vous acceptez de fournir des informations de paiement
          exactes et complètes. Vous autorisez Spectrum et nos processeurs de paiement tiers à débiter votre méthode de
          paiement pour le montant total de votre achat, y compris les taxes et frais applicables.
        </p>
        <p>
          6.4. Les prix des produits sont indiqués en euros et incluent la TVA, sauf mention contraire. Les frais de
          livraison sont indiqués séparément avant la validation de la commande.
        </p>
        <p>
          6.5. Conformément à la législation française, les Acheteurs disposent d'un droit de rétractation de 14 jours à
          compter de la réception du produit, sans avoir à justifier de motifs ni à payer de pénalités. Ce droit ne
          s'applique pas dans certains cas prévus par la loi, notamment pour les produits personnalisés ou périssables.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Propriété intellectuelle</h2>
        <p>
          7.1. Nos Services et leur contenu original, fonctionnalités et fonctionnalités sont et resteront la propriété
          exclusive de Spectrum et de ses concédants de licence. Nos Services sont protégés par le droit d'auteur, les
          marques de commerce et d'autres lois en France et à l'étranger.
        </p>
        <p>7.2. Vous ne pouvez pas utiliser notre nom, logo ou marques sans notre consentement écrit préalable.</p>
        <p>
          7.3. Nous respectons les droits de propriété intellectuelle d'autrui. Si vous pensez que votre travail a été
          copié d'une manière qui constitue une violation du droit d'auteur, veuillez nous fournir les informations
          suivantes :
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            Une signature électronique ou physique du titulaire du droit d'auteur ou de la personne autorisée à agir en
            son nom
          </li>
          <li className="mb-2">
            Une description de l'œuvre protégée par le droit d'auteur que vous affirmez avoir été violée
          </li>
          <li className="mb-2">
            Une description de l'emplacement du matériel que vous affirmez être une violation sur les Services
          </li>
          <li className="mb-2">Vos coordonnées</li>
          <li className="mb-2">
            Une déclaration selon laquelle vous croyez de bonne foi que l'utilisation contestée n'est pas autorisée par
            le titulaire du droit d'auteur, son agent ou la loi
          </li>
          <li className="mb-2">
            Une déclaration, sous peine de parjure, que les informations ci-dessus sont exactes et que vous êtes le
            titulaire du droit d'auteur ou autorisé à agir en son nom
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Protection des données personnelles</h2>
        <p>
          8.1. La collecte et le traitement de vos données personnelles sont régis par notre Politique de
          Confidentialité, qui fait partie intégrante des présentes CGU. En utilisant nos Services, vous consentez à
          notre Politique de Confidentialité.
        </p>
        <p>
          8.2. Conformément au Règlement Général sur la Protection des Données (RGPD) et à la Loi Informatique et
          Libertés, vous disposez de droits concernant vos données personnelles, notamment les droits d'accès, de
          rectification, d'effacement, de limitation du traitement, de portabilité des données et d'opposition. Pour
          exercer ces droits, veuillez nous contacter à l'adresse indiquée dans la section "Nous contacter".
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation de responsabilité</h2>
        <p>
          9.1. Dans toute la mesure permise par la loi applicable, Spectrum ne sera pas responsable des dommages
          indirects, accessoires, spéciaux, consécutifs ou punitifs, ou de toute perte de profits ou de revenus, que ces
          dommages soient prévisibles ou non, et qu'ils découlent d'une action en responsabilité contractuelle,
          délictuelle ou autre.
        </p>
        <p>
          9.2. Notre responsabilité totale pour toute réclamation découlant de ou liée à ces CGU ne dépassera pas le
          montant que vous avez payé pour utiliser nos Services au cours des 12 mois précédant la réclamation.
        </p>
        <p>
          9.3. Les limitations de responsabilité ci-dessus ne s'appliquent pas à la responsabilité qui ne peut être
          exclue ou limitée en vertu de la loi applicable, comme la responsabilité pour fraude, faute intentionnelle ou
          négligence grave.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Indemnisation</h2>
        <p>
          Vous acceptez de défendre, d'indemniser et de dégager de toute responsabilité Spectrum et ses dirigeants,
          administrateurs, employés et agents contre toute réclamation, responsabilité, dommage, perte et dépense, y
          compris les frais juridiques raisonnables, découlant de ou liés à votre violation de ces CGU, à votre
          utilisation de nos Services ou à votre violation des droits d'un tiers.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Résiliation</h2>
        <p>
          11.1. Vous pouvez résilier votre compte à tout moment en nous contactant ou en utilisant la fonction de
          suppression de compte disponible dans les paramètres de votre compte.
        </p>
        <p>
          11.2. Nous nous réservons le droit de résilier ou de suspendre votre compte et votre accès à nos Services
          immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris, sans limitation, si
          vous enfreignez ces CGU.
        </p>
        <p>
          11.3. En cas de résiliation, les dispositions des présentes CGU qui, par leur nature, devraient survivre à la
          résiliation, survivront, y compris, sans limitation, les dispositions relatives à la propriété intellectuelle,
          aux garanties, à la limitation de responsabilité et à l'indemnisation.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Modifications des CGU</h2>
        <p>
          12.1. Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications entrent en vigueur dès
          leur publication sur cette page.
        </p>
        <p>
          12.2. Nous vous informerons des modifications importantes par e-mail ou par une notification sur notre site.
          Votre utilisation continue des Services après la publication des modifications constitue votre acceptation de
          ces modifications.
        </p>
        <p>12.3. Si vous n'acceptez pas les nouvelles conditions, vous devez cesser d'utiliser nos Services.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Dispositions générales</h2>
        <p>
          13.1. <strong>Loi applicable</strong> : Ces CGU sont régies et interprétées conformément aux lois françaises,
          sans égard aux principes de conflits de lois.
        </p>
        <p>
          13.2. <strong>Juridiction compétente</strong> : Tout litige découlant de ou lié à ces CGU sera soumis à la
          compétence exclusive des tribunaux de Paris, France, sauf disposition contraire de la loi applicable.
        </p>
        <p>
          13.3. <strong>Règlement des litiges</strong> : Conformément aux articles L.616-1 et R.616-1 du Code de la
          consommation, nous proposons un dispositif de médiation de la consommation. L'entité de médiation retenue est
          : [Nom et coordonnées du médiateur]. Vous pouvez également utiliser la plateforme de règlement en ligne des
          litiges (RLL) fournie par la Commission européenne à l'adresse http://ec.europa.eu/consumers/odr/.
        </p>
        <p>
          13.4. <strong>Intégralité de l'accord</strong> : Ces CGU constituent l'intégralité de l'accord entre vous et
          Spectrum concernant votre utilisation des Services et remplacent tous les accords antérieurs ou contemporains,
          communications et propositions, qu'ils soient oraux ou écrits, entre vous et Spectrum.
        </p>
        <p>
          13.5. <strong>Renonciation</strong> : Le fait que nous n'exercions pas ou n'appliquions pas un droit ou une
          disposition des présentes CGU ne constitue pas une renonciation à ce droit ou à cette disposition.
        </p>
        <p>
          13.6. <strong>Divisibilité</strong> : Si une disposition des présentes CGU est jugée invalide ou inapplicable,
          cette disposition sera limitée ou éliminée dans la mesure minimale nécessaire, et les dispositions restantes
          des présentes CGU resteront pleinement en vigueur.
        </p>
        <p>
          13.7. <strong>Cession</strong> : Vous ne pouvez pas céder ou transférer ces CGU, en tout ou en partie, sans
          notre consentement écrit préalable. Nous pouvons céder ou transférer ces CGU, en tout ou en partie, sans
          restriction.
        </p>
        <p>
          13.8. <strong>Force majeure</strong> : Nous ne serons pas responsables de tout retard ou manquement à nos
          obligations en vertu des présentes CGU résultant de causes indépendantes de notre volonté, y compris, mais
          sans s'y limiter, les catastrophes naturelles, les guerres, le terrorisme, les émeutes, les embargos, les
          actes des autorités civiles ou militaires, les incendies, les inondations, les accidents, les grèves ou les
          pénuries de moyens de transport, de carburant, d'énergie, de main-d'œuvre ou de matériaux.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">14. Nous contacter</h2>
        <p>Si vous avez des questions concernant ces CGU, veuillez nous contacter à :</p>
        <p className="mb-6">
          <strong>Email</strong> : contact@spectrumforus.com
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
