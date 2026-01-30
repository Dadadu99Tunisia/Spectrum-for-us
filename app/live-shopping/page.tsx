"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Bell, Calendar, Clock, Eye, Search, Users } from "lucide-react"

export default function LiveShoppingPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Données fictives pour la démo
  const liveNow = [
    {
      id: "live-1",
      title: "Collection Été 2023",
      seller: "Spectrum Boutique",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Live+1",
      viewers: 124,
      startTime: "Il y a 15 minutes",
      products: 5,
    },
    {
      id: "live-2",
      title: "Nouveautés Bijoux Queer",
      seller: "Queer Gems",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Live+2",
      viewers: 87,
      startTime: "Il y a 30 minutes",
      products: 8,
    },
  ]

  const upcoming = [
    {
      id: "upcoming-1",
      title: "Nouveautés Pride",
      seller: "Spectrum Boutique",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Upcoming+1",
      scheduledFor: "22 juin 2023, 19:30",
      products: 8,
    },
    {
      id: "upcoming-2",
      title: "Collection Automne 2023",
      seller: "Queer Fashion",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Upcoming+2",
      scheduledFor: "30 juin 2023, 18:00",
      products: 12,
    },
    {
      id: "upcoming-3",
      title: "Accessoires Inclusifs",
      seller: "Inclusive Style",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Upcoming+3",
      scheduledFor: "5 juillet 2023, 20:00",
      products: 6,
    },
  ]

  const past = [
    {
      id: "past-1",
      title: "Collection Printemps 2023",
      seller: "Spectrum Boutique",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Past+1",
      date: "15 mai 2023",
      views: 1240,
      products: 10,
    },
    {
      id: "past-2",
      title: "Accessoires Pride",
      seller: "Queer Gems",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Past+2",
      date: "1 juin 2023",
      views: 876,
      products: 7,
    },
    {
      id: "past-3",
      title: "Vêtements Gender-Neutral",
      seller: "Inclusive Style",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      thumbnail: "/placeholder.svg?height=200&width=350&text=Past+3",
      date: "10 juin 2023",
      views: 654,
      products: 9,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Live Shopping</h1>
          <p className="text-muted-foreground">Découvrez des produits en direct avec nos vendeur·euse·s</p>
        </div>
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des lives..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="en-direct">
        <TabsList className="mb-6">
          <TabsTrigger value="en-direct" className="gap-2">
            <Badge className="bg-red-500 h-2 w-2 rounded-full p-0" />
            En direct
          </TabsTrigger>
          <TabsTrigger value="a-venir" className="gap-2">
            <Calendar className="h-4 w-4" />À venir
          </TabsTrigger>
          <TabsTrigger value="passes" className="gap-2">
            <Clock className="h-4 w-4" />
            Passés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-direct">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveNow.length > 0 ? (
                liveNow.map((live) => (
                  <motion.div
                    key={live.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Link href={`/live-shopping/${live.id}`}>
                      <Card className="overflow-hidden h-full">
                        <CardContent className="p-0">
                          <div className="relative">
                            <div className="aspect-video overflow-hidden relative bg-muted">
                              <Image
                                src={live.thumbnail || "/placeholder.svg"}
                                alt={live.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-red-500">LIVE</Badge>
                              </div>
                              <div className="absolute top-2 right-2">
                                <div className="bg-black/50 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {live.viewers}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={live.sellerAvatar} alt={live.seller} />
                                <AvatarFallback>{live.seller.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{live.seller}</span>
                            </div>
                            <h3 className="font-semibold mb-1">{live.title}</h3>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{live.startTime}</span>
                              <span>{live.products} produits</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Aucun live en cours pour le moment</p>
                  <Button variant="outline" className="mt-4 gap-2">
                    <Bell className="h-4 w-4" />
                    Être notifié des prochains lives
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="a-venir">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((live) => (
                <motion.div
                  key={live.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="overflow-hidden h-full">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-video overflow-hidden relative bg-muted">
                          <Image
                            src={live.thumbnail || "/placeholder.svg"}
                            alt={live.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-purple-500">À VENIR</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={live.sellerAvatar} alt={live.seller} />
                            <AvatarFallback>{live.seller.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{live.seller}</span>
                        </div>
                        <h3 className="font-semibold mb-1">{live.title}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {live.scheduledFor}
                          </span>
                          <span>{live.products} produits</span>
                        </div>
                        <Button className="w-full mt-3 gap-2">
                          <Bell className="h-4 w-4" />
                          Rappel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="passes">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((live) => (
                <motion.div
                  key={live.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="overflow-hidden h-full">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-video overflow-hidden relative bg-muted">
                          <Image
                            src={live.thumbnail || "/placeholder.svg"}
                            alt={live.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <div className="bg-black/50 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {live.views}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={live.sellerAvatar} alt={live.seller} />
                            <AvatarFallback>{live.seller.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{live.seller}</span>
                        </div>
                        <h3 className="font-semibold mb-1">{live.title}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{live.date}</span>
                          <span>{live.products} produits</span>
                        </div>
                        <Button variant="outline" className="w-full mt-3">
                          Revoir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
