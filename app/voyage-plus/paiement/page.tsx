import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CreditCard, Lock, Info, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Options de paiement | Voyage+",
  description: "Choisissez votre option de paiement pour Voyage+",
}

export default function PaiementPage() {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Choisissez votre option de paiement</h1>

          <Tabs defaultValue="mensuel" className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mensuel">Paiement mensuel</TabsTrigger>
              <TabsTrigger value="10x">Paiement en 10x sans frais</TabsTrigger>
            </TabsList>

            <TabsContent value="mensuel" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Abonnement mensuel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">6.99€</span>
                    <span className="text-muted-foreground ml-2">/mois</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span>Sans engagement</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span>7 jours d'essai gratuit</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span>Annulation à tout moment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="10x" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paiement en 10x sans frais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">69.90€</span>
                    <span className="text-muted-foreground ml-2">soit 6.99€ x 10 mois</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span>Engagement 10 mois</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span>7 jours d'essai gratuit</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span>
                        <strong>0€ de frais</strong> sur le paiement en plusieurs fois
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Méthode de paiement</h2>
            <RadioGroup defaultValue="card" className="space-y-4">
              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    <span>Carte de crédit</span>
                  </div>
                </Label>
                <div className="flex space-x-2">
                  <Image
                    src="/placeholder.svg?height=30&width=40"
                    alt="Visa"
                    width={40}
                    height={30}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/placeholder.svg?height=30&width=40"
                    alt="Mastercard"
                    width={40}
                    height={30}
                    className="h-6 w-auto"
                  />
                  <Image
                    src="/placeholder.svg?height=30&width=40"
                    alt="Amex"
                    width={40}
                    height={30}
                    className="h-6 w-auto"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="PayPal"
                      width={20}
                      height={20}
                      className="h-5 w-5 mr-2"
                    />
                    <span>PayPal</span>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
                <RadioGroupItem value="applepay" id="applepay" />
                <Label htmlFor="applepay" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="Apple Pay"
                      width={20}
                      height={20}
                      className="h-5 w-5 mr-2"
                    />
                    <span>Apple Pay</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Informations de paiement</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <div className="relative mt-1">
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="expiry">Date d'expiration</Label>
                      <Input id="expiry" placeholder="MM/AA" className="mt-1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cvc">CVC</Label>
                        <Button variant="ghost" size="sm" className="h-5 p-0">
                          <Info className="h-3 w-3 mr-1" />
                          <span className="text-xs">Qu'est-ce que c'est?</span>
                        </Button>
                      </div>
                      <Input id="cvc" placeholder="123" className="mt-1" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="name">Nom sur la carte</Label>
                      <Input id="name" placeholder="J. SMITH" className="mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700"
            >
              Confirmer le paiement
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Abonnement Voyage+</span>
                  <span>6.99€/mois</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Période d'essai</span>
                  <span>7 jours gratuits</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total à payer aujourd'hui</span>
                  <span>0.00€</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Votre carte sera débitée de 6.99€ après la période d'essai de 7 jours, sauf si vous annulez avant.
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-4">
              <div className="text-sm">
                <div className="font-medium mb-1">Ce qui est inclus :</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Guides exclusifs pour destinations LGBTQ+ friendly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Réductions sur hébergements partenaires</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Assistance voyage 24/7</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Accès à la communauté de voyageurs</span>
                  </li>
                </ul>
              </div>
              <div className="text-xs text-muted-foreground">
                En confirmant votre paiement, vous acceptez nos{" "}
                <Link href="#" className="underline">
                  Conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link href="#" className="underline">
                  Politique de confidentialité
                </Link>
                .
              </div>
            </CardFooter>
          </Card>

          <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Paiement sécurisé</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Toutes vos informations de paiement sont cryptées et sécurisées. Nous ne stockons pas les détails de
                  votre carte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
