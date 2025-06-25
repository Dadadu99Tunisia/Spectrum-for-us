"use client"

import { useState, useCallback } from "react"
import { products, type Product } from "@/lib/data/products"

interface CartItem {
  productId: string
  quantity: number
}

interface CartProduct extends CartItem {
  product: Product
}

const initialCartItems: CartItem[] = [
  { productId: "prod-001", quantity: 1 },
  { productId: "prod-006", quantity: 2 },
  { productId: "prod-008", quantity: 1 },
]

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const cartProducts: CartProduct[] = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { ...item, product } : null
    })
    .filter((item): item is CartProduct => item !== null)

  const subtotal = cartProducts.reduce((total, item) => {
    const price = item.product?.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product?.price || 0
    return total + price * item.quantity
  }, 0)

  const shippingCost = subtotal > 50 ? 0 : 4.99
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discount

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (newQuantity > product.stock) {
      alert(`Désolé, il ne reste que ${product.stock} unités en stock.`)
      return
    }

    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }, [])

  const removeProduct = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const applyPromoCode = useCallback(() => {
    if (!promoCode) return

    setIsApplyingPromo(true)
    setTimeout(() => {
      if (promoCode.toLowerCase() === "welcome10") {
        setPromoApplied(true)
        alert("Code promo appliqué avec succès !")
      } else {
        alert("Code promo invalide.")
      }
      setIsApplyingPromo(false)
    }, 800)
  }, [promoCode])

  return {
    cartItems,
    cartProducts,
    promoCode,
    setPromoCode,
    promoApplied,
    isApplyingPromo,
    subtotal,
    shippingCost,
    discount,
    total,
    updateQuantity,
    removeProduct,
    applyPromoCode,
  }
}
