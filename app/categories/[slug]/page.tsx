import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"

// Demo data - same as homepage
const demoCategories = [
  { id: "c1", name: "Fashion & Apparel", slug: "fashion-apparel", description: "Gender-neutral streetwear, binders, tucking lingerie, upcycled fashion, and clubwear for every body and every expression.", image_url: "/images/categories/fashion-apparel.jpg" },
  { id: "c2", name: "Beauty & Grooming", slug: "beauty-grooming", description: "Skincare for all skin types, beard care, gender-affirming makeup, and fragrances that celebrate individuality.", image_url: "/images/categories/beauty-grooming.jpg" },
  { id: "c3", name: "Adaptive & Mobility", slug: "adaptive-mobility", description: "High-fashion adaptive gear: designer wheelchair covers, stylish canes, sensory-friendly clothing, magnetic closure apparel, and prosthetic art.", image_url: "/images/categories/adaptive-mobility.jpg" },
  { id: "c4", name: "Home & Sanctuary", slug: "home-sanctuary", description: "Queer art prints, LGBTQ+ literature, safe space decor, and candles to create your perfect sanctuary.", image_url: "/images/categories/home-sanctuary.jpg" },
  { id: "c5", name: "Intimacy & Wellness", slug: "intimacy-wellness", description: "Sexual wellness products, mental health resources, and yoga and body connection tools for holistic well-being.", image_url: "/images/categories/intimacy-wellness.jpg" },
  { id: "c6", name: "Accessories", slug: "accessories", description: "Pronoun pins, pride jewelry, bags, and statement pieces that let you express your authentic self.", image_url: "/images/categories/accessories.jpg" },
  { id: "c7", name: "Unisex & Fluid Style", slug: "unisex-fluid", description: "Clothing and accessories designed without gender boundaries, for fluid and androgynous expression.", image_url: "/images/categories/unisex-fluid.jpg" },
  { id: "c8", name: "Community & Culture", slug: "community-culture", description: "Books, zines, educational materials, and cultural items celebrating diverse identities and histories.", image_url: "/images/categories/community-culture.jpg" },
]

const demoProducts = [
  { id: "p1", name: "Abstract Art Wheelchair Spoke Guards", slug: "abstract-art-wheelchair-spoke-guards", description: "Transform your wheelchair into a statement piece with these stunning abstract art spoke guards.", price: 89.99, compare_at_price: 119.99, images: ["/images/products/wheelchair-spoke-guards.jpg"], rating: 4.9, review_count: 156, vendors: { store_name: "Radiant Mobility Co." }, category_id: "c3" },
  { id: "p2", name: "Breathable Chest Binder - Nude Tone", slug: "breathable-chest-binder-nude", description: "Our most comfortable binder yet. Breathable mesh panels, 8+ hours of safe wear.", price: 54.99, compare_at_price: 64.99, images: ["/images/products/chest-binder.jpg"], rating: 4.8, review_count: 412, vendors: { store_name: "Affirm Apparel" }, category_id: "c1" },
  { id: "p3", name: "Magnetic Button Silk Shirt", slug: "magnetic-button-silk-shirt", description: "Elegant silk shirt with hidden magnetic closures for easy dressing.", price: 129.99, compare_at_price: 159.99, images: ["/images/products/magnetic-silk-shirt.jpg"], rating: 4.7, review_count: 78, vendors: { store_name: "Radiant Mobility Co." }, category_id: "c3" },
  { id: "p4", name: "Trans-Owned Organic Beard Oil", slug: "trans-owned-organic-beard-oil", description: "Nourishing beard oil made with organic argan, jojoba, and cedar essential oils.", price: 24.99, compare_at_price: null, images: ["/images/products/beard-oil.jpg"], rating: 4.8, review_count: 187, vendors: { store_name: "Fluid Beauty Collective" }, category_id: "c2" },
  { id: "p5", name: "Pronoun Pin Set - Gold Plated", slug: "pronoun-pin-set-gold", description: "Elegant gold-plated pronoun pins featuring she/her, he/him, they/them, and a customizable blank pin.", price: 18.99, compare_at_price: 24.99, images: ["/images/products/pronoun-pins.jpg"], rating: 4.8, review_count: 523, vendors: { store_name: "Pride Accessories" }, category_id: "c6" },
  { id: "p6", name: "Queer Joy Art Print Collection", slug: "queer-joy-art-print-collection", description: "Set of 3 vibrant art prints celebrating queer joy and community. Created by LGBTQ+ artists.", price: 49.99, compare_at_price: null, images: ["/images/products/queer-art-prints.jpg"], rating: 4.8, review_count: 145, vendors: { store_name: "Sanctuary Home" }, category_id: "c4" },
  { id: "p7", name: "Gender-Neutral Streetwear Hoodie", slug: "gender-neutral-streetwear-hoodie", description: "Oversized, cozy hoodie designed without gender constraints.", price: 79.99, compare_at_price: 99.99, images: ["/images/products/streetwear-hoodie.jpg"], rating: 4.6, review_count: 167, vendors: { store_name: "Affirm Apparel" }, category_id: "c1" },
  { id: "p8", name: "Safe Space Neon Sign", slug: "safe-space-neon-sign", description: "LED neon sign that reads \"Safe Space\" in warm pink. Energy-efficient, dimmable.", price: 89.99, compare_at_price: 109.99, images: ["/images/products/safe-space-sign.jpg"], rating: 4.7, review_count: 98, vendors: { store_name: "Sanctuary Home" }, category_id: "c4" },
  { id: "p9", name: "Gender-Affirming Color Corrector Palette", slug: "gender-affirming-color-corrector", description: "Professional-grade color correction palette designed for covering beard shadow.", price: 36.99, compare_at_price: 44.99, images: ["/images/products/color-corrector.jpg"], rating: 4.7, review_count: 156, vendors: { store_name: "Fluid Beauty Collective" }, category_id: "c2" },
  { id: "p10", name: "Rainbow Crystal Bracelet", slug: "rainbow-crystal-bracelet", description: "Handcrafted bracelet featuring natural crystals in rainbow colors.", price: 34.99, compare_at_price: 42.99, images: ["/images/products/crystal-bracelet.jpg"], rating: 4.7, review_count: 178, vendors: { store_name: "Pride Accessories" }, category_id: "c6" },
]

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; min?: string; max?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = demoCategories.find(c => c.slug === slug)

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

  const category = demoCategories.find(c => c.slug === slug)

  if (!category) {
    notFound()
  }

  // Filter products by category
  let products = demoProducts.filter(p => p.category_id === category.id)

  // Apply price filters
  if (min) {
    products = products.filter(p => p.price >= Number.parseFloat(min))
  }
  if (max) {
    products = products.filter(p => p.price <= Number.parseFloat(max))
  }

  // Apply sorting
  switch (sort) {
    case "price-asc":
      products = [...products].sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      products = [...products].sort((a, b) => b.price - a.price)
      break
    case "rating":
      products = [...products].sort((a, b) => b.rating - a.rating)
      break
    case "newest":
    default:
      // Keep original order
      break
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
