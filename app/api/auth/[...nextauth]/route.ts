import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordCorrect = await compare(credentials.password, user.password)

        if (!isPasswordCorrect) {
          return null
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Fichier temporairement désactivé pour éviter les erreurs
export async function GET() {
  return new Response("Auth temporairement désactivé", { status: 200 })
}

export async function POST() {
  return new Response("Auth temporairement désactivé", { status: 200 })
}
