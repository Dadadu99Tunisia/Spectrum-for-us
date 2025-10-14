import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Play, Star, Calendar, Clock, Heart, Share2, ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Types pour les médias (identique à la page principale)
type MediaType = "movie" | "series"

interface Media {
  id: string
  title: string
  type: MediaType
  year: number
  image: string
  rating: number
  duration: string
  description: string
  genres: string[]
  featured?: boolean
  new?: boolean
  country?: string
  director?: string
  cast?: string[]
  similarMedia?: string[]
}

// Données de films et séries queers inspirées de QueerScreen
const queerMedia: Media[] = [
  {
    id: "les-engages",
    title: "Les Engagés",
    type: "series",
    year: 2017,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.5,
    duration: "3 saisons",
    description:
      "Hicham, jeune homme de 22 ans, quitte son domicile familial pour s'installer à Lyon. Il découvre le Point G, un centre LGBT, et s'engage dans l'association.",
    genres: ["Drame", "LGBTQ+"],
    featured: true,
    country: "France",
    director: "Slimane-Baptiste Berhoun",
    cast: ["Mehdi Meskar", "Eric Pucheu", "Claudia Mongumu"],
    similarMedia: ["les-crevettes-pailletees", "120-battements", "plaire-aimer"],
  },
  {
    id: "theo-et-hugo",
    title: "Théo et Hugo dans le même bateau",
    type: "movie",
    year: 2016,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "1h 37m",
    description:
      "Dans un sex-club, les corps de Théo et Hugo se trouvent, se reconnaissent, se mêlent dans une étreinte passionnée. Après les mots, après les désirs, ils déambulent dans les rues vides de Paris vers l'aube.",
    genres: ["Drame", "Romance"],
    featured: true,
    country: "France",
    director: "Olivier Ducastel, Jacques Martineau",
    cast: ["Geoffrey Couët", "François Nambot"],
    similarMedia: ["sauvage", "plaire-aimer", "embrasse-moi"],
  },
  {
    id: "rafiki",
    title: "Rafiki",
    type: "movie",
    year: 2018,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.6,
    duration: "1h 23m",
    description:
      "À Nairobi, Kena et Ziki mènent deux vies de jeunes lycéennes bien différentes, mais cherchent chacune à leur façon à poursuivre leurs rêves. Leurs chemins se croisent en pleine campagne électorale au cours de laquelle s'affrontent leurs pères respectifs.",
    genres: ["Drame", "Romance"],
    featured: true,
    country: "Kenya",
    director: "Wanuri Kahiu",
    cast: ["Samantha Mugatsia", "Sheila Munyiva"],
    similarMedia: ["call-me-by-your-name", "tomboy", "120-battements"],
  },
  {
    id: "embrasse-moi",
    title: "Embrasse-moi !",
    type: "movie",
    year: 2017,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.2,
    duration: "1h 26m",
    description:
      "Océanerosemarie déborde de vie, d'amis, et surtout d'ex-petites amies. Mais elle vient de rencontrer Cécile, la \"cette-fois-c'est-vraiment-la-bonne\" femme de sa vie !",
    genres: ["Comédie", "Romance"],
    featured: true,
    country: "France",
    director: "Océanerosemarie, Cyprien Vial",
    cast: ["Océanerosemarie", "Alice Pol", "Grégory Montel"],
    similarMedia: ["les-crevettes-pailletees", "theo-et-hugo", "les-amours-imaginaires"],
  },
  {
    id: "les-crevettes-pailletees",
    title: "Les Crevettes pailletées",
    type: "movie",
    year: 2019,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.3,
    duration: "1h 40m",
    description:
      'Après avoir tenu des propos homophobes, Matthias Le Goff, vice-champion du monde de natation, est condamné à entraîner "Les Crevettes Pailletées", une équipe de water-polo gay, davantage motivée par la fête que par la compétition.',
    genres: ["Comédie", "Sport"],
    new: true,
    country: "France",
    director: "Cédric Le Gallo, Maxime Govare",
    cast: ["Nicolas Gob", "Alban Lenoir", "Michaël Abiteboul"],
    similarMedia: ["mario", "embrasse-moi", "les-engages"],
  },
  {
    id: "plaire-aimer",
    title: "Plaire, aimer et courir vite",
    type: "movie",
    year: 2018,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "2h 12m",
    description:
      "1990. Arthur a vingt ans et il est étudiant à Rennes. Sa vie bascule le jour où il rencontre Jacques, un écrivain qui habite à Paris avec son jeune fils.",
    genres: ["Drame", "Romance"],
    new: true,
    country: "France",
    director: "Christophe Honoré",
    cast: ["Vincent Lacoste", "Pierre Deladonchamps", "Denis Podalydès"],
    similarMedia: ["120-battements", "theo-et-hugo", "call-me-by-your-name"],
  },
  {
    id: "sauvage",
    title: "Sauvage",
    type: "movie",
    year: 2018,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.5,
    duration: "1h 39m",
    description:
      "Léo, 22 ans, se vend dans la rue pour subsister. Les hommes défilent. Lui reste là, en quête d'amour. Il ignore de quoi demain sera fait. Il s'élance dans les rues. Son cœur bat fort.",
    genres: ["Drame"],
    country: "France",
    director: "Camille Vidal-Naquet",
    cast: ["Félix Maritaud", "Eric Bernard", "Nicolas Dibla"],
    similarMedia: ["theo-et-hugo", "jonas", "120-battements"],
  },
  {
    id: "jonas",
    title: "Jonas",
    type: "movie",
    year: 2018,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.4,
    duration: "1h 22m",
    description:
      "Jonas a 18 ans, un été comme tous les autres s'offre à lui. Mais cette année, une fille en pleurs sur une plage va bouleverser sa vie et ses certitudes.",
    genres: ["Drame"],
    country: "France",
    director: "Christophe Charrier",
    cast: ["Félix Maritaud", "Nicolas Bauwens", "Tommy-Lee Baïk"],
    similarMedia: ["sauvage", "tomboy", "plaire-aimer"],
  },
  {
    id: "mario",
    title: "Mario",
    type: "movie",
    year: 2018,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.6,
    duration: "1h 59m",
    description:
      "Pour la première fois de sa vie, Mario, un jeune footballeur, tombe amoureux de Leon, nouvel attaquant venu d'Allemagne. Mais dans le monde très masculin du football professionnel, leur histoire d'amour ne sera  Mais dans le monde très masculin du football professionnel, leur histoire d'amour ne sera pas sans conséquences.",
    genres: ["Drame", "Sport"],
    country: "Suisse",
    director: "Marcel Gisler",
    cast: ["Max Hubacher", "Aaron Altaras", "Jessy Moravec"],
    similarMedia: ["les-crevettes-pailletees", "120-battements", "plaire-aimer"],
  },
  {
    id: "les-fantomes-dishmael",
    title: "Les Fantômes d'Ismaël",
    type: "movie",
    year: 2017,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.1,
    duration: "1h 54m",
    description:
      "À la veille du tournage de son nouveau film, la vie d'un cinéaste est chamboulée par la réapparition d'un amour disparu.",
    genres: ["Drame", "Thriller"],
    country: "France",
    director: "Arnaud Desplechin",
    cast: ["Mathieu Amalric", "Marion Cotillard", "Charlotte Gainsbourg"],
    similarMedia: ["plaire-aimer", "les-amours-imaginaires", "laurence-anyways"],
  },
  {
    id: "call-me-by-your-name",
    title: "Call Me by Your Name",
    type: "movie",
    year: 2017,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.9,
    duration: "2h 12m",
    description:
      "Durant l'été 1983, dans le nord de l'Italie, Elio, 17 ans, rencontre Oliver, un doctorant américain venu aider son père...",
    genres: ["Drame", "Romance"],
    country: "Italie/France",
    director: "Luca Guadagnino",
    cast: ["Timothée Chalamet", "Armie Hammer", "Michael Stuhlbarg"],
    similarMedia: ["plaire-aimer", "rafiki", "les-amours-imaginaires"],
  },
  {
    id: "120-battements",
    title: "120 battements par minute",
    type: "movie",
    year: 2017,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "2h 23m",
    description:
      "Début des années 90. Alors que le sida tue depuis près de dix ans, les militants d'Act Up-Paris multiplient les actions pour lutter contre l'indifférence générale.",
    genres: ["Drame", "Histoire"],
    country: "France",
    director: "Robin Campillo",
    cast: ["Nahuel Pérez Biscayart", "Arnaud Valois", "Adèle Haenel"],
    similarMedia: ["plaire-aimer", "theo-et-hugo", "les-engages"],
  },
  {
    id: "les-amours-imaginaires",
    title: "Les Amours imaginaires",
    type: "movie",
    year: 2010,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.5,
    duration: "1h 42m",
    description:
      "Francis et Marie, deux amis, tombent amoureux de la même personne. Leur trio va rapidement se transformer en relation malsaine où chacun va tenter d'interpréter à sa manière les mots et gestes de celui qu'il aime.",
    genres: ["Drame", "Romance"],
    country: "Canada",
    director: "Xavier Dolan",
    cast: ["Monia Chokri", "Niels Schneider", "Xavier Dolan"],
    similarMedia: ["laurence-anyways", "call-me-by-your-name", "embrasse-moi"],
  },
  {
    id: "laurence-anyways",
    title: "Laurence Anyways",
    type: "movie",
    year: 2012,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "2h 48m",
    description:
      "Dans les années 1990, Laurence annonce à Fred, sa petite amie, qu'il veut devenir une femme. Envers et contre tous, et peut-être bien eux-mêmes, ils affrontent les préjugés de leur entourage.",
    genres: ["Drame", "Romance"],
    country: "Canada/France",
    director: "Xavier Dolan",
    cast: ["Melvil Poupaud", "Suzanne Clément", "Nathalie Baye"],
    similarMedia: ["les-amours-imaginaires", "tomboy", "120-battements"],
  },
  {
    id: "tomboy",
    title: "Tomboy",
    type: "movie",
    year: 2011,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.6,
    duration: "1h 22m",
    description:
      "Laure, 10 ans, est un garçon manqué. Arrivée dans un nouveau quartier, elle fait croire à Lisa et sa bande qu'elle est un garçon. L'été devient un grand terrain de jeu et Laure devient Michaël.",
    genres: ["Drame"],
    country: "France",
    director: "Céline Sciamma",
    cast: ["Zoé Héran", "Malonn Lévana", "Jeanne Disson"],
    similarMedia: ["laurence-anyways", "rafiki", "jonas"],
  },
]

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const media = queerMedia.find((m) => m.id === params.id)

  if (!media) {
    return {
      title: "Média non trouvé | Slay+ | Spectrum",
      description: "Le contenu que vous recherchez n'est pas disponible sur Slay+.",
    }
  }

  return {
    title: `${media.title} | Slay+ | Spectrum`,
    description: media.description,
  }
}

