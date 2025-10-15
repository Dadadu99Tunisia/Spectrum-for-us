export interface Product {
  id: string
  name: string
  description: string
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
    name: "T-shirt Pride",
    description: "T-shirt avec motif arc-en-ciel, 100% coton biologique",
    price: 25.99,
    images: ["/placeholder.svg?height=400&width=400"],
    categoryId: "clothing",
    subcategoryId: "tops",
    sellerId: "seller-001",
    stock: 50,
    tags: ["pride", "t-shirt", "vêtements", "arc-en-ciel"],
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
    featured: true,
    rating: 4.8,
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
    name: "Binder Confort Plus",
    description: "Binder de compression confortable pour tous les jours",
    price: 45.99,
    images: ["/placeholder.svg?height=400&width=400"],
    categoryId: "identite-transition",
    subcategoryId: "binders-compression",
    sellerId: "seller-003",
    stock: 30,
    tags: ["binder", "compression", "transition", "confort"],
    createdAt: "2023-02-20T10:15:00Z",
    updatedAt: "2023-02-20T10:15:00Z",
    featured: true,
    rating: 4.9,
    reviews: [],
  },
  {
    id: "prod-003",
    name: "Bracelet Pronoms",
    description: "Bracelet personnalisable avec vos pronoms",
    price: 15.5,
    images: ["/placeholder.svg?height=400&width=400"],
    categoryId: "bijoux-ornements",
    subcategoryId: "identite-affirmation",
    sellerId: "seller-002",
    stock: 100,
    tags: ["bracelet", "pronoms", "bijoux", "personnalisable"],
    createdAt: "2023-03-05T09:45:00Z",
    updatedAt: "2023-03-05T09:45:00Z",
    rating: 4.7,
    reviews: [],
  },
  {
    id: "prod-004",
    name: "Livre 'Histoires Queer'",
    description: "Recueil de nouvelles LGBTQIA+ par des auteurs émergents",
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
    name: "Drapeau Non-Binaire",
    description: "Drapeau non-binaire de haute qualité, 150x90cm",
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
]
