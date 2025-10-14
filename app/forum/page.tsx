import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, MessageSquare, Plus, Search, Filter, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Données fictives pour les discussions du forum
const discussions = [
  {
    id: "1",
    title: "Comment trouver des vêtements gender-affirming ?",
    author: {
      name: "Alex Dubois",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AD",
    },
    category: "Mode & Style",
    views: 1245,
    replies: 32,
    likes: 78,
    lastActivity: "Il y a 2 heures",
    pinned: true,
  },
  {
    id: "2",
    title: "Recommandations de livres LGBTQ+ pour adolescents",
    author: {
      name: "Sophie Martin",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    category: "Littérature",
    views: 876,
    replies: 45,
    likes: 92,
    lastActivity: "Il y a 5 heures",
    pinned: true,
  },
  {
    id: "3",
    title: "Expériences avec les bijoux Pride",
    author: {
      name: "Léo Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LG",
    },
    category: "Accessoires",
    views: 543,
    replies: 18,
    likes: 36,
    lastActivity: "Il y a 1 jour",
    pinned: false,
  },
  {
    id: "4",
    title: "Artistes queer à découvrir absolument",
    author: {
      name: "Emma Petit",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EP",
    },
    category: "Art & Culture",
    views: 789,
    replies: 27,
    likes: 64,
    lastActivity: "Il y a 2 jours",
    pinned: false,
  },
  {
    id: "5",
    title: "Conseils pour organiser un événement Pride local",
    author: {
      name: "Thomas Leroy",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TL",
    },
    category: "Événements",
    views: 1032,
    replies: 56,
    likes: 124,
    lastActivity: "Il y a 3 jours",
    pinned: false,
  },
  {
    id: "6",
    title: "Expériences avec les produits de beauté inclusifs",
    author: {
      name: "Julie Moreau",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JM",
    },
    category: "Beauté",
    views: 678,
    replies: 23,
    likes: 47,
    lastActivity: "Il y a 4 jours",
    pinned: false,
  },
]

// Catégories du forum
const categories = [
  { name: "Mode & Style", count: 45 },
  { name: "Art & Culture", count: 38 },
  { name: "Événements", count: 27 },
  { name: "Littérature", count: 32 },
  { name: "Beauté", count: 19 },
  { name: "Accessoires", count: 23 },
  { name: "Santé & Bien-être", count: 41 },
  { name: "Communauté", count: 56 },
]

export default function ForumPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Forum</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Forum Communautaire</h1>
          <p className="text-muted-foreground">
            Échangez, partagez et connectez avec d'autres membres de la communauté.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle discussion
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher dans le forum..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Liste des discussions */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="recent">
            <TabsList className="mb-6">
              <TabsTrigger value="recent">Récents</TabsTrigger>
              <TabsTrigger value="popular">Populaires</TabsTrigger>
              <TabsTrigger value="unanswered">Sans réponse</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {discussions.map((discussion) => (
                <Card key={discussion.id} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {discussion.pinned && <Badge className="bg-purple-500">Épinglé</Badge>}
                          <Badge variant="outline">{discussion.category}</Badge>
                        </div>
                        <Link href={`/forum/discussions/${discussion.id}`}>
                          <h3 className="text-lg font-semibold hover:text-purple-600 dark:hover:text-purple-400 mb-1">
                            {discussion.title}
                          </h3>
                        </Link>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Par {discussion.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {discussion.views}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {discussion.replies}
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {discussion.likes}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="popular">
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Discussions populaires</h3>
                <p className="text-muted-foreground mb-4">Les discussions les plus populaires apparaîtront ici.</p>
              </div>
            </TabsContent>

            <TabsContent value="unanswered">
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Discussions sans réponse</h3>
                <p className="text-muted-foreground mb-4">Les discussions sans réponse apparaîtront ici.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex justify-between items-center">
                    <Link
                      href={`/forum/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      {category.name}
                    </Link>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir toutes les catégories
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membres actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {discussions.map((discussion) => (
                  <Avatar key={discussion.id} className="h-8 w-8">
                    <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                    <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir tous les membres
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

