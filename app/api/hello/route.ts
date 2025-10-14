import { NextResponse } from "next/server"

export const runtime = "nodejs" // 'edge' ou 'nodejs'

export async function GET() {
  return NextResponse.json({
    message: "Hello from Spectrum Marketplace API!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
}

