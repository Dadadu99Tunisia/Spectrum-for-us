import { NextResponse } from "next/server"

export async function GET() {
  // Vérifier si l'API key est configurée
  const apiKeyStatus = process.env.OPENAI_API_KEY ? "API key is configured" : "API key is missing"

  return NextResponse.json({
    status: "Chat API Debug Endpoint",
    apiKeyStatus,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
