"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface ProductFiltersProps {
  filters?: {
    priceRange: number[]
    colors: string[]
    sizes: string[]
    brands: string[]
  }
  onFiltersChange?: (filters: any) => void
}

export function ProductFilters({ filters: initialFilters, onFiltersChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || [0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>(initialFilters?.colors || [])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialFilters?.sizes || [])

  const categories = ["Vêtements", "Bijoux", "Art", "Maison", "Beauté", "Accessoires", "Livres", "Électronique"]

  const colors = ["Rouge", "Bleu", "Vert", "Jaune", "Rose", "Violet", "Orange", "Noir", "Blanc", "Arc-en-ciel"]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, color])
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    }
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size])
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    }
  }

  const clearFilters = () => {
    setPriceRange([0, 100])
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedSizes([])
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Filtres
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Effacer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prix */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Prix (€)</Label>
          <Slider value={priceRange} onValueChange={setPriceRange} max={200} step={5} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>

        {/* Catégories */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <Label className="text-sm font-medium">Catégories</Label>
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
                <Label htmlFor={category} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Couleurs */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <Label className="text-sm font-medium">Couleurs</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {colors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={color}
                  checked={selectedColors.includes(color)}
                  onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                />
                <Label htmlFor={color} className="text-sm">
                  {color}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Tailles */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <Label className="text-sm font-medium">Tailles</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={size}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                />
                <Label htmlFor={size} className="text-sm">
                  {size}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Button
          className="w-full"
          onClick={() =>
            onFiltersChange?.({
              priceRange,
              categories: selectedCategories,
              colors: selectedColors,
              sizes: selectedSizes,
            })
          }
        >
          Appliquer les filtres
        </Button>
      </CardContent>
    </Card>
  )
}
