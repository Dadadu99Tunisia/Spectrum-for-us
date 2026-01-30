"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock, Edit, Eye, MoreHorizontal, Plus, Trash2, Video } from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LiveShoppingPage() {
  const [date, setDate] = useState<Date>()

  return (
    <VendeurLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Live Shopping</h1>
            <p className="text-muted-foreground">Créez et gérez vos sessions de vente en direct</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Planifier un Live
          </Button>
        </div>

        <Tabs defaultValue="a-venir">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="a-venir">À venir</TabsTrigger>
            <TabsTrigger value="passes">Passés</TabsTrigger>
            <TabsTrigger value="brouillons">Brouillons</TabsTrigger>
          </TabsList>

          <TabsContent value="a-venir" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sessions de Live Shopping à venir</CardTitle>
                <CardDescription>Gérez vos prochaines sessions de vente en direct</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Live 1 */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-20 w-36 rounded-md overflow-hidden relative bg-muted">
                        <Image
                          src="/placeholder.svg?height=80&width=144&text=Live+Preview"
                          alt="Collection Été 2023"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500">Live</Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Collection Été 2023</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>15 juin 2023, 18:00</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-xs">
                            5 produits
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            45 min
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="h-3 w-3" />
                        Modifier
                      </Button>
                      <Button size="sm" className="gap-1">
                        <Video className="h-3 w-3" />
                        Démarrer
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Annuler</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Live 2 */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-20 w-36 rounded-md overflow-hidden relative bg-muted">
                        <Image
                          src="/placeholder.svg?height=80&width=144&text=Live+Preview"
                          alt="Nouveautés Pride"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-purple-500">Planifié</Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Nouveautés Pride</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>22 juin 2023, 19:30</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-xs">
                            8 produits
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            60 min
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="h-3 w-3" />
                        Modifier
                      </Button>
                      <Button variant="secondary" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" />
                        Aperçu
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Annuler</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Planifier un nouveau Live Shopping</CardTitle>
                <CardDescription>
                  Créez une nouvelle session de vente en direct pour présenter vos produits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du Live</Label>
                      <Input id="title" placeholder="Ex: Collection Été 2023" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Décrivez ce que vous allez présenter pendant ce live..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Heure</Label>
                        <Select>
                          <SelectTrigger id="time">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18:00">18:00</SelectItem>
                            <SelectItem value="18:30">18:30</SelectItem>
                            <SelectItem value="19:00">19:00</SelectItem>
                            <SelectItem value="19:30">19:30</SelectItem>
                            <SelectItem value="20:00">20:00</SelectItem>
                            <SelectItem value="20:30">20:30</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée (minutes)</Label>
                      <Select>
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Image de couverture</Label>
                      <div className="border-2 border-dashed rounded-md p-4 text-center">
                        <div className="h-40 flex flex-col items-center justify-center">
                          <div className="mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mx-auto h-12 w-12 text-muted-foreground"
                            >
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                              <path d="m9 11 3 3L22 4" />
                            </svg>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">Glissez-déposez une image ou</p>
                          <Button variant="outline" size="sm">
                            Parcourir
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Produits à présenter</Label>
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm font-medium">Sélectionnez des produits</p>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-3 w-3" />
                            Ajouter
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-md overflow-hidden relative">
                                <Image
                                  src="/placeholder.svg?height=40&width=40"
                                  alt="T-shirt Pride Collection"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">T-shirt Pride Collection</p>
                                <p className="text-xs text-muted-foreground">29,99 €</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-md overflow-hidden relative">
                                <Image
                                  src="/placeholder.svg?height=40&width=40"
                                  alt="Boucles d'oreilles Arc-en-ciel"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Boucles d'oreilles Arc-en-ciel</p>
                                <p className="text-xs text-muted-foreground">34,99 €</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline">Enregistrer comme brouillon</Button>
                <Button>Planifier le Live</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="passes" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sessions de Live Shopping passées</CardTitle>
                <CardDescription>Consultez les statistiques de vos sessions précédentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune session passée pour le moment</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brouillons" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Brouillons de Live Shopping</CardTitle>
                <CardDescription>Gérez vos sessions en cours de préparation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucun brouillon pour le moment</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VendeurLayout>
  )
}
