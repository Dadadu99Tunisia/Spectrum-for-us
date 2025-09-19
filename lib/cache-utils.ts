type CacheOptions = {
  ttl: number // Time to live in milliseconds
}

const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 60 * 1000, // 1 minute
}

class CacheManager {
  private cache: Map<string, { value: any; expiry: number }> = new Map()

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value as T
  }

  set<T>(key: string, value: T, options: Partial<CacheOptions> = {}): void {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    const expiry = Date.now() + opts.ttl

    this.cache.set(key, { value, expiry })
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Nettoyer les entrées expirées
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }
}

// Exporter une instance singleton
export const cacheManager = new CacheManager()

// Nettoyer le cache périodiquement (côté client uniquement)
if (typeof window !== "undefined") {
  setInterval(() => {
    cacheManager.cleanup()
  }, 60 * 1000) // Nettoyer toutes les minutes
}

// Wrapper pour les fonctions asynchrones avec mise en cache
export async function withCache<T>(key: string, fn: () => Promise<T>, options?: Partial<CacheOptions>): Promise<T> {
  const cached = cacheManager.get<T>(key)

  if (cached !== null) {
    return cached
  }

  const result = await fn()
  cacheManager.set(key, result, options)
  return result
}
