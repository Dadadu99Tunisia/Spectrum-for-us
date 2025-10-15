"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Grid2X2, LayoutGrid, List } from "lucide-react"

export default function ProductSorting() {
  const [viewMode, setViewMode] = useState<"grid" | "large-grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("featured")

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">16 produits</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid2X2 className="h-4 w-4" />
            <span className="sr-only">Vue grille</span>
          </Button>
          <Button
            variant={viewMode === "large-grid" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("large-grid")}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Vue grille large</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Vue liste</span>
          </Button>
        </div>

        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">En vedette</SelectItem>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="price-low">Prix: Croissant</SelectItem>
            <SelectItem value="price-high">Prix: Décroissant</SelectItem>
            <SelectItem value="best-selling">Meilleures ventes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
