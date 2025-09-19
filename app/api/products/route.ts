import { NextResponse } from "next/server"
import { productsDB } from "@/lib/db-local"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const sort = searchParams.get("sort") || "newest"

    let products = await productsDB.getAll()

    // Filtrage
    if (category) {
      products = products.filter((p: any) => p.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(
        (p: any) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
      )
    }

    if (minPrice !== undefined) {
      products = products.filter((p: any) => p.price >= minPrice)
    }

    if (maxPrice !== undefined) {
      products = products.filter((p: any) => p.price <= maxPrice)
    }

    // Tri
    switch (sort) {
      case "price_asc":
        products.sort((a: any, b: any) => a.price - b.price)
        break
      case "price_desc":
        products.sort((a: any, b: any) => b.price - a.price)
        break
      case "name_asc":
        products.sort((a: any, b: any) => a.name.localeCompare(b.name))
        break
      case "name_desc":
        products.sort((a: any, b: any) => b.name.localeCompare(a.name))
        break
      case "newest":
      default:
        products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    // Pagination
    const total = products.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedProducts = products.slice(offset, offset + limit)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const product = await productsDB.create({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images: data.images || [],
      sellerId: data.sellerId,
      published: data.published || true,
      featured: data.featured || false,
      inventory: data.inventory || 0,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 })
  }
}
