"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check, ChevronDown } from "lucide-react"

export type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "popular"

interface SortOptionData {
  value: SortOption
  label: string
  description: string
}

const sortOptions: SortOptionData[] = [
  {
    value: "newest",
    label: "Plus récents",
    description: "Trier par date d'ajout (du plus récent au plus ancien)",
  },
  {
    value: "popular",
    label: "Plus populaires",
    description: "Trier par nombre de ventes et avis",
  },
  {
    value: "price-asc",
    label: "Prix croissant",
    description: "Trier par prix (du moins cher au plus cher)",
  },
  {
    value: "price-desc",
    label: "Prix décroissant",
    description: "Trier par prix (du plus cher au moins cher)",
  },
  {
    value: "name-asc",
    label: "Nom A-Z",
    description: "Trier par nom (ordre alphabétique)",
  },
  {
    value: "name-desc",
    label: "Nom Z-A",
    description: "Trier par nom (ordre inverse)",
  },
]

interface ProductSortingProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export function ProductSorting({ currentSort, onSortChange }: ProductSortingProps) {
  const currentOption = sortOptions.find((option) => option.value === currentSort)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
          <span className="mr-2">Trier par:</span>
          <span className="font-semibold">{currentOption?.label}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className="flex flex-col items-start cursor-pointer py-3"
          >
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">{option.label}</span>
              {currentSort === option.value && <Check className="h-4 w-4 text-primary" />}
            </div>
            <span className="text-xs text-muted-foreground mt-1">{option.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
