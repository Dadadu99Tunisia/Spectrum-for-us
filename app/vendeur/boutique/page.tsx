"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Save, Eye, ExternalLink } from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"

export default function BoutiquePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("informations")

  // Données fictives pour la démo
  const boutique = {
    nom: "QueerApparel",
    description:
      "Vêtements et accessoires inclusifs pour toutes les identités. Notre mission est de créer des vêtements qui permettent à chacun d'exprimer sa véritable identité, au-delà des normes de genre traditionnelles.",
    logo: "/placeholder.svg?height=200&width=200",
    banniere: "/placeholder.svg?height=600&width=1200",
    categorie: "Vêtements",
    dateCreation: "Janvier 2022",
    adresse: "123 Rue de la Mode, 75001 Paris",
    email: "contact@queerapparel.com",
    telephone: "+33 1 23 45 67 89",
    reseauxSociaux: {
      instagram: "queerapparel",
      facebook: "queerapparel",
      twitter: "queerapparel",
    },
    politique: {
      livraison: "Livraison gratuite à partir de 50€. Délai de livraison: 3-5 jours ouvrés.",
      retours: "Retours gratuits sous 30 jours. Les articles doivent être dans leur état d'origine.",
      paiement: "Nous acceptons les cartes de crédit, PayPal et les virements bancaires.",
    },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
  }

  return (
    <VendeurLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ma Boutique</h1>
          <p className="text-muted-foreground">Gérez les informations de votre boutique</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/vendeur/${boutique.nom.toLowerCase()}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Voir ma boutique
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="informations" className="flex-1">
                Informations
              </TabsTrigger>
              <TabsTrigger value="apparence" className="flex-1">
                Apparence
              </TabsTrigger>
              <TabsTrigger value="politiques" className="flex-1">
                Politiques
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="informations">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de la Boutique</CardTitle>
                    <CardDescription>Modifiez les informations de base de votre boutique</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom de la boutique</Label>
                        <Input id="nom" defaultValue={boutique.nom} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          defaultValue={boutique.description}
                          className="min-h-[150px]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie principale</Label>
                        <select
                          id="category"
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                          defaultValue={boutique.categorie}
                          required
                        >
                          <option value="">Sélectionnez une catégorie</option>
                          <option value="Vêtements">Vêtements</option>
                          <option value="Bijoux">Bijoux</option>
                          <option value="Art">Art</option>
                          <option value="Beauté">Beauté</option>
                          <option value="Décoration">Décoration</option>
                          <option value="Livres">Livres</option>
                          <option value="Accessoires">Accessoires</option>
                          <option value="Artisanat">Artisanat</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adresse">Adresse</Label>
                        <Input id="adresse" defaultValue={boutique.adresse} required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={boutique.email} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telephone">Téléphone</Label>
                          <Input id="telephone" defaultValue={boutique.telephone} />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="apparence">
                <Card>
                  <CardHeader>
                    <CardTitle>Apparence de la Boutique</CardTitle>
                    <CardDescription>Personnalisez l'apparence de votre boutique</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Logo de la boutique</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                            <Image
                              src={boutique.logo || "/placeholder.svg"}
                              alt="Logo de la boutique"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Changer le logo
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Format carré recommandé. PNG, JPG ou SVG. 1MB max.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Bannière de la boutique</Label>
                        <div className="relative aspect-[3/1] w-full rounded-md overflow-hidden border">
                          <Image
                            src={boutique.banniere || "/placeholder.svg"}
                            alt="Bannière de la boutique"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                            <Button variant="outline" className="bg-white/90 hover:bg-white">
                              <Upload className="h-4 w-4 mr-2" />
                              Changer la bannière
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Format recommandé: 1200x400px. PNG ou JPG. 2MB max.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Couleurs de la boutique</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="couleur-primaire" className="text-xs">
                              Couleur primaire
                            </Label>
                            <div className="flex mt-1">
                              <div className="h-10 w-10 rounded-l-md bg-purple-600 border border-r-0"></div>
                              <Input id="couleur-primaire" defaultValue="#9333ea" className="rounded-l-none" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="couleur-secondaire" className="text-xs">
                              Couleur secondaire
                            </Label>
                            <div className="flex mt-1">
                              <div className="h-10 w-10 rounded-l-md bg-pink-600 border border-r-0"></div>
                              <Input id="couleur-secondaire" defaultValue="#db2777" className="rounded-l-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="politiques">
                <Card>
                  <CardHeader>
                    <CardTitle>Politiques de la Boutique</CardTitle>
                    <CardDescription>Définissez vos politiques de vente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="politique-livraison">Politique de livraison</Label>
                        <Textarea
                          id="politique-livraison"
                          defaultValue={boutique.politique.livraison}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="politique-retours">Politique de retours</Label>
                        <Textarea
                          id="politique-retours"
                          defaultValue={boutique.politique.retours}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="politique-paiement">Politique de paiement</Label>
                        <Textarea
                          id="politique-paiement"
                          defaultValue={boutique.politique.paiement}
                          className="min-h-[100px]"
                        />
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Réseaux Sociaux</CardTitle>
              <CardDescription>Connectez vos réseaux sociaux</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      instagram.com/
                    </span>
                    <Input id="instagram" className="rounded-l-none" defaultValue={boutique.reseauxSociaux.instagram} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      facebook.com/
                    </span>
                    <Input id="facebook" className="rounded-l-none" defaultValue={boutique.reseauxSociaux.facebook} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      twitter.com/
                    </span>
                    <Input id="twitter" className="rounded-l-none" defaultValue={boutique.reseauxSociaux.twitter} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>URL de la Boutique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL personnalisée</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      spectrumforus.com/
                    </span>
                    <Input id="url" className="rounded-l-none" defaultValue={boutique.nom.toLowerCase()} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Utilisez uniquement des lettres minuscules, des chiffres et des tirets.
                  </p>
                </div>

                <div className="pt-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/vendeur/${boutique.nom.toLowerCase()}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir ma boutique
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendeurLayout>
  )
}

