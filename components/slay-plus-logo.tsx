import { Film } from "lucide-react"
import Link from "next/link"

export function SlayPlusLogo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "text-lg",
    default: "text-2xl",
    large: "text-4xl",
  }

  return (
    <Link href="/slay-plus" className="flex items-center">
      <div className="flex items-center">
        <div className="bg-red-600 rounded-full p-1.5 mr-1.5">
          <Film className={`text-white ${size === "small" ? "h-4 w-4" : size === "large" ? "h-8 w-8" : "h-5 w-5"}`} />
        </div>
        <span className={`font-bold ${sizeClasses[size]}`}>
          Slay<span className="text-red-600">+</span>
        </span>
      </div>
    </Link>
  )
}
