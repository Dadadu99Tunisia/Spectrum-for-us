import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  linkToHome?: boolean
}

const sizeMap = {
  sm: { width: 100, height: 25 },
  md: { width: 150, height: 38 },
  lg: { width: 200, height: 50 },
  xl: { width: 250, height: 63 },
}

export function Logo({ size = "md", className = "", linkToHome = true }: LogoProps) {
  const { width, height } = sizeMap[size]

  const logoImage = (
    <Image
      src="/logo-spectrum.png"
      alt="Spectrum For Us"
      width={width}
      height={height}
      className={`h-auto w-auto transition-opacity hover:opacity-80 ${className}`}
      priority
    />
  )

  if (linkToHome) {
    return (
      <Link href="/" className="inline-block">
        {logoImage}
      </Link>
    )
  }

  return logoImage
}
