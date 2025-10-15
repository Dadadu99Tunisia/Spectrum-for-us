export interface Seller {
  id: string
  userId: string
  shopName: string
  description: string
  logo?: string
  coverImage?: string
  location?: string
  contactEmail: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
    website?: string
  }
  createdAt: string
  updatedAt: string
  rating?: number
  verified?: boolean
  featured?: boolean
}

// Données de démonstration
export const sellers: Seller[] = [
  {
    id: "seller-001",
    userId: "user-001",
    shopName: "Rainbow Creations",
    description: "Boutique spécialisée dans les vêtements et accessoires Pride faits main",
    logo: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=800&width=1200",
    location: "Paris, France",
    contactEmail: "contact@rainbowcreations.com",
    socialLinks: {
      instagram: "rainbow_creations",
      twitter: "rainbow_create",
      facebook: "rainbowcreations",
      website: "https://rainbowcreations.com",
    },
    createdAt: "2022-10-15T09:00:00Z",
    updatedAt: "2023-01-20T14:30:00Z",
    rating: 4.9,
    verified: true,
    featured: true,
  },
  {
    id: "seller-002",
    userId: "user-003",
    shopName: "Bijoux Inclusifs",
    description: "Créations de bijoux personnalisés pour l'affirmation de soi",
    logo: "/placeholder.svg?height=200&width=200",
    location: "Lyon, France",
    contactEmail: "hello@bijouxinclusifs.fr",
    socialLinks: {
      instagram: "bijoux_inclusifs",
      website: "https://bijouxinclusifs.fr",
    },
    createdAt: "2022-11-05T10:15:00Z",
    updatedAt: "2023-02-10T11:45:00Z",
    rating: 4.8,
    verified: true,
  },
  {
    id: "seller-003",
    userId: "user-004",
    shopName: "Trans Essentials",
    description: "Produits essentiels pour la transition et le bien-être",
    logo: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=800&width=1200",
    location: "Bordeaux, France",
    contactEmail: "info@transessentials.com",
    socialLinks: {
      instagram: "trans_essentials",
      twitter: "trans_essentials",
      facebook: "transessentials",
    },
    createdAt: "2022-12-20T08:30:00Z",
    updatedAt: "2023-03-15T09:20:00Z",
    rating: 4.9,
    verified: true,
    featured: true,
  },
  {
    id: "seller-004",
    userId: "user-005",
    shopName: "Librairie Queer",
    description: "Livres, zines et publications LGBTQIA+ indépendantes",
    logo: "/placeholder.svg?height=200&width=200",
    location: "Marseille, France",
    contactEmail: "books@librairequeer.fr",
    socialLinks: {
      instagram: "librairie_queer",
      twitter: "librairequeer",
    },
    createdAt: "2023-01-10T13:45:00Z",
    updatedAt: "2023-04-05T15:10:00Z",
    rating: 4.7,
    verified: true,
  },
]
