import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, ShoppingCart, Star, Search, SlidersHorizontal } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Pride Rainbow Tee",
    price: 29.99,
    image: "/rainbow-pride-t-shirt.jpg",
    category: "Clothing",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Trans Flag Pin Set",
    price: 12.99,
    image: "/transgender-flag-pins.jpg",
    category: "Accessories",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 3,
    name: "Bi Pride Hoodie",
    price: 49.99,
    image: "/bisexual-pride-hoodie.jpg",
    category: "Clothing",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "Lesbian Flag Sticker Pack",
    price: 8.99,
    image: "/lesbian-pride-stickers.jpg",
    category: "Accessories",
    rating: 4.6,
    reviews: 203,
  },
  {
    id: 5,
    name: "Non-Binary Pride Tank",
    price: 24.99,
    image: "/non-binary-pride-tank-top.jpg",
    category: "Clothing",
    rating: 4.8,
    reviews: 92,
  },
  {
    id: 6,
    name: "Pan Pride Enamel Pin",
    price: 9.99,
    image: "/pansexual-pride-enamel-pin.jpg",
    category: "Accessories",
    rating: 4.7,
    reviews: 145,
  },
  {
    id: 7,
    name: "Ace Pride Beanie",
    price: 19.99,
    image: "/asexual-pride-beanie-hat.jpg",
    category: "Accessories",
    rating: 4.9,
    reviews: 78,
  },
  {
    id: 8,
    name: "Genderfluid Pride Tote",
    price: 16.99,
    image: "/genderfluid-pride-tote-bag.jpg",
    category: "Accessories",
    rating: 4.6,
    reviews: 112,
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500" />
              <span className="text-xl font-bold">Spectrum</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium text-primary">
                Products
              </Link>
              <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Link href="/auth/login">
                <Button variant="default">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection of pride merchandise</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
          <Button variant="outline" className="md:w-auto bg-transparent">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  <p className="text-lg font-bold">${product.price}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-transparent" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
