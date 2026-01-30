"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube3d } from "lucide-react"
import Link from "next/link"

interface TryARButtonProps {
  productId: string
  productName: string
}

export default function TryARButton({ productId, productName }: TryARButtonProps) {
  const [mounted, setMounted] = useState(false)

  // Attendre que le composant soit monté côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Ne rien rendre côté serveur ou pendant le montage
  if (!mounted) {
    return null
  }

  return (
    <Link href={`/ar/${productId}`} passHref>
      <Button variant="outline" className="w-full gap-2 mt-2">
        <Cube3d className="h-4 w-4" />
        Voir en 3D
      </Button>
    </Link>
  )
}
