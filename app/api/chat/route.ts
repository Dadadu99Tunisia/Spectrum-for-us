import { OpenAI } from "openai"

// Créer une instance OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

// Ne pas utiliser runtime = "edge" car cela peut causer des problèmes avec l'AI SDK
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Vérifier si l'API key est configurée
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.",
        }),
        { status: 500 },
      )
    }

    // Créer la complétion avec OpenAI (sans streaming pour éviter les problèmes)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      // Désactivation du streaming pour simplifier
      stream: false,
    })

    // Retourner la réponse standard (non streaming)
    return new Response(
      JSON.stringify({
        content: response.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "An error occurred during your request." }), { status: 500 })
  }
}
