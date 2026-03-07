import { cn } from "@/lib/utils";
import type { AgentStatus, TaskStatus, EventSeverity, ContentStatus } from "@/lib/types";

type StatusVariant = AgentStatus | TaskStatus | EventSeverity | ContentStatus | "connected" | "disconnected";

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; dotClass: string }> = {
  // Agent status
  active: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400",
  },
  idle: {
    label: "Idle",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-400",
  },
  error: {
    label: "Error",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    dotClass: "bg-red-400",
  },
  offline: {
    label: "Offline",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-500",
  },
  // Task status
  pending: {
    label: "Pending",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-400",
  },
  running: {
    label: "Running",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    dotClass: "bg-cyan-400",
  },
  completed: {
    label: "Done",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    dotClass: "bg-red-400",
  },
  // Severity
  info: {
    label: "Info",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-400",
  },
  warning: {
    label: "Warning",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-400",
  },
  success: {
    label: "Success",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400",
  },
  // Content
  draft: {
    label: "Draft",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-400",
  },
  review: {
    label: "Review",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-400",
  },
  published: {
    label: "Published",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400",
  },
  // Integration
  connected: {
    label: "Connected",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400",
  },
  disconnected: {
    label: "Disconnected",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-500",
  },
};

export function StatusBadge({ status, className, dot = true, pulse = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (status === "active" || status === "running") && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                config.dotClass
              )}
            />
          )}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", config.dotClass)} />
        </span>
      )}
      {config.label}
    </span>
  );
}

// ─── Priority Badge ────────────────────────────────────────
const PRIORITY_CONFIG = {
  low: { label: "Low", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  medium: { label: "Med", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  high: { label: "High", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  critical: { label: "Crit", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "critical";
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
