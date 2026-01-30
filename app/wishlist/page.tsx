import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WishlistGrid } from "@/components/wishlist/wishlist-grid"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export const metadata = {
  title: "Wishlist | Spectrum Marketplace",
  description: "Your saved products",
}

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/wishlist")
  }

  // Fetch wishlist items
  const { data: wishlistData } = await supabase
    .from("wishlists")
    .select("*, products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch vendor info for products
  let wishlistItems: any[] = []
  if (wishlistData && wishlistData.length > 0) {
    const vendorIds = [...new Set(wishlistData.map((w) => w.products?.vendor_id).filter(Boolean))]
    const { data: vendorsData } = await supabase.from("vendors").select("id, store_name").in("id", vendorIds)

    const vendorMap = new Map(vendorsData?.map((v) => [v.id, v]) || [])
    wishlistItems = wishlistData.map((w) => ({
      ...w,
      products: {
        ...w.products,
        vendors: vendorMap.get(w.products?.vendor_id) || { store_name: "Unknown" },
      },
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlistItems.length > 0 ? (
          <WishlistGrid items={wishlistItems} />
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist and find them here anytime.
            </p>
            <Button asChild>
              <Link href="/categories">Browse Products</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
