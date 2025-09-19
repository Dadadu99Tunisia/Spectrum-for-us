/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration optimisée pour le déploiement
  experimental: {
    // Désactiver les fonctionnalités expérimentales qui peuvent causer des problèmes
    serverComponentsExternalPackages: ['stripe']
  },
  
  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
      },
      {
        protocol: 'https',
        hostname: '**.placeholder.com',
      }
    ],
    // Optimisation des images
    formats: ['image/webp', 'image/avif'],
  },

  // Optimisations de build
  swcMinify: true,
  
  // Configuration pour éviter les erreurs de build
  typescript: {
    // En production, ne pas échouer sur les erreurs TypeScript mineures
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // En production, ne pas échouer sur les warnings ESLint
    ignoreDuringBuilds: false,
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirections pour les anciennes URLs
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
