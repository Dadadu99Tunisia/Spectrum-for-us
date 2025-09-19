"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowUpDown } from "lucide-react"

interface ProductSortingProps {
  onSortChange?: (sortBy: string) => void
}

export function ProductSorting({ onSortChange }: ProductSortingProps) {
  const [selectedSort, setSelectedSort] = useState("featured")
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { value: "featured", label: "Mis en avant" },
    { value: "newest", label: "Plus récents" },
    { value: "price-low", label: "Prix croissant" },
    { value: "price-high", label: "Prix décroissant" },
    { value: "popular", label: "Plus populaires" },
    { value: "rating", label: "Mieux notés" },
  ]

  const handleSortChange = (sortValue: string) => {
    setSelectedSort(sortValue)
    setIsOpen(false)
    onSortChange?.(sortValue)
  }

  const selectedOption = sortOptions.find((option) => option.value === selectedSort)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Trier par: {selectedOption?.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors ${
                selectedSort === option.value ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
