import {
  Shirt,
  Footprints,
  Gem,
  Scissors,
  Flag,
  Accessibility,
  Sparkles,
  Home,
  Palette,
  BookOpen,
  Gamepad2,
  Smartphone,
  UtensilsCrossed,
  Dumbbell,
  Gift,
  HeartHandshake,
  Users,
  ShoppingBag,
} from "lucide-react"

interface CategoryIconProps {
  category: string
  className?: string
}

export function CategoryIcon({ category, className = "w-6 h-6" }: CategoryIconProps) {
  switch (category) {
    case "vetements-mode":
      return <Shirt className={className} />
    case "chaussures":
      return <Footprints className={className} />
    case "accessoires-mode":
      return <Gem className={className} />
    case "capillaire":
      return <Scissors className={className} />
    case "identite-lgbtqia":
      return <Flag className={className} />
    case "produits-pmr":
      return <Accessibility className={className} />
    case "hygiene-beaute":
      return <Sparkles className={className} />
    case "maison-decoration":
      return <Home className={className} />
    case "art-artisanat":
      return <Palette className={className} />
    case "culture-education":
      return <BookOpen className={className} />
    case "jeux-loisirs":
      return <Gamepad2 className={className} />
    case "technologie-adaptee":
      return <Smartphone className={className} />
    case "alimentation-boissons":
      return <UtensilsCrossed className={className} />
    case "sport-bien-etre":
      return <Dumbbell className={className} />
    case "cadeaux-personnalises":
      return <Gift className={className} />
    case "services":
      return <HeartHandshake className={className} />
    case "communaute-entraide":
      return <Users className={className} />
    default:
      return <ShoppingBag className={className} />
  }
}