export default function MediaDetailPage({ params }: { params: { id: string } }) {
  const media = queerMedia.find((m) => m.id === params.id)

  if (!media) {
    notFound()
  }

  // Trouver les médias similaires
  const similarMediaItems = media.similarMedia ? queerMedia.filter((m) => media.similarMedia?.includes(m.id)) : []

  return (
    <main className="min-h-screen bg-black text-white pb-16">
      {/* Hero Banner with Media Details */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-20 container mx-auto px-4 py-24 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Back Button */}
          <Link href="/slay-plus" className="absolute top-8 left-4 md:left-8">
            <Button variant="ghost" size="sm" className="hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour
            </Button>
          </Link>

          {/* Media Poster */}
          <div className="relative w-64 md:w-80 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
            <Image src={media.image || "/placeholder.svg"} alt={media.title} fill className="object-cover" />
            {media.new && <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">Nouveau</Badge>}
          </div>

          {/* Media Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {media.genres.map((genre) => (
                <Badge key={genre} className="bg-white/10 hover:bg-white/20">
                  {genre}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-2">{media.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
              <span>{media.year}</span>
              <span className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                {media.rating}/5
              </span>
              <span className="flex items-center">
                {media.type === "movie" ? <Clock className="h-4 w-4 mr-1" /> : <Calendar className="h-4 w-4 mr-1" />}
                {media.duration}
              </span>
              {media.country && <span>{media.country}</span>}
            </div>

            <p className="text-lg mb-6 max-w-2xl">{media.description}</p>

            {/* Cast & Crew */}
            <div className="mb-6">
              {media.director && (
                <p className="text-sm text-gray-400 mb-1">
                  <span className="font-semibold">Réalisation:</span> {media.director}
                </p>
              )}
              {media.cast && media.cast.length > 0 && (
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Distribution:</span> {media.cast?.join(", ")}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Play className="mr-2 h-5 w-5" /> Regarder maintenant
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10">
                <Plus className="mr-2 h-5 w-5" /> Ajouter à ma liste
              </Button>
              <Button size="lg" variant="ghost" className="hover:bg-white/10">
                <Heart className="mr-2 h-5 w-5" /> Favoris
              </Button>
              <Button size="lg" variant="ghost" className="hover:bg-white/10">
                <Share2 className="mr-2 h-5 w-5" /> Partager
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Content */}
      {similarMediaItems.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Vous pourriez aussi aimer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {similarMediaItems.map((item) => (
              <Link href={`/slay-plus/${item.id}`} key={item.id}>
                <div className="bg-transparent border-0 rounded-lg overflow-hidden hover:scale-105 transition-transform">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Play className="h-4 w-4 mr-1" /> Regarder
                      </Button>
                    </div>
                    {item.new && <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">Nouveau</Badge>}
                  </div>
                  <div className="pt-3 px-1">
                    <h3 className="font-bold truncate hover:text-red-500 transition-colors">{item.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
                      <span>{item.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Subscription Banner */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez Slay+ aujourd'hui</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Accédez à notre catalogue complet de films et séries LGBTQ+ pour seulement 6,99€ par mois. Sans engagement,
            annulez à tout moment.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            ESSAYER GRATUITEMENT
          </Button>
          <p className="text-white/80 mt-4">7 JOURS OFFERTS</p>
        </div>
      </section>
    </main>
  )
}
