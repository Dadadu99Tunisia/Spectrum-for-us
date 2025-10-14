export interface User {
  id: string
  email: string
  name: string
  role: "user" | "seller" | "admin"
  createdAt: string
  updatedAt: string
  avatar?: string
  isSeller?: boolean
  sellerId?: string
}

// Données de démonstration - Dans une vraie application, les mots de passe seraient hachés
export const users: User[] = [
  {
    id: "user-001",
    email: "admin@spectrum.com",
    name: "Admin Spectrum",
    role: "admin",
    createdAt: "2022-09-01T08:00:00Z",
    updatedAt: "2022-09-01T08:00:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "user-002",
    email: "sophie@example.com",
    name: "Sophie Martin",
    role: "user",
    createdAt: "2022-10-05T14:30:00Z",
    updatedAt: "2022-10-05T14:30:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "user-003",
    email: "alex@bijouxinclusifs.fr",
    name: "Alex Dubois",
    role: "seller",
    createdAt: "2022-10-10T09:15:00Z",
    updatedAt: "2022-10-10T09:15:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
    isSeller: true,
    sellerId: "seller-002",
  },
  {
    id: "user-004",
    email: "sam@transessentials.com",
    name: "Sam Moreau",
    role: "seller",
    createdAt: "2022-11-15T11:45:00Z",
    updatedAt: "2022-11-15T11:45:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
    isSeller: true,
    sellerId: "seller-003",
  },
  {
    id: "user-005",
    email: "camille@librairequeer.fr",
    name: "Camille Petit",
    role: "seller",
    createdAt: "2022-12-20T10:30:00Z",
    updatedAt: "2022-12-20T10:30:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
    isSeller: true,
    sellerId: "seller-004",
  },
]

