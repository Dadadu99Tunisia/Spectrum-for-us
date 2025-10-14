"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Key,
  Smartphone,
  Lock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  LogOut,
  Plus,
} from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"
import VendorTwoFactor from "@/components/security/vendor-two-factor"

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("authentication")
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [sessionHistory] = useState([
    {
      id: "1",
      device: "MacBook Pro",
      browser: "Chrome",
      location: "Paris, France",
      ip: "198.51.100.42",
      date: "15/03/2023 14:32",
      current: true,
    },
    {
      id: "2",
      device: "iPhone 12",
      browser: "Safari Mobile",
      location: "Paris, France",
      ip: "198.51.100.27",
      date: "12/03/2023 08:45",
      current: false,
    },
    {
      id: "3",
      device: "Windows PC",
      browser: "Firefox",
      location: "Lyon, France",
      ip: "198.51.100.98",
      date: "05/03/2023 19:22",
      current: false,
    },
  ])

  return (
    <VendeurLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sécurité</h1>
        <p className="text-muted-foreground">Gérez les paramètres de sécurité de votre compte vendeur</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="authentication" className="flex-1">
            <Shield className="h-4 w-4 mr-2" />
            Authentification
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1">
            <Key className="h-4 w-4 mr-2" />
            Mot de passe
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex-1">
            <Smartphone className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex-1">
            <Clock className="h-4 w-4 mr-2" />
            Activité
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <TabsContent value="authentication">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>État de la sécurité</CardTitle>
                  <CardDescription>Vérifiez l'état actuel de la sécurité de votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Mot de passe fort</h3>
                        <p className="text-sm text-muted-foreground">
                          Votre mot de passe est suffisamment fort et unique.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Authentification à deux facteurs</h3>
                        <p className="text-sm text-muted-foreground">
                          L'authentification à deux facteurs n'est pas activée.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Dernière connexion récente</h3>
                        <p className="text-sm text-muted-foreground">
                          Dernière connexion aujourd'hui à 14:32 depuis Paris, France.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Vérifier la sécurité maintenant</Button>
                </CardFooter>
              </Card>

              <VendorTwoFactor />

              <Card>
                <CardHeader>
                  <CardTitle>Options de connexion</CardTitle>
                  <CardDescription>Gérez les méthodes de connexion à votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Connexion par e-mail et mot de passe</p>
                          <p className="text-sm text-muted-foreground">Votre méthode de connexion principale</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Activé
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Connexion par SMS</p>
                          <p className="text-sm text-muted-foreground">Recevez un code de connexion unique par SMS</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configurer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Changer votre mot de passe</CardTitle>
                <CardDescription>Assurez-vous de choisir un mot de passe fort et unique</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe actuel"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                          {showCurrentPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre nouveau mot de passe"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                          {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirmez votre nouveau mot de passe"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Votre mot de passe doit :</p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Contenir au moins 8 caractères
                      </li>
                      <li className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Inclure une lettre majuscule
                      </li>
                      <li className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Inclure une lettre minuscule
                      </li>
                      <li className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Inclure un chiffre
                      </li>
                      <li className="flex items-center gap-1 text-muted-foreground">
                        <AlertTriangle className="h-3 w-3" />
                        Inclure un caractère spécial (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button>Changer le mot de passe</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Sessions Actives</CardTitle>
                <CardDescription>Gérez vos sessions connectées sur tous les appareils</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionHistory.map((session) => (
                    <div
                      key={session.id}
                      className={`flex justify-between items-start p-4 rounded-md border ${
                        session.current ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            session.current ? "bg-green-100 dark:bg-green-900/20" : "bg-muted"
                          }`}
                        >
                          <Smartphone
                            className={`h-5 w-5 ${session.current ? "text-green-600" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{session.device}</h3>
                          <p className="text-sm text-muted-foreground">{session.browser}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • {session.ip}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {session.date} {session.current && "(Session actuelle)"}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="outline" size="sm">
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnecter
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
                <Button variant="destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnecter tous les autres appareils
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Journal d'activité</CardTitle>
                <CardDescription>Consultez l'historique des activités récentes sur votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted"></div>
                    <div className="space-y-6 pl-8">
                      {[
                        {
                          type: "login",
                          date: "15/03/2023 14:32",
                          description: "Connexion réussie",
                          details: "Paris, France (198.51.100.42) - Chrome sur MacBook Pro",
                          icon: <Lock className="h-4 w-4" />,
                        },
                        {
                          type: "product",
                          date: "15/03/2023 10:15",
                          description: "Produit ajouté",
                          details: "T-shirt Pride Collection (#PRD-001)",
                          icon: <Plus className="h-4 w-4" />,
                        },
                        {
                          type: "settings",
                          date: "14/03/2023 16:47",
                          description: "Paramètres modifiés",
                          details: "Mise à jour des informations de livraison",
                          icon: <RefreshCw className="h-4 w-4" />,
                        },
                        {
                          type: "login",
                          date: "12/03/2023 08:45",
                          description: "Connexion réussie",
                          details: "Paris, France (198.51.100.27) - Safari sur iPhone 12",
                          icon: <Lock className="h-4 w-4" />,
                        },
                        {
                          type: "order",
                          date: "10/03/2023 15:22",
                          description: "Commande expédiée",
                          details: "Commande #CMD-7842 marquée comme expédiée",
                          icon: <CheckCircle className="h-4 w-4" />,
                        },
                      ].map((activity, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-10 top-0 flex h-6 w-6 items-center justify-center rounded-full border bg-background">
                            {activity.icon}
                          </div>
                          <div className="mb-1 flex items-baseline gap-2">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Afficher plus d'activités
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </VendeurLayout>
  )
}
