import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { FeaturedVendors } from "@/components/home/featured-vendors"

// Demo data for when database is not set up yet
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
  { id: "p1", name: "Abstract Art Wheelchair Spoke Guards", slug: "abstract-art-wheelchair-spoke-guards", description: "Transform your wheelchair into a statement piece with these stunning abstract art spoke guards.", price: 89.99, compare_at_price: 119.99, images: ["/images/products/wheelchair-spoke-guards.jpg"], rating: 4.9, review_count: 156, vendors: { store_name: "Radiant Mobility Co." } },
  { id: "p2", name: "Breathable Chest Binder - Nude Tone", slug: "breathable-chest-binder-nude", description: "Our most comfortable binder yet. Breathable mesh panels, 8+ hours of safe wear.", price: 54.99, compare_at_price: 64.99, images: ["/images/products/chest-binder.jpg"], rating: 4.8, review_count: 412, vendors: { store_name: "Affirm Apparel" } },
  { id: "p3", name: "Magnetic Button Silk Shirt", slug: "magnetic-button-silk-shirt", description: "Elegant silk shirt with hidden magnetic closures for easy dressing.", price: 129.99, compare_at_price: 159.99, images: ["/images/products/magnetic-silk-shirt.jpg"], rating: 4.7, review_count: 78, vendors: { store_name: "Radiant Mobility Co." } },
  { id: "p4", name: "Trans-Owned Organic Beard Oil", slug: "trans-owned-organic-beard-oil", description: "Nourishing beard oil made with organic argan, jojoba, and cedar essential oils.", price: 24.99, compare_at_price: null, images: ["/images/products/beard-oil.jpg"], rating: 4.8, review_count: 187, vendors: { store_name: "Fluid Beauty Collective" } },
  { id: "p5", name: "Pronoun Pin Set - Gold Plated", slug: "pronoun-pin-set-gold", description: "Elegant gold-plated pronoun pins featuring she/her, he/him, they/them, and a customizable blank pin.", price: 18.99, compare_at_price: 24.99, images: ["/images/products/pronoun-pins.jpg"], rating: 4.8, review_count: 523, vendors: { store_name: "Pride Accessories" } },
  { id: "p6", name: "Queer Joy Art Print Collection", slug: "queer-joy-art-print-collection", description: "Set of 3 vibrant art prints celebrating queer joy and community. Created by LGBTQ+ artists.", price: 49.99, compare_at_price: null, images: ["/images/hero/pride-accessories.jpg"], rating: 4.8, review_count: 145, vendors: { store_name: "Sanctuary Home" } },
  { id: "p7", name: "Gender-Neutral Streetwear Hoodie", slug: "gender-neutral-streetwear-hoodie", description: "Oversized, cozy hoodie designed without gender constraints.", price: 79.99, compare_at_price: 99.99, images: ["/images/hero/adaptive-fashion.jpg"], rating: 4.6, review_count: 167, vendors: { store_name: "Affirm Apparel" } },
  { id: "p8", name: "Safe Space Neon Sign", slug: "safe-space-neon-sign", description: "LED neon sign that reads \"Safe Space\" in warm pink. Energy-efficient, dimmable.", price: 89.99, compare_at_price: 109.99, images: ["/images/hero/inclusive-home-decor.jpg"], rating: 4.7, review_count: 98, vendors: { store_name: "Sanctuary Home" } },
]

const demoVendors = [
  { id: "v1", store_name: "Radiant Mobility Co.", store_description: "Disability-led brand creating high-fashion adaptive gear. We believe mobility aids should be as stylish as they are functional.", store_logo: "/images/categories/adaptive-mobility.jpg", is_verified: true, rating: 4.9, total_sales: 1850 },
  { id: "v2", store_name: "Affirm Apparel", store_description: "Trans-owned fashion house specializing in gender-affirming clothing, binders, and tucking lingerie.", store_logo: "/images/categories/fashion-apparel.jpg", is_verified: true, rating: 4.8, total_sales: 2340 },
  { id: "v3", store_name: "Sanctuary Home", store_description: "Queer-owned home decor celebrating LGBTQ+ art, literature, and safe space aesthetics.", store_logo: "/images/categories/home-sanctuary.jpg", is_verified: true, rating: 4.7, total_sales: 1120 },
  { id: "v4", store_name: "Fluid Beauty Collective", store_description: "Gender-affirming beauty and grooming products for all. Skincare, beard care, and makeup without boundaries.", store_logo: "/images/categories/beauty-grooming.jpg", is_verified: true, rating: 4.8, total_sales: 1560 },
]

export default async function HomePage() {
  // Use demo data - database tables are not set up yet
  // Once you run the SQL scripts (001-create-tables.sql, 002-enable-rls.sql, 003-seed-data.sql),
  // the app will fetch real data from the database
  const categories = demoCategories
  const featuredProducts = demoProducts.slice(0, 4)
  const newArrivals = demoProducts.slice(4)
  const topVendors = demoVendors

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
