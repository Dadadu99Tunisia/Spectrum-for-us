export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  createdAt: string
  updatedAt: string
  trackingNumber?: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  sellerId: string
  variantId?: string
  variantName?: string
}

export interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode: string
  country: string
  phone: string
}

// Données de démonstration
export const orders: Order[] = [
  {
    id: "order-001",
    userId: "user-002",
    items: [
      {
        id: "item-001",
        productId: "prod-001",
        productName: "T-shirt Pride",
        quantity: 2,
        price: 25.99,
        sellerId: "seller-001",
      },
      {
        id: "item-002",
        productId: "prod-005",
        productName: "Drapeau Non-Binaire",
        quantity: 1,
        price: 22.99,
        sellerId: "seller-001",
      },
    ],
    totalAmount: 74.97,
    status: "delivered",
    shippingAddress: {
      fullName: "Sophie Martin",
      addressLine1: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      phone: "+33612345678",
    },
    billingAddress: {
      fullName: "Sophie Martin",
      addressLine1: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      phone: "+33612345678",
    },
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: "2023-02-15T10:30:00Z",
    updatedAt: "2023-02-20T14:15:00Z",
    trackingNumber: "SP12345678FR",
  },
  {
    id: "order-002",
    userId: "user-002",
    items: [
      {
        id: "item-003",
        productId: "prod-002",
        productName: "Binder Confort Plus",
        quantity: 1,
        price: 45.99,
        sellerId: "seller-003",
      },
    ],
    totalAmount: 45.99,
    status: "shipped",
    shippingAddress: {
      fullName: "Sophie Martin",
      addressLine1: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      phone: "+33612345678",
    },
    billingAddress: {
      fullName: "Sophie Martin",
      addressLine1: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      phone: "+33612345678",
    },
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: "2023-03-10T09:45:00Z",
    updatedAt: "2023-03-12T11:20:00Z",
    trackingNumber: "SP87654321FR",
  },
]
