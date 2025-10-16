"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Palette, Heart } from "lucide-react"
import Link from "next/link"

const mockCreators = [
  {
    id: "1",
    name: "Alex Moreau",
    bio: "Designer textile spécialisé·e dans la mode non-genrée. Matériaux durables et coupes inclusives.",
    avatar_url: "/queer-entrepreneur-workspace-creative.jpg",
    discipline: "Mode",
    location: "Paris",
    style: "Minimaliste",
    products_count: 24,
  },
  {
    id: "2",
    name: "Sam Rivera",
    bio: "Artiste visuel·le explorant les identités fluides à travers la photographie et l'illustration.",
    avatar_url: "/queer-art-poster-belonging-illustration.jpg",
    discipline: "Art",
    location: "Lyon",
    style: "Contemporain",
    products_count: 18,
  },
  {
    id: "3",
    name: "Jordan Chen",
    bio: "Créateur·ice de bijoux artisanaux. Chaque pièce raconte une histoire d'authenticité.",
    avatar_url: "/fluid-artisan-jewelry-queer.jpg",
    discipline: "Bijoux",
    location: "Marseille",
    style: "Artisanal",
    products_count: 32,
  },
  {
    id: "4",
    name: "Morgan Dubois",
    bio: "Auteur·ice et poète. Écrit sur les expériences queers et la déconstruction des normes.",
    avatar_url: "/queer-voices-book-cover-diverse.jpg",
    discipline: "Littérature",
    location: "Bordeaux",
    style: "Poétique",
    products_count: 5,
  },
]

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDiscipline, setSelectedDiscipline] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const disciplines = ["Tous", "Mode", "Art", "Bijoux", "Littérature", "Musique", "Design"]
  const locations = ["Tous", "Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "International"]

  const filteredCreators = mockCreators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDiscipline = selectedDiscipline === "all" || creator.discipline === selectedDiscipline
    const matchesLocation = selectedLocation === "all" || creator.location === selectedLocation

    return matchesSearch && matchesDiscipline && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Créateur·ices</h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
              Découvrez les artistes, designers et créateur·ices qui font vivre Spectrum For Us. Des talents
              authentiques, des créations uniques.
            </p>
            <Button size="lg" asChild>
              <Link href="/vendor-subscription">Rejoindre la communauté</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un·e créateur·ice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Discipline" />
            </SelectTrigger>
            <SelectContent>
              {disciplines.map((disc) => (
                <SelectItem key={disc} value={disc === "Tous" ? "all" : disc}>
                  {disc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Localisation" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc === "Tous" ? "all" : loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreators.map((creator) => (
            <Card
              key={creator.id}
              className="text-center hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4 overflow-hidden ring-4 ring-background group-hover:ring-primary/20 transition-all">
                  <img
                    src={creator.avatar_url || "/placeholder.svg"}
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardTitle className="text-xl">{creator.name}</CardTitle>
                <div className="flex gap-2 justify-center mt-2 flex-wrap">
                  <Badge variant="secondary">{creator.discipline}</Badge>
                  <Badge variant="outline">{creator.style}</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{creator.bio}</p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{creator.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    <span>{creator.products_count} créations</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center gap-2 px-6 pb-6">
                <Button variant="default" size="sm" asChild className="flex-1">
                  <Link href={`/creators/${creator.id}`}>Voir le profil</Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Aucun·e créateur·ice ne correspond à vos critères</p>
          </div>
        )}
      </section>
    </div>
  )
}
