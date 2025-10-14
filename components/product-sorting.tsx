"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface ProductSortingProps {
  sortBy?: string
  onSortChange?: (sortBy: string) => void
}

export function ProductSorting({ sortBy: initialSort, onSortChange }: ProductSortingProps) {
  const [currentSort, setCurrentSort] = useState(initialSort || "newest")

  const sortOptions = [
    { value: "newest", label: "Plus récents" },
    { value: "oldest", label: "Plus anciens" },
    { value: "price_low", label: "Prix croissant" },
    { value: "price_high", label: "Prix décroissant" },
    { value: "name_asc", label: "Nom A-Z" },
    { value: "name_desc", label: "Nom Z-A" },
    { value: "popular", label: "Plus populaires" },
    { value: "rating", label: "Mieux notés" },
  ]

  const handleSortChange = (sortValue: string) => {
    setCurrentSort(sortValue)
    onSortChange?.(sortValue)
  }

  const currentSortLabel = sortOptions.find((option) => option.value === currentSort)?.label || "Trier par"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[150px] justify-between bg-transparent">
          {currentSortLabel}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={currentSort === option.value ? "bg-accent" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
