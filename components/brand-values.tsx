import { Shield, Heart, Users, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const values = [
  {
    icon: Shield,
    title: "Sécurité & Confiance",
    description: "Transactions sécurisées et protection des données personnelles pour tou·te·s nos utilisateur·rice·s.",
  },
  {
    icon: Heart,
    title: "Inclusivité",
    description: "Un espace où chacun·e est respecté·e, valorisé·e et célébré·e pour son authenticité.",
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Nous construisons des liens forts entre créateur·rice·s et client·e·s partageant les mêmes valeurs.",
  },
  {
    icon: Sparkles,
    title: "Créativité",
    description: "Nous mettons en avant l'originalité et l'expression artistique unique de notre communauté.",
  },
]

export default function BrandValues() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {values.map((value, index) => {
        const Icon = value.icon
        return (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
