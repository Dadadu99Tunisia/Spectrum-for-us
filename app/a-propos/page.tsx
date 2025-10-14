import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Heart, Users, Gift, Star, ArrowRight } from "lucide-react"

// Remplacer les données fictives de l'équipe par les informations réelles

// Remplacer le tableau "team" existant par celui-ci :
const team = [
  {
    name: "Aicha Chennaoui",
    role: "Fondatrice & CEO",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Aicha a fondé Spectrum avec la vision de créer un espace inclusif où chacun peut exprimer son identité librement.",
  },
  {
    name: "Anaël Lallouette-Zylbersztain",
    role: "CFO",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Anaël supervise tous les aspects financiers de Spectrum, en veillant à la croissance durable de la plateforme.",
  },
]

// Données fictives pour les valeurs
const values = [
  {
    title: "Inclusivité",
    description:
      "Nous créons un espace où chacun est le bienvenu, indépendamment de son identité de genre, son orientation sexuelle, son origine ou ses capacités.",
    icon: Users,
  },
  {
    title: "Authenticité",
    description:
      "Nous encourageons chacun à être authentique et à exprimer sa véritable identité sans crainte ni jugement.",
    icon: Heart,
  },
  {
    title: "Communauté",
    description:
      "Nous construisons une communauté forte et solidaire où les membres peuvent se soutenir mutuellement et grandir ensemble.",
    icon: Gift,
  },
  {
    title: "Qualité",
    description:
      "Nous nous engageons à offrir des produits et services de haute qualité qui répondent aux besoins spécifiques de notre communauté.",
    icon: Star,
  },
]

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">À Propos</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">À Propos de Spectrum</h1>
      <p className="text-muted-foreground mb-8">
        Découvrez notre histoire, notre mission et les personnes qui font de Spectrum une réalité.
      </p>

      {/* Notre histoire */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4">Notre Histoire</Badge>
            <h2 className="text-2xl font-semibold mb-4">Comment tout a commencé</h2>
            <p className="text-muted-foreground mb-4">
              Spectrum a été fondé en 2022 avec une mission claire : créer un espace en ligne où les entrepreneurs et
              artistes queer peuvent prospérer et où les consommateurs peuvent trouver des produits qui célèbrent la
              diversité et l'inclusivité.
            </p>
            <p className="text-muted-foreground mb-6">
              Ce qui a commencé comme une petite plateforme est rapidement devenu une communauté vibrante de créateurs,
              d'acheteurs et de supporters qui partagent notre vision d'un monde plus inclusif et diversifié.
            </p>
            <Button asChild className="group">
              <Link href="/stories">
                Lire plus d'histoires
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=800&width=600&text=Notre Histoire"
              alt="L'histoire de Spectrum"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-4">Nos Valeurs</Badge>
          <h2 className="text-2xl font-semibold mb-4">Ce qui nous guide</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nos valeurs fondamentales définissent qui nous sommes et comment nous opérons. Elles sont au cœur de chaque
            décision que nous prenons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Notre équipe */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-4">Notre Équipe</Badge>
          <h2 className="text-2xl font-semibold mb-4">Les personnes derrière Spectrum</h2>
          {/* Mettre à jour le texte de présentation de l'équipe */}
          {/* Remplacer le paragraphe sous "Les personnes derrière Spectrum" par : */}
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Notre petite équipe passionnée travaille chaque jour pour faire de Spectrum un espace inclusif et
            accueillant pour tous.
          </p>
        </div>

        {/* Mettre à jour la grille d'affichage pour deux personnes au lieu de quatre */}
        {/* Remplacer la div de la grille par : */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Rejoignez-nous */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Rejoignez notre mission</h2>
          <p className="mb-6">
            Que vous soyez un entrepreneur, un artiste, un acheteur ou simplement quelqu'un qui partage nos valeurs, il
            y a une place pour vous dans notre communauté.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-purple-600 hover:bg-white/90">Devenir Vendeur</Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              En Savoir Plus
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

