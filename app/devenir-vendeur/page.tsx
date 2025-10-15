"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Upload, ArrowRight, Info } from "lucide-react"

export default function DevenirVendeurPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNextStep = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setStep(4) // Étape de confirmation
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Devenez Vendeur·euse sur Spectrum</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rejoignez notre marketplace inclusive et commencez à vendre vos produits à une communauté engagée.
          </p>
        </div>

        {/* Étapes de progression */}
        <div className="mb-10">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-purple-600 -translate-y-1/2 z-0"
              style={{ width: `${(step - 1) * 33.33}%` }}
            ></div>

            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    s < step
                      ? "bg-purple-600 text-white"
                      : s === step
                        ? "bg-purple-600 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                <span className={`text-xs mt-2 ${s <= step ? "text-purple-600 font-medium" : "text-muted-foreground"}`}>
                  {s === 1 && "Informations"}
                  {s === 2 && "Boutique"}
                  {s === 3 && "Vérification"}
                  {s === 4 && "Confirmation"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Étape 1: Informations personnelles */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>Parlez-nous un peu de vous</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" placeholder="Votre prénom" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Votre nom" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" placeholder="Votre adresse" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code Postal</Label>
                    <Input id="postalCode" placeholder="75000" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" placeholder="Paris" required />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNextStep}>
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Étape 2: Informations de la boutique */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Votre Boutique</CardTitle>
              <CardDescription>Créez votre espace de vente</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nom de la boutique</Label>
                  <Input id="storeName" placeholder="Le nom de votre boutique" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Description</Label>
                  <Textarea
                    id="storeDescription"
                    placeholder="Décrivez votre boutique et vos produits..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo de la boutique</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Glissez-déposez votre logo ici ou</p>
                    <Button variant="outline" size="sm">
                      Parcourir
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG ou SVG. 1MB max.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Photos de couverture</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Glissez-déposez vos photos ici ou</p>
                    <Button variant="outline" size="sm">
                      Parcourir
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG ou JPG. 5MB max. Vous pouvez ajouter jusqu'à 5 photos.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie principale</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="vetements">Vêtements</option>
                    <option value="bijoux">Bijoux</option>
                    <option value="art">Art</option>
                    <option value="beaute">Beauté</option>
                    <option value="decoration">Décoration</option>
                    <option value="livres">Livres</option>
                    <option value="accessoires">Accessoires</option>
                    <option value="artisanat">Artisanat</option>
                  </select>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Retour
              </Button>
              <Button onClick={handleNextStep}>
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Étape 3: Vérification et conditions */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Vérification</CardTitle>
              <CardDescription>Dernière étape avant de soumettre votre demande</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Informations importantes</h3>
                      <p className="text-sm text-muted-foreground">
                        Votre demande sera examinée par notre équipe dans un délai de 48 heures. Nous vous contacterons
                        par email pour vous informer de la décision.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="terms" className="mt-1" required />
                    <Label htmlFor="terms" className="font-normal text-sm">
                      J'accepte les{" "}
                      <Link href="/terms" className="text-purple-600 hover:underline">
                        conditions d'utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="/privacy" className="text-purple-600 hover:underline">
                        politique de confidentialité
                      </Link>{" "}
                      de Spectrum.
                    </Label>
                  </div>

                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="guidelines" className="mt-1" required />
                    <Label htmlFor="guidelines" className="font-normal text-sm">
                      Je comprends et j'accepte les{" "}
                      <Link href="/seller-guidelines" className="text-purple-600 hover:underline">
                        directives pour les vendeur·euse·s
                      </Link>
                      , y compris les frais de commission de 10% sur chaque vente.
                    </Label>
                  </div>

                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="authentic" className="mt-1" required />
                    <Label htmlFor="authentic" className="font-normal text-sm">
                      Je certifie que tous les produits que je vendrai sont authentiques, légaux et respectent les
                      valeurs d'inclusion et de diversité de Spectrum.
                    </Label>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Retour
                    </Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">◌</span>
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          Soumettre ma demande
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Confirmation */}
        {step === 4 && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Demande Envoyée avec Succès!</CardTitle>
              <CardDescription className="text-base">
                Merci d'avoir soumis votre demande pour devenir vendeur·euse sur Spectrum.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 max-w-md mx-auto">
                <p>
                  Notre équipe examinera votre demande dans les 48 heures. Vous recevrez un email à l'adresse que vous
                  avez fournie pour vous informer de notre décision.
                </p>
                <div className="bg-muted p-4 rounded-lg text-left">
                  <h3 className="font-medium mb-2">Prochaines étapes:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Vérification de vos informations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Approbation de votre boutique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Configuration de votre espace vendeur·euse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Ajout de vos premiers produits</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  )
}
