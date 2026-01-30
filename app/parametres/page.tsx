import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Lock, User, CreditCard, Globe, Eye, EyeOff } from "lucide-react"

export default function ParametresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground mb-6">Gérez vos préférences et informations personnelles</p>

        <Tabs defaultValue="compte" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="compte" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Compte</span>
            </TabsTrigger>
            <TabsTrigger value="securite" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="paiement" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Paiement</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compte">
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>Modifiez vos informations personnelles et vos préférences de compte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" placeholder="Votre nom" defaultValue="Alex Dupont" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Votre email" defaultValue="alex@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input id="username" placeholder="Nom d'utilisateur" defaultValue="alex_d" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="Numéro de téléphone" defaultValue="+33 6 12 34 56 78" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Parlez-nous de vous"
                    defaultValue="Passionné·e d'art et de culture queer. J'adore découvrir de nouveaux artistes et créateurs."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Annuler</Button>
                <Button>Enregistrer les modifications</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="securite">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Gérez votre mot de passe et la sécurité de votre compte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input id="current-password" type="password" placeholder="••••••••" />
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input id="new-password" type="password" placeholder="••••••••" />
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Authentification à deux facteurs</Label>
                      <p className="text-sm text-muted-foreground">
                        Ajoutez une couche de sécurité supplémentaire à votre compte.
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Mettre à jour le mot de passe</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="paiement">
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
                <CardDescription>Gérez vos cartes de crédit et autres méthodes de paiement.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md flex items-center justify-center text-white font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">Visa se terminant par 4242</p>
                        <p className="text-sm text-muted-foreground">Expire le 12/2025</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        Supprimer
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    + Ajouter une méthode de paiement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>Choisissez comment et quand vous souhaitez être notifié·e.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des emails concernant votre activité et vos commandes.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des emails sur les nouveaux produits et offres.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications de sécurité</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des emails concernant la sécurité de votre compte.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer les préférences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Préférences régionales</CardTitle>
                <CardDescription>Personnalisez votre expérience sur Spectrum.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <select
                      id="language"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <select
                      id="currency"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="eur">EUR (€)</option>
                      <option value="usd">USD ($)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="cad">CAD ($)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cookies">Cookies de personnalisation</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre l'utilisation de cookies pour personnaliser votre expérience.
                      </p>
                    </div>
                    <Switch id="cookies" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer les préférences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
