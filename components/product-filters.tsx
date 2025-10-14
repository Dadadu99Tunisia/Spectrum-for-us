"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

// Catégories simplifiées
const filterCategories = [
  { id: "vetements", name: "Vêtements", count: 42 },
  { id: "accessoires", name: "Accessoires", count: 38 },
  { id: "bijoux", name: "Bijoux", count: 24 },
  { id: "maison", name: "Maison", count: 18 },
  { id: "beaute", name: "Beauté", count: 15 },
]

// Tags simplifiés
const filterTags = [
  { id: "inclusif", name: "Inclusif", count: 65 },
  { id: "non-genre", name: "Non genré", count: 42 },
  { id: "queer", name: "Queer", count: 38 },
  { id: "fait-main", name: "Fait main", count: 27 },
  { id: "ethique", name: "Éthique", count: 31 },
]

export default function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tagId])
    } else {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    }
  }

  const applyFilters = () => {
    console.log("Filtres appliqués:", {
      priceRange,
      selectedCategories,
      selectedTags,
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Filtres</h3>

      <Accordion type="multiple" defaultValue={["categories", "price", "tags"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Catégories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filterCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer flex-1">
                    {category.name}
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
              <Slider defaultValue={[0, 100]} max={100} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span className="text-sm">{priceRange[0]} €</span>
                <span className="text-sm">{priceRange[1]} €</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filterTags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={(checked) => handleTagChange(tag.id, checked === true)}
                  />
                  <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal cursor-pointer flex-1">
                    {tag.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">({tag.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={applyFilters} className="w-full">
        Appliquer les filtres
      </Button>
    </div>
  )
}
