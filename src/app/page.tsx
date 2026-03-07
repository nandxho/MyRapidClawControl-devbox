"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Activity,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import {
  MOCK_AGENTS,
  MOCK_TASKS,
  MOCK_EVENTS,
  generateMetrics,
} from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { SystemMetric } from "@/lib/types";

const STAGGER = { container: { animate: { transition: { staggerChildren: 0.05 } } }, item: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } } };

// Custom tooltip for recharts
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-sm px-3 py-2 text-xs">
      <p className="text-cyan-400 font-mono mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono">
          {p.dataKey}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);

  useEffect(() => {
    setMetrics(generateMetrics(24));
  }, []);

  const activeAgents = useMemo(() => MOCK_AGENTS.filter((a) => a.status === "active").length, []);
  const runningTasks = useMemo(() => MOCK_TASKS.filter((t) => t.status === "running").length, []);
  const completedToday = useMemo(() => MOCK_TASKS.filter((t) => t.status === "completed").length, []);
  const recentEvents = useMemo(() => MOCK_EVENTS.slice(0, 6), []);
  const recentTasks = useMemo(() => MOCK_TASKS.slice(0, 5), []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">
            Mission Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time overview — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Live</span>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div
        variants={STAGGER.container}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { title: "Active Agents", value: activeAgents, delta: "+1 today", direction: "up" as const, icon: Bot, description: "of 6 registered" },
          { title: "Running Tasks", value: runningTasks, delta: "2 critical", direction: "neutral" as const, icon: Activity, description: "in queue: 2 pending" },
          { title: "Completed Today", value: completedToday, delta: "+18%", direction: "up" as const, icon: CheckCircle2, iconColor: "text-emerald-400", description: "vs yesterday" },
          { title: "Uptime", value: "99.8%", delta: "+0.1%", direction: "up" as const, icon: Zap, iconColor: "text-amber-400", description: "30-day average" },
        ].map((metric) => (
          <motion.div key={metric.title} variants={STAGGER.item}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              delta={metric.delta}
              deltaDirection={metric.direction}
              icon={metric.icon}
              iconColor={metric.iconColor}
              description={metric.description}
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Middle row: Chart + Agent status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity chart */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <GlassCard padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div>
                <h3 className="text-sm font-medium text-slate-200">System Activity</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">24-hour rolling window</p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="h-0.5 w-4 rounded-full bg-cyan-400 inline-block" />
                  Messages
                </span>
                <span className="flex items-center gap-1.5 text-violet-400">
                  <span className="h-0.5 w-4 rounded-full bg-violet-400 inline-block" />
                  Tasks
                </span>
              </div>
            </div>
            <div className="h-48 px-1 pb-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="gradMsg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradTask" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval={3}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="messages" stroke="#06b6d4" strokeWidth={1.5} fill="url(#gradMsg)" />
                  <Area type="monotone" dataKey="tasks" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#gradTask)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Agent status */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <GlassCard padding="none" className="h-full">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <h3 className="text-sm font-medium text-slate-200">Agent Status</h3>
              <Link href="/agents" className="text-[11px] text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {MOCK_AGENTS.slice(0, 5).map((agent) => (
                <div key={agent._id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/15">
                    <span className="text-[10px] font-bold text-cyan-400 font-mono">{agent.name.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-slate-200">{agent.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{agent.model.split("-").slice(1, 3).join(" ")}</p>
                  </div>
                  <StatusBadge status={agent.status} pulse dot />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom row: Tasks + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent tasks */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard padding="none" className="h-full">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                <h3 className="text-sm font-medium text-slate-200">Recent Tasks</h3>
              </div>
              <Link href="/ops" className="text-[11px] text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-start gap-3 px-4 py-2.5">
                  <div className="mt-0.5 shrink-0">
                    {task.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    {task.status === "running" && <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />}
                    {task.status === "failed" && <AlertCircle className="h-3.5 w-3.5 text-red-400" />}
                    {task.status === "pending" && <Clock className="h-3.5 w-3.5 text-slate-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-slate-200 truncate">{task.title}</p>
                    <p className="text-[10px] text-slate-500">{task.agentName} · {formatRelativeTime(task.createdAt)}</p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Event feed */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard padding="none" className="h-full">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                <h3 className="text-sm font-medium text-slate-200">Event Stream</h3>
              </div>
              <Link href="/ops" className="text-[11px] text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
                Logs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentEvents.map((event) => (
                <div key={event._id} className="flex items-start gap-3 px-4 py-2.5">
                  <span className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    event.severity === "success" && "bg-emerald-400",
                    event.severity === "error" && "bg-red-400",
                    event.severity === "warning" && "bg-amber-400",
                    event.severity === "info" && "bg-blue-400",
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-slate-300 leading-relaxed">{event.message}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                      {event.source} · {formatRelativeTime(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
