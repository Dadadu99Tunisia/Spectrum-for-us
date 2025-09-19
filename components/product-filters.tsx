"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Filter } from "lucide-react"

interface ProductFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])

  const categories = ["Mode", "Beauté", "Maison", "Art", "Accessoires", "Électronique"]

  const colors = [
    { name: "Noir", value: "black", color: "#000000" },
    { name: "Blanc", value: "white", color: "#FFFFFF" },
    { name: "Rouge", value: "red", color: "#EF4444" },
    { name: "Bleu", value: "blue", color: "#3B82F6" },
    { name: "Vert", value: "green", color: "#10B981" },
    { name: "Rose", value: "pink", color: "#EC4899" },
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category)
    setSelectedCategories(newCategories)
    onFiltersChange?.({
      categories: newCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange,
    })
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked ? [...selectedColors, color] : selectedColors.filter((c) => c !== color)
    setSelectedColors(newColors)
    onFiltersChange?.({
      categories: selectedCategories,
      colors: newColors,
      sizes: selectedSizes,
      priceRange,
    })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked ? [...selectedSizes, size] : selectedSizes.filter((s) => s !== size)
    setSelectedSizes(newSizes)
    onFiltersChange?.({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: newSizes,
      priceRange,
    })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange?.({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange: value,
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedSizes([])
    setPriceRange([0, 1000])
    onFiltersChange?.({
      categories: [],
      colors: [],
      sizes: [],
      priceRange: [0, 1000],
    })
  }

  return (
    <div className="w-full max-w-sm space-y-6 p-4 border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Effacer
        </Button>
      </div>

      {/* Prix */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Prix</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{priceRange[0]}€</span>
              <span>{priceRange[1]}€</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Catégories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Catégories</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Couleurs */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Couleurs</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          {colors.map((color) => (
            <div key={color.value} className="flex items-center space-x-2">
              <Checkbox
                id={color.value}
                checked={selectedColors.includes(color.value)}
                onCheckedChange={(checked) => handleColorChange(color.value, checked as boolean)}
              />
              <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color.color }} />
              <Label htmlFor={color.value} className="text-sm font-normal">
                {color.name}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Tailles */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Tailles</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={size}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
              />
              <Label htmlFor={size} className="text-sm font-normal">
                {size}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
