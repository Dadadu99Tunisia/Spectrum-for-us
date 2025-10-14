"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  CheckCircle,
  Clock,
  User,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"

export default function CommandeDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("details")

  // Données fictives pour la démo
  const order = {
    id: params.id,
    client: {
      nom: "Sophie Martin",
      email: "sophie.martin@example.com",
      telephone: "+33 6 12 34 56 78",
    },
    date: "15/04/2023",
    montant: {
      sousTotal: 79.99,
      livraison: 10.0,
      total: 89.99,
    },
    statut: "Livré",
    adresse: {
      livraison: {
        rue: "123 Rue de la Paix",
        ville: "Paris",
        codePostal: "75001",
        pays: "France",
      },
      facturation: {
        rue: "123 Rue de la Paix",
        ville: "Paris",
        codePostal: "75001",
        pays: "France",
      },
    },
    paiement: {
      methode: "Carte bancaire",
      reference: "PAY-123456789",
      statut: "Payé",
    },
    produits: [
      {
        id: "PRD-001",
        nom: "T-shirt Pride Collection",
        prix: 29.99,
        quantite: 2,
        total: 59.98,
        image: "/placeholder.svg?height=80&width=80",
        options: "Couleur: Blanc, Taille: M",
      },
      {
        id: "PRD-015",
        nom: "Bracelet Rainbow",
        prix: 19.99,
        quantite: 1,
        total: 19.99,
        image: "/placeholder.svg?height=80&width=80",
        options: "Taille: Unique",
      },
    ],
    historique: [
      {
        date: "15/04/2023 14:30",
        statut: "Livré",
        description: "Commande livrée au client",
      },
      {
        date: "14/04/2023 09:15",
        statut: "Expédié",
        description: "Commande expédiée via Colissimo",
      },
      {
        date: "13/04/2023 16:45",
        statut: "En préparation",
        description: "Commande en cours de préparation",
      },
      {
        date: "13/04/2023 10:30",
        statut: "Paiement confirmé",
        description: "Paiement reçu et confirmé",
      },
      {
        date: "13/04/2023 10:25",
        statut: "Commande créée",
        description: "Commande créée par le client",
      },
    ],
    notes: [],
  }

  return (
    <VendeurLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/vendeur/commandes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Commande {order.id}</h1>
            <p className="text-muted-foreground">Passée le {order.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Contacter
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Facture
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Statut de la commande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                className={
                  order.statut === "Livré"
                    ? "bg-green-500"
                    : order.statut === "Expédié"
                      ? "bg-blue-500"
                      : order.statut === "En préparation"
                        ? "bg-yellow-500"
                        : order.statut === "Annulé"
                          ? "bg-red-500"
                          : "bg-gray-500"
                }
              >
                {order.statut}
              </Badge>
              <span className="text-sm text-muted-foreground">Dernière mise à jour: {order.historique[0].date}</span>
            </div>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted"></div>
                <div className="space-y-4">
                  {order.historique.map((event, index) => (
                    <div key={index} className="flex gap-3 relative">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                          index === 0 ? "bg-green-100 text-green-600" : "bg-muted"
                        }`}
                      >
                        {index === 0 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.statut}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <p className="text-xs">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informations client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{order.client.nom}</p>
                  <p className="text-sm text-muted-foreground">{order.client.email}</p>
                  <p className="text-sm text-muted-foreground">{order.client.telephone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Adresse de livraison</p>
                  <p className="text-sm">{order.adresse.livraison.rue}</p>
                  <p className="text-sm">
                    {order.adresse.livraison.codePostal} {order.adresse.livraison.ville}
                  </p>
                  <p className="text-sm">{order.adresse.livraison.pays}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Adresse de facturation</p>
                  <p className="text-sm">{order.adresse.facturation.rue}</p>
                  <p className="text-sm">
                    {order.adresse.facturation.codePostal} {order.adresse.facturation.ville}
                  </p>
                  <p className="text-sm">{order.adresse.facturation.pays}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Méthode de paiement</p>
                  <p className="text-sm">{order.paiement.methode}</p>
                  <p className="text-sm text-muted-foreground">Référence: {order.paiement.reference}</p>
                  <Badge className="mt-1 bg-green-500">{order.paiement.statut}</Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{order.montant.sousTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{order.montant.livraison.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{order.montant.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Produits commandés</CardTitle>
              <CardDescription>Liste des produits dans cette commande</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Produit</th>
                      <th className="text-left py-3 px-4 font-medium">Prix unitaire</th>
                      <th className="text-left py-3 px-4 font-medium">Quantité</th>
                      <th className="text-right py-3 px-4 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.produits.map((produit) => (
                      <tr key={produit.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-md overflow-hidden">
                              <Image
                                src={produit.image || "/placeholder.svg"}
                                alt={produit.nom}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/vendeur/produits/${produit.id}`}
                                className="font-medium hover:text-purple-600"
                              >
                                {produit.nom}
                              </Link>
                              <p className="text-xs text-muted-foreground">{produit.options}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{produit.prix.toFixed(2)} €</td>
                        <td className="py-3 px-4">{produit.quantite}</td>
                        <td className="py-3 px-4 text-right font-medium">{produit.total.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">
                        Sous-total
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{order.montant.sousTotal.toFixed(2)} €</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">
                        Livraison
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{order.montant.livraison.toFixed(2)} €</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">
                        Total
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{order.montant.total.toFixed(2)} €</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Ajoutez des notes internes pour cette commande</CardDescription>
            </CardHeader>
            <CardContent>
              {order.notes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Aucune note pour cette commande</p>
                  <Button>Ajouter une note</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {order.notes.map((note, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <p>{note.contenu}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>{note.auteur}</span>
                        <span>{note.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </VendeurLayout>
  )
}

