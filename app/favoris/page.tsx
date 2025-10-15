"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Heart, ShoppingBag, Store } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Données fictives pour les favoris
const favoriteProducts = [
  {
    id: "1",
    name: "T-shirt Pride Collection",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: { name: "QueerApparel", id: "seller1" },
    category: "Vêtements",
  },
  {
    id: "2",
    name: "Boucles d'oreilles Arc-en-ciel",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: { name: "PrideJewelry", id: "seller2" },
    category: "Bijoux",
  },
  {
    id: "5",
    name: "Drapeau Progress Pride",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: { name: "PrideFlagShop", id: "seller5" },
    category: "Décoration",
  },
  {
    id: "6",
    name: "Bracelet Pronoms Personnalisé",
    price: 15.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: { name: "IdentityJewels", id: "seller6" },
    category: "Bijoux",
  },
]

const favoriteSellers = [
  {
    id: "seller1",
    name: "QueerApparel",
    description: "Vêtements et accessoires inclusifs pour toutes les identités.",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    productCount: 45,
    category: "Vêtements",
  },
  {
    id: "seller2",
    name: "PrideJewelry",
    description: "Bijoux artisanaux célébrant la diversité et l'expression de soi.",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    productCount: 32,
    category: "Bijoux",
  },
]

export default function FavorisPage() {
  const [products, setProducts] = useState(favoriteProducts)
  const [sellers, setSellers] = useState(favoriteSellers)

  const removeProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  const removeSeller = (sellerId: string) => {
    setSellers(sellers.filter((seller) => seller.id !== sellerId))
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Favoris</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Mes Favoris</h1>
      <p className="text-muted-foreground mb-8">
        Retrouvez ici tous les produits et vendeurs que vous avez ajoutés à vos favoris.
      </p>

      <Tabs defaultValue="products" className="mb-8">
        <TabsList>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Produits
            <Badge variant="outline" className="ml-1">
              {products.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sellers" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Vendeurs
            <Badge variant="outline" className="ml-1">
              {sellers.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit favori</h3>
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
              <Button asChild>
                <Link href="/boutique">Explorer les produits</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/80 hover:bg-white text-pink-500"
                        onClick={() => removeProduct(product.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                        <span className="sr-only">Retirer des favoris</span>
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-purple-500 hover:bg-purple-600">{product.category}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <Link href={`/produit/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <Link
                      href={`/vendeur/${product.seller.id}`}
                      className="text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      par {product.seller.name}
                    </Link>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <span className="font-bold">{product.price.toFixed(2)} €</span>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sellers" className="mt-6">
          {sellers.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun vendeur favori</h3>
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore ajouté de vendeurs à vos favoris.</p>
              <Button asChild>
                <Link href="/vendeurs">Explorer les vendeurs</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellers.map((seller) => (
                <Card key={seller.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={seller.image || "/placeholder.svg"}
                      alt={seller.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/80 hover:bg-white text-pink-500"
                        onClick={() => removeSeller(seller.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                        <span className="sr-only">Retirer des favoris</span>
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-purple-500 hover:bg-purple-600 mb-2">{seller.category}</Badge>
                      <h3 className="text-xl font-bold text-white">{seller.name}</h3>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{seller.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{seller.productCount} produits</span>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/vendeur/${seller.id}`}>Voir la boutique</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
