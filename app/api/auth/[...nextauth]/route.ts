import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

// Version simplifiée sans dépendances externes
export const authOptions = {
  secret: "demo-secret-key-for-testing-only",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/connexion",
    signOut: "/",
    error: "/connexion",
    newUser: "/inscription",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Pour la démo, nous acceptons n'importe quelles identifiants
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Utilisateur de démo
        return {
          id: "demo-user",
          email: credentials.email,
          name: "Utilisateur Démo",
          image: "/placeholder.svg?height=100&width=100",
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || "demo-user"
        session.user.name = token.name || "Utilisateur Démo"
        session.user.email = token.email || "demo@example.com"
        session.user.image = token.picture || "/placeholder.svg?height=100&width=100"
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
