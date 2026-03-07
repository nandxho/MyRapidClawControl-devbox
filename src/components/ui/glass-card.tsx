import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "surface";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base
          "rounded-xl backdrop-blur-sm",
          // Variants
          variant === "default" && "bg-white/[0.02] border border-white/[0.06]",
          variant === "primary" &&
            "bg-cyan-500/[0.04] border border-cyan-500/[0.15]",
          variant === "surface" && "bg-[#0d1526]/80 border border-white/[0.06]",
          // Hover
          hover &&
            "transition-all duration-200 hover:border-cyan-500/30 hover:shadow-[0_0_24px_rgba(6,182,212,0.08)] cursor-pointer",
          // Padding
          padding === "none" && "p-0",
          padding === "sm" && "p-3",
          padding === "md" && "p-4",
          padding === "lg" && "p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
