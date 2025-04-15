export interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
  description?: string
  icon?: string
}

export interface Subcategory {
  id: string
  name: string
  description?: string
}

// Liste complète des catégories et sous-catégories inclusives
export const categories = [
  {
    id: "vetements-mode",
    name: "Vêtements & Mode",
    description: "Vêtements et accessoires de mode inclusifs pour toustes",
    icon: "Shirt",
    subcategories: [
      {
        id: "vetements-non-genres",
        name: "Vêtements non genrés",
        description: "T-shirts, pantalons, robes, vestes, pulls pour toustes",
      },
      {
        id: "sous-vetements-affirmation",
        name: "Sous-vêtements d'affirmation",
        description: "Binders, tucking, packers, gaffs et autres sous-vêtements d'affirmation",
      },
      {
        id: "lingerie-inclusive",
        name: "Lingerie inclusive",
        description: "Lingerie neutre, boxers menstruels et vêtements intimes pour toustes",
      },
      {
        id: "vetements-grande-taille",
        name: "Grandes tailles",
        description: "Vêtements stylés en grandes tailles pour toustes",
      },
      {
        id: "vetements-petite-taille",
        name: "Petites tailles",
        description: "Vêtements adaptés aux personnes de petite taille",
      },
      {
        id: "vetements-post-op",
        name: "Vêtements post-opératoires",
        description: "Vêtements adaptés après chirurgie d'affirmation de genre",
      },
      {
        id: "vetements-adaptes-pmr",
        name: "Vêtements adaptés PMR",
        description: "Vêtements faciles à enfiler avec fermetures adaptées",
      },
      {
        id: "costumes-performance",
        name: "Costumes & Performance",
        description: "Drag, voguing, ballroom et autres costumes de performance",
      },
      {
        id: "vetements-sport-inclusifs",
        name: "Vêtements de sport inclusifs",
        description: "Tenues de sport adaptées à toustes les corps",
      },
      {
        id: "vetements-grossesse-allaitement",
        name: "Grossesse & Allaitement",
        description: "Vêtements adaptés pour toustes les personnes enceintes et allaitantes",
      },
    ],
  },
  {
    id: "chaussures",
    name: "Chaussures",
    description: "Chaussures inclusives pour toustes les pieds",
    icon: "Footprints",
    subcategories: [
      {
        id: "chaussures-non-genrees",
        name: "Chaussures non genrées",
        description: "Pointures non genrées pour toustes",
      },
      {
        id: "chaussures-adaptees-pmr",
        name: "Chaussures adaptées PMR",
        description: "Modèles adaptés aux personnes à mobilité réduite",
      },
      { id: "talons-inclusifs", name: "Talons inclusifs", description: "Talons pour toutes identités et morphologies" },
      {
        id: "chaussures-grandes-pointures",
        name: "Grandes pointures",
        description: "Chaussures stylées en grandes pointures",
      },
      {
        id: "chaussures-petites-pointures",
        name: "Petites pointures",
        description: "Chaussures stylées en petites pointures",
      },
      {
        id: "chaussures-orthopediques",
        name: "Chaussures orthopédiques",
        description: "Chaussures orthopédiques et stylisées",
      },
      {
        id: "chaussures-sport-inclusives",
        name: "Chaussures de sport inclusives",
        description: "Chaussures de sport adaptées à toustes",
      },
    ],
  },
  {
    id: "accessoires-mode",
    name: "Accessoires de Mode",
    description: "Accessoires de mode inclusifs et affirmatifs",
    icon: "Gem",
    subcategories: [
      {
        id: "bijoux-inclusifs",
        name: "Bijoux inclusifs",
        description: "Colliers, bracelets, boucles d'oreilles pour toustes",
      },
      {
        id: "sacs-inclusifs",
        name: "Sacs inclusifs",
        description: "Sacs à main, sacs à dos, pochettes adaptés à toustes",
      },
      {
        id: "accessoires-tete",
        name: "Accessoires pour la tête",
        description: "Casquettes, bonnets, foulards, turbans pour toustes",
      },
      {
        id: "ceintures-bretelles",
        name: "Ceintures & Bretelles",
        description: "Ceintures et bretelles adaptées à toutes morphologies",
      },
      {
        id: "lunettes-inclusives",
        name: "Lunettes inclusives",
        description: "Lunettes de vue et solaires pour toustes les visages",
      },
      {
        id: "accessoires-pmr",
        name: "Accessoires adaptés PMR",
        description: "Accessoires de mode adaptés aux personnes à mobilité réduite",
      },
      {
        id: "accessoires-pronoms",
        name: "Accessoires à pronoms",
        description: "Badges, pins et bijoux affichant les pronoms",
      },
    ],
  },
  {
    id: "capillaire",
    name: "Capillaire & Coiffure",
    description: "Produits capillaires et coiffures pour toustes",
    icon: "Scissors",
    subcategories: [
      { id: "perruques", name: "Perruques", description: "Perruques pour toustes les styles et besoins" },
      { id: "extensions", name: "Extensions", description: "Extensions capillaires de toutes textures" },
      {
        id: "accessoires-cheveux",
        name: "Accessoires pour cheveux",
        description: "Headbands, barrettes, élastiques pour toustes",
      },
      {
        id: "produits-cheveux-textures",
        name: "Produits cheveux texturés",
        description: "Soins adaptés aux cheveux bouclés, crépus, frisés",
      },
      {
        id: "produits-transition-capillaire",
        name: "Transition capillaire",
        description: "Produits pour accompagner la transition capillaire",
      },
      { id: "couvre-chefs", name: "Couvre-chefs", description: "Turbans, foulards, bonnets pour toustes" },
      {
        id: "produits-perte-cheveux",
        name: "Produits perte de cheveux",
        description: "Solutions pour alopécie et perte de cheveux",
      },
    ],
  },
  {
    id: "identite-lgbtqia",
    name: "Identité & Fierté LGBTQIA+",
    description: "Produits célébrant les identités LGBTQIA+",
    icon: "Flag",
    subcategories: [
      {
        id: "drapeaux-fierte",
        name: "Drapeaux de fierté",
        description: "Drapeaux représentant toutes les identités LGBTQIA+",
      },
      {
        id: "vetements-fierte",
        name: "Vêtements aux couleurs des fiertés",
        description: "T-shirts, sweats, accessoires aux couleurs LGBTQIA+",
      },
      {
        id: "bijoux-fierte",
        name: "Bijoux de fierté",
        description: "Colliers, bracelets, boucles d'oreilles aux couleurs LGBTQIA+",
      },
      { id: "badges-pins", name: "Badges & Pins", description: "Badges, pins et patches affirmant les identités" },
      {
        id: "accessoires-pronoms",
        name: "Accessoires à pronoms",
        description: "Badges, bracelets et pins indiquant les pronoms",
      },
      {
        id: "tatouages-temporaires",
        name: "Tatouages temporaires",
        description: "Tatouages temporaires aux motifs LGBTQIA+",
      },
      {
        id: "stickers-autocollants",
        name: "Stickers & Autocollants",
        description: "Stickers et autocollants aux motifs LGBTQIA+",
      },
      {
        id: "objets-quotidien-fierte",
        name: "Objets du quotidien",
        description: "Mugs, gourdes, fournitures aux couleurs des fiertés",
      },
    ],
  },
  {
    id: "produits-pmr",
    name: "Produits adaptés PMR",
    description: "Produits adaptés aux personnes à mobilité réduite",
    icon: "Accessibility",
    subcategories: [
      {
        id: "vetements-adaptes-pmr",
        name: "Vêtements adaptés",
        description: "Vêtements avec fermetures facilitées et ajustements",
      },
      {
        id: "chaussures-pmr",
        name: "Chaussures adaptées",
        description: "Chaussures faciles à enfiler et orthopédiques",
      },
      {
        id: "aides-mobilite",
        name: "Aides à la mobilité",
        description: "Cannes personnalisées, housses de fauteuil design",
      },
      {
        id: "accessoires-quotidien-pmr",
        name: "Accessoires quotidiens",
        description: "Couverts ergonomiques, ouvre-bouteilles adaptés",
      },
      { id: "sacs-adaptes", name: "Sacs adaptés", description: "Sacs à ouverture simplifiée, pochettes accessibles" },
      { id: "bijoux-adaptes", name: "Bijoux adaptés", description: "Bijoux faciles à mettre et enlever" },
      {
        id: "produits-soin-adaptes",
        name: "Produits de soin adaptés",
        description: "Produits de beauté et d'hygiène faciles d'utilisation",
      },
    ],
  },
  {
    id: "hygiene-beaute",
    name: "Hygiène, Beauté & Bien-être",
    description: "Produits d'hygiène, de beauté et de bien-être inclusifs",
    icon: "Sparkles",
    subcategories: [
      {
        id: "produits-menstruels",
        name: "Produits menstruels inclusifs",
        description: "Culottes, boxers, cups et protections menstruelles neutres",
      },
      { id: "soins-peau", name: "Soins de la peau", description: "Crèmes, lotions adaptées à toutes les peaux" },
      {
        id: "parfums-non-genres",
        name: "Parfums non genrés",
        description: "Parfums et eaux de toilette sans assignation de genre",
      },
      {
        id: "rasage-epilation",
        name: "Rasage & Épilation",
        description: "Produits de rasage et d'épilation inclusifs",
      },
      {
        id: "maquillage-inclusif",
        name: "Maquillage inclusif",
        description: "Maquillage pour toustes les teints et styles",
      },
      {
        id: "soins-transition",
        name: "Soins de transition",
        description: "Produits spécifiques pour les personnes en transition",
      },
      { id: "bien-etre-sexuel", name: "Bien-être sexuel", description: "Produits de bien-être sexuel inclusifs" },
      {
        id: "produits-hygiene-adaptes",
        name: "Hygiène adaptée",
        description: "Produits d'hygiène adaptés aux besoins spécifiques",
      },
    ],
  },
  {
    id: "maison-decoration",
    name: "Maison & Décoration",
    description: "Objets de décoration et d'ameublement inclusifs",
    icon: "Home",
    subcategories: [
      {
        id: "decoration-fierte",
        name: "Décoration aux couleurs des fiertés",
        description: "Affiches, drapeaux, objets décoratifs LGBTQIA+",
      },
      {
        id: "art-mural",
        name: "Art mural inclusif",
        description: "Tableaux, affiches, photos par des artistes divers·es",
      },
      { id: "textiles-maison", name: "Textiles maison", description: "Coussins, plaids, rideaux aux motifs inclusifs" },
      {
        id: "objets-decoratifs",
        name: "Objets décoratifs",
        description: "Sculptures, figurines, objets déco inclusifs",
      },
      {
        id: "mobilier-adapte",
        name: "Mobilier adapté",
        description: "Meubles adaptés aux personnes à mobilité réduite",
      },
      { id: "luminaires", name: "Luminaires", description: "Lampes et éclairages adaptés et design" },
      {
        id: "ustensiles-cuisine",
        name: "Ustensiles de cuisine",
        description: "Ustensiles de cuisine ergonomiques et inclusifs",
      },
      { id: "linge-maison", name: "Linge de maison", description: "Draps, serviettes et linge de maison inclusifs" },
    ],
  },
  {
    id: "art-artisanat",
    name: "Art & Artisanat",
    description: "Œuvres d'art et créations artisanales inclusives",
    icon: "Palette",
    subcategories: [
      { id: "peintures", name: "Peintures", description: "Œuvres peintes par des artistes divers·es" },
      { id: "sculptures", name: "Sculptures", description: "Sculptures et objets 3D par des artistes divers·es" },
      { id: "photographie", name: "Photographie", description: "Photographies par des artistes divers·es" },
      {
        id: "illustrations",
        name: "Illustrations",
        description: "Dessins et illustrations par des artistes divers·es",
      },
      {
        id: "artisanat-textile",
        name: "Artisanat textile",
        description: "Créations textiles, tricot, crochet, couture",
      },
      {
        id: "ceramique-poterie",
        name: "Céramique & Poterie",
        description: "Objets en céramique et poterie par des artistes divers·es",
      },
      {
        id: "bijoux-artisanaux",
        name: "Bijoux artisanaux",
        description: "Bijoux faits main par des artistes divers·es",
      },
      { id: "art-numerique", name: "Art numérique", description: "Créations numériques par des artistes divers·es" },
    ],
  },
  {
    id: "culture-education",
    name: "Culture & Éducation",
    description: "Produits culturels et éducatifs inclusifs",
    icon: "BookOpen",
    subcategories: [
      {
        id: "livres-inclusifs",
        name: "Livres inclusifs",
        description: "Romans, essais, biographies LGBTQIA+, PMR, neuroatypiques",
      },
      { id: "bd-mangas", name: "BD & Mangas", description: "Bandes dessinées et mangas queer-friendly" },
      { id: "guides-brochures", name: "Guides & Brochures", description: "Guides et brochures sur l'inclusivité" },
      { id: "musique", name: "Musique", description: "Albums et compilations d'artistes divers·es" },
      { id: "films-series", name: "Films & Séries", description: "Films et séries inclusifs" },
      { id: "jeux-video", name: "Jeux vidéo", description: "Jeux vidéo inclusifs et représentatifs" },
      {
        id: "materiel-pedagogique",
        name: "Matériel pédagogique",
        description: "Supports éducatifs pour enfants et adultes",
      },
      { id: "podcasts-audio", name: "Podcasts & Audio", description: "Contenus audio inclusifs et éducatifs" },
    ],
  },
  {
    id: "jeux-loisirs",
    name: "Jeux & Loisirs",
    description: "Jeux et activités de loisirs inclusifs",
    icon: "Gamepad2",
    subcategories: [
      { id: "jeux-societe", name: "Jeux de société", description: "Jeux de société inclusifs et éducatifs" },
      {
        id: "poupees-figurines",
        name: "Poupées & Figurines",
        description: "Poupées et figurines représentant toutes les identités",
      },
      { id: "jeux-cartes", name: "Jeux de cartes", description: "Cartes à jouer, tarot et oracles inclusifs" },
      { id: "jouets-enfants", name: "Jouets pour enfants", description: "Jouets non genrés et inclusifs pour enfants" },
      { id: "jeux-plein-air", name: "Jeux de plein air", description: "Activités extérieures adaptées et inclusives" },
      { id: "puzzles", name: "Puzzles", description: "Puzzles aux thématiques inclusives" },
      { id: "kits-creatifs", name: "Kits créatifs", description: "Kits de création artistique inclusifs" },
      { id: "jeux-role", name: "Jeux de rôle", description: "Jeux de rôle et d'imagination inclusifs" },
    ],
  },
  {
    id: "technologie-adaptee",
    name: "Technologie Adaptée",
    description: "Produits technologiques adaptés et inclusifs",
    icon: "Smartphone",
    subcategories: [
      {
        id: "accessoires-tech",
        name: "Accessoires tech",
        description: "Coques, housses, supports aux couleurs inclusives",
      },
      { id: "peripheriques-adaptes", name: "Périphériques adaptés", description: "Claviers, souris, manettes adaptés" },
      {
        id: "appareils-assistance",
        name: "Appareils d'assistance",
        description: "Technologies d'assistance au quotidien",
      },
      { id: "audio-adapte", name: "Audio adapté", description: "Écouteurs, casques et appareils audio adaptés" },
      {
        id: "applications-inclusives",
        name: "Applications inclusives",
        description: "Logiciels et applications pour l'inclusivité",
      },
      { id: "objets-connectes", name: "Objets connectés", description: "Objets connectés adaptés et inclusifs" },
      { id: "realite-virtuelle", name: "Réalité virtuelle", description: "Expériences VR inclusives et adaptées" },
    ],
  },
  {
    id: "alimentation-boissons",
    name: "Alimentation & Boissons",
    description: "Produits alimentaires et boissons inclusifs",
    icon: "UtensilsCrossed",
    subcategories: [
      { id: "produits-vegan", name: "Produits vegan", description: "Aliments et boissons 100% végétaux" },
      {
        id: "produits-sans-allergenes",
        name: "Sans allergènes",
        description: "Produits sans gluten, lactose et allergènes courants",
      },
      {
        id: "boissons-inclusives",
        name: "Boissons inclusives",
        description: "Thés, cafés, boissons de marques engagées",
      },
      { id: "confiseries", name: "Confiseries", description: "Bonbons, chocolats et sucreries inclusifs" },
      {
        id: "produits-artisanaux",
        name: "Produits artisanaux",
        description: "Aliments fabriqués par des artisan·es divers·es",
      },
      { id: "box-abonnements", name: "Box & Abonnements", description: "Box alimentaires et abonnements inclusifs" },
      {
        id: "supplements-nutritionnels",
        name: "Suppléments nutritionnels",
        description: "Compléments adaptés aux besoins spécifiques",
      },
    ],
  },
  {
    id: "sport-bien-etre",
    name: "Sport & Bien-être",
    description: "Équipements sportifs et de bien-être inclusifs",
    icon: "Dumbbell",
    subcategories: [
      {
        id: "vetements-sport",
        name: "Vêtements de sport",
        description: "Tenues de sport adaptées à toustes les corps",
      },
      {
        id: "equipements-adaptes",
        name: "Équipements adaptés",
        description: "Matériel sportif adapté aux différents besoins",
      },
      { id: "yoga-meditation", name: "Yoga & Méditation", description: "Accessoires de yoga et méditation inclusifs" },
      {
        id: "fitness-maison",
        name: "Fitness à la maison",
        description: "Équipements de fitness adaptés pour la maison",
      },
      {
        id: "natation-aquatique",
        name: "Natation & Aquatique",
        description: "Maillots de bain et accessoires inclusifs",
      },
      {
        id: "supplements-sportifs",
        name: "Suppléments sportifs",
        description: "Compléments alimentaires pour sportif·ves",
      },
      {
        id: "accessoires-bien-etre",
        name: "Accessoires bien-être",
        description: "Produits de relaxation et bien-être",
      },
    ],
  },
  {
    id: "cadeaux-personnalises",
    name: "Cadeaux & Personnalisés",
    description: "Idées cadeaux et produits personnalisables inclusifs",
    icon: "Gift",
    subcategories: [
      { id: "cadeaux-fierte", name: "Cadeaux fierté", description: "Cadeaux aux couleurs et symboles LGBTQIA+" },
      {
        id: "cadeaux-personnalises",
        name: "Cadeaux personnalisés",
        description: "Produits personnalisables avec pronoms, noms, etc.",
      },
      { id: "cartes-voeux", name: "Cartes & Vœux", description: "Cartes de vœux inclusives pour toutes occasions" },
      { id: "coffrets-cadeaux", name: "Coffrets cadeaux", description: "Box et coffrets thématiques inclusifs" },
      {
        id: "cadeaux-ceremonie",
        name: "Cadeaux cérémonie",
        description: "Cadeaux pour unions, cérémonies et célébrations",
      },
      {
        id: "cadeaux-enfants",
        name: "Cadeaux pour enfants",
        description: "Cadeaux inclusifs et éducatifs pour enfants",
      },
      { id: "cadeaux-solidaires", name: "Cadeaux solidaires", description: "Cadeaux soutenant des causes inclusives" },
    ],
  },
]
