import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Film, Play, Star, Info, Calendar, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Slay+ | Films et séries LGBTQ+ | Spectrum",
  description:
    "Découvrez une sélection exclusive de films et séries LGBTQ+ sur Slay+, la plateforme de streaming queer de Spectrum.",
}

// Types pour les médias
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
}

// Catalogue complet de films et séries LGBTQ+
const queerMedia: Media[] = [
  // Films français
  {
    id: "portrait-jeune-fille-en-feu",
    title: "Portrait de la jeune fille en feu",
    type: "movie",
    year: 2019,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "2h 2m",
    description:
      "Au XVIIIe siècle, une peintre est engagée pour faire le portrait de mariage d'une jeune femme qui vient de quitter le couvent. Jour après jour, les deux femmes se rapprochent...",
    genres: ["Drame", "Romance", "Historique"],
    featured: true,
    country: "France",
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
  },
  {
    id: "la-vie-dadele",
    title: "La Vie d'Adèle",
    type: "movie",
    year: 2013,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "2h 59m",
    description:
      "À 15 ans, Adèle ne se pose pas de question : une fille, ça sort avec des garçons. Sa vie bascule le jour où elle rencontre Emma, une jeune femme aux cheveux bleus, qui lui fait découvrir le désir et lui permettra de s'affirmer en tant que femme et adulte.",
    genres: ["Drame", "Romance"],
    country: "France",
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
    country: "France",
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
    country: "France",
  },

  // Films américains
  {
    id: "moonlight",
    title: "Moonlight",
    type: "movie",
    year: 2016,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.9,
    duration: "1h 51m",
    description:
      "L'histoire poignante d'un jeune homme noir qui lutte pour trouver sa place dans le monde tout en vivant dans un quartier défavorisé de Miami.",
    genres: ["Drame", "LGBTQ+"],
    featured: true,
    country: "États-Unis",
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
    featured: true,
    country: "Italie/États-Unis",
  },
  {
    id: "brokeback-mountain",
    title: "Brokeback Mountain",
    type: "movie",
    year: 2005,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "2h 14m",
    description:
      "Été 1963, Wyoming. Deux jeunes cow-boys, Jack et Ennis, sont engagés pour garder ensemble un troupeau de moutons à Brokeback Mountain. Isolés au milieu d'une nature sauvage, leur complicité se transforme lentement en une attirance aussi irrésistible qu'inattendue.",
    genres: ["Drame", "Romance", "Western"],
    country: "États-Unis",
  },
  {
    id: "paris-is-burning",
    title: "Paris is Burning",
    type: "movie",
    year: 1990,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "1h 18m",
    description:
      "Documentaire sur la culture ballroom et drag de New York à la fin des années 80, mettant en lumière les communautés afro-américaines et latines LGBTQ+.",
    genres: ["Documentaire", "LGBTQ+"],
    country: "États-Unis",
  },
  {
    id: "tangerine",
    title: "Tangerine",
    type: "movie",
    year: 2015,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.6,
    duration: "1h 28m",
    description:
      "Sin-Dee, une travailleuse du sexe trans, découvre que son petit ami/proxénète l'a trompée pendant qu'elle était en prison. Avec sa meilleure amie Alexandra, elle part à sa recherche à travers Los Angeles.",
    genres: ["Comédie", "Drame"],
    country: "États-Unis",
  },
  {
    id: "watermelon-woman",
    title: "The Watermelon Woman",
    type: "movie",
    year: 1996,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.5,
    duration: "1h 30m",
    description:
      'Cheryl, une jeune cinéaste noire lesbienne, travaille dans un vidéoclub tout en réalisant un documentaire sur une actrice noire des années 1930 connue sous le nom de "The Watermelon Woman".',
    genres: ["Comédie", "Drame", "Romance"],
    country: "États-Unis",
  },

  // Films britanniques
  {
    id: "pride",
    title: "Pride",
    type: "movie",
    year: 2014,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "2h 0m",
    description:
      "Été 1984 - Alors que Margaret Thatcher est au pouvoir, un groupe d'activistes gays et lesbiens décide de récolter de l'argent pour soutenir les familles des mineurs en grève.",
    genres: ["Comédie", "Drame", "Histoire"],
    country: "Royaume-Uni",
  },
  {
    id: "gods-own-country",
    title: "God's Own Country",
    type: "movie",
    year: 2017,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.6,
    duration: "1h 44m",
    description:
      "Johnny travaille dans la ferme familiale du Yorkshire. Frustré par sa vie isolée, il noie ses problèmes dans l'alcool et les aventures sans lendemain. L'arrivée d'un saisonnier roumain va tout changer.",
    genres: ["Drame", "Romance"],
    country: "Royaume-Uni",
  },

  // Films d'Amérique Latine
  {
    id: "xxy",
    title: "XXY",
    type: "movie",
    year: 2007,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.5,
    duration: "1h 31m",
    description:
      "Alex, 15 ans, est une personne intersexe. Peu après sa naissance, ses parents décident de quitter Buenos Aires pour s'installer sur la côte uruguayenne, dans une maison de bois isolée entourée de dunes.",
    genres: ["Drame"],
    country: "Argentine",
  },
  {
    id: "tatuagem",
    title: "Tatuagem",
    type: "movie",
    year: 2013,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.4,
    duration: "1h 50m",
    description:
      "Recife, 1978. Clécio Wanderley dirige la troupe théâtrale Chão de Estrelas qui défie la dictature militaire brésilienne. Fininha, un jeune soldat, tombe amoureux de Clécio et découvre un univers artistique et bohème.",
    genres: ["Drame", "Romance"],
    country: "Brésil",
  },
  {
    id: "una-mujer-fantastica",
    title: "Una Mujer Fantástica",
    type: "movie",
    year: 2017,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "1h 44m",
    description:
      "Marina, serveuse et chanteuse, et Orlando, de 20 ans son aîné, s'aiment et envisagent un avenir ensemble. Lorsqu'il meurt soudainement, Marina subit l'hostilité des proches d'Orlando : une « femme fantastique » devient leur ennemi.",
    genres: ["Drame"],
    featured: true,
    country: "Chili",
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
    country: "Kenya",
  },

  // Films asiatiques
  {
    id: "the-handmaiden",
    title: "The Handmaiden",
    type: "movie",
    year: 2016,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.9,
    duration: "2h 25m",
    description:
      "Corée, années 30, pendant la colonisation japonaise. Une jeune femme est engagée comme servante d'une riche japonaise, vivant recluse dans un immense manoir sous la coupe d'un oncle tyrannique. Mais cette servante a un secret...",
    genres: ["Drame", "Romance", "Thriller"],
    featured: true,
    country: "Corée du Sud",
  },
  {
    id: "happy-together",
    title: "Happy Together",
    type: "movie",
    year: 1997,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "1h 36m",
    description:
      "Lai et Ho, un couple homosexuel de Hong Kong, partent en Argentine. Leur relation tumultueuse alterne entre passion et violence. Après une énième dispute, ils se séparent mais continuent de se croiser à Buenos Aires.",
    genres: ["Drame", "Romance"],
    country: "Hong Kong",
  },
  {
    id: "fire",
    title: "Fire",
    type: "movie",
    year: 1996,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.6,
    duration: "1h 48m",
    description:
      "Dans une famille traditionnelle indienne, deux belles-sœurs, délaissées par leurs maris, développent une relation amoureuse. Premier film indien à traiter ouvertement du lesbianisme.",
    genres: ["Drame", "Romance"],
    country: "Inde",
  },

  // Films d'Océanie
  {
    id: "holding-the-man",
    title: "Holding the Man",
    type: "movie",
    year: 2015,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "2h 8m",
    description:
      "L'histoire vraie et émouvante de Timothy Conigrave et John Caleo, deux jeunes hommes qui se sont rencontrés au lycée en Australie dans les années 70 et sont restés ensemble pendant 15 ans, jusqu'à ce que la maladie les sépare.",
    genres: ["Biographie", "Drame", "Romance"],
    country: "Australie",
  },
  {
    id: "priscilla",
    title: "Priscilla, folle du désert",
    type: "movie",
    year: 1994,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "1h 44m",
    description:
      "Deux drag queens et une femme transgenre traversent le désert australien à bord d'un bus baptisé Priscilla, pour se produire dans un hôtel d'Alice Springs.",
    genres: ["Comédie", "Aventure"],
    country: "Australie",
  },

  // Films africains
  {
    id: "the-wound",
    title: "The Wound",
    type: "movie",
    year: 2017,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.5,
    duration: "1h 28m",
    description:
      "Dans les montagnes d'Afrique du Sud, lors d'un rituel d'initiation traditionnel xhosa, un ouvrier d'usine sud-africain cache un secret qui pourrait le mettre au ban de sa communauté.",
    genres: ["Drame"],
    country: "Afrique du Sud",
  },
  {
    id: "linvisible",
    title: "L'Invisible",
    type: "movie",
    year: 2016,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.3,
    duration: "1h 12m",
    description:
      "Documentaire sur les réalités LGBTQ en Tunisie, où l'homosexualité est encore criminalisée. À travers des témoignages, le film donne la parole à ceux qui vivent dans l'ombre.",
    genres: ["Documentaire"],
    country: "Tunisie",
  },

  // Séries américaines
  {
    id: "pose",
    title: "Pose",
    type: "series",
    year: 2018,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.9,
    duration: "3 saisons",
    description:
      "New York, 1987-1994. Plongée dans la culture ballroom, un mouvement culturel underground où des membres de la communauté LGBTQ+, principalement noirs et latinos, s'affrontent lors de compétitions de danse et de défilés.",
    genres: ["Drame", "LGBTQ+"],
    featured: true,
    country: "États-Unis",
  },
  {
    id: "rupauls-drag-race",
    title: "RuPaul's Drag Race",
    type: "series",
    year: 2009,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "15+ saisons",
    description:
      "Des drag queens s'affrontent dans une compétition de talents, de créativité et de personnalité pour remporter le titre de \"America's Next Drag Superstar\" et un prix en argent.",
    genres: ["Téléréalité", "Compétition"],
    country: "États-Unis",
  },
  {
    id: "euphoria",
    title: "Euphoria",
    type: "series",
    year: 2019,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "2 saisons",
    description:
      "Un groupe d'adolescents navigue entre amour et amitiés, dans un monde d'identité, de traumatismes, de drogues et de médias sociaux. Avec Jules, une jeune femme trans parmi les protagonistes.",
    genres: ["Drame", "LGBTQ+"],
    new: true,
    country: "États-Unis",
  },
  {
    id: "the-l-word",
    title: "The L Word",
    type: "series",
    year: 2004,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.6,
    duration: "6 saisons",
    description:
      "Les vies professionnelles et personnelles d'un groupe de femmes lesbiennes, bisexuelles et leurs amies à Los Angeles. Une série pionnière dans la représentation lesbienne à la télévision.",
    genres: ["Drame", "Romance"],
    country: "États-Unis",
  },
  {
    id: "the-l-word-generation-q",
    title: "The L Word: Generation Q",
    type: "series",
    year: 2019,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.5,
    duration: "3 saisons",
    description:
      "Suite de la série originale, suivant un nouveau groupe de personnages LGBTQ+ à Los Angeles, avec quelques visages familiers de la série originale.",
    genres: ["Drame", "Romance"],
    country: "États-Unis",
  },
  {
    id: "orange-is-the-new-black",
    title: "Orange is the New Black",
    type: "series",
    year: 2013,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "7 saisons",
    description:
      "Piper Chapman est envoyée en prison pour un crime commis dix ans plus tôt. Dans cette prison pour femmes, elle retrouve son ex-petite amie et découvre un monde complexe de relations et d'identités.",
    genres: ["Comédie", "Drame"],
    country: "États-Unis",
  },

  // Séries britanniques
  {
    id: "its-a-sin",
    title: "It's a Sin",
    type: "series",
    year: 2021,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.9,
    duration: "1 saison",
    description:
      "Londres, années 80. Cinq jeunes se lient d'amitié alors que le sida commence à se répandre. La série suit leur parcours pendant une décennie, alors qu'ils grandissent à l'ombre de l'épidémie.",
    genres: ["Drame", "Histoire"],
    featured: true,
    country: "Royaume-Uni",
  },
  {
    id: "sex-education",
    title: "Sex Education",
    type: "series",
    year: 2019,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "4 saisons",
    description:
      "Otis, un adolescent socialement inadapté dont la mère est sexologue, s'associe avec Maeve pour créer une clinique clandestine de thérapie sexuelle au lycée. La série présente divers personnages LGBTQ+.",
    genres: ["Comédie", "Drame"],
    country: "Royaume-Uni",
  },
  {
    id: "feel-good",
    title: "Feel Good",
    type: "series",
    year: 2020,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "2 saisons",
    description:
      "Mae, une comédienne canadienne en rétablissement, tente de gérer sa sobriété et sa nouvelle relation avec George, qui n'a jamais été avec une femme auparavant.",
    genres: ["Comédie", "Drame", "Romance"],
    country: "Royaume-Uni",
  },
  {
    id: "gentleman-jack",
    title: "Gentleman Jack",
    type: "series",
    year: 2019,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "2 saisons",
    description:
      "Basée sur l'histoire vraie d'Anne Lister, propriétaire terrienne, industrielle et diariste du XIXe siècle, connue pour ses relations avec des femmes et son style de vie non conventionnel.",
    genres: ["Biographie", "Drame", "Historique"],
    country: "Royaume-Uni",
  },

  // Séries françaises
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
    country: "France",
  },

  // Séries d'Amérique Latine
  {
    id: "manhas-de-setembro",
    title: "Manhãs de Setembro",
    type: "series",
    year: 2021,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.6,
    duration: "1 saison",
    description:
      "Cassandra, une femme trans qui a quitté sa ville natale pour vivre librement à São Paulo, voit sa vie bouleversée quand elle découvre qu'elle a un fils de 10 ans.",
    genres: ["Drame"],
    country: "Brésil",
  },

  // Séries asiatiques
  {
    id: "cherry-magic",
    title: "Cherry Magic! Thirty Years of Virginity Can Make You a Wizard?!",
    type: "series",
    year: 2020,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.5,
    duration: "1 saison",
    description:
      "Adachi, un homme de 30 ans encore vierge, développe soudainement le pouvoir de lire dans les pensées des gens qu'il touche. Il découvre ainsi que son collègue, Kurosawa, est secrètement amoureux de lui.",
    genres: ["Comédie", "Romance", "BL"],
    country: "Japon",
  },
  {
    id: "until-we-meet-again",
    title: "Until We Meet Again",
    type: "series",
    year: 2019,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.7,
    duration: "1 saison",
    description:
      "Deux étudiants universitaires, Pharm et Dean, sont inexplicablement attirés l'un par l'autre. Ils découvrent qu'ils sont liés par leurs vies antérieures, où leurs amants respectifs se sont suicidés.",
    genres: ["Drame", "Romance", "BL"],
    country: "Thaïlande",
  },

  // Séries australiennes
  {
    id: "please-like-me",
    title: "Please Like Me",
    type: "series",
    year: 2013,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.8,
    duration: "4 saisons",
    description:
      "Josh, un jeune homme qui vient de réaliser qu'il est gay, doit gérer sa vie amoureuse compliquée, sa mère suicidaire, et les hauts et bas de la vingtaine.",
    genres: ["Comédie", "Drame"],
    country: "Australie",
  },

  // Séries britanniques
  {
    id: "heartstopper",
    title: "Heartstopper",
    type: "series",
    year: 2022,
    image: "/placeholder.svg?height=500&width=350",
    rating: 4.9,
    duration: "2 saisons",
    description:
      "Charlie et Nick se rencontrent au lycée et découvrent que leur amitié inattendue se transforme en quelque chose de plus profond. Une histoire douce sur l'amour, l'amitié et la loyauté.",
    genres: ["Drame", "Romance"],
    featured: true,
    new: true,
    country: "Royaume-Uni",
  },
]

