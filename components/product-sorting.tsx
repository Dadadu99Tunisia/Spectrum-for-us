"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductSortingProps {
  sortBy: string
  onSortChange: (value: string) => void
}

export function ProductSorting({ sortBy, onSortChange }: ProductSortingProps) {
  return (
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Plus récent</SelectItem>
        <SelectItem value="oldest">Plus ancien</SelectItem>
        <SelectItem value="price-low">Prix croissant</SelectItem>
        <SelectItem value="price-high">Prix décroissant</SelectItem>
        <SelectItem value="name">Nom A-Z</SelectItem>
        <SelectItem value="rating">Mieux noté</SelectItem>
        <SelectItem value="popular">Popularité</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default ProductSorting
