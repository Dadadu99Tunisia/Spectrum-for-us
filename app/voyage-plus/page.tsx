"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  ChevronLeft,
  Plane,
  Hotel,
  Car,
  Calendar,
  Search,
  MapPin,
  Globe,
  CreditCard,
  Heart,
  Sparkles,
  PartyPopper,
  Instagram,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function VoyagePlus() {
  const router = useRouter()

  // États pour le formulaire de vol
  const [volSearch, setVolSearch] = useState({
    type: "aller-retour",
    passagers: "1-adulte",
    classe: "eco",
    depart: "",
    arrivee: "",
    dateDepart: "",
    dateRetour: "",
  })

  // États pour le formulaire d'hôtel
  const [hotelSearch, setHotelSearch] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    voyageurs: "2-adultes",
  })

  // États pour le formulaire de séjour
  const [sejourSearch, setSejourSearch] = useState({
    departVille: "",
    destination: "",
    dateDepart: "",
    duree: "7",
  })

  // États pour le formulaire de location de voiture
  const [voitureSearch, setVoitureSearch] = useState({
    lieuRetrait: "",
    dateRetrait: "",
    dateRetour: "",
    categorie: "compact",
  })

  // Fonction de gestion de la soumission du formulaire de vol
  const handleVolSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validation basique
    if (!volSearch.depart || !volSearch.arrivee || !volSearch.dateDepart) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    // Simuler une redirection vers une page de résultats
    toast({
      title: "Recherche en cours",
      description: `Recherche de vols de ${volSearch.depart} à ${volSearch.arrivee}`,
    })

    // Redirection simulée (dans une vraie application, on redirigerait vers une page de résultats)
    setTimeout(() => {
      router.push(`/voyage-plus/resultats?type=vol&depart=${volSearch.depart}&arrivee=${volSearch.arrivee}`)
    }, 1500)
  }

  // Fonction de gestion de la soumission du formulaire d'hôtel
  const handleHotelSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!hotelSearch.destination || !hotelSearch.checkIn || !hotelSearch.checkOut) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Recherche en cours",
      description: `Recherche d'hôtels à ${hotelSearch.destination}`,
    })

    setTimeout(() => {
      router.push(`/voyage-plus/resultats?type=hotel&destination=${hotelSearch.destination}`)
    }, 1500)
  }

  // Fonction de gestion de la soumission du formulaire de séjour
  const handleSejourSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!sejourSearch.departVille || !sejourSearch.destination || !sejourSearch.dateDepart) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Recherche en cours",
      description: `Recherche de séjours à ${sejourSearch.destination}`,
    })

    setTimeout(() => {
      router.push(`/voyage-plus/resultats?type=sejour&destination=${sejourSearch.destination}`)
    }, 1500)
  }

  // Fonction de gestion de la soumission du formulaire de location de voiture
  const handleVoitureSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!voitureSearch.lieuRetrait || !voitureSearch.dateRetrait || !voitureSearch.dateRetour) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Recherche en cours",
      description: `Recherche de voitures à ${voitureSearch.lieuRetrait}`,
    })

    setTimeout(() => {
      router.push(`/voyage-plus/resultats?type=voiture&lieu=${voitureSearch.lieuRetrait}`)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barre de navigation spécifique aux voyages */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white p-1 rounded">
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-bold text-xl">Spectrum Voyages</span>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-2 text-sm">
            <Link href="/voyage-plus" className="whitespace-nowrap font-medium hover:underline">
              Accueil
            </Link>
            <Link href="/voyage-plus/vol" className="whitespace-nowrap hover:underline">
              Vol
            </Link>
            <Link href="/voyage-plus/sejour" className="whitespace-nowrap hover:underline">
              Séjour
            </Link>
            <Link href="/voyage-plus/vente-flash" className="whitespace-nowrap hover:underline">
              Vente Flash
            </Link>
            <Link href="/voyage-plus/hotel" className="whitespace-nowrap hover:underline">
              Hôtel
            </Link>
            <Link href="/voyage-plus/derniere-minute" className="whitespace-nowrap hover:underline">
              Dernière minute
            </Link>
            <Link href="/voyage-plus/parcs" className="whitespace-nowrap hover:underline">
              Parcs de loisirs
            </Link>
            <Link href="/voyage-plus/france" className="whitespace-nowrap hover:underline">
              France
            </Link>
            <Link href="/voyage-plus/train-bus" className="whitespace-nowrap hover:underline">
              Train + Bus
            </Link>
            <Link href="/voyage-plus/location-voiture" className="whitespace-nowrap hover:underline">
              Location de voiture
            </Link>
          </div>
        </div>
      </div>

      {/* Bannière paiement 10x */}
      <div className="bg-blue-700 text-white py-2 text-center font-medium">
        Paiement 10x : Échelonnez vos paiements, pas vos vacances !
      </div>

      {/* Contenu principal */}
      <div className="flex-grow">
        {/* Hero section avec slider */}
        <div className="relative">
          <div className="relative h-[400px] overflow-hidden">
            <Image
              src="/placeholder.svg?height=800&width=1600"
              alt="Plage au coucher du soleil"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-blue-900/60"></div>

            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-white">
              <Button variant="ghost" className="rounded-full bg-white/20 p-2 hover:bg-white/30">
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Précédent</span>
              </Button>
            </div>

            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-white">
              <Button variant="ghost" className="rounded-full bg-white/20 p-2 hover:bg-white/30">
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Suivant</span>
              </Button>
            </div>

            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                <div className="w-full md:w-1/2 text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">L'ÉTÉ À PRIX MINI</h1>
                  <h2 className="text-xl md:text-2xl mb-6">Grèce, Espagne, Italie...</h2>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-pink-500 text-white px-4 py-2 rounded-full font-bold">PAIEMENT 10X</div>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-sm">Dès</span>
                    <span className="text-5xl md:text-7xl font-bold mx-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-200">
                      249€
                    </span>
                    <span className="text-sm">par personne</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Moteur de recherche */}
        <div className="container mx-auto px-4 -mt-16 relative z-10 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
            <Tabs defaultValue="vol" className="w-full">
              <TabsList className="w-full flex h-auto p-0 bg-gray-100 dark:bg-slate-800">
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
                  value="sejour"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Séjour
                </TabsTrigger>
                <TabsTrigger
                  value="voiture"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Voiture
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vol" className="p-6">
                <form onSubmit={handleVolSubmit}>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span>Je recherche un vol</span>
                      <Select
                        defaultValue={volSearch.type}
                        onValueChange={(value) => setVolSearch({ ...volSearch, type: value })}
                      >
                        <SelectTrigger className="w-[180px] h-8">
                          <SelectValue placeholder="Type de vol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aller-retour">Aller - retour</SelectItem>
                          <SelectItem value="aller-simple">Aller simple</SelectItem>
                          <SelectItem value="multi-destinations">Multi-destinations</SelectItem>
                        </SelectContent>
                      </Select>

                      <span>pour</span>
                      <Select
                        defaultValue={volSearch.passagers}
                        onValueChange={(value) => setVolSearch({ ...volSearch, passagers: value })}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="Passagers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-adulte">1 adulte</SelectItem>
                          <SelectItem value="2-adultes">2 adultes</SelectItem>
                          <SelectItem value="famille">Famille</SelectItem>
                        </SelectContent>
                      </Select>

                      <span>en</span>
                      <Select
                        defaultValue={volSearch.classe}
                        onValueChange={(value) => setVolSearch({ ...volSearch, classe: value })}
                      >
                        <SelectTrigger className="w-[150px] h-8">
                          <SelectValue placeholder="Classe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eco">Économique</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="affaires">Affaires</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Label
                        htmlFor="depart"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Départ
                      </Label>
                      <Input
                        id="depart"
                        placeholder="Ville ou aéroport"
                        className="pl-8"
                        value={volSearch.depart}
                        onChange={(e) => setVolSearch({ ...volSearch, depart: e.target.value })}
                        required
                      />
                      <MapPin className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="arrivee"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Arrivée
                      </Label>
                      <Input
                        id="arrivee"
                        placeholder="Ville ou aéroport"
                        className="pl-8"
                        value={volSearch.arrivee}
                        onChange={(e) => setVolSearch({ ...volSearch, arrivee: e.target.value })}
                        required
                      />
                      <MapPin className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="date-depart"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Date de départ
                      </Label>
                      <Input
                        id="date-depart"
                        type="date"
                        className="pl-8"
                        value={volSearch.dateDepart}
                        onChange={(e) => setVolSearch({ ...volSearch, dateDepart: e.target.value })}
                        required
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="date-retour"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Date de retour
                      </Label>
                      <Input
                        id="date-retour"
                        type="date"
                        className="pl-8"
                        value={volSearch.dateRetour}
                        onChange={(e) => setVolSearch({ ...volSearch, dateRetour: e.target.value })}
                        disabled={volSearch.type === "aller-simple"}
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="hotel" className="p-6">
                <form onSubmit={handleHotelSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Label
                        htmlFor="destination"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Destination
                      </Label>
                      <Input
                        id="destination"
                        placeholder="Ville, région ou pays"
                        className="pl-8"
                        value={hotelSearch.destination}
                        onChange={(e) => setHotelSearch({ ...hotelSearch, destination: e.target.value })}
                        required
                      />
                      <MapPin className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="check-in"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Arrivée
                      </Label>
                      <Input
                        id="check-in"
                        type="date"
                        className="pl-8"
                        value={hotelSearch.checkIn}
                        onChange={(e) => setHotelSearch({ ...hotelSearch, checkIn: e.target.value })}
                        required
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="check-out"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Départ
                      </Label>
                      <Input
                        id="check-out"
                        type="date"
                        className="pl-8"
                        value={hotelSearch.checkOut}
                        onChange={(e) => setHotelSearch({ ...hotelSearch, checkOut: e.target.value })}
                        required
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="voyageurs"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Voyageurs
                      </Label>
                      <Select
                        defaultValue={hotelSearch.voyageurs}
                        onValueChange={(value) => setHotelSearch({ ...hotelSearch, voyageurs: value })}
                      >
                        <SelectTrigger id="voyageurs">
                          <SelectValue placeholder="Nombre de voyageurs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-adulte">1 adulte</SelectItem>
                          <SelectItem value="2-adultes">2 adultes</SelectItem>
                          <SelectItem value="2-adultes-1-enfant">2 adultes, 1 enfant</SelectItem>
                          <SelectItem value="2-adultes-2-enfants">2 adultes, 2 enfants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="sejour" className="p-6">
                <form onSubmit={handleSejourSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Label
                        htmlFor="depart-sejour"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Ville de départ
                      </Label>
                      <Input
                        id="depart-sejour"
                        placeholder="Paris, Lyon, Marseille..."
                        className="pl-8"
                        value={sejourSearch.departVille}
                        onChange={(e) => setSejourSearch({ ...sejourSearch, departVille: e.target.value })}
                        required
                      />
                      <MapPin className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="destination-sejour"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Destination
                      </Label>
                      <Input
                        id="destination-sejour"
                        placeholder="Pays, ville ou région"
                        className="pl-8"
                        value={sejourSearch.destination}
                        onChange={(e) => setSejourSearch({ ...sejourSearch, destination: e.target.value })}
                        required
                      />
                      <MapPin className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="date-depart-sejour"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Date de départ
                      </Label>
                      <Input
                        id="date-depart-sejour"
                        type="date"
                        className="pl-8"
                        value={sejourSearch.dateDepart}
                        onChange={(e) => setSejourSearch({ ...sejourSearch, dateDepart: e.target.value })}
                        required
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label htmlFor="duree" className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1">
                        Durée
                      </Label>
                      <Select
                        defaultValue={sejourSearch.duree}
                        onValueChange={(value) => setSejourSearch({ ...sejourSearch, duree: value })}
                      >
                        <SelectTrigger id="duree">
                          <SelectValue placeholder="Durée du séjour" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekend">Week-end</SelectItem>
                          <SelectItem value="5">5 jours</SelectItem>
                          <SelectItem value="7">1 semaine</SelectItem>
                          <SelectItem value="14">2 semaines</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="voiture" className="p-6">
                <form onSubmit={handleVoitureSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Label
                        htmlFor="lieu-retrait"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Lieu de retrait
                      </Label>
                      <Input
                        id="lieu-retrait"
                        placeholder="Ville ou aéroport"
                        className="pl-8"
                        value={voitureSearch.lieuRetrait}
                        onChange={(e) => setVoitureSearch({ ...voitureSearch, lieuRetrait: e.target.value })}
                        required
                      />
                      <MapPin className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="date-retrait"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Date de retrait
                      </Label>
                      <Input
                        id="date-retrait"
                        type="date"
                        className="pl-8"
                        value={voitureSearch.dateRetrait}
                        onChange={(e) => setVoitureSearch({ ...voitureSearch, dateRetrait: e.target.value })}
                        required
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="date-retour-voiture"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Date de retour
                      </Label>
                      <Input
                        id="date-retour-voiture"
                        type="date"
                        className="pl-8"
                        value={voitureSearch.dateRetour}
                        onChange={(e) => setVoitureSearch({ ...voitureSearch, dateRetour: e.target.value })}
                        required
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>

                    <div className="relative">
                      <Label
                        htmlFor="categorie"
                        className="text-xs absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1"
                      >
                        Catégorie
                      </Label>
                      <Select
                        defaultValue={voitureSearch.categorie}
                        onValueChange={(value) => setVoitureSearch({ ...voitureSearch, categorie: value })}
                      >
                        <SelectTrigger id="categorie">
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
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Bannière paiement 10x avec blague */}
        <div className="container mx-auto px-4 mb-12">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">10X</div>
                <div className="text-xs">sans frais</div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">
                Chez Spectrum, avec Voyage+, on vous laisse payer en 10 fois, parce qu'on sait que les queer adorent les
                relations à distance... et les escapades imprévues ! 😜✈️
              </h3>
              <p className="text-sm text-muted-foreground">Pour échelonner votre paiement, pas vos vacances !</p>
            </div>
          </div>
        </div>

        {/* Destinations Queer */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Destinations Queer-Friendly</h2>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">Pride Edition</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=500" alt="Berlin Pride" fill className="object-cover" />
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600">
                  Pride Juin 2025
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold text-lg">Berlin</h3>
                    <p className="text-sm">La capitale queer de l'Europe</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Heart className="h-4 w-4 text-pink-400" />
                      <span className="text-xs">Score LGBTQ+: 10/10</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg">349€</div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Réserver
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=500" alt="San Francisco" fill className="object-cover" />
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600">
                  Castro District
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold text-lg">San Francisco</h3>
                    <p className="text-sm">Berceau des droits LGBTQ+</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Heart className="h-4 w-4 text-pink-400" />
                      <span className="text-xs">Score LGBTQ+: 9/10</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg">799€</div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Réserver
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=500" alt="Mykonos" fill className="object-cover" />
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600">
                  Plages LGBTQ+
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold text-lg">Mykonos</h3>
                    <p className="text-sm">L'île grecque arc-en-ciel</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Heart className="h-4 w-4 text-pink-400" />
                      <span className="text-xs">Score LGBTQ+: 8/10</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg">499€</div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Réserver
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PartyPopper className="h-5 w-5" />
                  <h3 className="text-xl font-bold">Événements Pride 2025</h3>
                </div>
                <p className="mb-4">
                  Réservez dès maintenant vos séjours pour les événements Pride dans le monde entier !
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 hover:bg-white/30">Madrid Pride - Juillet</Badge>
                  <Badge className="bg-white/20 hover:bg-white/30">Amsterdam Pride - Août</Badge>
                  <Badge className="bg-white/20 hover:bg-white/30">Sydney Mardi Gras - Février</Badge>
                  <Badge className="bg-white/20 hover:bg-white/30">Paris Pride - Juin</Badge>
                </div>
              </div>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <Sparkles className="h-4 w-4 mr-2" />
                Voir tous les événements
              </Button>
            </div>
          </div>
        </div>

        {/* Meilleures offres */}
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold mb-6">Nos meilleures offres France ou étranger</h2>

          <p className="text-muted-foreground mb-6">
            Vous aimez la France et souhaitez la découvrir sous toutes ses formes ? Réservez votre chalet à la montagne,
            votre villa dans le Sud ou encore votre mobil-home au camping. Les vacances en France vous tendent les bras
            chez Spectrum.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Plage paradisiaque"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">Séjours plage</h3>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Ville européenne"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">City breaks</h3>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=500" alt="Montagne" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">Séjours montagne</h3>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=500" alt="Camping" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">Campings</h3>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Partenariat MisterFly */}
        <div className="container mx-auto px-4 mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl">
                  <Image
                    src="/placeholder.svg?height=60&width=120"
                    alt="MisterFly Logo"
                    width={120}
                    height={60}
                    className="h-10 w-auto"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">PARTENARIAT EXCLUSIF AVEC MISTERFLY</h2>
                  <p className="mb-2">
                    Réservez des voyages LGBTQ+ friendly dans le monde entier avec notre partenaire MisterFly.
                  </p>
                  <div className="flex items-center">
                    <Badge className="bg-white text-purple-600 hover:bg-gray-100 mr-2">AVANTAGE</Badge>
                    <span className="text-sm font-medium">Paiement en 10x sans frais sur toutes les réservations</span>
                  </div>
                </div>
              </div>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <CreditCard className="h-4 w-4 mr-2" />
                Réserver maintenant
              </Button>
            </div>
          </div>
        </div>

        {/* Ventes flash */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Ventes flash</h2>
            <Badge className="bg-red-500">Offres limitées</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=500" alt="Grèce" fill className="object-cover" />
                <Badge className="absolute top-2 right-2 bg-red-500">-30%</Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold text-lg">Séjour en Grèce</h3>
                    <p className="text-sm">7 nuits - Hôtel 4* - Petit déjeuner</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="line-through text-gray-300">699€</span>
                      <span className="font-bold">489€</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=500" alt="Espagne" fill className="object-cover" />
                <Badge className="absolute top-2 right-2 bg-red-500">-25%</Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold text-lg">Week-end à Barcelone</h3>
                    <p className="text-sm">3 nuits - Hôtel 3* - Centre ville</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="line-through text-gray-300">399€</span>
                      <span className="font-bold">299€</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=500" alt="Italie" fill className="object-cover" />
                <Badge className="absolute top-2 right-2 bg-red-500">-20%</Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold text-lg">Rome en amoureux</h3>
                    <p className="text-sm">4 nuits - Hôtel 4* - Petit déjeuner</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="line-through text-gray-300">549€</span>
                      <span className="font-bold">439€</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Spectrum Voyages</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Voyagez en toute sérénité avec notre sélection de destinations LGBTQ+ friendly et notre partenaire
                MisterFly.
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">Paiement 10x sans frais</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Destinations</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    France
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Espagne
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Italie
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Grèce
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Portugal
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Toutes les destinations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Types de voyages</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Séjours
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Vols
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Hôtels
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Locations de voiture
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Circuits
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Week-ends
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Informations</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Conditions générales
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Nous contacter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
              asChild
            >
              <Link href="https://www.instagram.com/spectrum.forus/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Spectrum Voyages. Tous droits réservés.</p>
            <p className="mt-2">
              Suivez-nous sur{" "}
              <a
                href="https://www.instagram.com/spectrum.forus/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Instagram @spectrum.forus
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
