export interface Product {
  id: string
  name: string
  description: string
  longDescription?: string
  price: number
  images: string[]
  categoryId: string
  subcategoryId: string
  sellerId: string
  stock: number
  tags: string[]
  createdAt: string
  updatedAt: string
  featured?: boolean
  rating?: number
  reviews?: Review[]
  variants?: ProductVariant[]
  sizes?: string[]
  colors?: string[]
  isNew?: boolean
  discount?: number
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ProductVariant {
  id: string
  name: string
  options: string[]
  price?: number
}

// Données de démonstration
export const products: Product[] = [
  {
    id: "prod-001",
    name: "T-shirt Spectre",
    description: "T-shirt avec motif arc-en-ciel, 100% coton biologique",
    longDescription:
      "Ce t-shirt de notre collection Pride est fabriqué à partir de coton biologique 100% certifié, garantissant confort et durabilité. Avec sa coupe inclusive adaptée à tous les types de corps, il célèbre la diversité et l'expression de soi. Le design arc-en-ciel représente la fierté et la solidarité avec la communauté LGBTQ+. Chaque achat contribue à soutenir des organisations qui défendent les droits des personnes queer.",
    price: 25.99,
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    categoryId: "vetements-mode",
    subcategoryId: "vetements-non-genres",
    sellerId: "seller-001",
    stock: 50,
    tags: ["pride", "t-shirt", "vêtements", "arc-en-ciel"],
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    featured: true,
    rating: 4.8,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Blanc", "Noir", "Rouge", "Bleu"],
    reviews: [
      {
        id: "rev-001",
        userId: "user-002",
        userName: "Sophie Martin",
        rating: 5,
        comment: "Excellent t-shirt, très confortable et les couleurs sont magnifiques !",
        createdAt: "2023-02-10T14:30:00Z",
      },
    ],
  },
  {
    id: "prod-002",
    name: "Binder Horizon",
    description: "Binder de compression confortable pour tous les jours",
    longDescription:
      "Notre binder Confort Plus est conçu pour offrir une compression efficace tout en restant confortable pour un usage quotidien. Fabriqué avec des matériaux respirants et élastiques, il s'adapte à votre morphologie tout en offrant un aplatissement optimal. Les coutures plates réduisent les irritations et le design discret permet de le porter sous tous types de vêtements.",
    price: 45.99,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    categoryId: "identite-lgbtqia",
    subcategoryId: "vetements-fierte",
    sellerId: "seller-003",
    stock: 30,
    tags: ["binder", "compression", "transition", "confort"],
    createdAt: "2023-02-20T10:15:00Z",
    updatedAt: "2023-02-20T10:15:00Z",
    featured: true,
    rating: 4.9,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Noir", "Beige", "Gris"],
    reviews: [],
  },
  {
    id: "prod-003",
    name: "Bracelet Personnalisable Écho",
    description: "Bracelet personnalisable avec vos pronoms",
    longDescription:
      "Ce bracelet élégant et ajustable peut être personnalisé avec vos pronoms. Fabriqué en acier inoxydable de haute qualité, il est durable et résistant à l'eau. Un accessoire parfait pour affirmer votre identité avec style. Disponible en plusieurs finitions et couleurs.",
    price: 15.5,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    categoryId: "bijoux-ornements",
    subcategoryId: "bijoux-fierte",
    sellerId: "seller-002",
    stock: 100,
    tags: ["bracelet", "pronoms", "bijoux", "personnalisable"],
    createdAt: "2023-03-05T09:45:00Z",
    updatedAt: "2023-03-05T09:45:00Z",
    rating: 4.7,
    colors: ["Argent", "Or", "Rose Gold", "Noir"],
    reviews: [],
  },
  {
    id: "prod-004",
    name: "Livre 'Chroniques Contemporaines'",
    description: "Recueil de nouvelles LGBTQIA+ par des auteurs émergents",
    longDescription:
      "Ce recueil rassemble 15 nouvelles écrites par des auteurs LGBTQIA+ émergents, offrant un panorama riche et diversifié d'expériences queer contemporaines. Des histoires touchantes, drôles, parfois difficiles, mais toujours authentiques qui célèbrent la diversité des identités et des parcours de vie.",
    price: 19.99,
    images: ["/placeholder.svg?height=400&width=400"],
    categoryId: "livres-films-musique",
    subcategoryId: "litterature-queer",
    sellerId: "seller-004",
    stock: 75,
    tags: ["livre", "littérature", "queer", "nouvelles"],
    createdAt: "2023-03-15T11:30:00Z",
    updatedAt: "2023-03-15T11:30:00Z",
    featured: true,
    rating: 4.6,
    reviews: [],
  },
  {
    id: "prod-005",
    name: "Bannière Horizon",
    description: "Drapeau non-binaire de haute qualité, 150x90cm",
    longDescription:
      "Ce drapeau non-binaire est fabriqué en polyester résistant aux UV, parfait pour une utilisation en intérieur comme en extérieur. Ses couleurs vives et sa finition de qualité en font un symbole de fierté durable. Dimensions: 150x90cm, avec œillets métalliques pour faciliter l'accrochage.",
    price: 22.99,
    images: ["/placeholder.svg?height=400&width=400"],
    categoryId: "accessoires-fierte",
    subcategoryId: "drapeaux-pins",
    sellerId: "seller-001",
    stock: 40,
    tags: ["drapeau", "non-binaire", "fierté", "visibilité"],
    createdAt: "2023-04-02T13:20:00Z",
    updatedAt: "2023-04-02T13:20:00Z",
    rating: 4.8,
    reviews: [],
  },
  {
    id: "prod-006",
    name: "Chemise Universelle",
    description: "Chemise à coupe inclusive, adaptée à toutes les morphologies",
    longDescription:
      "Notre chemise inclusive est conçue pour s'adapter à tous les types de corps. Avec sa coupe ample et ajustable, elle offre un confort optimal tout en restant élégante. Fabriquée en coton biologique, elle est douce pour la peau et respectueuse de l'environnement.",
    price: 39.99,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    categoryId: "vetements-mode",
    subcategoryId: "vetements-non-genres",
    sellerId: "seller-005",
    stock: 60,
    tags: ["chemise", "inclusif", "non-genré", "coton bio"],
    createdAt: "2023-04-15T09:00:00Z",
    updatedAt: "2023-04-15T09:00:00Z",
    featured: true,
    rating: 4.5,
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["Blanc", "Bleu ciel", "Noir", "Rayé"],
    isNew: true,
    reviews: [],
  },
  {
    id: "prod-007",
    name: "Pantalon Liberté",
    description: "Pantalon adapté aux personnes à mobilité réduite, élégant et fonctionnel",
    longDescription:
      "Ce pantalon combine style et fonctionnalité pour les personnes à mobilité réduite. Avec ses fermetures magnétiques latérales et sa coupe adaptée pour une position assise prolongée, il offre un confort optimal tout en restant élégant. Le tissu stretch de haute qualité assure liberté de mouvement et durabilité.",
    price: 59.99,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    categoryId: "produits-pmr",
    subcategoryId: "vetements-adaptes-pmr",
    sellerId: "seller-006",
    stock: 35,
    tags: ["pantalon", "PMR", "adapté", "inclusif"],
    createdAt: "2023-05-10T14:45:00Z",
    updatedAt: "2023-05-10T14:45:00Z",
    rating: 4.9,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Noir", "Marine", "Gris", "Beige"],
    reviews: [],
  },
  {
    id: "prod-008",
    name: "Palette Chromatic",
    description: "Palette de fards à paupières aux couleurs vibrantes pour toutes les carnations",
    longDescription:
      "Cette palette de 24 fards à paupières offre une gamme de couleurs vibrantes qui complimentent toutes les carnations. Formulés sans cruauté animale et hautement pigmentés, ces fards sont faciles à appliquer et à estomper. Parfaits pour créer des looks quotidiens ou plus audacieux.",
    price: 34.99,
    images: ["/placeholder.svg?height=400&width=400"],
    categoryId: "hygiene-beaute",
    subcategoryId: "maquillage-inclusif",
    sellerId: "seller-007",
    stock: 85,
    tags: ["maquillage", "inclusif", "vegan", "cruelty-free"],
    createdAt: "2023-05-25T11:30:00Z",
    updatedAt: "2023-05-25T11:30:00Z",
    featured: true,
    rating: 4.7,
    isNew: true,
    discount: 15,
    reviews: [],
  },
  {
    id: "prod-009",
    name: "Chaussures Versatile",
    description: "Chaussures stylées et confortables, design non genré",
    longDescription:
      "Ces chaussures au design épuré transcendent les codes genrés traditionnels. Fabriquées avec des matériaux durables et éthiques, elles offrent un confort optimal pour une utilisation quotidienne. Disponibles dans une large gamme de pointures pour s'adapter à tous les pieds.",
    price: 79.99,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    categoryId: "chaussures",
    subcategoryId: "chaussures-non-genrees",
    sellerId: "seller-008",
    stock: 45,
    tags: ["chaussures", "non-genré", "confort", "éthique"],
    createdAt: "2023-06-05T10:15:00Z",
    updatedAt: "2023-06-05T10:15:00Z",
    rating: 4.6,
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],
    colors: ["Noir", "Blanc", "Beige", "Rouge"],
    reviews: [],
  },
  {
    id: "prod-010",
    name: "Illustration Diversité",
    description: "Illustration originale célébrant la diversité, impression limitée",
    longDescription:
      "Cette illustration originale créée par un artiste queer célèbre la diversité des identités et des expressions de genre. Imprimée sur papier d'art de haute qualité avec des encres archivables, chaque exemplaire est numéroté et signé par l'artiste. Une pièce unique pour décorer votre intérieur tout en soutenant les créateurs queer.",
    price: 45.0,
    images: ["/placeholder.svg?height=400&width=400"],
    categoryId: "art-artisanat",
    subcategoryId: "illustrations",
    sellerId: "seller-009",
    stock: 25,
    tags: ["art", "illustration", "pride", "édition limitée"],
    createdAt: "2023-06-20T15:30:00Z",
    updatedAt: "2023-06-20T15:30:00Z",
    featured: true,
    rating: 5.0,
    isNew: true,
    reviews: [],
  },
  {
    id: "prod-011",
    name: "Hoodie Cosmos",
    description: "Hoodie oversize confortable en coton bio, design inclusif",
    longDescription:
      "Ce hoodie oversize est l'allié parfait pour les journées décontractées. Fabriqué en coton biologique doux et épais, il offre chaleur et confort tout en affichant un design inclusif et moderne. Sa coupe ample convient à tous les types de corps et son capuchon doublé apporte une touche supplémentaire de confort.",
    price: 49.99,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    categoryId: "vetements-mode",
    subcategoryId: "vetements-non-genres",
    sellerId: "seller-001",
    stock: 70,
    tags: ["hoodie", "sweat", "coton bio", "inclusif"],
    createdAt: "2023-07-05T09:45:00Z",
    updatedAt: "2023-07-05T09:45:00Z",
    rating: 4.8,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Noir", "Gris chiné", "Lavande", "Vert sauge"],
    discount: 10,
    reviews: [],
  },
  {
    id: "prod-012",
    name: "Jeu de Société Perspectives",
    description: "Jeu de société éducatif et amusant sur la diversité et l'inclusion",
    longDescription:
      "Ce jeu de société innovant combine plaisir et éducation pour sensibiliser à la diversité et à l'inclusion. À travers des défis, des questions et des mises en situation, les joueurs développent leur empathie et leur compréhension des différentes identités et expériences. Parfait pour les familles, les écoles et les groupes d'amis souhaitant s'amuser tout en apprenant.",
    price: 29.99,
    images: ["/placeholder.svg?height=400&width=400"],
    categoryId: "jeux-loisirs",
    subcategoryId: "jeux-societe",
    sellerId: "seller-010",
    stock: 50,
    tags: ["jeu", "éducatif", "diversité", "inclusion"],
    createdAt: "2023-07-20T13:15:00Z",
    updatedAt: "2023-07-20T13:15:00Z",
    featured: true,
    rating: 4.9,
    isNew: true,
    reviews: [],
  },
]

