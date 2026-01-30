import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Palette,
  Camera,
  Code,
  BookOpen,
  Headphones,
  Mic,
  Heart,
  Sparkles,
  MessageSquare,
  Briefcase,
} from "lucide-react"

// Définition des services
const services = [
  {
    id: "design",
    name: "Design & Création",
    description: "Logos, illustrations, design graphique et création visuelle sur mesure",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  {
    id: "photo",
    name: "Photographie",
    description: "Séances photo, retouches et édition d'images professionnelles",
    icon: Camera,
    color: "from-purple-500 to-indigo-500",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "web",
    name: "Développement Web",
    description: "Sites web, applications et solutions numériques inclusives",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "education",
    name: "Éducation & Formation",
    description: "Ateliers, cours et formations sur des sujets variés",
    icon: BookOpen,
    color: "from-amber-500 to-orange-500",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "music",
    name: "Musique & Audio",
    description: "Production musicale, mixage, mastering et création sonore",
    icon: Headphones,
    color: "from-green-500 to-emerald-500",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "events",
    name: "Animation d'Événements",
    description: "DJ, performances, spectacles et animations pour vos événements",
    icon: Mic,
    color: "from-violet-500 to-purple-500",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "wellness",
    name: "Bien-être & Santé",
    description: "Coaching, thérapies alternatives et soins personnalisés",
    icon: Heart,
    color: "from-red-500 to-rose-500",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    id: "creative",
    name: "Services Créatifs",
    description: "Rédaction, traduction et autres services créatifs sur mesure",
    icon: Sparkles,
    color: "from-fuchsia-500 to-pink-500",
    textColor: "text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    id: "consulting",
    name: "Conseil & Mentorat",
    description: "Accompagnement professionnel, stratégie et développement",
    icon: MessageSquare,
    color: "from-teal-500 to-cyan-500",
    textColor: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "business",
    name: "Services Professionnels",
    description: "Comptabilité, juridique et autres services pour entrepreneur·e·s",
    icon: Briefcase,
    color: "from-indigo-500 to-blue-500",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
]

export default function ServicesShowcase() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {services.map((service) => (
          <Link href={`/services/${service.id}`} key={service.id} className="block h-full">
            <Card className="h-full transition-all hover:shadow-md hover:scale-105 group">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${service.color} text-white`}
                >
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className={`font-semibold text-lg mb-2 group-hover:${service.textColor}`}>{service.name}</h3>
                <p className="text-sm text-muted-foreground flex-grow">{service.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button asChild variant="outline" size="lg" className="group">
          <Link href="/services">
            Tous les Services
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
