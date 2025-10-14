// Base de données locale simple pour éviter les erreurs de fetch
const mockProducts = [
  {
    id: "1",
    name: "T-shirt Pride Arc-en-ciel",
    description: "T-shirt confortable aux couleurs de la fierté",
    price: 29.99,
    category: "Vêtements",
    images: ["/placeholder.svg?height=300&width=300&text=T-shirt+Pride"],
    sellerId: "seller1",
    published: true,
    featured: true,
    inventory: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Boucles d'oreilles Diversité",
    description: "Bijoux élégants célébrant la diversité",
    price: 24.99,
    category: "Bijoux",
    images: ["/placeholder.svg?height=300&width=300&text=Boucles+oreilles"],
    sellerId: "seller2",
    published: true,
    featured: true,
    inventory: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockUsers = [
  {
    id: "1",
    email: "user@example.com",
    name: "Utilisateur Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockSellers = [
  {
    id: "seller1",
    userId: "1",
    storeName: "Pride Apparel",
    description: "Vêtements inclusifs et de qualité",
    verified: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// API simplifiée pour éviter les erreurs de fetch
export const productsDB = {
  async getAll() {
    return mockProducts
  },

  async getById(id: string) {
    return mockProducts.find((p) => p.id === id)
  },

  async create(product: any) {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProducts.push(newProduct)
    return newProduct
  },
}

export const usersDB = {
  async getAll() {
    return mockUsers
  },

  async getByEmail(email: string) {
    return mockUsers.find((u) => u.email === email)
  },

  async getById(id: string) {
    return mockUsers.find((u) => u.id === id)
  },
}

export const sellersDB = {
  async getAll() {
    return mockSellers
  },

  async getById(id: string) {
    return mockSellers.find((s) => s.id === id)
  },
}
