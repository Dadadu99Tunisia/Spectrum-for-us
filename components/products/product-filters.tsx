"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useCallback } from "react"

export function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 1000])

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          current.delete(key)
        } else {
          current.set(key, value)
        }
      })

      return current.toString()
    },
    [searchParams],
  )

  const handleSortChange = (value: string) => {
    router.push(`${pathname}?${createQueryString({ sort: value })}`)
  }

  const handlePriceFilter = () => {
    router.push(
      `${pathname}?${createQueryString({
        min: priceRange[0].toString(),
        max: priceRange[1].toString(),
      })}`,
    )
  }

  const clearFilters = () => {
    router.push(pathname)
    setPriceRange([0, 1000])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Sort By</h3>
        <Select defaultValue={searchParams.get("sort") || "newest"} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
          <div className="flex items-center justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <Button onClick={handlePriceFilter} className="w-full" size="sm">
            Apply Price Filter
          </Button>
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        Clear All Filters
      </Button>
    </div>
  )
}
