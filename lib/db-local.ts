// Alternative gratuite : Base de données locale avec fichiers JSON
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

// Assurer que le dossier data existe
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Lire un fichier JSON
async function readJsonFile(filename: string) {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, `${filename}.json`)
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Écrire un fichier JSON
async function writeJsonFile(filename: string, data: any) {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, `${filename}.json`)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

// API pour les produits
export const productsDB = {
  async getAll() {
    return await readJsonFile("products")
  },

  async getById(id: string) {
    const products = await readJsonFile("products")
    return products.find((p: any) => p.id === id)
  },

  async create(product: any) {
    const products = await readJsonFile("products")
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    products.push(newProduct)
    await writeJsonFile("products", products)
    return newProduct
  },

  async update(id: string, updates: any) {
    const products = await readJsonFile("products")
    const index = products.findIndex((p: any) => p.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() }
      await writeJsonFile("products", products)
      return products[index]
    }
    return null
  },

  async delete(id: string) {
    const products = await readJsonFile("products")
    const filtered = products.filter((p: any) => p.id !== id)
    await writeJsonFile("products", filtered)
    return true
  },
}

// API pour les utilisateurs
export const usersDB = {
  async getAll() {
    return await readJsonFile("users")
  },

  async getByEmail(email: string) {
    const users = await readJsonFile("users")
    return users.find((u: any) => u.email === email)
  },

  async getById(id: string) {
    const users = await readJsonFile("users")
    return users.find((u: any) => u.id === id)
  },

  async create(user: any) {
    const users = await readJsonFile("users")
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.push(newUser)
    await writeJsonFile("users", users)
    return newUser
  },

  async update(id: string, updates: any) {
    const users = await readJsonFile("users")
    const index = users.findIndex((u: any) => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
      await writeJsonFile("users", users)
      return users[index]
    }
    return null
  },
}

// API pour les commandes
export const ordersDB = {
  async getAll() {
    return await readJsonFile("orders")
  },

  async getById(id: string) {
    const orders = await readJsonFile("orders")
    return orders.find((o: any) => o.id === id)
  },

  async getByUserId(userId: string) {
    const orders = await readJsonFile("orders")
    return orders.filter((o: any) => o.userId === userId)
  },

  async create(order: any) {
    const orders = await readJsonFile("orders")
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    orders.push(newOrder)
    await writeJsonFile("orders", orders)
    return newOrder
  },

  async update(id: string, updates: any) {
    const orders = await readJsonFile("orders")
    const index = orders.findIndex((o: any) => o.id === id)
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() }
      await writeJsonFile("orders", orders)
      return orders[index]
    }
    return null
  },
}

// API pour les vendeurs
export const sellersDB = {
  async getAll() {
    return await readJsonFile("sellers")
  },

  async getById(id: string) {
    const sellers = await readJsonFile("sellers")
    return sellers.find((s: any) => s.id === id)
  },

  async getByUserId(userId: string) {
    const sellers = await readJsonFile("sellers")
    return sellers.find((s: any) => s.userId === userId)
  },

  async create(seller: any) {
    const sellers = await readJsonFile("sellers")
    const newSeller = {
      ...seller,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    sellers.push(newSeller)
    await writeJsonFile("sellers", sellers)
    return newSeller
  },

  async update(id: string, updates: any) {
    const sellers = await readJsonFile("sellers")
    const index = sellers.findIndex((s: any) => s.id === id)
    if (index !== -1) {
      sellers[index] = { ...sellers[index], ...updates, updatedAt: new Date().toISOString() }
      await writeJsonFile("sellers", sellers)
      return sellers[index]
    }
    return null
  },
}

// API pour les favoris
export const favoritesDB = {
  async getByUserId(userId: string) {
    const favorites = await readJsonFile("favorites")
    return favorites.filter((f: any) => f.userId === userId)
  },

  async add(userId: string, productId: string) {
    const favorites = await readJsonFile("favorites")
    const existing = favorites.find((f: any) => f.userId === userId && f.productId === productId)
    if (!existing) {
      const newFavorite = {
        id: Date.now().toString(),
        userId,
        productId,
        createdAt: new Date().toISOString(),
      }
      favorites.push(newFavorite)
      await writeJsonFile("favorites", favorites)
      return newFavorite
    }
    return existing
  },

  async remove(userId: string, productId: string) {
    const favorites = await readJsonFile("favorites")
    const filtered = favorites.filter((f: any) => !(f.userId === userId && f.productId === productId))
    await writeJsonFile("favorites", filtered)
    return true
  },
}

// API pour le panier
export const cartDB = {
  async getByUserId(userId: string) {
    const cart = await readJsonFile("cart")
    return cart.filter((c: any) => c.userId === userId)
  },

  async addItem(userId: string, productId: string, quantity = 1) {
    const cart = await readJsonFile("cart")
    const existingIndex = cart.findIndex((c: any) => c.userId === userId && c.productId === productId)

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity
      cart[existingIndex].updatedAt = new Date().toISOString()
    } else {
      const newItem = {
        id: Date.now().toString(),
        userId,
        productId,
        quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      cart.push(newItem)
    }

    await writeJsonFile("cart", cart)
    return true
  },

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await readJsonFile("cart")
    const index = cart.findIndex((c: any) => c.userId === userId && c.productId === productId)

    if (index !== -1) {
      if (quantity <= 0) {
        cart.splice(index, 1)
      } else {
        cart[index].quantity = quantity
        cart[index].updatedAt = new Date().toISOString()
      }
      await writeJsonFile("cart", cart)
      return true
    }
    return false
  },

  async removeItem(userId: string, productId: string) {
    const cart = await readJsonFile("cart")
    const filtered = cart.filter((c: any) => !(c.userId === userId && c.productId === productId))
    await writeJsonFile("cart", filtered)
    return true
  },

  async clearCart(userId: string) {
    const cart = await readJsonFile("cart")
    const filtered = cart.filter((c: any) => c.userId !== userId)
    await writeJsonFile("cart", filtered)
    return true
  },
}
