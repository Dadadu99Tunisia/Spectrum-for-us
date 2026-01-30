"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Music, Mic, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const realVideos = [
  {
    id: "1",
    title: "Disclosure (Netflix)",
    description: "Documentaire sur la représentation trans à Hollywood avec Laverne Cox, Lilly Wachowski et d'autres.",
    thumbnail_url: "/disclosure-documentary-trans-hollywood.jpg",
    duration: 6480,
    platform: "Netflix",
    url: "https://www.netflix.com/title/81284247",
    creator: "Sam Feder",
    year: 2020,
  },
  {
    id: "2",
    title: "Pose (FX/Disney+)",
    description: "Série dramatique sur la scène ballroom LGBTQ+ de New York dans les années 80-90.",
    thumbnail_url: "/pose-tv-series-ballroom.jpg",
    duration: 3600,
    platform: "Disney+",
    url: "https://www.disneyplus.com",
    creator: "Ryan Murphy",
    year: 2018,
  },
  {
    id: "3",
    title: "Paris is Burning (YouTube)",
    description: "Documentaire culte sur la culture ballroom et voguing à New York dans les années 80.",
    thumbnail_url: "/paris-is-burning-documentary.jpg",
    duration: 4680,
    platform: "YouTube",
    youtube_url: "https://www.youtube.com/embed/hedJer7I1vI",
    creator: "Jennie Livingston",
    year: 1990,
  },
  {
    id: "4",
    title: "Heartstopper (Netflix)",
    description: "Série romantique sur deux lycéens britanniques qui tombent amoureux.",
    thumbnail_url: "/heartstopper-netflix-series.jpg",
    duration: 1800,
    platform: "Netflix",
    url: "https://www.netflix.com/title/81059939",
    creator: "Alice Oseman",
    year: 2022,
  },
  {
    id: "5",
    title: "The Death and Life of Marsha P. Johnson",
    description: "Documentaire sur l'activiste trans et icône de Stonewall.",
    thumbnail_url: "/marsha-p-johnson-documentary.jpg",
    duration: 6300,
    platform: "Netflix",
    url: "https://www.netflix.com/title/80189623",
    creator: "David France",
    year: 2017,
  },
  {
    id: "6",
    title: "Moonlight (Prime Video)",
    description: "Film oscarisé sur un jeune homme noir gay grandissant à Miami.",
    thumbnail_url: "/moonlight-film-barry-jenkins.jpg",
    duration: 6660,
    platform: "Prime Video",
    url: "https://www.primevideo.com",
    creator: "Barry Jenkins",
    year: 2016,
  },
]

const realMusic = [
  {
    id: "1",
    title: "LGBTQ+ Pride Anthems",
    artist: "Spotify",
    cover_url: "/pride-rainbow-music.jpg",
    genre: "Pop/Dance",
    spotify_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWWUz3ycJRRJd",
    tracks: 100,
    description: "Les hymnes LGBTQ+ les plus iconiques",
  },
  {
    id: "2",
    title: "Queer Voices",
    artist: "Spotify",
    cover_url: "/queer-artists-music.jpg",
    genre: "Indie/Alternative",
    spotify_url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3WvGXE8FqYX",
    tracks: 75,
    description: "Artistes LGBTQ+ émergent·es et établi·es",
  },
  {
    id: "3",
    title: "Hayley Kiyoko - Expectations",
    artist: "Hayley Kiyoko",
    cover_url: "/hayley-kiyoko-expectations.jpg",
    genre: "Pop",
    spotify_url: "https://open.spotify.com/embed/album/3xybjP7r2VsWzwvDQipdM0",
    tracks: 12,
    description: "Album de la 'Lesbian Jesus' du pop",
  },
  {
    id: "4",
    title: "Troye Sivan - Something To Give Each Other",
    artist: "Troye Sivan",
    cover_url: "/troye-sivan-album.jpg",
    genre: "Pop/Electronic",
    spotify_url: "https://open.spotify.com/embed/album/1WTA8UKf4IwXNXMUUhPqPJ",
    tracks: 10,
    description: "Le dernier album de l'icône pop queer",
  },
  {
    id: "5",
    title: "King Princess - Cheap Queen",
    artist: "King Princess",
    cover_url: "/king-princess-cheap-queen.jpg",
    genre: "Indie Pop",
    spotify_url: "https://open.spotify.com/embed/album/4YzNKUJx4TXDHzGKDRgehZ",
    tracks: 13,
    description: "Anthems queer indie-pop",
  },
  {
    id: "6",
    title: "Lil Nas X - MONTERO",
    artist: "Lil Nas X",
    cover_url: "/lil-nas-x-montero.jpg",
    genre: "Hip-Hop/Pop",
    spotify_url: "https://open.spotify.com/embed/album/6pOiDiuDQqrmo5DbG0ZubR",
    tracks: 15,
    description: "Album révolutionnaire du rappeur ouvertement gay",
  },
]

