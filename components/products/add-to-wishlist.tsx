"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "sonner"
import { Heart, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddToWishlistProps {
  productId: string
  variant?: "default" | "icon"
  className?: string
}

export function AddToWishlist({ productId, variant = "default", className }: AddToWishlistProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      checkWishlist()
    }
  }, [user, productId])

  const checkWishlist = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user?.id)
      .eq("product_id", productId)
      .single()

    setIsInWishlist(!!data)
  }

  const toggleWishlist = async () => {
    if (!user) {
      router.push("/auth/login?redirect=" + window.location.pathname)
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      if (isInWishlist) {
        await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId)
        setIsInWishlist(false)
        toast.success("Removed from wishlist")
      } else {
        await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId })
        setIsInWishlist(true)
        toast.success("Added to wishlist")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <Button size="icon" variant="secondary" className={className} onClick={toggleWishlist} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
        )}
      </Button>
    )
  }

  return (
    <Button variant="outline" className={className} onClick={toggleWishlist} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
      )}
      {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
    </Button>
  )
}
