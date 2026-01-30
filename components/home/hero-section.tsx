import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">New vendors joining daily</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Discover Unique Products from <span className="text-primary">Independent Sellers</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg text-pretty">
              Spectrum brings together thousands of vendors offering unique, handcrafted, and exclusive products you
              won&apos;t find anywhere else.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/categories">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/become-vendor">Become a Seller</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Vendors</p>
              </div>
              <div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                  <img src="/elegant-dress-model.png" alt="Fashion" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 overflow-hidden">
                  <img src="/modern-electronics-gadget.jpg" alt="Electronics" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-chart-3/20 to-chart-3/5 overflow-hidden">
                  <img src="/handmade-jewelry-artisan.jpg" alt="Jewelry" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-chart-4/20 to-chart-4/5 overflow-hidden">
                  <img src="/home-decor-minimalist.jpg" alt="Home Decor" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
