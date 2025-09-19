import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [
      {
        role: "system",
        content: `Tu es l'assistant virtuel de Spectrum, une marketplace inclusive qui met en avant les créateurs et artistes de la diversité. 
        
        Tes rôles :
        - Aider les utilisateurs à naviguer sur la plateforme
        - Recommander des produits et services
        - Expliquer le processus d'achat et de vente
        - Promouvoir les valeurs d'inclusion et de diversité
        - Répondre aux questions sur les vendeurs et leurs créations
        
        Ton ton est chaleureux, professionnel et inclusif. Tu parles français et tu connais bien l'écosystème créatif et artistique.`,
      },
      ...messages,
    ],
    temperature: 0.7,
    maxTokens: 500,
  })

  return result.toAIStreamResponse()
}
