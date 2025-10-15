"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "vetements", label: "Vêtements", count: 120 },
  { id: "bijoux", label: "Bijoux", count: 85 },
  { id: "art", label: "Art", count: 64 },
  { id: "beaute", label: "Beauté", count: 42 },
  { id: "decoration", label: "Décoration", count: 56 },
  { id: "livres", label: "Livres", count: 38 },
  { id: "accessoires", label: "Accessoires", count: 72 },
  { id: "artisanat", label: "Artisanat", count: 45 },
]

const sellers = [
  { id: "seller1", label: "QueerApparel", count: 45 },
  { id: "seller2", label: "PrideJewelry", count: 32 },
  { id: "seller3", label: "QueerArtists", count: 28 },
  { id: "seller4", label: "InclusiveBeauty", count: 18 },
  { id: "seller5", label: "PrideFlagShop", count: 24 },
]

export default function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 200])
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setPriceRange([0, 200])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filtres</h3>

        {activeFilters.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <button className="ml-1 hover:text-destructive" onClick={() => removeFilter(filter)}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={clearAllFilters}>
              Effacer Tout
            </Button>
          </div>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "sellers"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Catégories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={activeFilters.includes(category.label)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addFilter(category.label)
                      } else {
                        removeFilter(category.label)
                      }
                    }}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer flex-1">
                    {category.label}
                  </Label>
                  <span className="text-xs text-muted-foreground">({category.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Prix</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 200]} max={200} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span className="text-sm">{priceRange[0]} €</span>
                <span className="text-sm">{priceRange[1]} €</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const priceFilter = `${priceRange[0]}€ - ${priceRange[1]}€`
                  const existingPriceFilter = activeFilters.find((f) => f.includes("€"))

                  if (existingPriceFilter) {
                    removeFilter(existingPriceFilter)
                  }

                  if (priceRange[0] > 0 || priceRange[1] < 200) {
                    addFilter(priceFilter)
                  }
                }}
              >
                Appliquer
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sellers">
          <AccordionTrigger>Vendeurs</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sellers.map((seller) => (
                <div key={seller.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`seller-${seller.id}`}
                    checked={activeFilters.includes(seller.label)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addFilter(seller.label)
                      } else {
                        removeFilter(seller.label)
                      }
                    }}
                  />
                  <Label htmlFor={`seller-${seller.id}`} className="text-sm font-normal cursor-pointer flex-1">
                    {seller.label}
                  </Label>
                  <span className="text-xs text-muted-foreground">({seller.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
