"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Review } from "@/lib/data/products"

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
}

export default function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Calculer les statistiques des avis
  const averageRating =
    reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0

  const ratingCounts = [0, 0, 0, 0, 0] // Pour les étoiles 5, 4, 3, 2, 1
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++
    }
  })

  const ratingPercentages = ratingCounts.map((count) => (reviews.length > 0 ? (count / reviews.length) * 100 : 0))

  return (
    <div>
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Aucun avis pour le moment</h3>
          <p className="text-muted-foreground mb-4">Soyez le premier à donner votre avis sur ce produit !</p>
          <Button onClick={() => setShowReviewForm(true)}>Rédiger un avis</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Résumé des avis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Basé sur {reviews.length} avis</p>
                </div>
              </div>

              <div className="space-y-2">
                {ratingCounts.map((count, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-12 text-sm text-right">{5 - index} étoiles</div>
                    <Progress value={ratingPercentages[index]} className="h-2 w-full max-w-[200px]" />
                    <div className="text-sm text-muted-foreground w-10">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="mb-4">
                Partagez votre expérience avec ce produit et aidez d'autres clients à faire leur choix.
              </p>
              <Button onClick={() => setShowReviewForm(true)}>Rédiger un avis</Button>
            </div>
          </div>

          {/* Formulaire d'avis */}
          {showReviewForm && (
            <div className="border p-4 rounded-lg mb-8">
              <h3 className="font-medium mb-4">Votre avis</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-2">Note</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Button key={i} variant="outline" size="icon" className="h-8 w-8">
                        <Star className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2">Commentaire</p>
                  <Textarea placeholder="Partagez votre expérience avec ce produit..." />
                </div>
                <div className="flex gap-2">
                  <Button>Soumettre</Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Liste des avis */}
          <div className="space-y-6">
            <h3 className="font-medium">Avis des clients</h3>

            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.userName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mb-4">{review.comment}</p>

                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    Utile
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Répondre
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
