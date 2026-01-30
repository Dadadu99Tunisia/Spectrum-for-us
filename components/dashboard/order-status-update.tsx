"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

interface OrderStatusUpdateProps {
  itemId: string
  currentStatus: string
}

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export function OrderStatusUpdate({ itemId, currentStatus }: OrderStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setIsUpdating(true)
    const supabase = createClient()

    const { error } = await supabase.from("order_items").update({ status: newStatus }).eq("id", itemId)

    if (error) {
      toast.error("Failed to update status")
    } else {
      toast.success(`Status updated to ${newStatus}`)
      router.refresh()
    }

    setIsUpdating(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Status"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            className={currentStatus === status.value ? "bg-muted" : ""}
          >
            {status.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
