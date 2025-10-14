import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, CalendarDays, MapPin, Users, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import EventsGrid from "@/components/events-grid"

export default function EventsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Événements</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Événements</h1>
      <p className="text-muted-foreground mb-8">
        Découvrez les événements à venir dans la communauté queer et inclusive.
      </p>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un événement..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
        <Button variant="outline">
          <CalendarDays className="h-4 w-4 mr-2" />
          Date
        </Button>
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          Lieu
        </Button>
      </div>

      {/* Événement à la une */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Événement à la une</h2>
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Festival des Fiertés"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-purple-500 hover:bg-purple-600">Célébration</Badge>
              </div>
            </div>
            <CardContent className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Festival des Fiertés 2023
                </h3>
                <p className="text-muted-foreground mb-4">
                  Rejoignez-nous pour le plus grand festival des fiertés de l'année, avec des performances, des stands,
                  des discussions et bien plus encore.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-purple-600" />
                    15 Juin 2023 - 18 Juin 2023
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                    Paris, France
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-purple-600" />
                    5000+ participants attendus
                  </div>
                </div>
              </div>
              <Button className="w-full md:w-auto">S'inscrire</Button>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Événements à venir */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Événements à venir</h2>
        <EventsGrid />
      </section>

      {/* Événements passés */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Événements passés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-all duration-300 group opacity-75">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=300&width=500&text=Événement Passé ${i + 1}`}
                  alt={`Événement Passé ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-background/80">
                    Passé
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Événement Passé {i + 1}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {`${i + 1} Mai 2023`}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  Paris, France
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t border-border mt-2">
                <Button variant="outline" className="w-full">
                  Voir les photos
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}

