import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "magenta" | "peach" | "teal";
}

const variants = {
  default: "border-[#101014]/20 text-[#101014]/60",
  magenta: "border-[#FF2DA0]/40 text-[#FF2DA0]",
  peach: "border-[#FF2DA0]/40 text-[#FF2DA0]",
  teal: "border-[#2323C4]/40 text-[#2323C4]",
};

export function Tag({ children, className, variant = "default" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[11px] tracking-wide px-2 py-1 border rounded-sm",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
