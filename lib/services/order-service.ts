// This is a simplified order service for demonstration purposes
// In a real application, you would connect to your database

type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type Order = {
  id: string
  userId?: string
  items: OrderItem[]
  total: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
  shippingAddress?: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentIntentId?: string
  stripeSessionId?: string
}

// In-memory store for demonstration
const orders: Order[] = []

export const OrderService = {
  createOrder: async (data: Partial<Order>): Promise<Order> => {
    const order: Order = {
      id: `order_${Date.now()}`,
      items: data.items || [],
      total: data.total || 0,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    }

    orders.push(order)
    return order
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    return orders.find((order) => order.id === id) || null
  },

  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order | null> => {
    const orderIndex = orders.findIndex((order) => order.id === id)
    if (orderIndex === -1) return null

    orders[orderIndex].status = status
    orders[orderIndex].updatedAt = new Date()

    return orders[orderIndex]
  },

  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    return orders.filter((order) => order.userId === userId)
  },

  // This would be called from the webhook handler
  processPaymentSuccess: async (stripeSessionId: string, paymentIntentId: string): Promise<Order | null> => {
    const orderIndex = orders.findIndex((order) => order.stripeSessionId === stripeSessionId)
    if (orderIndex === -1) return null

    orders[orderIndex].status = "paid"
    orders[orderIndex].paymentIntentId = paymentIntentId
    orders[orderIndex].updatedAt = new Date()

    return orders[orderIndex]
  },
}
