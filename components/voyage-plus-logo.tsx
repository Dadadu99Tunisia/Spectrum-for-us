import { Globe } from "lucide-react"

export function VoyagePlusLogo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: {
      container: "gap-1",
      icon: "h-4 w-4",
      text: "text-base",
    },
    default: {
      container: "gap-2",
      icon: "h-6 w-6",
      text: "text-2xl",
    },
    large: {
      container: "gap-3",
      icon: "h-8 w-8",
      text: "text-3xl",
    },
  }

  const classes = sizeClasses[size]

  return (
    <div className={`flex items-center ${classes.container}`}>
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 p-2 rounded-lg">
        <Globe className={`${classes.icon} text-white`} />
      </div>
      <div
        className={`font-bold ${classes.text} bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent`}
      >
        Voyage+
      </div>
    </div>
  )
}
