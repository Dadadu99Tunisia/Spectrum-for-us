import { cn } from "@/lib/utils";

interface ParenProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
}

const sizes = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl md:text-[10rem]",
};

export function Paren({ children, className, size = "lg", color = "#FF3D7F" }: ParenProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span
        className={cn("font-fraunces font-light leading-none select-none", sizes[size])}
        style={{ color }}
        aria-hidden
      >
        (
      </span>
      {children}
      <span
        className={cn("font-fraunces font-light leading-none select-none", sizes[size])}
        style={{ color }}
        aria-hidden
      >
        )
      </span>
    </span>
  );
}
