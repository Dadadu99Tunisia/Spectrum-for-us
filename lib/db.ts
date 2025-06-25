import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Type simplifié pour simuler Prisma
// Note: Cette version utilise des données statiques et ne se connecte pas à une base de données
const mockProducts = [
  {
    id: "product-1",
    name: "T-shirt Pride",
    description: "T-shirt avec motif arc-en-ciel",
    price: 29.99,
    slug: "t-shirt-pride",
    inventory: 100,
    sellerId: "seller-1",
    seller: {
      id: "seller-1",
      storeName: "Pride Boutique",
      logo: "/placeholder.svg?height=100&width=100",
      verified: true,
    },
    images: [
      {
        url: "/placeholder.svg?height=400&width=400",
        alt: "T-shirt Pride",
      },
    ],
    categories: [
      {
        category: {
          id: "clothing",
          name: "Vêtements",
        },
      },
    ],
  },
  {
    id: "product-2",
    name: "Bracelet Rainbow",
    description: "Bracelet aux couleurs de l'arc-en-ciel",
    price: 12.99,
    slug: "bracelet-rainbow",
    inventory: 50,
    sellerId: "seller-2",
    seller: {
      id: "seller-2",
      storeName: "Accessoires Queer",
      logo: "/placeholder.svg?height=100&width=100",
      verified: true,
    },
    images: [
      {
        url: "/placeholder.svg?height=400&width=400",
        alt: "Bracelet Rainbow",
      },
    ],
    categories: [
      {
        category: {
          id: "jewelry",
          name: "Bijoux",
        },
      },
    ],
  },
]

const mockCategories = [
  {
    id: "clothing",
    name: "Vêtements",
    subCategories: [
      { id: "tops", name: "Hauts" },
      { id: "bottoms", name: "Bas" },
    ],
  },
  {
    id: "jewelry",
    name: "Bijoux",
    subCategories: [
      { id: "necklaces", name: "Colliers" },
      { id: "bracelets", name: "Bracelets" },
    ],
  },
]

const mockSellers = [
  {
    id: "seller-1",
    storeName: "Pride Boutique",
    description: "Boutique spécialisée dans les vêtements Pride",
    logo: "/placeholder.svg?height=100&width=100",
    verified: true,
    featured: true,
    rating: 4.8,
    reviewCount: 120,
    productCount: 45,
    location: "Paris",
  },
  {
    id: "seller-2",
    storeName: "Accessoires Queer",
    description: "Accessoires et bijoux pour la communauté LGBTQ+",
    logo: "/placeholder.svg?height=100&width=100",
    verified: true,
    featured: true,
    rating: 4.6,
    reviewCount: 85,
    productCount: 30,
    location: "Lyon",
  },
]

// Mock implementations for demonstration purposes
prisma.user = {
  findUnique: async () => null,
  create: async () => ({ id: "mock-id", name: "Mock User", email: "mock@example.com" }),
  findMany: async () => [],
}

prisma.product = {
  findMany: async () => mockProducts,
  findUnique: async () => mockProducts[0],
  count: async () => mockProducts.length,
  create: async (data: any) => ({ id: "new-product", ...data.data }),
  update: async (data: any) => ({ id: data.where.id, ...data.data }),
  delete: async () => ({ id: "deleted" }),
}

prisma.category = {
  findMany: async () => mockCategories,
}

prisma.seller = {
  findMany: async () => mockSellers,
  findUnique: async () => mockSellers[0],
  update: async (data: any) => ({ id: data.where.id, ...data.data }),
}

prisma.order = {
  findMany: async () => [],
  create: async (data: any) => ({ id: "new-order", ...data.data }),
}

prisma.cartItem = {
  deleteMany: async () => ({ count: 0 }),
}

prisma.favorite = {
  findUnique: async () => null,
}

export default prisma
