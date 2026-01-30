"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Heart, MessageSquare, Send, Share2, ShoppingCart, Users } from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"

export default function LiveShoppingSessionPage({ params }: { params: { id: string } }) {
  const [isLive, setIsLive] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([])
  const [message, setMessage] = useState("")
  const [currentProduct, setCurrentProduct] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)

  // Produits fictifs pour la démo
  const products = [
    {
      id: 1,
      name: "T-shirt Pride Collection",
      price: 29.99,
      image: "/placeholder.svg?height=100&width=100",
      description: "T-shirt 100% coton bio avec motif arc-en-ciel",
    },
    {
      id: 2,
      name: "Boucles d'oreilles Arc-en-ciel",
      price: 34.99,
      image: "/placeholder.svg?height=100&width=100",
      description: "Boucles d'oreilles artisanales aux couleurs du drapeau pride",
    },
    {
      id: 3,
      name: "Bracelet Pronoms Personnalisé",
      price: 15.99,
      image: "/placeholder.svg?height=100&width=100",
      description: "Bracelet ajustable avec vos pronoms préférés",
    },
  ]

  // Simuler l'arrivée de spectateurs et de commentaires
  useEffect(() => {
    if (isLive) {
      const viewerInterval = setInterval(() => {
        setViewerCount((prev) => Math.min(prev + Math.floor(Math.random() * 3), 150))
      }, 5000)

      const likeInterval = setInterval(() => {
        setLikeCount((prev) => prev + Math.floor(Math.random() * 5))
      }, 3000)

      const commentInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          const newComment = {
            id: Date.now().toString(),
            user: ["Alex", "Sam", "Jordan", "Taylor", "Quinn", "Casey"][Math.floor(Math.random() * 6)],
            text: [
              "J'adore ce produit !",
              "Est-ce qu'il est disponible en d'autres couleurs ?",
              "Le prix est vraiment intéressant",
              "Est-ce que vous livrez à l'international ?",
              "Je viens de commander, j'ai hâte de recevoir ma commande !",
              "Depuis combien de temps existe votre marque ?",
            ][Math.floor(Math.random() * 6)],
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setComments((prev) => [...prev, newComment])
        }
      }, 4000)

      return () => {
        clearInterval(viewerInterval)
        clearInterval(likeInterval)
        clearInterval(commentInterval)
      }
    }
  }, [isLive])

  // Faire défiler automatiquement vers le bas lorsque de nouveaux commentaires arrivent
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight
    }
  }, [comments])

  const startLive = () => {
    setIsLive(true)
    setViewerCount(1)
    // Dans un cas réel, ici on démarrerait la diffusion vidéo
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const endLive = () => {
    setIsLive(false)
    // Dans un cas réel, ici on arrêterait la diffusion vidéo
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const sendComment = () => {
    if (message.trim()) {
      const newComment = {
        id: Date.now().toString(),
        user: "Vous",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setComments((prev) => [...prev, newComment])
      setMessage("")
    }
  }

  const showProduct = (index: number) => {
    setCurrentProduct(index)
  }

  return (
    <VendeurLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Live Shopping: Collection Été 2023</h1>
            <p className="text-muted-foreground">{isLive ? "En direct" : "Prêt à démarrer"}</p>
          </div>
          {!isLive ? (
            <Button className="gap-2" onClick={startLive}>
              Démarrer le Live
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  Terminer le Live
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir terminer ce live ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action mettra fin à votre session de live shopping. Vous ne pourrez pas la reprendre.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={endLive}>Terminer le Live</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vidéo principale */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {/* Vidéo (simulée pour la démo) */}
              <video
                ref={videoRef}
                src=""
                poster="/placeholder.svg?height=720&width=1280&text=Live+Video"
                className="w-full h-full object-cover"
                loop
                muted
              ></video>

              {/* Overlay avec informations */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Vendeur" />
                    <AvatarFallback>SP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">Spectrum Boutique</p>
                    <p className="text-white/80 text-sm">Collection Été 2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500 text-white">LIVE</Badge>
                  <div className="bg-black/50 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {viewerCount}
                  </div>
                  <div className="bg-black/50 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {likeCount}
                  </div>
                </div>
              </div>

              {/* Produit en cours de présentation */}
              {currentProduct !== null && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-md overflow-hidden relative bg-white">
                        <Image
                          src={products[currentProduct].image || "/placeholder.svg"}
                          alt={products[currentProduct].name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{products[currentProduct].name}</h3>
                        <p className="text-white/80 text-sm">{products[currentProduct].price.toFixed(2)} €</p>
                      </div>
                    </div>
                    <Button className="gap-2 bg-white text-black hover:bg-white/90">
                      <ShoppingCart className="h-4 w-4" />
                      Acheter
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className="min-w-[200px] cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <CardContent className="p-3" onClick={() => showProduct(index)}>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden relative">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-muted-foreground text-xs">{product.price.toFixed(2)} €</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat et contrôles */}
          <div className="space-y-4">
            <Tabs defaultValue="chat">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="produits" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Produits
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="space-y-4">
                <Card>
                  <CardContent className="p-3">
                    <ScrollArea className="h-[400px] pr-4" ref={commentsRef}>
                      <div className="space-y-4 pt-2">
                        {comments.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Aucun commentaire pour le moment</p>
                          </div>
                        ) : (
                          comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{comment.user}</p>
                                  <p className="text-muted-foreground text-xs">{comment.time}</p>
                                </div>
                                <p className="text-sm">{comment.text}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Input
                    placeholder="Écrivez un message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendComment()}
                  />
                  <Button size="icon" onClick={sendComment}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="produits">
                <Card>
                  <CardContent className="p-3">
                    <div className="space-y-3">
                      {products.map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-16 rounded-md overflow-hidden relative">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-muted-foreground text-sm">{product.price.toFixed(2)} €</p>
                              <p className="text-sm mt-1">{product.description}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => showProduct(index)}>
                            Présenter
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardContent className="p-3">
                <h3 className="font-medium mb-2">Actions rapides</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Partager
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Aimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </VendeurLayout>
  )
}
