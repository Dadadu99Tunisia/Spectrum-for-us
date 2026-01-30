export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "customer" | "vendor" | "admin"
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  user_id: string
  store_name: string
  store_description: string | null
  store_logo: string | null
  store_banner: string | null
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean
  commission_rate: number
  is_verified: boolean
  rating: number
  total_sales: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  created_at: string
}

export interface Product {
  id: string
  vendor_id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  stock: number
  sku: string | null
  images: string[]
  is_active: boolean
  is_featured: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
  vendors?: Vendor
  categories?: Category
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  created_at: string
  products?: Product
}

export interface Cart {
  id: string
  user_id: string | null
  session_id: string | null
  created_at: string
  updated_at: string
  cart_items?: CartItem[]
}

export interface Order {
  id: string
  customer_id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  total_amount: number
  shipping_address: {
    name: string
    address: string
    city: string
    postal_code: string
    country: string
    phone?: string
  }
  billing_address?: {
    name: string
    address: string
    city: string
    postal_code: string
    country: string
  }
  stripe_payment_intent_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  vendor_id: string
  variant_id: string | null
  quantity: number
  unit_price: number
  total_price: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  created_at: string
  products?: Product
  vendors?: Vendor
}

export interface Review {
  id: string
  product_id: string
  customer_id: string
  order_item_id: string | null
  rating: number
  title: string | null
  comment: string | null
  is_verified_purchase: boolean
  created_at: string
  profiles?: Profile
}
