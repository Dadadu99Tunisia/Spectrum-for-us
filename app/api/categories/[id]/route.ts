import { type NextRequest, NextResponse } from "next/server"
import { getCategoryById } from "@/lib/utils/data-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = getCategoryById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération de la catégorie" },
      { status: 500 },
    )
  }
}

