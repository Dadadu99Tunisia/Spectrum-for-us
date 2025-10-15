import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FeaturedSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 border-purple-200 dark:border-purple-900">
        <Link href="/artistes" className="block">
          <div className="relative h-64 overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Artistes Queer"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-purple-500 hover:bg-purple-600">Artistes</Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Artistes Queer
            </h3>
            <p className="text-muted-foreground">
              Découvrez des œuvres uniques qui explorent l'identité, l'expression et la diversité.
            </p>
          </CardContent>
        </Link>
      </Card>

      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 border-pink-200 dark:border-pink-900">
        <Link href="/mode" className="block">
          <div className="relative h-64 overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Mode & Style"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-pink-500 hover:bg-pink-600">Mode</Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              Mode & Style
            </h3>
            <p className="text-muted-foreground">
              Explorez des créations audacieuses qui défient les normes et célèbrent l'individualité.
            </p>
          </CardContent>
        </Link>
      </Card>

      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 border-blue-200 dark:border-blue-900">
        <Link href="/culture" className="block">
          <div className="relative h-64 overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Culture Queer"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-blue-500 hover:bg-blue-600">Culture</Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Culture Queer
            </h3>
            <p className="text-muted-foreground">
              Plongez dans l'histoire, les médias et les mouvements qui façonnent la culture queer.
            </p>
          </CardContent>
        </Link>
      </Card>
    </div>
  )
}
