import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "magenta" | "peach" | "teal";
}

const variants = {
  default: "border-[#F3EADB]/20 text-[#F3EADB]/60",
  magenta: "border-[#E0337E]/40 text-[#E0337E]",
  peach: "border-[#F2B79E]/40 text-[#F2B79E]",
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
