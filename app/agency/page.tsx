import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Megaphone, TrendingUp, Users, Sparkles, Target, BarChart } from "lucide-react"
import Link from "next/link"

export default function AgencyPage() {
  const services = [
    {
      icon: Megaphone,
      title: "Social Media Marketing",
      description: "Campagnes payantes et organiques sur Facebook, Instagram, Twitter, TikTok",
    },
    {
      icon: Users,
      title: "Marketing d'Influence",
      description: "Collaborations avec des influenceurs queer pour maximiser votre portée",
    },
    {
      icon: Target,
      title: "Publicité Display & Vidéo",
      description: "Campagnes programmatiques pilotées par les données sur DV360",
    },
    {
      icon: TrendingUp,
      title: "SEO & Référencement",
      description: "Audits de site, conseil stratégique et création de liens",
    },
    {
      icon: Sparkles,
      title: "Création de Contenu",
      description: "Contenu créatif pour réseaux sociaux et médias digitaux",
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Suivi des performances et optimisation continue",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Qtalkbot Ads Agency</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/95 leading-relaxed">
              L'agence de communication dédiée aux marques et créateur·rice·s queer. Nous créons des campagnes
              authentiques qui respectent les codes de la communauté et assurent le succès de votre publicité sans être
              blessant ou offensant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link href="/contact">Demander un devis gratuit</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur border-white text-white hover:bg-white/20"
                asChild
              >
                <Link href="#services">Découvrir nos services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Notre Expertise</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Qtalkbot Ads est née de la nécessité de proposer des stratégies de contenu et de marque adaptées et
              respectueuses des codes queer. Nous comprenons que la communauté LGBTQIA+ n'est pas monolithique et que
              chaque campagne doit être pensée avec authenticité et sensibilité.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3">Ciblage Précis</h3>
                <p className="text-muted-foreground">
                  Accès efficace à la cible LGBTQIA+ avec un taux d'engagement supérieur de 40% à la moyenne
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-3">Authenticité</h3>
                <p className="text-muted-foreground">
                  Des campagnes qui ne tombent pas dans les stéréotypes et qui résonnent vraiment avec la communauté
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-3">ROI Optimisé</h3>
                <p className="text-muted-foreground">
                  Capitalisation sur le pouvoir d'achat de la Pink Economy (4,6 billions de dollars)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une gamme complète de services marketing pour faire rayonner votre marque auprès de la communauté queer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader>
                <service.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi le Marketing Queer ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">66%</div>
              <p className="text-primary-foreground/90">
                des personnes LGBTQ+ ne se voient pas représentées dans la publicité
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1000Mds$</div>
              <p className="text-primary-foreground/90">de pouvoir d'achat LGBTQ+ en 2024</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">13%</div>
              <p className="text-primary-foreground/90">de la population mondiale s'identifie comme LGBTQIA+</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">31%</div>
              <p className="text-primary-foreground/90">de la génération Z s'identifie comme queer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi Qtalkbot Ads ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">Expertise Queer</h3>
              <p className="text-muted-foreground">
                Nous comprenons les codes et les valeurs de la communauté pour créer des campagnes authentiques
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Résultats Mesurables</h3>
              <p className="text-muted-foreground">
                Suivi précis des performances avec des KPIs adaptés à vos objectifs
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold mb-2">Accompagnement Personnalisé</h3>
              <p className="text-muted-foreground">
                Une équipe dédiée qui vous accompagne à chaque étape de votre projet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à lancer votre campagne ?</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Contactez-nous pour discuter de votre projet et recevoir un devis personnalisé
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Contactez-nous</Link>
        </Button>
      </section>
    </div>
  )
}
