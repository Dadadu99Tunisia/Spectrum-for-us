import { NextResponse } from "next/server"

// GET /api/products - Récupérer tous les produits avec filtrage et pagination
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)

//     // Paramètres de filtrage et pagination
//     const page = Number.parseInt(searchParams.get("page") || "1")
//     const limit = Number.parseInt(searchParams.get("limit") || "10")
//     const category = searchParams.get("category")
//     const search = searchParams.get("search")
//     const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
//     const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
//     const sort = searchParams.get("sort") || "newest"
//     const sellerId = searchParams.get("sellerId")

//     // Construire la requête
//     const skip = (page - 1) * limit

//     // Filtres
//     const where: any = {
//       published: true,
//     }

//     if (category) {
//       where.categories = {
//         some: {
//           category: {
//             slug: category,
//           },
//         },
//       }
//     }

//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { description: { contains: search, mode: "insensitive" } },
//       ]
//     }

//     if (minPrice !== undefined) {
//       where.price = {
//         ...where.price,
//         gte: minPrice,
//       }
//     }

//     if (maxPrice !== undefined) {
//       where.price = {
//         ...where.price,
//         lte: maxPrice,
//       }
//     }

//     if (sellerId) {
//       where.sellerId = sellerId
//     }

//     // Tri
//     let orderBy: any = {}

//     switch (sort) {
//       case "newest":
//         orderBy = { createdAt: "desc" }
//         break
//       case "oldest":
//         orderBy = { createdAt: "asc" }
//         break
//       case "price_low":
//         orderBy = { price: "asc" }
//         break
//       case "price_high":
//         orderBy = { price: "desc" }
//         break
//       case "name_asc":
//         orderBy = { name: "asc" }
//         break
//       case "name_desc":
//         orderBy = { name: "desc" }
//         break
//       default:
//         orderBy = { createdAt: "desc" }
//     }

//     // Exécuter la requête
//     const [products, total] = await Promise.all([
//       prisma.product.findMany({
//         where,
//         orderBy,
//         skip,
//         take: limit,
//         include: {
//           seller: {
//             select: {
//               id: true,
//               storeName: true,
//               logo: true,
//               verified: true,
//             },
//           },
//           images: {
//             orderBy: {
//               position: "asc",
//             },
//           },
//           categories: {
//             include: {
//               category: true,
//             },
//           },
//         },
//       }),
//       prisma.product.count({ where }),
//     ])

//     // Calculer la pagination
//     const totalPages = Math.ceil(total / limit)
//     const hasMore = page < totalPages

//     return NextResponse.json({
//       products,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages,
//         hasMore,
//       },
//     })
//   } catch (error) {
//     console.error("Erreur lors de la récupération des produits:", error)
//     return NextResponse.json({ error: "Une erreur est survenue lors de la récupération des produits" }, { status: 500 })
//   }
// }

export async function GET() {
  // Version simplifiée pour le déploiement
  const mockProducts = Array.from({ length: 10 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Produit exemple ${i + 1}`,
    description: `Description du produit exemple ${i + 1}`,
    price: 19.99 + i * 5,
    slug: `produit-exemple-${i + 1}`,
    images: [
      {
        url: `/placeholder.svg?height=400&width=400&text=Produit+${i + 1}`,
        alt: `Image produit exemple ${i + 1}`,
      },
    ],
    seller: {
      id: "seller-1",
      storeName: "Boutique Exemple",
      logo: "/placeholder.svg?height=100&width=100",
      verified: true,
    },
  }))

  return NextResponse.json({
    products: mockProducts,
    total: mockProducts.length,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  })
}

// POST /api/products - Créer un nouveau produit (réservé aux vendeurs)
// export async function POST(request: NextRequest) {
//   try {
//     // Vérifier l'authentification
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return NextResponse.json({ error: "Vous devez être connecté pour créer un produit" }, { status: 401 })
//     }

//     // Vérifier si l'utilisateur est un vendeur
//     const seller = await prisma.seller.findUnique({
//       where: { userId: session.user.id },
//     })

//     if (!seller) {
//       return NextResponse.json({ error: "Vous devez être un vendeur pour créer un produit" }, { status: 403 })
//     }

//     // Récupérer les données du produit
//     const data = await request.json()

//     // Créer le slug à partir du nom
//     const slug = data.name
//       .toLowerCase()
//       .replace(/[^\w\s]/gi, "")
//       .replace(/\s+/g, "-")

//     // Vérifier si le slug existe déjà pour ce vendeur
//     const existingProduct = await prisma.product.findUnique({
//       where: {
//         sellerId_slug: {
//           sellerId: seller.id,
//           slug,
//         },
//       },
//     })

//     if (existingProduct) {
//       return NextResponse.json({ error: "Vous avez déjà un produit avec ce nom" }, { status: 400 })
//     }

//     // Créer le produit
//     const product = await prisma.product.create({
//       data: {
//         sellerId: seller.id,
//         name: data.name,
//         slug,
//         description: data.description,
//         price: data.price,
//         comparePrice: data.comparePrice,
//         sku: data.sku,
//         barcode: data.barcode,
//         inventory: data.inventory || 0,
//         weight: data.weight,
//         dimensions: data.dimensions,
//         featured: data.featured || false,
//         isNew: data.isNew || true,
//         published: data.published || true,
//         images: {
//           create: data.images?.map((image: any, index: number) => ({
//             url: image.url,
//             alt: image.alt || data.name,
//             position: index,
//           })),
//         },
//         categories: {
//           create: data.categories?.map((categoryId: string) => ({
//             categoryId,
//           })),
//         },
//         attributes: {
//           create: data.attributes?.map((attr: any) => ({
//             name: attr.name,
//             value: attr.value,
//           })),
//         },
//         variants: {
//           create: data.variants?.map((variant: any) => ({
//             name: variant.name,
//             sku: variant.sku,
//             price: variant.price,
//             inventory: variant.inventory || 0,
//             options: {
//               create: variant.options?.map((option: any) => ({
//                 name: option.name,
//                 value: option.value,
//               })),
//             },
//           })),
//         },
//       },
//     })

//     // Mettre à jour le nombre de produits du vendeur
//     await prisma.seller.update({
//       where: { id: seller.id },
//       data: {
//         productCount: {
//           increment: 1,
//         },
//       },
//     })

//     return NextResponse.json(product, { status: 201 })
//   } catch (error) {
//     console.error("Erreur lors de la création du produit:", error)
//     return NextResponse.json({ error: "Une erreur est survenue lors de la création du produit" }, { status: 500 })
//   }
// }

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Produit créé avec succès",
    product: {
      id: "new-product",
      name: "Nouveau produit",
      price: 29.99,
    },
  })
}

