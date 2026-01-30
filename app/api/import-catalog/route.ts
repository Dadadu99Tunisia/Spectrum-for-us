import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch the CSV catalog
    const catalogUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Catalogue_SpectrumForUs_Complet_2025-RO9qnl23uh57oqJ1iH3KKex1n9iMO7.csv"
    const response = await fetch(catalogUrl)
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const products = []
    const services = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })

      const priceMatch = row["Prix suggéré"]?.match(/(\d+(?:[.,]\d+)?)/)
      const price = priceMatch ? Number.parseFloat(priceMatch[1].replace(",", ".")) : 0

      const item = {
        name: row["Nom"],
        description: row["Description"],
        price: price,
        currency: "EUR",
        category: row["Catégorie"],
        vendor_id: user.id, // Use current admin as vendor for now
        image_url: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(row["Nom"])}`,
        stock: 100,
      }

      if (row["Type (produit/service)"]?.toLowerCase().includes("produit")) {
        products.push(item)
      } else {
        services.push(item)
      }
    }

    // Insert products
    if (products.length > 0) {
      const { error: productsError } = await supabase.from("products").insert(products)

      if (productsError) {
        console.error("Error inserting products:", productsError)
        return NextResponse.json({ error: "Failed to insert products", details: productsError }, { status: 500 })
      }
    }

    // Insert services
    if (services.length > 0) {
      const { error: servicesError } = await supabase.from("services").insert(services)

      if (servicesError) {
        console.error("Error inserting services:", servicesError)
        return NextResponse.json({ error: "Failed to insert services", details: servicesError }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      imported: {
        products: products.length,
        services: services.length,
      },
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Import failed", details: error }, { status: 500 })
  }
}
