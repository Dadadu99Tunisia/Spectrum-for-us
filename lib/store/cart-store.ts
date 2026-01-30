import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  image: string
  quantity: number
  vendorId: string
  vendorName: string
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (isOpen: boolean) => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.productId === item.productId && i.variantId === item.variantId)

        if (existingItem) {
          set({
            items: items.map((i) => (i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
          })
        } else {
          const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          set({ items: [...items, { ...item, id }] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })
      },

      clearCart: () => set({ items: [] }),

      setIsOpen: (isOpen) => set({ isOpen }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: "spectrum-cart",
    },
  ),
)
