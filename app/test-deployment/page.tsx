"use client"

import { ServerActionForm } from "@/components/server-action-form"

export default function TestDeploymentPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Test de déploiement Vercel</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold mb-4">Test des Server Actions</h2>
          <ServerActionForm />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Test des API Routes</h2>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <p className="mb-4">Cliquez sur le bouton pour tester l'API route</p>
            <button
              onClick={async () => {
                try {
                  const response = await fetch("/api/hello")
                  const data = await response.json()
                  alert(JSON.stringify(data, null, 2))
                } catch (error) {
                  console.error("Error:", error)
                  alert("Error fetching API route")
                }
              }}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Test API Route
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
