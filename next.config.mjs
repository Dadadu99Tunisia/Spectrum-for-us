/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Ignorer les erreurs TypeScript et ESLint pendant la build pour le déploiement
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Désactiver les sourcemaps en production pour réduire la taille du bundle
  productionBrowserSourceMaps: false,
  // Optimisations expérimentales
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    optimisticClientCache: true,
  },
  // Compression des assets
  compress: true,
  // Optimisation des polyfills
  swcMinify: true,
}

export default nextConfig
