import { OpenAIStream, StreamingTextResponse } from "ai"
import { OpenAI } from "openai"

// Créer une instance OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Vérifier si l'API key est configurée
    if (!process.env.OPENAI_API_KEY) {
      return new Response("OpenAI API key not configured.", { status: 500 })
    }

    // Créer la complétion avec OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content: `Tu es un assistant virtuel pour Spectrum, un marketplace inclusif et diversifié qui célèbre la communauté queer.
          Réponds de manière amicale, inclusive et respectueuse. Utilise un ton chaleureux et accueillant.
          Fournis des informations précises sur les produits, les vendeurs, les événements et les services de Spectrum.
          Si tu ne connais pas la réponse, propose de mettre l'utilisateur en contact avec un agent humain.`,
        },
        ...messages,
      ],
    })

    // Convertir la réponse en un flux de texte compatible
    const stream = OpenAIStream(response)

    // Répondre avec le flux
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response("An error occurred during your request.", { status: 500 })
  }
}
