import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; min?: string; max?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase.from("categories").select("name, description").eq("slug", slug).single()

  if (!category) {
    return { title: "Category Not Found" }
  }

  return {
    title: `${category.name} | Spectrum Marketplace`,
    description: category.description,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { sort, min, max } = await searchParams
  const supabase = await createClient()

  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (!category) {
    notFound()
  }

  let query = supabase.from("products").select("*").eq("category_id", category.id).eq("is_active", true)

  // Apply price filters
  if (min) {
    query = query.gte("price", Number.parseFloat(min))
  }
  if (max) {
    query = query.lte("price", Number.parseFloat(max))
  }

  // Apply sorting
  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "rating":
      query = query.order("rating", { ascending: false })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: productsData } = await query

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
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && <p className="text-muted-foreground">{category.description}</p>}
        </div>

        <div className="grid lg:grid-cols-[250px_1fr] gap-8">
          <aside className="hidden lg:block">
            <ProductFilters />
          </aside>
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{products.length} products found</p>
            </div>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
