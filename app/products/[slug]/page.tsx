import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductDetails } from "@/components/products/product-details"
import { FeaturedProducts } from "@/components/home/featured-products"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("name, description").eq("slug", slug).single()

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: `${product.name} | Spectrum Marketplace`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).eq("is_active", true).single()

  if (!product) {
    notFound()
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, store_name, store_logo, rating, total_sales, is_verified")
    .eq("id", product.vendor_id)
    .single()

  const { data: category } = product.category_id
    ? await supabase.from("categories").select("id, name, slug").eq("id", product.category_id).single()
    : { data: null }

  // Combine product with relations
  const productWithRelations = {
    ...product,
    vendors: vendor || { id: product.vendor_id, store_name: "Unknown", is_verified: false, rating: 0, total_sales: 0 },
    categories: category,
  }

  // Fetch reviews with profile info
  let reviews: any[] = []
  try {
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (reviewsData && reviewsData.length > 0) {
      const customerIds = [...new Set(reviewsData.map((r) => r.customer_id))]
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", customerIds)

      const profileMap = new Map(profilesData?.map((p) => [p.id, p]) || [])
      reviews = reviewsData.map((r) => ({
        ...r,
        profiles: profileMap.get(r.customer_id) || { full_name: "Anonymous", avatar_url: null },
      }))
    }
  } catch (e) {
    console.log("[v0] Could not fetch reviews")
  }

  let relatedProducts: any[] = []
  if (product.category_id) {
    const { data: relatedData } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .eq("is_active", true)
      .limit(4)

    if (relatedData && relatedData.length > 0) {
      const vendorIds = [...new Set(relatedData.map((p) => p.vendor_id))]
      const { data: vendorsData } = await supabase.from("vendors").select("id, store_name").in("id", vendorIds)

      const vendorMap = new Map(vendorsData?.map((v) => [v.id, v]) || [])
      relatedProducts = relatedData.map((p) => ({
        ...p,
        vendors: vendorMap.get(p.vendor_id) || { store_name: "Unknown" },
      }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetails product={productWithRelations} reviews={reviews} />
        {relatedProducts.length > 0 && (
          <FeaturedProducts products={relatedProducts} title="Related Products" subtitle="You might also like these" />
        )}
      </main>
      <Footer />
    </div>
  )
}
