import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"
import { Badge } from "@/components/ui/badge"
import { Percent } from "lucide-react"

export const metadata = {
  title: "Deals & Discounts | Spectrum Marketplace",
  description: "Find the best deals and discounts on our marketplace",
}

export default async function DealsPage() {
  const supabase = await createClient()

  // Fetch products with discounts (compare_at_price > price)
  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .not("compare_at_price", "is", null)
    .order("created_at", { ascending: false })

  // Fetch vendor info
  let products: any[] = []
  if (productsData && productsData.length > 0) {
    const vendorIds = [...new Set(productsData.map((p) => p.vendor_id))]
    const { data: vendorsData } = await supabase.from("vendors").select("id, store_name").in("id", vendorIds)

    const vendorMap = new Map(vendorsData?.map((v) => [v.id, v]) || [])
    products = productsData.map((p) => ({
      ...p,
      vendors: vendorMap.get(p.vendor_id) || { store_name: "Unknown" },
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12">
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Percent className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Deals & Discounts</h1>
                <p className="text-muted-foreground">Save big on your favorite products</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="secondary" className="text-sm">
                Up to 50% off
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Free shipping on orders $50+
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Limited time offers
              </Badge>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="container py-8">
          {products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">{products.length} deals found</p>
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            <div className="text-center py-16">
              <Percent className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No deals available right now</h2>
              <p className="text-muted-foreground">Check back soon for new discounts and promotions.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
