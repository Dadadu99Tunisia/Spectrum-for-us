import Image from "next/image"

interface CategoryImageProps {
  category: string
  className?: string
}

export function CategoryImage({ category, className = "w-full h-full object-cover" }: CategoryImageProps) {
  // Mapping des catégories vers des images modernes
  const getImageUrl = (category: string) => {
    switch (category) {
      case "clothing":
      case "mode-accessoires":
        return "/images/categories/clothing.jpg"
      case "jewelry":
      case "bijoux-ornements":
        return "/images/categories/jewelry.jpg"
      case "art":
        return "/images/categories/art.jpg"
      case "beauty":
        return "/images/categories/beauty.jpg"
      case "home":
      case "maison-deco":
        return "/images/categories/home.jpg"
      case "books":
      case "livres-films":
        return "/images/categories/books.jpg"
      case "accessories":
        return "/images/categories/accessories.jpg"
      case "identite-transition":
        return "/images/categories/identity.jpg"
      case "diy-creations":
        return "/images/categories/diy.jpg"
      case "sport-loisirs":
        return "/images/categories/sports.jpg"
      case "militantisme-communaute":
        return "/images/categories/community.jpg"
      default:
        return "/images/categories/default.jpg"
    }
  }

  // Pour l'instant, utilisons des placeholders
  const imageUrl = getImageUrl(category)
  const placeholderUrl = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(category)}`

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={placeholderUrl || "/placeholder.svg"}
        alt={`Catégorie ${category}`}
        width={400}
        height={300}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  )
}
