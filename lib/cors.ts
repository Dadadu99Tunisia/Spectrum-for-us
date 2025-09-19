export function corsHeaders(req: Request, allowedOrigins: string[]) {
  const origin = req.headers.get("origin") ?? ""
  const isAllowed = allowedOrigins.some((o) => o === origin)

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    Vary: "Origin",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Stripe-Signature, X-Requested-With",
  }
}

export function preflight(req: Request, headers: Record<string, string>) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers,
    })
  }
  return null
}

export function withCors(handler: Function, allowedOrigins: string[]) {
  return async (req: Request, ...args: any[]) => {
    const headers = corsHeaders(req, allowedOrigins)

    // Handle preflight
    const preflightResponse = preflight(req, headers)
    if (preflightResponse) return preflightResponse

    // Execute handler
    const response = await handler(req, ...args)

    // Add CORS headers to response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }
}
