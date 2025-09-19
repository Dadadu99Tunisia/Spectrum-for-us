import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/lib/supabase-client"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: "/connexion",
    signOut: "/",
    error: "/connexion",
    newUser: "/inscription",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error || !data.user) {
            return null
          }

          // Récupérer le profil utilisateur
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

          return {
            id: data.user.id,
            email: data.user.email!,
            name: profile?.full_name || data.user.email!,
            image: profile?.avatar_url || null,
            role: profile?.role || "buyer",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "buyer"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Créer ou mettre à jour le profil utilisateur
          const { error } = await supabase.from("profiles").upsert({
            id: user.id,
            full_name: user.name,
            avatar_url: user.image,
            role: "buyer",
          })

          if (error) {
            console.error("Error creating profile:", error)
            return false
          }
        } catch (error) {
          console.error("SignIn error:", error)
          return false
        }
      }
      return true
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
