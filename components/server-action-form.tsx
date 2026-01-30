"use client"

import { useState } from "react"
import { exampleServerAction } from "@/app/actions/example"

export function ServerActionForm() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const response = await exampleServerAction(formData)
      setResult(response)
    } catch (error) {
      console.error("Error:", error)
      setResult({ success: false, message: "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Server Action</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? "bg-green-50" : "bg-red-50"}`}>
          <p className={result.success ? "text-green-800" : "text-red-800"}>{result.message}</p>
          <p className="text-xs text-gray-500 mt-1">{result.timestamp}</p>
        </div>
      )}
    </div>
  )
}
