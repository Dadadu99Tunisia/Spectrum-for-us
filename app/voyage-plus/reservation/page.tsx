import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CreditCard, Calendar, CheckCircle, Plane, Hotel, Car, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: "Réservation | Voyage+",
  description: "Réservez votre voyage LGBTQ+ friendly avec MisterFly",
}

export default function ReservationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/voyage-plus">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour à Voyage+
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Réservez votre voyage</h1>
        <div className="flex items-center">
          <Image
            src="/placeholder.svg?height=40&width=120"
            alt="MisterFly Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <span className="ml-2 text-sm text-muted-foreground">Partenaire officiel</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden mb-8">
        <Tabs defaultValue="vol" className="w-full">
          <TabsList className="w-full flex h-auto p-0 bg-blue-50 dark:bg-slate-800">
            <TabsTrigger
              value="vol"
              className="flex-1 py-4 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <Plane className="h-4 w-4 mr-2" />
              Vol
            </TabsTrigger>
            <TabsTrigger
              value="hotel"
              className="flex-1 py-4 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <Hotel className="h-4 w-4 mr-2" />
              Hôtel
            </TabsTrigger>
            <TabsTrigger
              value="voiture"
              className="flex-1 py-4 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <Car className="h-4 w-4 mr-2" />
              Voiture
            </TabsTrigger>
            <TabsTrigger
              value="sejour"
              className="flex-1 py-4 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Séjour
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vol" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="depart">Ville de départ</Label>
                <Input id="depart" placeholder="Paris" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="Barcelone" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="date-depart">Date de départ</Label>
                <Input id="date-depart" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="date-retour">Date de retour</Label>
                <Input id="date-retour" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="passagers">Passagers</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="passagers" className="mt-1">
                    <SelectValue placeholder="Nombre de passagers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 passager</SelectItem>
                    <SelectItem value="2">2 passagers</SelectItem>
                    <SelectItem value="3">3 passagers</SelectItem>
                    <SelectItem value="4">4 passagers</SelectItem>
                    <SelectItem value="5">5 passagers ou plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="classe">Classe</Label>
                <Select defaultValue="eco">
                  <SelectTrigger id="classe" className="mt-1">
                    <SelectValue placeholder="Classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eco">Économique</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="affaires">Affaires</SelectItem>
                    <SelectItem value="premiere">Première</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex items-end">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 mt-1">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hotel" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="destination-hotel">Destination</Label>
                <Input id="destination-hotel" placeholder="Barcelone" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="check-in">Check-in</Label>
                <Input id="check-in" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="check-out">Check-out</Label>
                <Input id="check-out" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="chambres">Chambres et voyageurs</Label>
                <Select defaultValue="1-1">
                  <SelectTrigger id="chambres" className="mt-1">
                    <SelectValue placeholder="Chambres et voyageurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-1">1 chambre, 1 voyageur</SelectItem>
                    <SelectItem value="1-2">1 chambre, 2 voyageurs</SelectItem>
                    <SelectItem value="2-2">2 chambres, 2 voyageurs</SelectItem>
                    <SelectItem value="2-3">2 chambres, 3 voyageurs</SelectItem>
                    <SelectItem value="2-4">2 chambres, 4 voyageurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex items-end">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 mt-1">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voiture" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="lieu-retrait">Lieu de retrait</Label>
                <Input id="lieu-retrait" placeholder="Aéroport de Barcelone" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="date-retrait">Date de retrait</Label>
                <Input id="date-retrait" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="date-retour-voiture">Date de retour</Label>
                <Input id="date-retour-voiture" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="categorie">Catégorie</Label>
                <Select defaultValue="compact">
                  <SelectTrigger id="categorie" className="mt-1">
                    <SelectValue placeholder="Catégorie de véhicule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eco">Économique</SelectItem>
                    <SelectItem value="compact">Compacte</SelectItem>
                    <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="luxe">Luxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex items-end">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 mt-1">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sejour" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="depart-sejour">Ville de départ</Label>
                <Input id="depart-sejour" placeholder="Paris" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="destination-sejour">Destination</Label>
                <Input id="destination-sejour" placeholder="Barcelone" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="date-depart-sejour">Date de départ</Label>
                <Input id="date-depart-sejour" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="duree">Durée</Label>
                <Select defaultValue="7">
                  <SelectTrigger id="duree" className="mt-1">
                    <SelectValue placeholder="Durée du séjour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 jours</SelectItem>
                    <SelectItem value="5">5 jours</SelectItem>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="10">10 jours</SelectItem>
                    <SelectItem value="14">14 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="voyageurs">Voyageurs</Label>
                <Select defaultValue="2">
                  <SelectTrigger id="voyageurs" className="mt-1">
                    <SelectValue placeholder="Nombre de voyageurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 voyageur</SelectItem>
                    <SelectItem value="2">2 voyageurs</SelectItem>
                    <SelectItem value="3">3 voyageurs</SelectItem>
                    <SelectItem value="4">4 voyageurs</SelectItem>
                    <SelectItem value="5">5 voyageurs ou plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex items-end">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 mt-1">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Paiement en 10x sans frais</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Facilité de paiement</h3>
                  <p className="text-muted-foreground">
                    Étalez le coût de votre voyage sur 10 mois sans aucun frais supplémentaire
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">Comment ça marche ?</h4>
                <ol className="space-y-2 list-decimal list-inside text-sm">
                  <li>Choisissez votre voyage et procédez à la réservation</li>
                  <li>Sélectionnez l'option "Paiement en 10x sans frais" au moment du paiement</li>
                  <li>Renseignez vos informations de carte bancaire</li>
                  <li>Votre carte sera débitée en 10 mensualités égales</li>
                </ol>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Exemple pour un voyage de 1000€</span>
                  <span className="font-bold">10 x 100€</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Aucun frais supplémentaire</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Aucun justificatif à fournir</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Disponible pour tous les voyages à partir de 300€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Destinations populaires</h2>
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative h-32">
                <Image src="/placeholder.svg?height=200&width=400" alt="Barcelone" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold">Barcelone</h3>
                    <p className="text-sm">À partir de 299€</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-32">
                <Image src="/placeholder.svg?height=200&width=400" alt="Berlin" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold">Berlin</h3>
                    <p className="text-sm">À partir de 249€</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-32">
                <Image src="/placeholder.svg?height=200&width=400" alt="Tel Aviv" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold">Tel Aviv</h3>
                    <p className="text-sm">À partir de 399€</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Button className="w-full" variant="outline">
              Voir toutes les destinations
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Besoin d'aide pour votre réservation ?</h2>
            <p className="mb-0">Notre équipe est disponible 7j/7 pour vous accompagner dans vos projets de voyage.</p>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 whitespace-nowrap">Contactez-nous</Button>
        </div>
      </div>
    </div>
  )
}
