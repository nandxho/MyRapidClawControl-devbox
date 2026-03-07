"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string;
  deltaDirection?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
  description?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  deltaDirection = "up",
  icon: Icon,
  iconColor = "text-cyan-400",
  className,
  description,
}: MetricCardProps) {
  const isPositive = deltaDirection === "up";
  const isNeutral = deltaDirection === "neutral";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl bg-white/[0.02] border border-white/[0.06] p-4",
        "hover:border-cyan-500/20 transition-colors duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            "bg-cyan-500/10 border border-cyan-500/20"
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", iconColor)} strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-slate-100 font-mono">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "mb-0.5 flex items-center gap-0.5 text-[11px] font-medium",
              isNeutral
                ? "text-slate-500"
                : isPositive
                  ? "text-emerald-400"
                  : "text-red-400"
            )}
          >
            {!isNeutral &&
              (isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              ))}
            {delta}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-[11px] text-slate-600">{description}</p>
      )}
    </motion.div>
  );
}
