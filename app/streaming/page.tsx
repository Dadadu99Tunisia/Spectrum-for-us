"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Music, Mic, Clock, Eye, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const mockVideos = [
  {
    id: "1",
    title: "Documentaire: Voix Queers",
    description: "Un voyage à travers les histoires de personnes LGBTQIA+ du monde entier.",
    thumbnail_url: "/diverse-queer-people-celebrating-authentic-fashion.jpg",
    duration: 3600,
    views: 12500,
    likes: 890,
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    creator: "Studio Prisme",
  },
  {
    id: "2",
    title: "Court-métrage: Entre Deux",
    description: "L'histoire d'une personne non-binaire naviguant entre deux mondes.",
    thumbnail_url: "/queer-art-gallery-colorful-exhibition.jpg",
    duration: 1200,
    views: 8900,
    likes: 654,
    vimeo_url: "https://player.vimeo.com/video/76979871",
    creator: "Collectif Fluide",
  },
]

const mockMusic = [
  {
    id: "1",
    title: "Playlist: Queer Anthems 2025",
    artist: "Spectrum Collective",
    cover_url: "/placeholder.svg?key=music1",
    duration: 7200,
    genre: "Pop/Electronic",
    spotify_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    tracks: 24,
  },
  {
    id: "2",
    title: "Album: Identités Fluides",
    artist: "Alex Rivers",
    cover_url: "/placeholder.svg?key=music2",
    duration: 2400,
    genre: "Indie/Alternative",
    soundcloud_url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/293",
    tracks: 12,
  },
]

const mockPodcasts = [
  {
    id: "1",
    title: "Corps Communs - Épisode 12",
    description: "Discussion sur la santé mentale dans la communauté queer avec des expert·es.",
    cover_url: "/placeholder.svg?key=podcast1",
    duration: 3600,
    season: 2,
    episode: 12,
    host: "Marie & Sam",
  },
  {
    id: "2",
    title: "Fluidités - Spécial Pride",
    description: "Retour sur l'histoire des luttes LGBTQIA+ et les enjeux actuels.",
    cover_url: "/placeholder.svg?key=podcast2",
    duration: 2700,
    season: 1,
    episode: 8,
    host: "Jordan Chen",
  },
]

export default function StreamingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [selectedMusic, setSelectedMusic] = useState<any>(null)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}min`
    return `${mins}min`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-50 via-purple-50 to-blue-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Streaming</h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed">
              Découvrez des contenus créés par et pour la communauté queer. Films, musique, podcasts - nos histoires
              racontées par nous-mêmes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Essai gratuit 30 jours</Button>
              <Button size="lg" variant="outline">
                Découvrir le catalogue
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Sans engagement • Annulez à tout moment</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            {[
              { icon: "🎬", title: "Films & Séries", desc: "Documentaires et créations originales" },
              { icon: "🎵", title: "Musique Queer", desc: "Artistes LGBTQIA+ du monde entier" },
              { icon: "🎙️", title: "Podcasts", desc: "Discussions authentiques et engagées" },
            ].map((feature) => (
              <div key={feature.title}>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="videos">
              <Play className="h-4 w-4 mr-2" />
              Vidéos
            </TabsTrigger>
            <TabsTrigger value="music">
              <Music className="h-4 w-4 mr-2" />
              Musique
            </TabsTrigger>
            <TabsTrigger value="podcasts">
              <Mic className="h-4 w-4 mr-2" />
              Podcasts
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-8">
            {/* Video Player */}
            {selectedVideo && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    src={selectedVideo.youtube_url || selectedVideo.vimeo_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <CardHeader>
                  <CardTitle>{selectedVideo.title}</CardTitle>
                  <CardDescription>{selectedVideo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {selectedVideo.views.toLocaleString()} vues
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {selectedVideo.likes.toLocaleString()}
                    </span>
                    <span>Par {selectedVideo.creator}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Films & Documentaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        src={video.thumbnail_url || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-16 w-16 text-white" />
                      </div>
                      <Badge className="absolute bottom-2 right-2">{formatDuration(video.duration)}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-base">{video.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">{video.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {(video.views / 1000).toFixed(1)}k
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {video.likes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-8">
            {/* Music Player */}
            {selectedMusic && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500">
                  <iframe
                    src={selectedMusic.spotify_url || selectedMusic.soundcloud_url}
                    className="w-full h-full"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{selectedMusic.title}</CardTitle>
                  <CardDescription>
                    Par {selectedMusic.artist} • {selectedMusic.tracks} titres
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Music Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Playlists & Albums</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockMusic.map((music) => (
                  <Card
                    key={music.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedMusic(music)}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Music className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1 text-base">{music.title}</CardTitle>
                      <CardDescription>{music.artist}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="secondary">{music.genre}</Badge>
                        <span>{music.tracks} titres</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Podcasts Tab */}
          <TabsContent value="podcasts">
            <h2 className="text-2xl font-bold mb-6">Podcasts Queer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPodcasts.map((podcast) => (
                <Card key={podcast.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-4 p-6">
                    <div className="relative w-24 h-24 shrink-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <Mic className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2 mb-2">{podcast.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{podcast.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline">
                          S{podcast.season}E{podcast.episode}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(podcast.duration)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Animé par {podcast.host}</p>
                    </div>
                  </div>
                  <CardFooter>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Écouter
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Vous êtes créateur·rice de contenu ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Partagez vos créations avec notre communauté et monétisez votre contenu
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/vendor-subscription">Devenir créateur·rice</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
