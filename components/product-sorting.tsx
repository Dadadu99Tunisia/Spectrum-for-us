"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductSortingProps {
  sortBy: string
  onSortChange: (v: string) => void
}

export function ProductSorting({ sortBy, onSortChange }: ProductSortingProps) {
  return (
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Trier" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Nouveautés</SelectItem>
        <SelectItem value="priceAsc">Prix ↑</SelectItem>
        <SelectItem value="priceDesc">Prix ↓</SelectItem>
      </SelectContent>
    </Select>
  )
}
