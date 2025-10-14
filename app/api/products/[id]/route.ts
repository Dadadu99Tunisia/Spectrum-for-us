// GET /api/products/[id] - Récupérer un produit par son ID
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     const product = await prisma.product.findUnique({
//       where: { id },
//       include: {
//         seller: {
//           select: {
//             id: true,
//             storeName: true,
//             logo: true,
//             verified: true,
//             rating: true,
//             reviewCount: true,
//           },
//         },
//         images: {
//           orderBy: {
//             position: "asc",
//           },
//         },
//         categories: {
//           include: {
//             category: true,
//           },
//         },
//         variants: {
//           include: {
//             options: true,
//           },
//         },
//         attributes: true,
//         reviews: {
//           where: {
//             published: true,
//           },
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 image: true,
//               },
//             },
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//           take: 5,
//         },
//       },
//     })

//     if (!product) {
//       return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
//     }

//     // Vérifier si le produit est dans les favoris de l'utilisateur
//     const session = await getServerSession(authOptions)
//     let isFavorite = false

//     if (session) {
//       const favorite = await prisma.favorite.findUnique({
//         where: {
//           userId_productId: {
//             userId: session.user.id,
//             productId: id,
//           },
//         },
//       })

//       isFavorite = !!favorite
//     }

//     return NextResponse.json({
//       ...product,
//       isFavorite,
//     })
//   } catch (error) {
//     console.error("Erreur lors de la récupération du produit:", error)
//     return NextResponse.json({ error: "Une erreur est survenue lors de la récupération du produit" }, { status: 500 })
//   }
// }

import { NextResponse as NextResp } from "next/server"

export async function GET(request, { params }) {
  // Version simplifiée pour le déploiement
  return NextResp.json({
    id: params.id,
    name: "Produit exemple",
    description: "Description du produit exemple",
    price: 29.99,
    seller: {
      id: "seller-1",
      storeName: "Boutique Exemple",
      logo: "/placeholder.svg?height=100&width=100",
      verified: true,
      rating: 4.5,
      reviewCount: 120,
    },
    images: [
      {
        url: "/placeholder.svg?height=400&width=400",
        alt: "Image produit exemple",
        position: 0,
      },
    ],
    categories: [
      {
        category: {
          id: "cat-1",
          name: "Catégorie Exemple",
        },
      },
    ],
    isFavorite: false,
  })
}

// PUT /api/products/[id] - Mettre à jour un produit (réservé au vendeur du produit)
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     // Vérifier l'authentification
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return NextResponse.json({ error: "Vous devez être connecté pour modifier un produit" }, { status: 401 })
//     }

//     // Récupérer le produit
//     const product = await prisma.product.findUnique({
//       where: { id },
//       include: {
//         seller: true,
//       },
//     })

//     if (!product) {
//       return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
//     }

//     // Vérifier si l'utilisateur est le vendeur du produit
//     if (product.seller.userId !== session.user.id) {
//       return NextResponse.json({ error: "Vous n'êtes pas autorisé à modifier ce produit" }, { status: 403 })
//     }

//     // Récupérer les données du produit
//     const data = await request.json()

//     // Mettre à jour le produit
//     const updatedProduct = await prisma.product.update({
//       where: { id },
//       data: {
//         name: data.name,
//         description: data.description,
//         price: data.price,
//         compareAtPrice: data.compareAtPrice,
//         quantity: data.quantity,
//         sku: data.sku,
//         published: data.published,
//         // Autres champs à mettre à jour
//       },
//     })

//     return NextResponse.json(updatedProduct)
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour du produit:", error)
//     return NextResponse.json({ error: "Une erreur est survenue lors de la mise à jour du produit" }, { status: 500 })
//   }
// }

export async function PUT() {
  return NextResp.json({ success: true, message: "Mise à jour simulée" })
}

// DELETE /api/products/[id] - Supprimer un produit (réservé au vendeur du produit)
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     // Vérifier l'authentification
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return NextResponse.json({ error: "Vous devez être connecté pour supprimer un produit" }, { status: 401 })
//     }

//     // Récupérer le produit
//     const product = await prisma.product.findUnique({
//       where: { id },
//       include: {
//         seller: true,
//       },
//     })

//     if (!product) {
//       return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
//     }

//     // Vérifier si l'utilisateur est le vendeur du produit
//     if (product.seller.userId !== session.user.id) {
//       return NextResponse.json({ error: "Vous n'êtes pas autorisé à supprimer ce produit" }, { status: 403 })
//     }

//     // Supprimer le produit
//     await prisma.product.delete({
//       where: { id },
//     })

//     return NextResponse.json({ message: "Produit supprimé avec succès" }, { status: 200 })
//   } catch (error) {
//     console.error("Erreur lors de la suppression du produit:", error)
//     return NextResponse.json({ error: "Une erreur est survenue lors de la suppression du produit" }, { status: 500 })
//   }
// }

export async function DELETE() {
  return NextResp.json({ success: true, message: "Suppression simulée" })
}

