import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Users, Sparkles, TrendingUp, Shield, Globe2, ChevronRight } from "lucide-react"
import { MobileCategoryGrid } from "@/components/mobile-category-grid"

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "Veste Oversized Non-Genrée",
      creator: "Alex Chen",
      price: "89€",
      image: "/oversized-gender-neutral-jacket-fashion.jpg",
      category: "Mode",
      tags: ["Non-genré", "Sustainable"],
    },
    {
      id: 2,
      name: "Affiche Artistique 'Belonging'",
      creator: "Sam Rivera",
      price: "35€",
      image: "/queer-art-poster-belonging-illustration.jpg",
      category: "Art",
      tags: ["Illustration", "Inclusif"],
    },
    {
      id: 3,
      name: "Bijoux Artisanaux Fluides",
      creator: "Jordan Lee",
      price: "65€",
      image: "/fluid-artisan-jewelry-queer.jpg",
      category: "Bijoux",
      tags: ["Fait main", "Unique"],
    },
    {
      id: 4,
      name: "Livre 'Voix Plurielles'",
      creator: "Casey Morgan",
      price: "24€",
      image: "/queer-voices-book-cover-diverse.jpg",
      category: "Littérature",
      tags: ["Témoignages", "Inspirant"],
    },
  ]

  const blogPosts = [
    {
      title: "La Mode Non-Genrée : Au-delà des Étiquettes",
      excerpt:
        "Comment la communauté queer redéfinit les codes vestimentaires et crée de nouveaux espaces d'expression.",
      author: "Morgan Dubois",
      date: "15 Jan 2025",
      image: "/gender-neutral-fashion-editorial.jpg",
      category: "Mode & Style",
    },
    {
      title: "Entrepreneuriat Queer : Créer son Propre Chemin",
      excerpt: "Rencontre avec 5 entrepreneur·e·s qui ont transformé leur vision en business florissant.",
      author: "Alex Martin",
      date: "12 Jan 2025",
      image: "/queer-entrepreneur-workspace-creative.jpg",
      category: "Business",
    },
    {
      title: "L'Art comme Résistance et Célébration",
      excerpt:
        "Explorer comment les artistes queer utilisent leur créativité pour raconter des histoires authentiques.",
      author: "Sam Lefebvre",
      date: "10 Jan 2025",
      image: "/queer-art-gallery-colorful-exhibition.jpg",
      category: "Culture",
    },
  ]

  return (
    <div className="flex flex-col pb-20 lg:pb-0">
      {/* Hero Section */}
      <section className="relative gradient-hero py-12 md:py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 lg:space-y-8 text-white text-center lg:text-left">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 mx-auto lg:mx-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Nouvelle Collection Printemps 2025
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-balance">
                  Votre Espace,
                  <br />
                  Vos Règles
                </h1>

                <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed text-pretty">
                  Découvrez une marketplace où chaque produit raconte une histoire, où chaque créateur·rice célèbre
                  l'authenticité.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-xl text-base lg:text-lg px-6 lg:px-8 h-12 lg:h-14 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/products">
                      Explorer le Catalogue
                      <ArrowRight className="ml-2 h-4 lg:h-5 w-4 lg:w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur border-2 border-white text-white hover:bg-white/20 text-base lg:text-lg px-6 lg:px-8 h-12 lg:h-14 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/about">En Savoir Plus</Link>
                  </Button>
                </div>

                {/* Stats - Mobile Optimized */}
                <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-8 pt-4">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl lg:text-3xl font-bold">2,500+</div>
                    <div className="text-white/80 text-xs lg:text-sm">Produits</div>
                  </div>
                  <div className="h-10 lg:h-12 w-px bg-white/30" />
                  <div className="text-center lg:text-left">
                    <div className="text-2xl lg:text-3xl font-bold">500+</div>
                    <div className="text-white/80 text-xs lg:text-sm">Créateur·rice·s</div>
                  </div>
                  <div className="h-10 lg:h-12 w-px bg-white/30" />
                  <div className="text-center lg:text-left">
                    <div className="text-2xl lg:text-3xl font-bold">15</div>
                    <div className="text-white/80 text-xs lg:text-sm">Pays</div>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl hover-lift">
                  <Image
                    src="/diverse-queer-people-celebrating-authentic-fashion.jpg"
                    alt="Communauté Spectrum"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400" />
                    <div>
                      <div className="font-semibold text-sm">Nouveau Vendeur</div>
                      <div className="text-xs text-muted-foreground">Il y a 2 minutes</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">"Rejoindre Spectrum a transformé mon business !"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Catégories</h2>
            <Link href="/products" className="text-sm text-primary font-medium flex items-center gap-1">
              Tout voir
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <MobileCategoryGrid />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 lg:py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex flex-col items-center text-center">
              <Shield className="h-8 lg:h-10 w-8 lg:w-10 text-primary mb-2 lg:mb-3" />
              <h3 className="font-semibold text-sm lg:text-base mb-1">Paiement Sécurisé</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Transactions protégées</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Globe2 className="h-8 lg:h-10 w-8 lg:w-10 text-primary mb-2 lg:mb-3" />
              <h3 className="font-semibold text-sm lg:text-base mb-1">Livraison Mondiale</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Dans 15 pays</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Heart className="h-8 lg:h-10 w-8 lg:w-10 text-primary mb-2 lg:mb-3" />
              <h3 className="font-semibold text-sm lg:text-base mb-1">Fait avec Amour</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Par des créateur·rice·s</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="h-8 lg:h-10 w-8 lg:w-10 text-primary mb-2 lg:mb-3" />
              <h3 className="font-semibold text-sm lg:text-base mb-1">Communauté Active</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Support 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6 lg:mb-12">
            <div>
              <Badge className="mb-3 lg:mb-4">
                <TrendingUp className="h-3 w-3 mr-1" />
                Tendances
              </Badge>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-balance">Coups de Cœur</h2>
              <p className="text-sm lg:text-lg text-muted-foreground mt-2 lg:mt-3">Sélectionnés par notre communauté</p>
            </div>
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link href="/products">
                Tout Voir
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover-lift border-0 shadow-md overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted overflow-hidden image-overlay relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 lg:top-3 right-2 lg:right-3 z-10">
                      <Badge className="bg-white/90 backdrop-blur text-foreground text-[10px] lg:text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 lg:p-5">
                  <div className="flex gap-1 lg:gap-2 mb-2 lg:mb-3 flex-wrap">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] lg:text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-sm lg:text-lg mb-1 lg:mb-2 line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="text-xs lg:text-sm mb-2 lg:mb-3 hidden lg:block">
                    Par {product.creator}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-lg lg:text-2xl font-bold gradient-text">{product.price}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="group-hover:bg-primary group-hover:text-primary-foreground h-8 w-8 lg:h-auto lg:w-auto p-0 lg:p-2"
                    >
                      <Heart className="h-3 lg:h-4 w-3 lg:w-4" />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="p-3 lg:p-5 pt-0">
                  <Button className="w-full text-xs lg:text-sm h-9 lg:h-10" asChild>
                    <Link href={`/products/${product.id}`}>Découvrir</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6 lg:mt-8 md:hidden">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
              <Link href="/products">
                Voir Tous les Produits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <Badge className="mb-3 lg:mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Le Blog
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-balance mb-3 lg:mb-4">
              Histoires & Inspirations
            </h2>
            <p className="text-sm lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Plongez dans les récits de notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, i) => (
              <article key={i} className="group hover-lift">
                <Link href={`/blog/${i + 1}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 lg:mb-5 image-overlay relative">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 lg:top-4 left-3 lg:left-4 z-10">
                      <Badge className="bg-white/90 backdrop-blur text-foreground text-xs">{post.category}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 lg:space-y-3">
                    <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-lg lg:text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-primary font-semibold text-sm lg:text-base group-hover:gap-3 transition-all">
                      Lire l'article
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="text-center mt-8 lg:mt-12">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
              <Link href="/blog">
                Tous les Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-20 gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white space-y-6 lg:space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 backdrop-blur-sm mb-3 lg:mb-4">
              <Users className="h-8 w-8 lg:h-10 lg:w-10" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-balance leading-tight">
              Rejoignez une Communauté
              <br />
              qui Vous Ressemble
            </h2>
            <p className="text-base md:text-lg lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto text-pretty">
              Que vous soyez créateur·rice, acheteur·se ou simplement curieux·se, Spectrum For Us est votre espace pour
              être vous-même.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center pt-4 lg:pt-6">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-xl text-base lg:text-lg px-6 lg:px-8 h-12 lg:h-14 w-full sm:w-auto"
                asChild
              >
                <Link href="/vendor-subscription">
                  Devenir Vendeur·se
                  <ArrowRight className="ml-2 h-4 lg:h-5 w-4 lg:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur border-2 border-white text-white hover:bg-white/20 text-base lg:text-lg px-6 lg:px-8 h-12 lg:h-14 w-full sm:w-auto"
                asChild
              >
                <Link href="/about">Notre Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
