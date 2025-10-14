"use server"

export async function exampleServerAction(data: FormData) {
  // Simuler un délai pour montrer l'activité
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Récupérer des données du formulaire
  const name = data.get("name") as string

  // Traitement côté serveur
  console.log(`Processing data for: ${name}`)

  // Retourner une réponse
  return {
    success: true,
    message: `Hello, ${name}! Your data has been processed.`,
    timestamp: new Date().toISOString(),
  }
}

