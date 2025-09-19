"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface ProductFiltersProps {
  filters: {
    priceRange: number[]
    colors: string[]
    sizes: string[]
    brands: string[]
  }
  onFiltersChange: (filters: any) => void
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const colors = ["Rouge", "Bleu", "Vert", "Noir", "Blanc", "Rose", "Violet"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const brands = ["Calvin Klein", "Pride Collection", "Spectrum", "Inclusive"]

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked ? [...localFilters.colors, color] : localFilters.colors.filter((c) => c !== color)
    const newFilters = { ...localFilters, colors: newColors }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={localFilters.priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{localFilters.priceRange[0]}€</span>
              <span>{localFilters.priceRange[1]}€</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Couleurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {colors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={color}
                  checked={localFilters.colors.includes(color)}
                  onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                />
                <Label htmlFor={color}>{color}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tailles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={localFilters.sizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newSizes = localFilters.sizes.includes(size)
                    ? localFilters.sizes.filter((s) => s !== size)
                    : [...localFilters.sizes, size]
                  const newFilters = { ...localFilters, sizes: newSizes }
                  setLocalFilters(newFilters)
                  onFiltersChange(newFilters)
                }}
              >
                {size}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductFilters
