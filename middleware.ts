import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin")
    const isVendeurPath = req.nextUrl.pathname.startsWith("/vendeur")

    // Protection des routes admin
    if (isAdminPath) {
      if (!token || (token.role !== "ADMIN" && token.role !== "SUPER_ADMIN")) {
        return NextResponse.redirect(new URL("/connexion", req.url))
      }
    }

    // Protection des routes vendeur
    if (isVendeurPath) {
      if (!token || (token.role !== "SELLER" && token.role !== "ADMIN" && token.role !== "SUPER_ADMIN")) {
        return NextResponse.redirect(new URL("/devenir-vendeur", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permettre l'accès aux routes publiques
        if (!req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/vendeur")) {
          return true
        }

        // Exiger une authentification pour les routes protégées
        return !!token
      },
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/vendeur/:path*", "/favoris", "/panier/:path*"],
}
