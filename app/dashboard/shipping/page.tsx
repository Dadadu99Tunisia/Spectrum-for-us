"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Truck, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimated_days_min: number
  estimated_days_max: number
  is_active: boolean
}

export default function VendorShippingPage() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [shippingPolicy, setShippingPolicy] = useState("")
  const [processingTime, setProcessingTime] = useState(3)
  const [shipsFrom, setShipsFrom] = useState({ country: "France", city: "" })

  const [newMethod, setNewMethod] = useState({
    name: "",
    description: "",
    price: 0,
    estimated_days_min: 3,
    estimated_days_max: 5,
  })

  const supabase = createClient()

  useEffect(() => {
    loadShippingSettings()
    loadShippingMethods()
  }, [])

  const loadShippingSettings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (data) {
      setShippingPolicy(data.shipping_policy || "")
      setProcessingTime(data.processing_time_days || 3)
      setShipsFrom({
        country: data.ships_from_country || "France",
        city: data.ships_from_city || "",
      })
    }
  }

  const loadShippingMethods = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from("vendor_shipping_methods").select("*").eq("vendor_id", user.id)

    if (data) {
      setShippingMethods(data)
    }
  }

  const saveShippingSettings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from("profiles")
      .update({
        shipping_policy: shippingPolicy,
        processing_time_days: processingTime,
        ships_from_country: shipsFrom.country,
        ships_from_city: shipsFrom.city,
      })
      .eq("id", user.id)

    alert("Paramètres de livraison enregistrés")
  }

  const addShippingMethod = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("vendor_shipping_methods").insert({
      vendor_id: user.id,
      ...newMethod,
    })

    if (!error) {
      setIsAdding(false)
      setNewMethod({
        name: "",
        description: "",
        price: 0,
        estimated_days_min: 3,
        estimated_days_max: 5,
      })
      loadShippingMethods()
    }
  }

  const deleteMethod = async (id: string) => {
    await supabase.from("vendor_shipping_methods").delete().eq("id", id)
    loadShippingMethods()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Gestion de la livraison</h1>

      {/* Shipping Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>Configurez vos options de livraison et d'expédition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="processingTime">Délai de traitement (jours)</Label>
            <Input
              id="processingTime"
              type="number"
              min="1"
              value={processingTime}
              onChange={(e) => setProcessingTime(Number.parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Temps nécessaire pour préparer la commande avant expédition
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Expédition depuis (Pays)</Label>
              <Input
                id="country"
                value={shipsFrom.country}
                onChange={(e) => setShipsFrom({ ...shipsFrom, country: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={shipsFrom.city}
                onChange={(e) => setShipsFrom({ ...shipsFrom, city: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="policy">Politique de livraison</Label>
            <Textarea
              id="policy"
              rows={4}
              value={shippingPolicy}
              onChange={(e) => setShippingPolicy(e.target.value)}
              placeholder="Décrivez votre politique de livraison, les zones couvertes, etc."
            />
          </div>

          <Button onClick={saveShippingSettings}>Enregistrer les paramètres</Button>
        </CardContent>
      </Card>

      {/* Shipping Methods */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Méthodes de livraison</CardTitle>
              <CardDescription>Définissez vos options et tarifs de livraison</CardDescription>
            </div>
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <Card className="border-2 border-primary">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Nom de la méthode</Label>
                  <Input
                    value={newMethod.name}
                    onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                    placeholder="Ex: Livraison standard"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newMethod.description}
                    onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                    placeholder="Ex: Livraison en 3-5 jours ouvrés"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Prix (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newMethod.price}
                      onChange={(e) => setNewMethod({ ...newMethod, price: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Délai min (jours)</Label>
                    <Input
                      type="number"
                      value={newMethod.estimated_days_min}
                      onChange={(e) =>
                        setNewMethod({ ...newMethod, estimated_days_min: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Délai max (jours)</Label>
                    <Input
                      type="number"
                      value={newMethod.estimated_days_max}
                      onChange={(e) =>
                        setNewMethod({ ...newMethod, estimated_days_max: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addShippingMethod}>Ajouter</Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {shippingMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <h3 className="font-semibold">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <p className="text-sm mt-1">
                        {method.estimated_days_min}-{method.estimated_days_max} jours • €{method.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteMethod(method.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {shippingMethods.length === 0 && !isAdding && (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune méthode de livraison configurée</p>
              <p className="text-sm">Ajoutez vos options de livraison pour commencer</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
