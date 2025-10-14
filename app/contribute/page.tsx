import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Heart, Users, Gift, Star, Calendar, ArrowRight } from "lucide-react"

// Données fictives pour les façons de contribuer
const contributionWays = [
  {
    title: "Devenir Vendeur",
    description: "Rejoignez notre marketplace et vendez vos produits inclusifs à notre communauté.",
    icon: Star,
    link: "/devenir-vendeur",
    cta: "Commencer à vendre",
  },
  {
    title: "Partager votre histoire",
    description: "Racontez votre parcours et inspirez d'autres membres de la communauté.",
    icon: Heart,
    link: "/stories/submit",
    cta: "Partager mon histoire",
  },
  {
    title: "Organiser un événement",
    description: "Proposez un événement pour la communauté et faites-le connaître sur notre plateforme.",
    icon: Calendar,
    link: "/events/submit",
    cta: "Proposer un événement",
  },
  {
    title: "Faire un don",
    description: "Soutenez notre mission d'inclusivité et de diversité par un don financier.",
    icon: Gift,
    link: "/donate",
    cta: "Faire un don",
  },
  {
    title: "Devenir bénévole",
    description: "Donnez de votre temps et de vos compétences pour aider notre communauté à grandir.",
    icon: Users,
    link: "/volunteer",
    cta: "Devenir bénévole",
  },
]

// Données fictives pour les projets communautaires
const communityProjects = [
  {
    title: "Ateliers d'art inclusifs",
    description: "Des ateliers d'art gratuits pour les jeunes LGBTQ+ en situation de précarité.",
    image: "/placeholder.svg?height=400&width=600",
    progress: 75,
    goal: "5000 €",
    raised: "3750 €",
    supporters: 42,
  },
  {
    title: "Bibliothèque queer mobile",
    description: "Une bibliothèque itinérante apportant des livres LGBTQ+ dans les zones rurales.",
    image: "/placeholder.svg?height=400&width=600",
    progress: 60,
    goal: "8000 €",
    raised: "4800 €",
    supporters: 67,
  },
  {
    title: "Formation professionnelle pour personnes trans",
    description: "Programme de formation et d'insertion professionnelle pour les personnes trans.",
    image: "/placeholder.svg?height=400&width=600",
    progress: 40,
    goal: "12000 €",
    raised: "4800 €",
    supporters: 89,
  },
]

export default function ContributePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Contribuer</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Contribuer à la Communauté</h1>
      <p className="text-muted-foreground mb-8">
        Découvrez comment vous pouvez soutenir et contribuer à notre communauté inclusive.
      </p>

      {/* Section principale */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Pourquoi contribuer ?</h2>
            <p className="text-muted-foreground mb-4">
              En contribuant à Spectrum, vous aidez à créer un espace plus inclusif et diversifié pour la communauté
              queer. Votre soutien permet de :
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <Heart className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span>Soutenir des entrepreneurs et artistes queer</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>Renforcer notre communauté et créer des liens</span>
              </li>
              <li className="flex items-start gap-2">
                <Gift className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Financer des projets communautaires importants</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>Promouvoir la visibilité et la représentation queer</span>
              </li>
            </ul>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              En savoir plus sur notre mission
            </Button>
          </div>
          <div className="relative rounded-lg overflow-hidden h-[300px] md:h-auto">
            <Image
              src="/placeholder.svg?height=600&width=800&text=Community"
              alt="Notre communauté"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Façons de contribuer */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Comment contribuer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributionWays.map((way, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <way.icon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>{way.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{way.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={way.link}>
                    {way.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Projets communautaires */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Projets communautaires à soutenir</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityProjects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{project.raised} collectés</span>
                      <span>Objectif : {project.goal}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{project.supporters} soutiens</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 border-t border-border mt-4">
                <Button className="w-full">Soutenir ce projet</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}

