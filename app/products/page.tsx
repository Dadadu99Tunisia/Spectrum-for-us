"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart, Heart, Search, Filter, X } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const mockProducts = [
  // Mode - Essentiels
  {
    id: "1",
    name: "Chemise fluide unisexe",
    description: "Chemise légère à coupe droite et boutonnière réversible.",
    price: 75,
    currency: "EUR",
    category: "Mode",
    subcategory: "Essentiels",
    inclusivity: "Non genré",
    materials: "Coton bio",
    image_url: "/unisex-fluid-shirt-minimal.jpg",
    vendor: { name: "Atelier local (Tunis)", avatar_url: null },
    stock: 15,
    tags: ["slowfashion", "unisex"],
    value: "Confort & adaptabilité morphologique",
  },
  // Mode - Lingerie inclusive
  {
    id: "2",
    name: "Brassière compressive douce",
    description: "Brassière de maintien douce, pensée pour les personnes trans et non-binaires.",
    price: 55,
    currency: "EUR",
    category: "Mode",
    subcategory: "Lingerie inclusive",
    inclusivity: "Trans-friendly",
    materials: "Bambou, élasthanne recyclé",
    image_url: "/soft-compression-bra-neutral.jpg",
    vendor: { name: "Marque artisanale queer", avatar_url: null },
    stock: 20,
    tags: ["binder", "bodyneutral"],
    value: "Soutien sans douleur",
  },
  // Mode - Maillots de bain
  {
    id: "3",
    name: "Short & top inclusif",
    description: "Ensemble de bain adapté à toutes morphologies, liant soutien et liberté.",
    price: 80,
    currency: "EUR",
    category: "Mode",
    subcategory: "Maillots de bain",
    inclusivity: "Tous corps",
    materials: "Nylon recyclé",
    image_url: "/inclusive-swimwear-set.jpg",
    vendor: { name: "Fabricant éthique Portugal", avatar_url: null },
    stock: 12,
    tags: ["inclusive", "swim"],
    value: "Respect du corps en mouvement",
  },
  // Accessoires - Bijoux
  {
    id: "4",
    name: 'Collier fluide "Arc"',
    description: "Collier en argent recyclé inspiré des formes naturelles.",
    price: 60,
    currency: "EUR",
    category: "Accessoires",
    subcategory: "Bijoux",
    inclusivity: "Non genré",
    materials: "Argent recyclé",
    image_url: "/fluid-artisan-jewelry-queer.jpg",
    vendor: { name: "Artiste queer Marseille", avatar_url: null },
    stock: 8,
    tags: ["minimal", "design"],
    value: "Artisanat & durabilité",
  },
  // Beauté - Cosmétiques neutres
  {
    id: "5",
    name: "Sérum universel hydratant",
    description: "Sérum léger formulé pour tous types de peau.",
    price: 32,
    currency: "EUR",
    category: "Beauté",
    subcategory: "Cosmétiques neutres",
    inclusivity: "Tous types de peau",
    materials: "Verre, ingrédients naturels",
    image_url: "/minimal-serum-bottle-skincare.jpg",
    vendor: { name: "Laboratoire inclusif Lyon", avatar_url: null },
    stock: 50,
    tags: ["cleanbeauty", "genderfree"],
    value: "Formule clean & neutre",
  },
  // Beauté - Parfums
  {
    id: "6",
    name: 'Parfum "Soil & Skin"',
    description: "Notes boisées et minérales, sans classification de genre.",
    price: 65,
    currency: "EUR",
    category: "Beauté",
    subcategory: "Parfums",
    inclusivity: "Non genré",
    materials: "Verre, huiles naturelles",
    image_url: "/minimal-perfume-bottle-woody.jpg",
    vendor: { name: "Maison artisanale queer", avatar_url: null },
    stock: 25,
    tags: ["parfumneutre", "artisan"],
    value: "Sensorialité libre",
  },
  // Bien-être - Santé intime
  {
    id: "7",
    name: "Lubrifiant naturel neutre",
    description: "Lubrifiant à base d'eau, compatible latex, PH équilibré.",
    price: 20,
    currency: "EUR",
    category: "Bien-être",
    subcategory: "Santé intime",
    inclusivity: "Tous corps",
    materials: "Bouteille verre, formule végane",
    image_url: "/minimal-glass-bottle-intimate.jpg",
    vendor: { name: "Studio intime Berlin", avatar_url: null },
    stock: 100,
    tags: ["sexpositive", "vegan"],
    value: "Santé sexuelle positive",
  },
  // Bien-être - Soins sensoriels
  {
    id: "8",
    name: 'Bougie "Respire"',
    description: "Bougie naturelle, cire de soja, parfum apaisant.",
    price: 25,
    currency: "EUR",
    category: "Bien-être",
    subcategory: "Soins sensoriels",
    inclusivity: "Tous publics",
    materials: "Cire soja, pot verre",
    image_url: "/soy-candle-minimal-glass.jpg",
    vendor: { name: "Créatrice queer Lille", avatar_url: null },
    stock: 60,
    tags: ["selfcare", "madeinfrance"],
    value: "Bien-être mental",
  },
  // Maison - Art & design
  {
    id: "9",
    name: 'Vase "Morphologie"',
    description: "Pièce en céramique évoquant la fluidité des corps.",
    price: 90,
    currency: "EUR",
    category: "Maison",
    subcategory: "Art & design",
    inclusivity: "Non genré",
    materials: "Terre cuite locale",
    image_url: "/ceramic-vase-organic-shape.jpg",
    vendor: { name: "Céramiste queer Paris", avatar_url: null },
    stock: 5,
    tags: ["art", "home"],
    value: "Design artisanal",
  },
  // Maison - Textile
  {
    id: "10",
    name: "Plaid tissé main",
    description: "Plaid chaud et texturé, tissé artisanalement.",
    price: 120,
    currency: "EUR",
    category: "Maison",
    subcategory: "Textile",
    inclusivity: "Tous foyers",
    materials: "Laine recyclée",
    image_url: "/handwoven-blanket-texture.jpg",
    vendor: { name: "Atelier coopératif Tunisie", avatar_url: null },
    stock: 10,
    tags: ["durable", "artisanat"],
    value: "Artisanat éthique",
  },
  // Culture - Édition
  {
    id: "11",
    name: 'Zine "Fluides"',
    description: "Publication queer sur le corps, la mémoire et la langue.",
    price: 12,
    currency: "EUR",
    category: "Culture",
    subcategory: "Édition",
    inclusivity: "Queer",
    materials: "Papier recyclé",
    image_url: "/queer-zine-magazine-cover.jpg",
    vendor: { name: "Collectif queer Maghreb", avatar_url: null },
    stock: 200,
    tags: ["zine", "edition"],
    value: "Transmission culturelle",
  },
  // Sexualité & Intimité - Sextoys universels
  {
    id: "12",
    name: 'Stimulateur ergonomique "Flow"',
    description: "Sextoy modulable, silicone médical, design neutre.",
    price: 89,
    currency: "EUR",
    category: "Sexualité & Intimité",
    subcategory: "Sextoys universels",
    inclusivity: "Tous corps",
    materials: "Silicone médical, USB",
    image_url: "/ergonomic-toy-minimal-design.jpg",
    vendor: { name: "Fab. éthique Allemagne", avatar_url: null },
    stock: 30,
    tags: ["plaisir", "nonbinaire"],
    value: "Plaisir sans genre",
  },
  // Sexualité & Intimité - Sextoys trans-friendly
  {
    id: "13",
    name: 'Dildo soft "Nova"',
    description: "Dildo souple adapté pour pack & play ou pénétration douce.",
    price: 95,
    currency: "EUR",
    category: "Sexualité & Intimité",
    subcategory: "Sextoys trans-friendly",
    inclusivity: "Trans-friendly",
    materials: "Silicone hypoallergénique",
    image_url: "/soft-silicone-toy-neutral.jpg",
    vendor: { name: "Créatrice trans Amsterdam", avatar_url: null },
    stock: 15,
    tags: ["transfriendly", "inclusive"],
    value: "Ergonomie inclusive",
  },
  // Sexualité & Intimité - Sensoriel
  {
    id: "14",
    name: 'Kit "Découverte tactile"',
    description: "Ensemble d'objets sensoriels (plume, corde douce, huile).",
    price: 60,
    currency: "EUR",
    category: "Sexualité & Intimité",
    subcategory: "Sensoriel",
    inclusivity: "Tous genres",
    materials: "Coton, bambou, verre",
    image_url: "/sensory-kit-minimal-box.jpg",
    vendor: { name: "Studio queer Barcelone", avatar_url: null },
    stock: 25,
    tags: ["consentement", "sensoriel"],
    value: "Exploration consentie",
  },
  // Sexualité & Intimité - Lubrifiants & soins
  {
    id: "15",
    name: "Huile intime apaisante",
    description: "Huile végétale apaisante post-acte, sans parfum.",
    price: 25,
    currency: "EUR",
    category: "Sexualité & Intimité",
    subcategory: "Lubrifiants & soins",
    inclusivity: "Peaux sensibles",
    materials: "Jojoba, camomille",
    image_url: "/intimate-oil-glass-bottle.jpg",
    vendor: { name: "Coop féministe Lyon", avatar_url: null },
    stock: 80,
    tags: ["intime", "safe"],
    value: "Soin du corps intime",
  },
  // Sexualité & Intimité - Éducation
  {
    id: "16",
    name: 'Guide "Plaisir & consentement"',
    description: "Manuel illustré sur le respect, le corps et le plaisir.",
    price: 18,
    currency: "EUR",
    category: "Sexualité & Intimité",
    subcategory: "Éducation",
    inclusivity: "Tous publics",
    materials: "Papier recyclé",
    image_url: "/illustrated-guide-book-cover.jpg",
    vendor: { name: "Maison d'édition queer", avatar_url: null },
    stock: 150,
    tags: ["educationsexuelle", "queer"],
    value: "Pédagogie & empowerment",
  },
  // Sexualité & Intimité - Lingerie érotique
  {
    id: "17",
    name: "Body souple inclusif",
    description: "Body en tulle extensible, conçu pour le confort de tous les corps.",
    price: 85,
    currency: "EUR",
    category: "Sexualité & Intimité",
    subcategory: "Lingerie érotique",
    inclusivity: "Non genré",
    materials: "Tulle recyclé",
    image_url: "/placeholder.svg?height=400&width=400",
    vendor: { name: "Créateur queer Paris", avatar_url: null },
    stock: 18,
    tags: ["bodypositive", "lingerie"],
    value: "Sensualité libre",
  },
  // Additional products for variety
  {
    id: "18",
    name: "Veste oversized non-genrée",
    description: "Coupe ample et confortable, matières durables. Pour tous les corps.",
    price: 89,
    currency: "EUR",
    category: "Mode",
    subcategory: "Essentiels",
    inclusivity: "Non genré",
    materials: "Coton bio",
    image_url: "/oversized-gender-neutral-jacket-fashion.jpg",
    vendor: { name: "Atelier Fluide", avatar_url: null },
    stock: 15,
    tags: ["sustainable", "unisex", "comfort"],
    value: "Confort & adaptabilité",
  },
  {
    id: "19",
    name: 'Affiche "Belonging"',
    description: "Illustration originale célébrant la diversité et l'appartenance.",
    price: 35,
    currency: "EUR",
    category: "Maison",
    subcategory: "Art & design",
    inclusivity: "Inclusif",
    materials: "Papier recyclé",
    image_url: "/queer-art-poster-belonging-illustration.jpg",
    vendor: { name: "Studio Prisme", avatar_url: null },
    stock: 50,
    tags: ["art", "poster", "inclusive"],
    value: "Célébration de la diversité",
  },
  {
    id: "20",
    name: 'Livre "Voix Queers"',
    description: "Recueil de témoignages et récits de la communauté LGBTQIA+.",
    price: 22,
    currency: "EUR",
    category: "Culture",
    subcategory: "Édition",
    inclusivity: "Communautaire",
    materials: "Papier FSC",
    image_url: "/queer-voices-book-cover-diverse.jpg",
    vendor: { name: "Éditions Spectre", avatar_url: null },
    stock: 100,
    tags: ["book", "stories", "community"],
    value: "Transmission culturelle",
  },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 150])
  const [selectedInclusivity, setSelectedInclusivity] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [sortBy, setSortBy] = useState("newest")

  const categories = ["Tous", "Mode", "Accessoires", "Beauté", "Bien-être", "Maison", "Culture", "Sexualité & Intimité"]

  const subcategoriesByCategory: Record<string, string[]> = {
    Mode: ["Essentiels", "Lingerie inclusive", "Maillots de bain"],
    Accessoires: ["Bijoux"],
    Beauté: ["Cosmétiques neutres", "Parfums"],
    "Bien-être": ["Santé intime", "Soins sensoriels"],
    Maison: ["Art & design", "Textile"],
    Culture: ["Édition", "Audio"],
    "Sexualité & Intimité": [
      "Sextoys universels",
      "Sextoys trans-friendly",
      "Sensoriel",
      "Lubrifiants & soins",
      "Éducation",
      "Lingerie érotique",
    ],
  }

  const inclusivityOptions = [
    "Non genré",
    "Trans-friendly",
    "Tous corps",
    "Inclusif",
    "Queer",
    "Tous publics",
    "Peaux sensibles",
    "Communautaire",
  ]

  const materialOptions = [
    "Coton bio",
    "Bambou",
    "Argent recyclé",
    "Silicone médical",
    "Papier recyclé",
    "Verre",
    "Laine recyclée",
  ]

  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesSubcategory =
        selectedSubcategory === "all" || !selectedSubcategory || product.subcategory === selectedSubcategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesInclusivity = selectedInclusivity.length === 0 || selectedInclusivity.includes(product.inclusivity)
      const matchesMaterials =
        selectedMaterials.length === 0 ||
        selectedMaterials.some((mat) => product.materials.toLowerCase().includes(mat.toLowerCase()))

      return (
        matchesSearch && matchesCategory && matchesSubcategory && matchesPrice && matchesInclusivity && matchesMaterials
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const addToCart = (product: any) => {
    setCart([...cart, product])
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setSelectedSubcategory("all")
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedSubcategory("all")
    setPriceRange([0, 150])
    setSelectedInclusivity([])
    setSelectedMaterials([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">Shop</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Découvrez des créations uniques par et pour la communauté queer
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Search and Cart */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative bg-transparent w-full sm:w-auto">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Panier
                {cart.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Votre Panier</SheetTitle>
                <SheetDescription>
                  {cart.length} article{cart.length > 1 ? "s" : ""}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-4 max-h-[60vh] overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price}€</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeFromCart(index)} className="flex-shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-center text-muted-foreground py-8">Votre panier est vide</p>}
              </div>
              {cart.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{cartTotal.toFixed(2)}€</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Passer la commande
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="h-4 w-4" />
                    Filtres
                  </CardTitle>
                  {(selectedCategory !== "all" ||
                    selectedInclusivity.length > 0 ||
                    selectedMaterials.length > 0 ||
                    priceRange[0] !== 0 ||
                    priceRange[1] !== 150) && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Catégorie</Label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory Filter */}
                {selectedCategory !== "all" && subcategoriesByCategory[selectedCategory] && (
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Sous-catégorie</Label>
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        {subcategoriesByCategory[selectedCategory].map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>
                            {subcat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Prix: {priceRange[0]}€ - {priceRange[1]}€
                  </Label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={150} step={5} className="mt-2" />
                </div>

                {/* Inclusivity Filter */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Inclusivité</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {inclusivityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`incl-${option}`}
                          checked={selectedInclusivity.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedInclusivity([...selectedInclusivity, option])
                            } else {
                              setSelectedInclusivity(selectedInclusivity.filter((i) => i !== option))
                            }
                          }}
                        />
                        <Label htmlFor={`incl-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials Filter */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Matériaux</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {materialOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mat-${option}`}
                          checked={selectedMaterials.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMaterials([...selectedMaterials, option])
                            } else {
                              setSelectedMaterials(selectedMaterials.filter((m) => m !== option))
                            }
                          }}
                        />
                        <Label htmlFor={`mat-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                  <SelectItem value="name">Nom A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <CardHeader className="p-0 relative">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 flex-1">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {product.subcategory || product.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {product.inclusivity}
                      </Badge>
                    </div>
                    <CardTitle className="text-base md:text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mb-4 text-sm">{product.description}</CardDescription>
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="text-xl md:text-2xl font-bold">{product.price}€</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{product.vendor.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{product.materials}</p>
                  </CardContent>
                  <CardFooter className="p-4 md:p-6 pt-0 gap-2">
                    <Button className="flex-1 text-sm" asChild>
                      <Link href={`/products/${product.id}`}>Voir détails</Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-2">Aucun produit ne correspond à vos critères</p>
                <p className="text-sm text-muted-foreground mb-4">Essayez de modifier vos filtres</p>
                <Button variant="outline" className="bg-transparent" onClick={clearAllFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
