import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"
import { Search } from "lucide-react"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  return {
    title: q ? `Search: ${q} | Spectrum Marketplace` : "Search | Spectrum Marketplace",
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const supabase = await createClient()

  let products: any[] = []

  if (q) {
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .order("created_at", { ascending: false })

    if (productsData && productsData.length > 0) {
      const vendorIds = [...new Set(productsData.map((p) => p.vendor_id))]
      const { data: vendorsData } = await supabase.from("vendors").select("id, store_name").in("id", vendorIds)

      const vendorMap = new Map(vendorsData?.map((v) => [v.id, v]) || [])
      products = productsData.map((p) => ({
        ...p,
        vendors: vendorMap.get(p.vendor_id) || { store_name: "Unknown" },
      }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{q ? `Search results for "${q}"` : "Search"}</h1>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">
              {q
                ? `We couldn't find any products matching "${q}". Try a different search term.`
                : "Enter a search term to find products."}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
