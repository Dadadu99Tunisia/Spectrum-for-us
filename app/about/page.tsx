import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Users, Globe, Sparkles, Target, Shield, Lightbulb, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">À Propos de Spectrum For Us</h1>
            <p className="text-xl text-white/95 text-pretty leading-relaxed">
              B(u)y us, for us — Spectrum of possibilities
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Notre Mission</h2>
                <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Spectrum For Us</strong> est né d'une volonté de créer un espace
                    où chaque personne queer peut avoir accès à un grand catalogue de produits et services, 24h/24 et
                    7j/7, tout en étant un véritable acteur économique et social.
                  </p>
                  <p>
                    Nous sommes la <strong className="text-foreground">première marketplace internationale</strong>{" "}
                    dédiée aux produits et services créés par et pour la communauté LGBTQIA+. Notre plateforme regroupe
                    des artisan·e·s, créateur·rice·s et marques qui partagent nos valeurs d'inclusivité et
                    d'authenticité.
                  </p>
                  <p>
                    Avec un marché queer représentant la{" "}
                    <strong className="text-foreground">4ème plus grande économie mondiale</strong> (4,6 billions de
                    dollars de PIB), nous croyons fermement au pouvoir économique de notre communauté et à l'importance
                    de soutenir les entreprises queers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Heart className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Authentique</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous valorisons l'authenticité et encourageons chacun·e à être soi-même sans compromis.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Safe</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Un espace sécurisé où tou·te·s les membres de la communauté LGBTQIA+ sont les bienvenu·e·s.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Globe className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Ouverte</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Multilingue, multi-devises et accessible à tou·te·s, partout dans le monde.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Libre</h3>
                <p className="text-muted-foreground leading-relaxed">
                  La liberté d'expression, de création et de commerce sans jugement ni discrimination.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Solidaire</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous soutenons activement les créateur·rice·s et entrepreneur·e·s queers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Target className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Inclusive</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tous les genres, toutes les identités, toutes les expressions sont célébrées ici.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Lightbulb className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Créative</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous célébrons la créativité sous toutes ses formes et encourageons l'innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Activiste</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous utilisons nos ressources pour faire avancer les droits LGBTQIA+.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Notre Fondatrice</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-8 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                      <img src="/founder-avatar.jpg" alt="Dada Azouz" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8 md:p-12">
                    <h3 className="text-2xl font-bold mb-2">Dada Azouz</h3>
                    <p className="text-primary font-semibold mb-6">Fondatrice & CEO</p>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        En tant que personne queer et neuroatypique, j'ai souvent transgressé les règles et me suis
                        souvent retrouvée à naviguer entre les rayons "homme" et "femme" dans les magasins
                        traditionnels. Cette expérience m'a fait réaliser que faire du shopping ne devrait pas être une
                        source d'anxiété pour notre communauté.
                      </p>
                      <p>
                        <strong className="text-foreground">Spectrum For Us</strong> est né de cette volonté de créer un
                        espace où chaque personne queer peut trouver des produits qui lui correspondent vraiment, sans
                        jugement et sans compromis.
                      </p>
                      <p>
                        Avec une vision 100% remote et une organisation de travail flexible, nous construisons une
                        entreprise qui respecte les différences et célèbre la diversité sous toutes ses formes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.6T$</div>
              <p className="text-primary-foreground/90">PIB de l'économie queer mondiale</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">13%</div>
              <p className="text-primary-foreground/90">De la population s'identifie comme LGBTQIA+</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <p className="text-primary-foreground/90">Créateur·rice·s queers sur notre plateforme</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <p className="text-primary-foreground/90">Accessible partout, tout le temps</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Rejoignez Notre Communauté</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Que vous soyez créateur·rice, entrepreneur·e ou simplement à la recherche de produits authentiques,
              Spectrum For Us est votre maison.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/vendor-subscription">Devenir Vendeur·euse</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">Explorer la Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