// Fonction pour obtenir les produits par catégorie
export function getProductsByCategory(categoryId: string, limit?: number) {
  const categoryProducts = products.filter((product) => product.categoryId === categoryId)
  if (limit) {
    return categoryProducts.slice(0, limit)
  }
  return categoryProducts
}

// Fonction pour obtenir les produits par sous-catégorie
export function getProductsBySubcategory(categoryId: string, subcategoryId: string, limit?: number) {
  const subcategoryProducts = products.filter(
    (product) => product.categoryId === categoryId && product.subcategoryId === subcategoryId,
  )
  if (limit) {
    return subcategoryProducts.slice(0, limit)
  }
  return subcategoryProducts
}

// Fonction pour obtenir un produit par ID
export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}

// Fonction pour obtenir les produits en vedette
export function getFeaturedProducts(limit?: number) {
  const featuredProducts = products.filter((product) => product.featured)
  if (limit) {
    return featuredProducts.slice(0, limit)
  }
  return featuredProducts
}

// Fonction pour obtenir les nouveaux produits
export function getNewProducts(limit?: number) {
  const newProducts = products.filter((product) => product.isNew)
  if (limit) {
    return newProducts.slice(0, limit)
  }
  return newProducts
}

// Fonction pour obtenir les produits en promotion
export function getDiscountedProducts(limit?: number) {
  const discountedProducts = products.filter((product) => product.discount && product.discount > 0)
  if (limit) {
    return discountedProducts.slice(0, limit)
  }
  return discountedProducts
}

// Fonction pour rechercher des produits
export function searchProducts(query: string, limit?: number) {
  const searchQuery = query.toLowerCase()
  const searchResults = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
  )

  if (limit) {
    return searchResults.slice(0, limit)
  }
  return searchResults
}
