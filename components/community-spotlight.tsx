import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const spotlights = [
  {
    id: "1",
    name: "Alex Dubois",
    role: "Artiste & Activiste",
    quote:
      "L'art est mon moyen d'expression et de résistance. À travers mes créations, je célèbre la diversité des identités queer.",
    image: "/placeholder.svg?height=400&width=400",
    initials: "AD",
  },
  {
    id: "2",
    name: "Sophie Martin",
    role: "Designer de Mode",
    quote:
      "Je crée des vêtements qui permettent à chacun d'exprimer sa véritable identité, au-delà des normes de genre traditionnelles.",
    image: "/placeholder.svg?height=400&width=400",
    initials: "SM",
  },
  {
    id: "3",
    name: "Léo Garcia",
    role: "Écrivain & Poète",
    quote:
      "Les mots ont le pouvoir de transformer notre perception du monde. J'écris pour donner une voix à ceux qui sont souvent réduits au silence.",
    image: "/placeholder.svg?height=400&width=400",
    initials: "LG",
  },
]

export default function CommunitySpotlight() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {spotlights.map((person) => (
        <Card key={person.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-4 border-purple-200 dark:border-purple-800">
              <AvatarImage src={person.image} alt={person.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl">
                {person.initials}
              </AvatarFallback>
            </Avatar>

            <Badge className="mb-2 bg-gradient-to-r from-purple-500 to-pink-500">{person.role}</Badge>

            <h3 className="text-xl font-bold mb-3">{person.name}</h3>

            <p className="text-muted-foreground italic mb-4">"{person.quote}"</p>

            <Button variant="outline" size="sm" className="mt-2">
              Voir le Profil
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

