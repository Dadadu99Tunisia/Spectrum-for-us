"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Check } from "lucide-react"

interface ProductSortingProps {
  sortBy?: string
  onSortChange?: (sortBy: string) => void
}

interface SortOption {
  value: string
  label: string
  description?: string
}

export function ProductSorting({ sortBy: initialSort = "newest", onSortChange }: ProductSortingProps) {
  const [currentSort, setCurrentSort] = useState<string>(initialSort)

  const sortOptions: SortOption[] = [
    { value: "newest", label: "Plus récents", description: "Nouveautés en premier" },
    { value: "oldest", label: "Plus anciens", description: "Anciens produits en premier" },
    { value: "price_low", label: "Prix croissant", description: "Du moins cher au plus cher" },
    { value: "price_high", label: "Prix décroissant", description: "Du plus cher au moins cher" },
    { value: "name_asc", label: "Nom A-Z", description: "Ordre alphabétique" },
    { value: "name_desc", label: "Nom Z-A", description: "Ordre alphabétique inverse" },
    { value: "popular", label: "Plus populaires", description: "Les plus vendus" },
    { value: "rating", label: "Mieux notés", description: "Meilleures notes" },
  ]

  const handleSortChange = (sortValue: string) => {
    setCurrentSort(sortValue)
    if (onSortChange) {
      onSortChange(sortValue)
    }
  }

  const currentSortOption = sortOptions.find((option) => option.value === currentSort)
  const currentSortLabel = currentSortOption?.label || "Trier par"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[180px] justify-between bg-white hover:bg-gray-50">
          <span className="text-sm">{currentSortLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        {sortOptions.map((option, index) => (
          <div key={option.value}>
            <DropdownMenuItem
              onClick={() => handleSortChange(option.value)}
              className={`cursor-pointer ${currentSort === option.value ? "bg-accent" : ""}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  {option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}
                </div>
                {currentSort === option.value && <Check className="h-4 w-4 ml-2" />}
              </div>
            </DropdownMenuItem>
            {index === 1 && <DropdownMenuSeparator />}
            {index === 3 && <DropdownMenuSeparator />}
            {index === 5 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
