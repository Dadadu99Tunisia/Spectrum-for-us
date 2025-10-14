import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const partners = [
  {
    id: "1",
    name: "Pride Association",
    logo: "/placeholder.svg?height=80&width=200",
    description: "Organisation nationale pour la défense des droits LGBTQIA+",
    website: "https://example.com/pride",
  },
  {
    id: "2",
    name: "Queer Arts Collective",
    logo: "/placeholder.svg?height=80&width=200",
    description: "Collectif d'artistes promouvant la visibilité queer dans l'art",
    website: "https://example.com/queerarts",
  },
  {
    id: "3",
    name: "Trans Support Network",
    logo: "/placeholder.svg?height=80&width=200",
    description: "Réseau de soutien et d'entraide pour les personnes trans",
    website: "https://example.com/transsupport",
  },
  {
    id: "4",
    name: "Inclusive Business Alliance",
    logo: "/placeholder.svg?height=80&width=200",
    description: "Alliance d'entreprises engagées pour l'inclusion et la diversité",
    website: "https://example.com/inclusivebusiness",
  },
  {
    id: "5",
    name: "Rainbow Foundation",
    logo: "/placeholder.svg?height=80&width=200",
    description: "Fondation finançant des projets pour la communauté LGBTQIA+",
    website: "https://example.com/rainbow",
  },
]

export default function PartnersShowcase() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {partners.map((partner) => (
          <Link href={partner.website} key={partner.id} target="_blank" rel="noopener noreferrer" className="group">
            <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="relative h-16 w-full mb-4 flex items-center justify-center">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={160}
                    height={60}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium text-sm mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {partner.name}
                </h3>
                <p className="text-xs text-muted-foreground">{partner.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
