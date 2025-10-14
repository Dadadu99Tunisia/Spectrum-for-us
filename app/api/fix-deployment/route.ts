import { type NextRequest, NextResponse } from "next/server"

// Cette route API peut être utilisée pour vérifier si les API routes fonctionnent correctement
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    message: "API routes fonctionnent correctement",
    timestamp: new Date().toISOString(),
  })
}

