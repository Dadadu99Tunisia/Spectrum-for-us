import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { FeaturedVendors } from "@/components/home/featured-vendors"

export default async function HomePage() {
  const supabase = await createClient()

  let categories: any[] = []
  let featuredProducts: any[] = []
  let newArrivals: any[] = []
  let topVendors: any[] = []

  try {
    // Fetch categories
    const { data: categoriesData } = await supabase.from("categories").select("*").order("name").limit(8)
    categories = categoriesData || []
  } catch (e) {
    console.log("[v0] Categories table may not exist yet")
  }

  try {
    // Fetch featured products - separate query for vendor info
    const { data: featuredData } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8)

    if (featuredData && featuredData.length > 0) {
      // Fetch vendor names for these products
      const vendorIds = [...new Set(featuredData.map((p) => p.vendor_id))]
      const { data: vendorsData } = await supabase.from("vendors").select("id, store_name").in("id", vendorIds)

      const vendorMap = new Map(vendorsData?.map((v) => [v.id, v]) || [])
      featuredProducts = featuredData.map((p) => ({
        ...p,
        vendors: vendorMap.get(p.vendor_id) || { store_name: "Unknown" },
      }))
    }
  } catch (e) {
    console.log("[v0] Products table may not exist yet")
  }

  try {
    // Fetch new arrivals
    const { data: newData } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8)

    if (newData && newData.length > 0) {
      const vendorIds = [...new Set(newData.map((p) => p.vendor_id))]
      const { data: vendorsData } = await supabase.from("vendors").select("id, store_name").in("id", vendorIds)

      const vendorMap = new Map(vendorsData?.map((v) => [v.id, v]) || [])
      newArrivals = newData.map((p) => ({
        ...p,
        vendors: vendorMap.get(p.vendor_id) || { store_name: "Unknown" },
      }))
    }
  } catch (e) {
    console.log("[v0] Could not fetch new arrivals")
  }

  try {
    // Fetch top vendors
    const { data: vendorsData } = await supabase
      .from("vendors")
      .select("*")
      .eq("is_verified", true)
      .order("rating", { ascending: false })
      .limit(4)
    topVendors = vendorsData || []
  } catch (e) {
    console.log("[v0] Vendors table may not exist yet")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection categories={categories} />
        <FeaturedProducts
          products={featuredProducts}
          title="Featured Products"
          subtitle="Handpicked products from our best vendors"
        />
        <FeaturedVendors vendors={topVendors} />
        <FeaturedProducts
          products={newArrivals}
          title="New Arrivals"
          subtitle="Fresh products just added to the marketplace"
          viewAllHref="/new-arrivals"
        />
      </main>
      <Footer />
    </div>
  )
}
