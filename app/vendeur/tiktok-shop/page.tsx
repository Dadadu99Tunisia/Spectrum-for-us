"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Settings,
  ShoppingBag,
  TrendingUp,
  Upload,
} from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"

export default function TikTokShopPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [syncInProgress, setSyncInProgress] = useState(false)

  const handleConnect = () => {
    // Simuler une connexion à TikTok Shop
    setTimeout(() => {
      setIsConnected(true)
    }, 1500)
  }

  const handleSync = () => {
    setSyncInProgress(true)
    // Simuler une synchronisation
    setTimeout(() => {
      setSyncInProgress(false)
    }, 3000)
  }

  return (
    <VendeurLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">TikTok Shop</h1>
            <p className="text-muted-foreground">Vendez vos produits directement sur TikTok</p>
          </div>
          {isConnected && (
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Paramètres TikTok Shop
            </Button>
          )}
        </div>

        {!isConnected ? (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=80&width=80&text=TikTok"
                  alt="TikTok Logo"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <CardTitle className="text-2xl">Connectez votre boutique TikTok Shop</CardTitle>
              <CardDescription>
                Vendez vos produits directement sur TikTok et atteignez des millions de clients potentiels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-purple-500" />
                      Vente simplifiée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Synchronisez vos produits et gérez vos ventes depuis une seule plateforme</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      Audience élargie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Accédez à des millions d'utilisateurs TikTok et augmentez votre visibilité
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-purple-500" />
                      Synchronisation automatique
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Vos stocks et commandes sont automatiquement mis à jour entre les plateformes
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="gap-2" onClick={handleConnect}>
                  Connecter TikTok Shop
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Votre boutique TikTok Shop est connectée</AlertTitle>
              <AlertDescription>
                Vous pouvez maintenant synchroniser et gérer vos produits sur TikTok Shop.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="produits">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="produits">Produits</TabsTrigger>
                <TabsTrigger value="commandes">Commandes</TabsTrigger>
                <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
                <TabsTrigger value="parametres">Paramètres</TabsTrigger>
              </TabsList>

              <TabsContent value="produits" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Produits TikTok Shop</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleSync} disabled={syncInProgress}>
                      {syncInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Synchronisation...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Synchroniser
                        </>
                      )}
                    </Button>
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Ajouter des produits
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Produits synchronisés</CardTitle>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="auto-sync" className="text-sm">
                          Synchronisation automatique
                        </Label>
                        <Switch id="auto-sync" defaultChecked />
                      </div>
                    </div>
                    <CardDescription>
                      Gérez les produits qui sont synchronisés avec votre boutique TikTok Shop
                    </CardDescription>
                    <div className="relative">
                      <Input placeholder="Rechercher un produit..." className="pl-8" />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Produit 1 */}
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 rounded-md overflow-hidden relative">
                            <Image
                              src="/placeholder.svg?height=64&width=64"
                              alt="T-shirt Pride Collection"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">T-shirt Pride Collection</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>29,99 €</span>
                              <span>•</span>
                              <span>15 en stock</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Synchronisé
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="https://tiktok.com" target="_blank" className="flex items-center gap-1">
                              <span className="sr-only md:not-sr-only md:inline-block">Voir sur TikTok</span>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {/* Produit 2 */}
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 rounded-md overflow-hidden relative">
                            <Image
                              src="/placeholder.svg?height=64&width=64"
                              alt="Boucles d'oreilles Arc-en-ciel"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">Boucles d'oreilles Arc-en-ciel</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>34,99 €</span>
                              <span>•</span>
                              <span>8 en stock</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Synchronisé
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="https://tiktok.com" target="_blank" className="flex items-center gap-1">
                              <span className="sr-only md:not-sr-only md:inline-block">Voir sur TikTok</span>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {/* Produit 3 */}
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 rounded-md overflow-hidden relative">
                            <Image
                              src="/placeholder.svg?height=64&width=64"
                              alt="Impression d'Art Inclusive"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">Impression d'Art Inclusive</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>24,99 €</span>
                              <span>•</span>
                              <span>20 en stock</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                          >
                            En attente
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="https://tiktok.com" target="_blank" className="flex items-center gap-1">
                              <span className="sr-only md:not-sr-only md:inline-block">Voir sur TikTok</span>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t pt-4">
                    <Button variant="outline">Voir tous les produits</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="commandes" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Commandes TikTok Shop</CardTitle>
                    <CardDescription>Gérez les commandes provenant de TikTok Shop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucune commande TikTok Shop pour le moment</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="statistiques" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques TikTok Shop</CardTitle>
                    <CardDescription>Suivez les performances de vos produits sur TikTok Shop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Vues des produits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0</div>
                          <p className="text-xs text-muted-foreground">Derniers 30 jours</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Ventes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0 €</div>
                          <p className="text-xs text-muted-foreground">Derniers 30 jours</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Taux de conversion
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0%</div>
                          <p className="text-xs text-muted-foreground">Derniers 30 jours</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        Connectez votre boutique et commencez à vendre pour voir les statistiques
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="parametres" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres TikTok Shop</CardTitle>
                    <CardDescription>Configurez les paramètres de votre intégration TikTok Shop</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shop-name">Nom de la boutique TikTok</Label>
                      <Input id="shop-name" value="Spectrum Boutique" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok-id">Identifiant TikTok Shop</Label>
                      <Input id="tiktok-id" value="TKTSHP123456" readOnly />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-sync-settings">Synchronisation automatique</Label>
                        <Switch id="auto-sync-settings" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Synchronisez automatiquement les produits, stocks et commandes entre Spectrum et TikTok Shop
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Notifications TikTok Shop</Label>
                        <Switch id="notifications" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications pour les nouvelles commandes et messages de TikTok Shop
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="destructive">Déconnecter</Button>
                    <Button>Enregistrer les modifications</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </VendeurLayout>
  )
}
