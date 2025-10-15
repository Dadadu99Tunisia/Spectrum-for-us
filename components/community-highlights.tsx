import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const highlights = [
  {
    id: "1",
    title: "Seller Spotlight: QueerApparel",
    description: "Meet the team behind our most popular clothing brand and learn about their journey.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Seller Story",
  },
  {
    id: "2",
    title: "Pride Month Collection",
    description: "Explore our curated collection celebrating Pride Month with exclusive products.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Collection",
  },
  {
    id: "3",
    title: "Community Forum: Supporting Queer Entrepreneurs",
    description: "Join the discussion on how we can better support queer business owners.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Forum",
  },
]

export default function CommunityHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {highlights.map((item) => (
        <Link href={`/community/${item.id}`} key={item.id}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-all">
            <div className="relative h-48 w-full">
              <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              <div className="absolute top-2 left-2">
                <Badge>{item.type}</Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
