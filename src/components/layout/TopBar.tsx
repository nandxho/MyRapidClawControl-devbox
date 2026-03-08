"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Settings,
  Bell,
  Crosshair,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLiveEvents } from "@/lib/live-events";

type GatewayStatus = "healthy" | "degraded" | "offline";

interface HealthState {
  status: GatewayStatus;
  latency: number;
}

const STATUS_LABEL: Record<GatewayStatus, string> = {
  healthy: "GATEWAY ONLINE",
  degraded: "DEGRADED",
  offline: "GATEWAY OFFLINE",
};

const STATUS_COLOR: Record<GatewayStatus, string> = {
  healthy: "text-emerald-400",
  degraded: "text-amber-400",
  offline: "text-red-400",
};

const STATUS_DOT: Record<GatewayStatus, string> = {
  healthy: "bg-emerald-400",
  degraded: "bg-amber-400",
  offline: "bg-red-400",
};

export function TopBar() {
  const [health, setHealth] = useState<HealthState>({ status: "healthy", latency: 42 });
  const [search, setSearch] = useState("");
  const { events } = useLiveEvents();
  const notifCount = events.filter((e)=>/(error|warn|alert|inbound_event)/i.test(e.event_type)).length;

  const checkHealth = useCallback(async () => {
    const start = performance.now();
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        const data = (await res.json()) as { status: string };
        setHealth({
          status: data.status === "healthy" ? "healthy" : "degraded",
          latency,
        });
      } else {
        setHealth({ status: "degraded", latency });
      }
    } catch {
      setHealth({ status: "offline", latency: 0 });
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 30_000);
    return () => clearInterval(id);
  }, [checkHealth]);

  return (
    <header className="sticky top-0 z-50 flex h-12 items-center gap-4 border-b border-white/[0.05] bg-[#050a14]/90 backdrop-blur-md px-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-500/20">
          <Crosshair className="h-3.5 w-3.5 text-cyan-400" strokeWidth={1.5} />
        </div>
        <span className="text-xs font-semibold tracking-[0.12em] text-slate-200 uppercase">
          OpenClaw
        </span>
        <span className="hidden sm:block text-[10px] text-slate-600 tracking-widest uppercase font-mono">
          {"//"} Mission Control
        </span>
      </Link>

      <div className="h-4 w-px bg-white/[0.06]" />

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-600" />
          <input
            type="text"
            placeholder="Search agents, tasks, docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full h-7 pl-7 pr-3 text-xs",
              "bg-white/[0.03] border border-white/[0.06] rounded-md",
              "text-slate-300 placeholder:text-slate-600",
              "focus:outline-none focus:border-cyan-500/30 focus:bg-cyan-500/[0.02]",
              "transition-all duration-150"
            )}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Gateway Health */}
      <AnimatePresence mode="wait">
        <motion.div
          key={health.status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden sm:flex items-center gap-2"
        >
          <div className="relative flex h-2 w-2 shrink-0">
            {health.status === "healthy" && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            )}
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", STATUS_DOT[health.status])} />
          </div>
          <div className="flex flex-col items-end">
            <span className={cn("text-[10px] font-semibold tracking-widest uppercase font-mono", STATUS_COLOR[health.status])}>
              {STATUS_LABEL[health.status]}
            </span>
            {health.latency > 0 && (
              <span className="text-[9px] text-slate-600 font-mono">{health.latency}ms</span>
            )}
          </div>
          {health.status === "degraded" && (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          )}
          {health.status === "offline" && (
            <WifiOff className="h-3.5 w-3.5 text-red-400" />
          )}
          {health.status === "healthy" && (
            <Wifi className="h-3.5 w-3.5 text-emerald-500 opacity-60" />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="h-4 w-px bg-white/[0.06]" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Link href="/comms" className="relative flex h-7 w-7 items-center justify-center rounded-md hover:bg-white/[0.04] transition-colors">
          <Bell className="h-3.5 w-3.5 text-slate-400" />
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-red-400" />
          )}
        </Link>
        <Link href="/ops" className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-white/[0.04] transition-colors">
          <Settings className="h-3.5 w-3.5 text-slate-400" />
        </Link>
      </div>
    </header>
  );
}
