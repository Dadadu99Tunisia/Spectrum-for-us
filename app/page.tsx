import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Heart, ShoppingCart, Sparkles, CheckCircle2, Search, SlidersHorizontal } from "lucide-react"
import { MobileCategoryGrid } from "@/components/mobile-category-grid"

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "Chunky Knit Sweater",
      vendor: "CozyCreations",
      price: 89,
      image: "/oversized-gender-neutral-jacket-fashion.jpg",
      tags: ["Handmade", "Trans-Owned"],
      color: "border-electric-blue",
      shadowColor: "shadow-blue",
    },
    {
      id: 2,
      name: "Abstract Joy Print",
      vendor: "ArtfulSoul",
      price: 45,
      image: "/queer-art-poster-belonging-illustration.jpg",
      tags: ["Upcycled", "Local"],
      color: "border-zesty-orange",
      shadowColor: "shadow-orange",
    },
    {
      id: 3,
      name: "Fluid Statement Ring",
      vendor: "GenderFreeGems",
      price: 65,
      image: "/fluid-artisan-jewelry-queer.jpg",
      tags: ["Handmade", "Unique"],
      color: "border-fresh-teal",
      shadowColor: "shadow-teal",
    },
    {
      id: 4,
      name: "Inclusive Stories Book",
      vendor: "QueerReads",
      price: 28,
      image: "/queer-voices-book-cover-diverse.jpg",
      tags: ["LGBTQ+", "Inspiring"],
      color: "border-poppy-red",
      shadowColor: "shadow-red",
    },
    {
      id: 5,
      name: "Eco Pride Tote",
      vendor: "SustainablePride",
      price: 32,
      image: "/gender-neutral-fashion-editorial.jpg",
      tags: ["Sustainable", "Vegan"],
      color: "border-electric-blue",
      shadowColor: "shadow-blue",
    },
    {
      id: 6,
      name: "Affirmation Candle Set",
      vendor: "WarmVibes",
      price: 38,
      image: "/queer-entrepreneur-workspace-creative.jpg",
      tags: ["Self-Care", "Handmade"],
      color: "border-zesty-orange",
      shadowColor: "shadow-orange",
    },
  ]

  const vibeCategories = [
    { name: "Wear", icon: "👕", color: "bg-electric-blue", href: "/products?category=wear" },
    { name: "Decorate", icon: "🎨", color: "bg-zesty-orange", href: "/products?category=decorate" },
    { name: "Read", icon: "📚", color: "bg-fresh-teal", href: "/products?category=read" },
    { name: "Play", icon: "🎮", color: "bg-poppy-red", href: "/products?category=play" },
    { name: "Care", icon: "💆", color: "bg-sunshine-yellow", href: "/products?category=care" },
  ]

  const filterMoods = ["Joyful", "Bold", "Cozy", "Minimal", "Retro"]
  const filterColors = ["Electric Blue", "Zesty Orange", "Sunshine Yellow", "Poppy Red", "Fresh Teal"]

  return (
    <div className="flex flex-col pb-20 lg:pb-0 bg-cream">
      {/* Hero Section - Bright & Welcoming */}
      <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden bg-cream">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-electric-blue/10 blob-shape blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-zesty-orange/10 blob-shape blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-fresh-teal/10 blob-shape blur-3xl" aria-hidden="true" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Fun Badge */}
            <Badge className="bg-sunshine-yellow text-charcoal border-0 px-6 py-2 text-sm font-bold rounded-full shadow-lg">
              <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />
              New Makers Joining Daily
            </Badge>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-charcoal text-balance">
              Queer Joy is{" "}
              <span className="relative inline-block">
                <span className="gradient-text">Essential</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" aria-hidden="true">
                  <path d="M2 8C50 2 150 2 198 8" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              Shop Authentic.
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl lg:text-2xl text-charcoal/80 max-w-3xl mx-auto leading-relaxed text-pretty">
              A marketplace brimming with creators like you. Discover handmade goods, art, and joy from LGBTQ+ makers worldwide.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-electric-blue hover:bg-electric-blue/90 text-white font-bold text-lg px-10 py-7 rounded-full shadow-blue hover-bounce"
                asChild
              >
                <Link href="/products">
                  Dive In
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {/* Hero Search Bar */}
            <div className="max-w-2xl mx-auto pt-6">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/50" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Find Joy: search makers, art, gear..."
                  className="pl-14 pr-6 h-14 w-full rounded-full border-3 border-zesty-orange bg-white text-charcoal placeholder:text-charcoal/50 text-base focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/20"
                  aria-label="Search products and makers"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vibe Navigation Categories */}
      <section className="py-8 bg-white border-y-3 border-charcoal/10">
        <div className="container mx-auto px-4">
          <nav aria-label="Product categories">
            <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
              {vibeCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <span className={`w-16 h-16 md:w-20 md:h-20 ${category.color} rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-lg hover-bounce group-focus:ring-4 group-focus:ring-charcoal/30`}>
                      {category.icon}
                    </span>
                    <span className="text-sm md:text-base font-bold text-charcoal group-hover:text-electric-blue transition-colors">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Mobile Category Grid */}
      <section className="py-6 bg-cream md:hidden">
        <div className="container mx-auto px-4">
          <MobileCategoryGrid />
        </div>
      </section>

      {/* Main Content: Sidebar + Product Grid */}
      <section className="py-12 lg:py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 space-y-8">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="h-5 w-5 text-electric-blue" aria-hidden="true" />
                  <h2 className="text-xl font-bold text-charcoal">Filters</h2>
                </div>

                {/* Mood Filter */}
                <fieldset className="bg-white rounded-3xl p-6 border-3 border-electric-blue/20">
                  <legend className="text-base font-bold text-charcoal mb-4 px-2">Mood</legend>
                  <div className="space-y-3">
                    {filterMoods.map((mood) => (
                      <div key={mood} className="flex items-center gap-3">
                        <Checkbox
                          id={`mood-${mood}`}
                          className="h-5 w-5 rounded-lg border-2 border-zesty-orange data-[state=checked]:bg-zesty-orange data-[state=checked]:border-zesty-orange"
                        />
                        <label htmlFor={`mood-${mood}`} className="text-sm font-medium text-charcoal cursor-pointer">
                          {mood}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {/* Color Pop Filter */}
                <fieldset className="bg-white rounded-3xl p-6 border-3 border-zesty-orange/20">
                  <legend className="text-base font-bold text-charcoal mb-4 px-2">Color Pop</legend>
                  <div className="space-y-3">
                    {filterColors.map((color) => (
                      <div key={color} className="flex items-center gap-3">
                        <Checkbox
                          id={`color-${color}`}
                          className="h-5 w-5 rounded-lg border-2 border-fresh-teal data-[state=checked]:bg-fresh-teal data-[state=checked]:border-fresh-teal"
                        />
                        <label htmlFor={`color-${color}`} className="text-sm font-medium text-charcoal cursor-pointer">
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {/* Fit Vibe Filter */}
                <fieldset className="bg-white rounded-3xl p-6 border-3 border-fresh-teal/20">
                  <legend className="text-base font-bold text-charcoal mb-4 px-2">Fit Vibe</legend>
                  <div className="space-y-3">
                    {["Unisex", "Oversized", "Cropped", "Flowy", "Structured"].map((fit) => (
                      <div key={fit} className="flex items-center gap-3">
                        <Checkbox
                          id={`fit-${fit}`}
                          className="h-5 w-5 rounded-lg border-2 border-poppy-red data-[state=checked]:bg-poppy-red data-[state=checked]:border-poppy-red"
                        />
                        <label htmlFor={`fit-${fit}`} className="text-sm font-medium text-charcoal cursor-pointer">
                          {fit}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-charcoal">
                    Coups de Coeur
                  </h2>
                  <p className="text-charcoal/70 mt-1">Curated picks from our community</p>
                </div>
                <Button variant="ghost" className="hidden md:flex text-electric-blue font-bold hover:bg-electric-blue/10" asChild>
                  <Link href="/products">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {featuredProducts.map((product) => (
                  <article
                    key={product.id}
                    className={`group bg-white rounded-3xl border-3 ${product.color} overflow-hidden hover-bounce ${product.shadowColor}`}
                  >
                    <Link href={`/products/${product.id}`} className="block">
                      {/* Product Image */}
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Hover Add to Cart */}
                        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            size="lg"
                            className="bg-zesty-orange hover:bg-zesty-orange/90 text-white font-bold rounded-full px-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                            onClick={(e) => {
                              e.preventDefault()
                              // Add to cart logic
                            }}
                          >
                            <ShoppingCart className="mr-2 h-5 w-5" aria-hidden="true" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-4 lg:p-5">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-sunshine-yellow/30 text-charcoal border-0 text-xs font-bold rounded-full px-3"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-base lg:text-lg font-bold text-charcoal mb-1 line-clamp-2 group-hover:text-electric-blue transition-colors">
                          {product.name}
                        </h3>

                        {/* Vendor */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="text-sm text-charcoal/70">{product.vendor}</span>
                          <CheckCircle2 className="h-4 w-4 text-fresh-teal" aria-label="Verified seller" />
                        </div>

                        {/* Price & Favorite */}
                        <div className="flex items-center justify-between">
                          <span className="text-xl lg:text-2xl font-black text-zesty-orange">
                            ${product.price}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 rounded-full hover:bg-poppy-red/10 group-hover:text-poppy-red"
                            onClick={(e) => {
                              e.preventDefault()
                              // Favorite logic
                            }}
                            aria-label={`Add ${product.name} to favorites`}
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* View All Mobile */}
              <div className="text-center mt-8 md:hidden">
                <Button
                  className="bg-electric-blue hover:bg-electric-blue/90 text-white font-bold rounded-full px-8 py-6"
                  asChild
                >
                  <Link href="/products">
                    View All Products
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Party CTA */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-electric-blue via-zesty-orange via-sunshine-yellow via-fresh-teal to-poppy-red" aria-hidden="true" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-poppy-red text-white border-0 px-6 py-2 text-sm font-bold rounded-full mb-6">
            Join 500+ Creators
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-charcoal mb-4 text-balance">
            Sell & Join the Party
          </h2>
          
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto mb-8 text-pretty">
            Turn your passion into a thriving business. Connect with a community that celebrates authenticity.
          </p>
          
          <Button
            size="lg"
            className="bg-zesty-orange hover:bg-zesty-orange/90 text-white font-bold text-lg px-10 py-7 rounded-full shadow-orange hover-bounce"
            asChild
          >
            <Link href="/vendor-subscription">
              Start Selling Today
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