const realPodcasts = [
  {
    id: "1",
    title: "Nancy (France Culture)",
    description: "Le podcast qui explore les questions LGBTQI+ avec humour et profondeur.",
    cover_url: "/nancy-podcast-france-culture.jpg",
    host: "Océan & Julien Marsay",
    platform: "France Culture",
    url: "https://www.radiofrance.fr/franceculture/podcasts/nancy",
  },
  {
    id: "2",
    title: "Un Podcast à Soi (Arte Radio)",
    description: "Documentaires sur les questions de genre et féminisme.",
    cover_url: "/un-podcast-a-soi-arte.jpg",
    host: "Charlotte Bienaimé",
    platform: "Arte Radio",
    url: "https://www.arteradio.com/serie/un_podcast_soi",
  },
  {
    id: "3",
    title: "Les Couilles sur la Table (Binge Audio)",
    description: "Podcast sur les masculinités et les questions de genre.",
    cover_url: "/les-couilles-sur-la-table.jpg",
    host: "Victoire Tuaillon",
    platform: "Binge Audio",
    url: "https://www.binge.audio/podcast/les-couilles-sur-la-table",
  },
  {
    id: "4",
    title: "Queer as Fact",
    description: "Histoire LGBTQ+ racontée avec humour et rigueur (EN).",
    cover_url: "/placeholder.svg?height=300&width=300",
    host: "Leigh & Ellie",
    platform: "Spotify",
    url: "https://open.spotify.com/show/0pMVEbHLpXadeOeHE1L3qh",
  },
  {
    id: "5",
    title: "Food 4 Thot",
    description: "Podcast sur la culture queer, la race et la sexualité (EN).",
    cover_url: "/placeholder.svg?height=300&width=300",
    host: "Collectif",
    platform: "Spotify",
    url: "https://open.spotify.com/show/0s1Y0QfTtU7A76JqPsLQKP",
  },
  {
    id: "6",
    title: "Kiffe ta Race (Binge Audio)",
    description: "Podcast sur les questions raciales en France, avec perspectives queer.",
    cover_url: "/placeholder.svg?height=300&width=300",
    host: "Rokhaya Diallo & Grace Ly",
    platform: "Binge Audio",
    url: "https://www.binge.audio/podcast/kiffetarace",
  },
]

export default function StreamingPage() {
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
            {selectedVideo && selectedVideo.youtube_url && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    src={selectedVideo.youtube_url}
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
                    <Badge>{selectedVideo.platform}</Badge>
                    <span>{selectedVideo.year}</span>
                    <span>Par {selectedVideo.creator}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-6">Films & Séries Queer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {realVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        src={video.thumbnail_url || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {video.youtube_url ? (
                          <Play className="h-16 w-16 text-white" onClick={() => setSelectedVideo(video)} />
                        ) : (
                          <ExternalLink className="h-16 w-16 text-white" />
                        )}
                      </div>
                      <Badge className="absolute top-2 left-2">{video.platform}</Badge>
                      <Badge className="absolute bottom-2 right-2">{formatDuration(video.duration)}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-base">{video.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">{video.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      {video.youtube_url ? (
                        <Button className="w-full" onClick={() => setSelectedVideo(video)}>
                          <Play className="h-4 w-4 mr-2" />
                          Regarder
                        </Button>
                      ) : (
                        <Button className="w-full" asChild>
                          <a href={video.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Voir sur {video.platform}
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-8">
            {selectedMusic && (
              <Card className="overflow-hidden">
                <div className="h-[380px] bg-gradient-to-br from-purple-500 to-pink-500">
                  <iframe
                    src={selectedMusic.spotify_url}
                    className="w-full h-full"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
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

            <div>
              <h2 className="text-2xl font-bold mb-6">Musique Queer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {realMusic.map((music) => (
                  <Card
                    key={music.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedMusic(music)}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                      <img
                        src={music.cover_url || "/placeholder.svg"}
                        alt={music.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Music className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1 text-base">{music.title}</CardTitle>
                      <CardDescription className="line-clamp-1">{music.artist}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{music.description}</p>
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
              {realPodcasts.map((podcast) => (
                <Card key={podcast.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-4 p-6">
                    <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={podcast.cover_url || "/placeholder.svg"}
                        alt={podcast.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2 mb-2">{podcast.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{podcast.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline">{podcast.platform}</Badge>
                        <span>Animé par {podcast.host}</span>
                      </div>
                    </div>
                  </div>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <a href={podcast.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Écouter sur {podcast.platform}
                      </a>
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
