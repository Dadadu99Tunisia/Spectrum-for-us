/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com', 'placehold.co'],
  },
  // Ignorer les erreurs TypeScript et ESLint pendant la build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Désactiver les sourcemaps en production pour réduire la taille du bundle
  productionBrowserSourceMaps: false,
  // Optimiser les images automatiquement
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Expérimental: optimisations pour les applications de grande taille
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
}

export default nextConfig
