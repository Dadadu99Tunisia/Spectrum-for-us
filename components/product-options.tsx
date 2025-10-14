"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ProductOptionsProps {
  colors?: string[]
  sizes?: string[]
  onColorChange?: (color: string) => void
  onSizeChange?: (size: string) => void
}

export default function ProductOptions({ colors = [], sizes = [], onColorChange, onSizeChange }: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length > 0 ? colors[0] : null)
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length > 0 ? sizes[0] : null)

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    if (onColorChange) onColorChange(color)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    if (onSizeChange) onSizeChange(size)
  }

  return (
    <div className="space-y-6">
      {colors.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Couleur</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                className={`rounded-md px-4 ${selectedColor === color ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                onClick={() => handleColorSelect(color)}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Taille</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className={`min-w-[3rem] ${selectedSize === size ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
