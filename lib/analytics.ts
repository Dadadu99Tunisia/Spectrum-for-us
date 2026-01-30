// Analytics et monitoring des performances
export const analytics = {
  // Tracking des événements
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag("event", eventName, properties)
      }

      // Console log en développement
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics Event:", eventName, properties)
      }
    }
  },

  // Tracking des pages vues
  pageView: (url: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      })
    }
  },

  // Tracking des erreurs
  trackError: (error: Error, context?: string) => {
    if (typeof window !== "undefined") {
      // Sentry ou autre service d'erreur
      console.error("Error tracked:", error, context)

      // Google Analytics
      if (window.gtag) {
        window.gtag("event", "exception", {
          description: error.message,
          fatal: false,
          custom_map: { context },
        })
      }
    }
  },

  // Métriques de performance
  trackPerformance: () => {
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

      const metrics = {
        // Core Web Vitals
        fcp: 0, // First Contentful Paint
        lcp: 0, // Largest Contentful Paint
        fid: 0, // First Input Delay
        cls: 0, // Cumulative Layout Shift

        // Autres métriques
        ttfb: navigation.responseStart - navigation.requestStart,
        domLoad: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        windowLoad: navigation.loadEventEnd - navigation.navigationStart,
      }

      // Observer pour LCP
      if ("PerformanceObserver" in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.entryType === "largest-contentful-paint") {
              metrics.lcp = entry.startTime
            }
          })
        })
        observer.observe({ entryTypes: ["largest-contentful-paint"] })
      }

      // Envoyer les métriques après un délai
      setTimeout(() => {
        analytics.track("performance_metrics", metrics)
      }, 5000)
    }
  },
}

// Types pour TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
