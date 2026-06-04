/**
 * Rate limiter en mémoire — pas de dépendance Redis.
 * Fonctionne par cold-start (Edge/Node). Pour un trafic > 10k req/h, migrer vers Upstash.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Nettoyage toutes les 5 minutes pour éviter la fuite mémoire
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number; // timestamp ms
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (existing.count >= maxRequests) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, remaining: maxRequests - existing.count, resetAt: existing.resetAt };
}

/** Helpers pré-configurés */
export const limits = {
  /** Formulaires publics : 5 / 10min par IP */
  publicForm: (ip: string) => rateLimit(`form:${ip}`, 5, 10 * 60 * 1000),
  /** Payment intent : 3 / minute par user */
  payment: (userId: string) => rateLimit(`pay:${userId}`, 3, 60 * 1000),
  /** Upload : 10 / heure par user */
  upload: (userId: string) => rateLimit(`upload:${userId}`, 10, 60 * 60 * 1000),
  /** Auth : 10 tentatives / 15min par IP */
  auth: (ip: string) => rateLimit(`auth:${ip}`, 10, 15 * 60 * 1000),
};

/** Retourne une NextResponse 429 si le rate limit est dépassé, sinon null */
export function rateLimitResponse(result: RateLimitResult) {
  if (result.success) return null;
  const { NextResponse } = require("next/server");
  return NextResponse.json(
    { error: "Trop de tentatives. Réessaie dans quelques minutes." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}
