"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, X } from "lucide-react"

export interface FilterOptions {
  categories?: string[]
  colors?: string[]
  sizes?: string[]
  brands?: string[]
  priceRange?: [number, number]
  inStock?: boolean
  onSale?: boolean
}

interface ProductFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  onClearFilters?: () => void
}

export function ProductFilters({ filters, onFilterChange, onClearFilters }: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    colors: true,
    sizes: true,
    brands: false,
    price: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const availableCategories = [
    { id: "vetements", name: "Vêtements" },
    { id: "accessoires", name: "Accessoires" },
    { id: "bijoux", name: "Bijoux" },
    { id: "maison", name: "Maison" },
    { id: "art", name: "Art" },
  ]

  const availableColors = [
    { id: "noir", name: "Noir", hex: "#000000" },
    { id: "blanc", name: "Blanc", hex: "#FFFFFF" },
    { id: "rouge", name: "Rouge", hex: "#FF0000" },
    { id: "bleu", name: "Bleu", hex: "#0000FF" },
    { id: "vert", name: "Vert", hex: "#00FF00" },
    { id: "rose", name: "Rose", hex: "#FFC0CB" },
  ]

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const availableBrands = [
    "Rainbow Creations",
    "Trans Essentials",
    "Bijoux Inclusifs",
    "Pride Fashion",
    "Spectrum Style",
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...(filters.categories || []), categoryId]
      : (filters.categories || []).filter((c) => c !== categoryId)

    onFilterChange({ ...filters, categories: newCategories })
  }

  const handleColorChange = (colorId: string, checked: boolean) => {
    const newColors = checked
      ? [...(filters.colors || []), colorId]
      : (filters.colors || []).filter((c) => c !== colorId)

    onFilterChange({ ...filters, colors: newColors })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked ? [...(filters.sizes || []), size] : (filters.sizes || []).filter((s) => s !== size)

    onFilterChange({ ...filters, sizes: newSizes })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...(filters.brands || []), brand] : (filters.brands || []).filter((b) => b !== brand)

    onFilterChange({ ...filters, brands: newBrands })
  }

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleStockChange = (checked: boolean) => {
    onFilterChange({ ...filters, inStock: checked })
  }

  const handleSaleChange = (checked: boolean) => {
    onFilterChange({ ...filters, onSale: checked })
  }

  const activeFilterCount =
    (filters.categories?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.sizes?.length || 0) +
    (filters.brands?.length || 0) +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtres</h2>
        {activeFilterCount > 0 && onClearFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 px-2 lg:px-3">
            Effacer tout ({activeFilterCount})
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Categories */}
      <Collapsible open={openSections.categories} onOpenChange={() => toggleSection("categories")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Catégories</span>
          {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {availableCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories?.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible open={openSections.colors} onOpenChange={() => toggleSection("colors")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Couleurs</span>
          {openSections.colors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {availableColors.map((color) => (
            <div key={color.id} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.id}`}
                checked={filters.colors?.includes(color.id)}
                onCheckedChange={(checked) => handleColorChange(color.id, checked as boolean)}
              />
              <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.hex }} />
              <Label htmlFor={`color-${color.id}`} className="text-sm font-normal cursor-pointer">
                {color.name}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Sizes */}
      <Collapsible open={openSections.sizes} onOpenChange={() => toggleSection("sizes")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Tailles</span>
          {openSections.sizes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={filters.sizes?.includes(size)}
                  onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                />
                <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Brands */}
      <Collapsible open={openSections.brands} onOpenChange={() => toggleSection("brands")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Marques</span>
          {openSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands?.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Prix</span>
          {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <Slider
            min={0}
            max={200}
            step={5}
            value={filters.priceRange || [0, 200]}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{filters.priceRange?.[0] || 0}€</span>
            <span>{filters.priceRange?.[1] || 200}€</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Filters */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="in-stock" checked={filters.inStock} onCheckedChange={handleStockChange} />
          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            En stock uniquement
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="on-sale" checked={filters.onSale} onCheckedChange={handleSaleChange} />
          <Label htmlFor="on-sale" className="text-sm font-normal cursor-pointer">
            En promotion
          </Label>
        </div>
      </div>
    </div>
  )
}
