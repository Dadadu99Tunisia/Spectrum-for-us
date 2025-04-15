"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Filter, MapPin, Star, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function ResultatsPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<any[]>([])

  const type = searchParams.get("type") || "vol"
  const destination = searchParams.get("destination") || searchParams.get("arrivee") || ""
  const depart = searchParams.get("depart") || ""
  const lieu = searchParams.get("lieu") || ""

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      // Générer des résultats fictifs en fonction du type de recherche
      const fakeResults = generateFakeResults(type, destination || lieu || depart)
      setResults(fakeResults)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [type, destination, depart, lieu])

  // Fonction pour générer des résultats fictifs
  const generateFakeResults = (type: string, query: string) => {
    const results = []

    // Nombre de résultats aléatoire entre 5 et 12
    const count = Math.floor(Math.random() * 8) + 5

    for (let i = 0; i < count; i++) {
      if (type === "vol") {
        results.push({
          id: `vol-${i}`,
          compagnie: ["Air France", "Lufthansa", "EasyJet", "Transavia", "Ryanair"][Math.floor(Math.random() * 5)],
          logo: "/placeholder.svg?height=40&width=80",
          depart: depart || "Paris",
          arrivee: destination || "Barcelone",
          dateDepart: "10/06/2025",
          dateArrivee: "10/06/2025",
          heureDepart: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 6)}0`,
          heureArrivee: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 6)}0`,
          duree: `${Math.floor(Math.random() * 3) + 1}h${Math.floor(Math.random() * 60)}`,
          escales: Math.random() > 0.7 ? 1 : 0,
          prix: Math.floor(Math.random() * 300) + 100,
          lgbtqFriendly: Math.random() > 0.5,
        })
      } else if (type === "hotel") {
        results.push({
          id: `hotel-${i}`,
          nom: [`Hôtel ${query}`, "Grand Plaza", "Seaside Resort", "City Center", "Luxury Suites"][
            Math.floor(Math.random() * 5)
          ],
          image: "/placeholder.svg?height=200&width=300",
          lieu: destination || "Barcelone",
          etoiles: Math.floor(Math.random() * 3) + 3,
          note: (Math.random() * 2 + 7).toFixed(1),
          avis: Math.floor(Math.random() * 500) + 100,
          prix: Math.floor(Math.random() * 150) + 50,
          lgbtqFriendly: Math.random() > 0.5,
        })
      } else if (type === "sejour") {
        results.push({
          id: `sejour-${i}`,
          nom: [`Séjour à ${destination}`, "Escapade romantique", "Week-end détente", "Vacances tout compris"][
            Math.floor(Math.random() * 4)
          ],
          image: "/placeholder.svg?height=200&width=300",
          lieu: destination || "Barcelone",
          hotel: `Hôtel ${Math.floor(Math.random() * 3) + 3}*`,
          duree: `${Math.floor(Math.random() * 7) + 3} jours`,
          pension: ["Petit déjeuner", "Demi-pension", "Pension complète", "Tout inclus"][Math.floor(Math.random() * 4)],
          prix: Math.floor(Math.random() * 500) + 300,
          lgbtqFriendly: Math.random() > 0.5,
        })
      } else if (type === "voiture") {
        results.push({
          id: `voiture-${i}`,
          modele: ["Peugeot 208", "Renault Clio", "Volkswagen Golf", "Toyota Yaris", "Fiat 500"][
            Math.floor(Math.random() * 5)
          ],
          image: "/placeholder.svg?height=150&width=250",
          categorie: ["Économique", "Compacte", "Intermédiaire", "SUV"][Math.floor(Math.random() * 4)],
          places: Math.floor(Math.random() * 3) + 4,
          transmission: Math.random() > 0.5 ? "Manuelle" : "Automatique",
          prix: Math.floor(Math.random() * 50) + 30,
          agence: ["Avis", "Hertz", "Europcar", "Sixt"][Math.floor(Math.random() * 4)],
        })
      }
    }

    return results
  }

  const renderResults = () => {
    if (loading) {
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-32 w-32 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex justify-between items-end pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
    }

    if (results.length === 0) {
      return (
        <div className="text-center py-12">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucun résultat trouvé</h3>
          <p className="text-muted-foreground mb-6">Essayez de modifier vos critères de recherche</p>
          <Button asChild>
            <Link href="/voyage-plus">Retour à la recherche</Link>
          </Button>
        </div>
      )
    }

    return results.map((result) => {
      if (type === "vol") {
        return (
          <Card key={result.id} className="mb-4 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-gray-50 dark:bg-slate-800 p-4 flex items-center justify-center md:w-1/4">
                  <div className="text-center">
                    <Image
                      src={result.logo || "/placeholder.svg"}
                      alt={result.compagnie}
                      width={80}
                      height={40}
                      className="mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">{result.compagnie}</p>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between md:justify-start md:gap-12">
                        <div className="text-center md:text-left">
                          <p className="text-lg font-bold">{result.heureDepart}</p>
                          <p className="text-sm text-muted-foreground">{result.depart}</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <p className="text-xs text-muted-foreground">{result.duree}</p>
                          <div className="relative w-16 md:w-32">
                            <Separator className="my-2" />
                            <div className="absolute left-0 top-1/2 w-2 h-2 -mt-1 rounded-full bg-primary"></div>
                            <div className="absolute right-0 top-1/2 w-2 h-2 -mt-1 rounded-full bg-primary"></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {result.escales === 0 ? "Direct" : `${result.escales} escale`}
                          </p>
                        </div>

                        <div className="text-center md:text-right">
                          <p className="text-lg font-bold">{result.heureArrivee}</p>
                          <p className="text-sm text-muted-foreground">{result.arrivee}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 text-center md:text-right">
                      <p className="text-2xl font-bold">{result.prix}€</p>
                      <p className="text-xs text-muted-foreground mb-2">par personne</p>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600">Réserver</Button>
                      {result.lgbtqFriendly && (
                        <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">LGBTQ+ friendly</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      } else if (type === "hotel") {
        return (
          <Card key={result.id} className="mb-4 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3">
                  <Image src={result.image || "/placeholder.svg"} alt={result.nom} fill className="object-cover" />
                  {result.lgbtqFriendly && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600">
                      LGBTQ+ friendly
                    </Badge>
                  )}
                </div>

                <div className="p-4 flex-1">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{result.nom}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{result.lieu}</p>
                      </div>
                      <div className="flex items-center gap-1 mb-4">
                        {Array(result.etoiles)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500">{result.note}/10</Badge>
                        <span className="text-sm text-muted-foreground">({result.avis} avis)</span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 text-center md:text-right">
                      <p className="text-2xl font-bold">{result.prix}€</p>
                      <p className="text-xs text-muted-foreground mb-2">par nuit</p>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600">Réserver</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      } else if (type === "sejour") {
        return (
          <Card key={result.id} className="mb-4 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3">
                  <Image src={result.image || "/placeholder.svg"} alt={result.nom} fill className="object-cover" />
                  {result.lgbtqFriendly && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600">
                      LGBTQ+ friendly
                    </Badge>
                  )}
                </div>

                <div className="p-4 flex-1">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{result.nom}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{result.lieu}</p>
                      </div>
                      <div className="flex flex-col gap-1 mb-2">
                        <p className="text-sm">
                          {result.hotel} - {result.pension}
                        </p>
                        <p className="text-sm">Durée: {result.duree}</p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 text-center md:text-right">
                      <p className="text-2xl font-bold">{result.prix}€</p>
                      <p className="text-xs text-muted-foreground mb-2">par personne</p>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600">Réserver</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      } else if (type === "voiture") {
        return (
          <Card key={result.id} className="mb-4 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-40 md:h-auto md:w-1/4">
                  <Image src={result.image || "/placeholder.svg"} alt={result.modele} fill className="object-cover" />
                </div>

                <div className="p-4 flex-1">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{result.modele}</h3>
                      <Badge className="mb-2">{result.categorie}</Badge>
                      <div className="flex flex-col gap-1 mb-2">
                        <p className="text-sm">
                          {result.places} places - {result.transmission}
                        </p>
                        <p className="text-sm text-muted-foreground">Agence: {result.agence}</p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 text-center md:text-right">
                      <p className="text-2xl font-bold">{result.prix}€</p>
                      <p className="text-xs text-muted-foreground mb-2">par jour</p>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600">Réserver</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/voyage-plus">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour à la recherche
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full md:w-1/4">
          <Card className="sticky top-4">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer les résultats
              </h2>

              <div className="space-y-4">
                {type === "vol" && (
                  <>
                    <div>
                      <h3 className="font-medium mb-2">Compagnies</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="af" className="mr-2" />
                          <label htmlFor="af" className="text-sm">
                            Air France
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="lh" className="mr-2" />
                          <label htmlFor="lh" className="text-sm">
                            Lufthansa
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="ej" className="mr-2" />
                          <label htmlFor="ej" className="text-sm">
                            EasyJet
                          </label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Escales</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="direct" className="mr-2" />
                          <label htmlFor="direct" className="text-sm">
                            Vol direct
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="1escale" className="mr-2" />
                          <label htmlFor="1escale" className="text-sm">
                            1 escale max
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {(type === "hotel" || type === "sejour") && (
                  <>
                    <div>
                      <h3 className="font-medium mb-2">Catégorie</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="3stars" className="mr-2" />
                          <label htmlFor="3stars" className="text-sm">
                            3 étoiles
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="4stars" className="mr-2" />
                          <label htmlFor="4stars" className="text-sm">
                            4 étoiles
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="5stars" className="mr-2" />
                          <label htmlFor="5stars" className="text-sm">
                            5 étoiles
                          </label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Services</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="wifi" className="mr-2" />
                          <label htmlFor="wifi" className="text-sm">
                            Wi-Fi gratuit
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="piscine" className="mr-2" />
                          <label htmlFor="piscine" className="text-sm">
                            Piscine
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="parking" className="mr-2" />
                          <label htmlFor="parking" className="text-sm">
                            Parking
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Prix</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="price1" className="mr-2" />
                      <label htmlFor="price1" className="text-sm">
                        Moins de 100€
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price2" className="mr-2" />
                      <label htmlFor="price2" className="text-sm">
                        100€ - 300€
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price3" className="mr-2" />
                      <label htmlFor="price3" className="text-sm">
                        Plus de 300€
                      </label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Spécificités</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="lgbtq" className="mr-2" />
                      <label htmlFor="lgbtq" className="text-sm">
                        LGBTQ+ friendly
                      </label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Appliquer les filtres</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                <>
                  {results.length} résultats trouvés
                  {destination && ` pour ${destination}`}
                </>
              )}
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm hidden md:inline">Trier par:</span>
              <Select defaultValue="prix">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prix">Prix (croissant)</SelectItem>
                  <SelectItem value="prix-desc">Prix (décroissant)</SelectItem>
                  <SelectItem value="duree">Durée</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderResults()}
        </div>
      </div>
    </div>
  )
}
