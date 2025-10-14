"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface FilterOptions {
  priceRange: number[]
  colors: string[]
  sizes: string[]
  brands: string[]
  inclusive?: boolean
}

interface ProductFiltersProps {
  filters?: FilterOptions
  onFiltersChange?: (filters: FilterOptions) => void
}

export function ProductFilters({ filters: initialFilters, onFiltersChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>(initialFilters?.priceRange || [0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>(initialFilters?.colors || [])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialFilters?.sizes || [])
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters?.brands || [])

  const categories = ["Vêtements", "Bijoux", "Art", "Maison", "Beauté", "Accessoires", "Livres", "Électronique"]

  const colors = ["Rouge", "Bleu", "Vert", "Jaune", "Rose", "Violet", "Orange", "Noir", "Blanc", "Arc-en-ciel"]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Unique"]

  const brands = [
    "Pride Collection",
    "Rainbow Fashion",
    "Inclusive Wear",
    "Queer Art Co",
    "Spectrum Style",
    "Unity Designs",
  ]

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category)
    setSelectedCategories(newCategories)
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked ? [...selectedColors, color] : selectedColors.filter((c) => c !== color)
    setSelectedColors(newColors)
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked ? [...selectedSizes, size] : selectedSizes.filter((s) => s !== size)
    setSelectedSizes(newSizes)
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...selectedBrands, brand] : selectedBrands.filter((b) => b !== brand)
    setSelectedBrands(newBrands)
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedBrands([])
    onFiltersChange?.({
      priceRange: [0, 1000],
      colors: [],
      sizes: [],
      brands: [],
    })
  }

  const applyFilters = () => {
    onFiltersChange?.({
      priceRange,
      colors: selectedColors,
      sizes: selectedSizes,
      brands: selectedBrands,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Filtres</span>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
            Effacer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prix */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Prix (€)</Label>
          <Slider value={priceRange} onValueChange={setPriceRange} max={1000} min={0} step={10} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>

        {/* Catégories */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
            <Label className="text-sm font-medium cursor-pointer">Catégories</Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2 px-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Couleurs */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
            <Label className="text-sm font-medium cursor-pointer">Couleurs</Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {colors.map((color) => (
              <div key={color} className="flex items-center space-x-2 px-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={selectedColors.includes(color)}
                  onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                />
                <Label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                  {color}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Tailles */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
            <Label className="text-sm font-medium cursor-pointer">Tailles</Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2 px-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                />
                <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Marques */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
            <Label className="text-sm font-medium cursor-pointer">Marques</Label>
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2 px-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Button className="w-full" onClick={applyFilters}>
          Appliquer les filtres
        </Button>
      </CardContent>
    </Card>
  )
}
