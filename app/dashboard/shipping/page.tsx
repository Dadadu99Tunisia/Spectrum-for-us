"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Truck, Globe, MapPin, Package, Clock, 
  Euro, RefreshCcw, Save, Info, CheckCircle
} from "lucide-react"

export default function VendorShippingPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    // Zones
    shipsToFrance: true,
    shipsToEurope: false,
    shipsToWorld: false,
    
    // Processing time
    processingMin: 1,
    processingMax: 3,
    
    // Free shipping
    offersFreeShipping: true,
    freeShippingMinimum: 75,
    
    // Shipping costs
    shippingFrance: 5.99,
    shippingEurope: 12.99,
    shippingWorld: 24.99,
    
    // Delivery times
    deliveryFranceMin: 2,
    deliveryFranceMax: 5,
    deliveryEuropeMin: 5,
    deliveryEuropeMax: 10,
    deliveryWorldMin: 10,
    deliveryWorldMax: 21,
    
    // Returns
    acceptsReturns: true,
    returnPeriod: 14,
    returnPaidBy: "buyer",
    
    // Carriers
    carriers: ["Colissimo", "Mondial Relay"],
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleCarrier = (carrier: string) => {
    if (settings.carriers.includes(carrier)) {
      setSettings({ ...settings, carriers: settings.carriers.filter(c => c !== carrier) })
    } else {
      setSettings({ ...settings, carriers: [...settings.carriers, carrier] })
    }
  }

  const availableCarriers = [
    "Colissimo",
    "Mondial Relay",
    "Chronopost",
    "UPS",
    "DHL",
    "FedEx",
    "GLS",
    "Relais Colis",
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Paramètres d'expédition</h1>
          <p className="text-muted-foreground">Configurez vos options de livraison et vos zones d'expédition</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Enregistré !" : "Enregistrer"}
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Comment fonctionne l'expédition sur Spectrum ?</p>
          <p className="text-muted-foreground mt-1">
            En tant que vendeur·euse, vous êtes responsable de l'expédition de vos produits directement aux client·e·s. 
            Configurez vos tarifs et délais ci-dessous. Ces informations seront affichées aux acheteur·euse·s.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Shipping Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Zones d'expédition
            </CardTitle>
            <CardDescription>
              Sélectionnez les régions où vous expédiez vos produits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">France métropolitaine</p>
                  <p className="text-sm text-muted-foreground">Livraison en France continentale</p>
                </div>
              </div>
              <Switch
                checked={settings.shipsToFrance}
                onCheckedChange={(checked) => setSettings({ ...settings, shipsToFrance: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Union Européenne</p>
                  <p className="text-sm text-muted-foreground">Pays de l'UE hors France</p>
                </div>
              </div>
              <Switch
                checked={settings.shipsToEurope}
                onCheckedChange={(checked) => setSettings({ ...settings, shipsToEurope: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">International</p>
                  <p className="text-sm text-muted-foreground">Reste du monde</p>
                </div>
              </div>
              <Switch
                checked={settings.shipsToWorld}
                onCheckedChange={(checked) => setSettings({ ...settings, shipsToWorld: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Frais de port
            </CardTitle>
            <CardDescription>
              Définissez vos tarifs de livraison par zone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Free shipping */}
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Livraison gratuite</span>
                </div>
                <Switch
                  checked={settings.offersFreeShipping}
                  onCheckedChange={(checked) => setSettings({ ...settings, offersFreeShipping: checked })}
                />
              </div>
              {settings.offersFreeShipping && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm whitespace-nowrap">A partir de</Label>
                  <Input
                    type="number"
                    value={settings.freeShippingMinimum}
                    onChange={(e) => setSettings({ ...settings, freeShippingMinimum: Number(e.target.value) })}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">€ d'achat</span>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {settings.shipsToFrance && (
                <div className="flex items-center gap-4">
                  <Label className="w-32">France</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.shippingFrance}
                      onChange={(e) => setSettings({ ...settings, shippingFrance: Number(e.target.value) })}
                      className="w-24"
                    />
                    <span className="text-muted-foreground">€</span>
                  </div>
                </div>
              )}
              {settings.shipsToEurope && (
                <div className="flex items-center gap-4">
                  <Label className="w-32">Europe</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.shippingEurope}
                      onChange={(e) => setSettings({ ...settings, shippingEurope: Number(e.target.value) })}
                      className="w-24"
                    />
                    <span className="text-muted-foreground">€</span>
                  </div>
                </div>
              )}
              {settings.shipsToWorld && (
                <div className="flex items-center gap-4">
                  <Label className="w-32">International</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.shippingWorld}
                      onChange={(e) => setSettings({ ...settings, shippingWorld: Number(e.target.value) })}
                      className="w-24"
                    />
                    <span className="text-muted-foreground">€</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Processing & Delivery Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Délais de traitement et livraison
            </CardTitle>
            <CardDescription>
              Indiquez vos délais de préparation et d'expédition estimés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Processing time */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Délai de préparation (jours ouvrés)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.processingMin}
                  onChange={(e) => setSettings({ ...settings, processingMin: Number(e.target.value) })}
                  className="w-20"
                  min={1}
                />
                <span className="text-muted-foreground">à</span>
                <Input
                  type="number"
                  value={settings.processingMax}
                  onChange={(e) => setSettings({ ...settings, processingMax: Number(e.target.value) })}
                  className="w-20"
                  min={1}
                />
                <span className="text-muted-foreground">jours</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Temps nécessaire pour préparer la commande avant expédition
              </p>
            </div>

            <Separator />

            {/* Delivery times by zone */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Délais de livraison estimés (jours ouvrés)</Label>
              
              {settings.shipsToFrance && (
                <div className="flex items-center gap-4">
                  <span className="w-24 text-sm">France</span>
                  <Input
                    type="number"
                    value={settings.deliveryFranceMin}
                    onChange={(e) => setSettings({ ...settings, deliveryFranceMin: Number(e.target.value) })}
                    className="w-16"
                  />
                  <span className="text-muted-foreground">à</span>
                  <Input
                    type="number"
                    value={settings.deliveryFranceMax}
                    onChange={(e) => setSettings({ ...settings, deliveryFranceMax: Number(e.target.value) })}
                    className="w-16"
                  />
                  <span className="text-sm text-muted-foreground">jours</span>
                </div>
              )}
              {settings.shipsToEurope && (
                <div className="flex items-center gap-4">
                  <span className="w-24 text-sm">Europe</span>
                  <Input
                    type="number"
                    value={settings.deliveryEuropeMin}
                    onChange={(e) => setSettings({ ...settings, deliveryEuropeMin: Number(e.target.value) })}
                    className="w-16"
                  />
                  <span className="text-muted-foreground">à</span>
                  <Input
                    type="number"
                    value={settings.deliveryEuropeMax}
                    onChange={(e) => setSettings({ ...settings, deliveryEuropeMax: Number(e.target.value) })}
                    className="w-16"
                  />
                  <span className="text-sm text-muted-foreground">jours</span>
                </div>
              )}
              {settings.shipsToWorld && (
                <div className="flex items-center gap-4">
                  <span className="w-24 text-sm">International</span>
                  <Input
                    type="number"
                    value={settings.deliveryWorldMin}
                    onChange={(e) => setSettings({ ...settings, deliveryWorldMin: Number(e.target.value) })}
                    className="w-16"
                  />
                  <span className="text-muted-foreground">à</span>
                  <Input
                    type="number"
                    value={settings.deliveryWorldMax}
                    onChange={(e) => setSettings({ ...settings, deliveryWorldMax: Number(e.target.value) })}
                    className="w-16"
                  />
                  <span className="text-sm text-muted-foreground">jours</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Carriers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Transporteurs utilisés
            </CardTitle>
            <CardDescription>
              Sélectionnez les transporteurs que vous utilisez pour vos expéditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableCarriers.map((carrier) => (
                <Badge
                  key={carrier}
                  variant={settings.carriers.includes(carrier) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5"
                  onClick={() => toggleCarrier(carrier)}
                >
                  {carrier}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Returns Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              Politique de retours
            </CardTitle>
            <CardDescription>
              Définissez votre politique de retours et remboursements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Accepter les retours</p>
                <p className="text-sm text-muted-foreground">
                  Les client·e·s peuvent retourner les articles
                </p>
              </div>
              <Switch
                checked={settings.acceptsReturns}
                onCheckedChange={(checked) => setSettings({ ...settings, acceptsReturns: checked })}
              />
            </div>

            {settings.acceptsReturns && (
              <>
                <Separator />
                <div className="flex items-center gap-4">
                  <Label>Délai de retour</Label>
                  <Input
                    type="number"
                    value={settings.returnPeriod}
                    onChange={(e) => setSettings({ ...settings, returnPeriod: Number(e.target.value) })}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">jours</span>
                </div>

                <div className="space-y-2">
                  <Label>Frais de retour payés par</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={settings.returnPaidBy === "buyer" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, returnPaidBy: "buyer" })}
                      className={settings.returnPaidBy !== "buyer" ? "bg-transparent" : ""}
                    >
                      L'acheteur·euse
                    </Button>
                    <Button
                      type="button"
                      variant={settings.returnPaidBy === "seller" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, returnPaidBy: "seller" })}
                      className={settings.returnPaidBy !== "seller" ? "bg-transparent" : ""}
                    >
                      Le·la vendeur·euse
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Save button at bottom */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg" className="gap-2">
            {saved ? <CheckCircle className="h-5 w-5" /> : <Save className="h-5 w-5" />}
            {saved ? "Modifications enregistrées !" : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>
    </div>
  )
}
