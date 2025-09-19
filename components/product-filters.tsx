"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Filter, X } from "lucide-react"

interface ProductFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const categories = ["Mode", "Beauté", "Maison", "Art", "Accessoires", "Électronique"]

  const colors = [
    { name: "Rouge", value: "red", color: "bg-red-500" },
    { name: "Bleu", value: "blue", color: "bg-blue-500" },
    { name: "Vert", value: "green", color: "bg-green-500" },
    { name: "Noir", value: "black", color: "bg-black" },
    { name: "Blanc", value: "white", color: "bg-white border" },
    { name: "Rose", value: "pink", color: "bg-pink-500" },
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category)
    setSelectedCategories(updated)
    onFiltersChange?.({
      categories: updated,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange,
    })
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const updated = checked ? [...selectedColors, color] : selectedColors.filter((c) => c !== color)
    setSelectedColors(updated)
    onFiltersChange?.({
      categories: selectedCategories,
      colors: updated,
      sizes: selectedSizes,
      priceRange,
    })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const updated = checked ? [...selectedSizes, size] : selectedSizes.filter((s) => s !== size)
    setSelectedSizes(updated)
    onFiltersChange?.({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: updated,
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

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prix */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Prix</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{priceRange[0]}€</span>
              <span>{priceRange[1]}€</span>
            </div>
          </div>
        </div>

        {/* Catégories */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <Label className="text-sm font-medium">Catégories</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Couleurs */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <Label className="text-sm font-medium">Couleurs</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {colors.map((color) => (
              <div key={color.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color.value}`}
                  checked={selectedColors.includes(color.value)}
                  onCheckedChange={(checked) => handleColorChange(color.value, checked as boolean)}
                />
                <Label
                  htmlFor={`color-${color.value}`}
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <div className={`w-4 h-4 rounded-full ${color.color}`} />
                  {color.name}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Tailles */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <Label className="text-sm font-medium">Tailles</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="grid grid-cols-3 gap-2 mt-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                />
                <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
