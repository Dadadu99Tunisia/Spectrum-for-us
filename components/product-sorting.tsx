"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowUpDown } from "lucide-react"

interface ProductSortingProps {
  onSortChange?: (sortBy: string) => void
  defaultValue?: string
}

export function ProductSorting({ onSortChange, defaultValue = "featured" }: ProductSortingProps) {
  const sortOptions = [
    { value: "featured", label: "Mis en avant" },
    { value: "newest", label: "Plus récents" },
    { value: "price-low", label: "Prix croissant" },
    { value: "price-high", label: "Prix décroissant" },
    { value: "name-asc", label: "Nom A-Z" },
    { value: "name-desc", label: "Nom Z-A" },
    { value: "rating", label: "Mieux notés" },
    { value: "popularity", label: "Plus populaires" },
  ]

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Label htmlFor="sort-select" className="text-sm font-medium whitespace-nowrap">
        Trier par:
      </Label>
      <Select defaultValue={defaultValue} onValueChange={onSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          <SelectValue placeholder="Choisir un tri" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