export default function SlayPlusPage() {
  const featuredMedia = queerMedia.filter((media) => media.featured)
  const newMedia = queerMedia.filter((media) => media.new)
  const movies = queerMedia.filter((media) => media.type === "movie")
  const series = queerMedia.filter((media) => media.type === "series")

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"></div>
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center mb-4">
            <Film className="h-8 w-8 mr-2 text-pink-500" />
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Slay<span className="text-white">+</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white">
            Découvrez une sélection exclusive de films et séries LGBTQ+ qui célèbrent la diversité et l'authenticité des
            expériences queers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Play className="mr-2 h-5 w-5" /> Commencer à regarder
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 text-white">
              <Info className="mr-2 h-5 w-5" /> En savoir plus
            </Button>
          </div>
          <p className="text-white/80 mt-4">6.99€/MOIS SANS ENGAGEMENT - 7 JOURS OFFERTS</p>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Le meilleur du cinéma LGBTQ+</h2>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="mb-8 p-1 flex justify-center">
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
            >
              À la une
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
            >
              Nouveautés
            </TabsTrigger>
            <TabsTrigger
              value="movies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
            >
              Films
            </TabsTrigger>
            <TabsTrigger
              value="series"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
            >
              Séries
            </TabsTrigger>
          </TabsList>

          {/* Featured Content */}
          <TabsContent value="featured" className="mt-0">
            <h3 className="text-2xl font-bold mb-6">Sélection à la une</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMedia.map((media) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          </TabsContent>

          {/* New Content */}
          <TabsContent value="new" className="mt-0">
            <h3 className="text-2xl font-bold mb-6">Nouveautés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newMedia.length > 0 ? (
                newMedia.map((media) => <MediaCard key={media.id} media={media} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Revenez jeudi prochain pour découvrir nos nouveautés !</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Movies */}
          <TabsContent value="movies" className="mt-0">
            <h3 className="text-2xl font-bold mb-6">Films</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MediaCard key={movie.id} media={movie} />
              ))}
            </div>
          </TabsContent>

          {/* Series */}
          <TabsContent value="series" className="mt-0">
            <h3 className="text-2xl font-bold mb-6">Séries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {series.map((serie) => (
                <MediaCard key={serie.id} media={serie} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Explorez par genre</h2>
        <div className="flex flex-wrap gap-3">
          {Array.from(new Set(queerMedia.flatMap((media) => media.genres))).map((genre) => (
            <Link href={`/slay-plus/genre/${genre.toLowerCase()}`} key={genre}>
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm hover:bg-purple-600/20 transition-colors border-purple-200 hover:border-purple-600"
              >
                {genre}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Countries */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Explorez par pays</h2>
        <div className="flex flex-wrap gap-3">
          {Array.from(new Set(queerMedia.filter((media) => media.country).map((media) => media.country))).map(
            (country) => (
              <Link href={`/slay-plus/pays/${country?.toLowerCase()}`} key={country}>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm hover:bg-purple-600/20 transition-colors border-purple-200 hover:border-purple-600"
                >
                  {country}
                </Badge>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez Slay+ aujourd'hui</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Accédez à notre catalogue complet de films et séries LGBTQ+ pour seulement 6,99€ par mois. Sans engagement,
            annulez à tout moment.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            S'abonner maintenant
          </Button>
          <p className="text-gray-400 mt-4">7 JOURS OFFERTS</p>
        </div>
      </section>
    </main>
  )
}

// Composant pour afficher un film ou une série
function MediaCard({ media }: { media: Media }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={media.image || "/placeholder.svg"}
          alt={media.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <Button
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Play className="h-4 w-4 mr-1" /> Regarder
          </Button>
          {media.new && <Badge className="bg-yellow-500 text-black">Nouveau</Badge>}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm">{media.rating}/5</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            {media.type === "movie" ? <Clock className="h-3 w-3 mr-1" /> : <Calendar className="h-3 w-3 mr-1" />}
            <span>{media.duration}</span>
          </div>
        </div>
        <Link href={`/slay-plus/${media.id}`}>
          <h3 className="font-bold truncate group-hover:text-purple-600 transition-colors">{media.title}</h3>
        </Link>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>{media.year}</span>
          {media.country && (
            <>
              <span className="mx-2">•</span>
              <span>{media.country}</span>
            </>
          )}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-2 hover:bg-purple-600/20 group">
          <Heart className="h-4 w-4 mr-2 group-hover:text-pink-500" />
          Ajouter aux favoris
        </Button>
      </CardContent>
    </Card>
  )
}
