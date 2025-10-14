import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"

const testimonials = [
  {
    quote:
      "Spectrum m'a permis de développer mon activité artistique et de toucher une communauté qui partage mes valeurs.",
    author: "Alex Dubois",
    role: "Artiste & Créateur·rice",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "J'adore acheter sur Spectrum car je sais que je soutiens directement des créateur·rice·s queer et des petites entreprises inclusives.",
    author: "Camille Martin",
    role: "Client·e régulier·ère",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "La plateforme est non seulement belle et facile à utiliser, mais elle crée un véritable sentiment de communauté.",
    author: "Sam Lefèvre",
    role: "Designer & Vendeur·euse",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="border-none shadow-md bg-white dark:bg-background">
          <CardContent className="p-6">
            <QuoteIcon className="h-8 w-8 text-purple-400 mb-4" />
            <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
            <div className="flex items-center">
              <div className="mr-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <div>
                <h4 className="font-semibold">{testimonial.author}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

