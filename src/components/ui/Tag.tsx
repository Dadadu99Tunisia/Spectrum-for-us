import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "magenta" | "peach" | "teal";
}

const variants = {
  default: "border-[#1A1612]/20 text-[#1A1612]/60",
  magenta: "border-[#FF3D7F]/40 text-[#FF3D7F]",
  peach: "border-[#1A1612]/40 text-[#1A1612]",
  teal: "border-[#1C9C95]/40 text-[#1C9C95]",
};

export function Tag({ children, className, variant = "default" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[11px] tracking-widest uppercase px-2 py-1 border rounded-sm",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
