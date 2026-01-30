export interface Profile {
  id: string
  name: string | null
  email: string
  avatar_url: string | null
  role: "buyer" | "vendor" | "admin"
  bio: string | null
  social_links: Record<string, string>
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  currency: "USD" | "EUR" | "TND"
  image_url: string | null
  category: string
  stock: number
  vendor_id: string
  created_at: string
  updated_at: string
  vendor?: Profile
}

export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  currency: "USD" | "EUR" | "TND"
  image_url: string | null
  category: string
  vendor_id: string
  created_at: string
  updated_at: string
  vendor?: Profile
}

export interface Order {
  id: string
  user_id: string
  total_price: number
  currency: string
  status: "pending" | "processing" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  service_id: string | null
  quantity: number
  subtotal: number
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}
