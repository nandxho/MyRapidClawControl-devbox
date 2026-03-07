"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  RefreshCw,
  ChevronDown,
  CircleDot,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { MOCK_TASKS, MOCK_EVENTS, generateMetrics } from "@/lib/mock-data";
import { formatRelativeTime, formatDuration, cn } from "@/lib/utils";
import type { TaskStatus, SystemMetric } from "@/lib/types";

const TAB_TRIGGER_CLASS =
  "px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 transition-all data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-cyan-500/[0.04] rounded-t-md";

const STATUS_FILTER: { label: string; value: TaskStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Running", value: "running" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

export default function OpsPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMetrics(generateMetrics(24));
  }, []);

  const filteredTasks = useMemo(() => {
    return MOCK_TASKS.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [statusFilter, search]);

  const taskCounts = useMemo(() => ({
    all: MOCK_TASKS.length,
    running: MOCK_TASKS.filter((t) => t.status === "running").length,
    pending: MOCK_TASKS.filter((t) => t.status === "pending").length,
    completed: MOCK_TASKS.filter((t) => t.status === "completed").length,
    failed: MOCK_TASKS.filter((t) => t.status === "failed").length,
  }), []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const SEVERITY_COLORS: Record<string, string> = {
    info: "text-blue-400",
    warning: "text-amber-400",
    error: "text-red-400",
    success: "text-emerald-400",
  };

  const LOG_PREFIX: Record<string, string> = {
    info: "[INFO]",
    warning: "[WARN]",
    error: "[ERR!]",
    success: "[OK  ]",
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Task queue, system health, and event logs</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
          Refresh
        </button>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Running", count: taskCounts.running, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
          { label: "Pending", count: taskCounts.pending, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
          { label: "Completed", count: taskCounts.completed, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Failed", count: taskCounts.failed, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl border p-3", s.bg, s.border)}>
            <p className={cn("text-2xl font-semibold font-mono", s.color)}>{s.count}</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="tasks">
        <Tabs.List className="flex border-b border-white/[0.06] gap-1 -mb-px">
          <Tabs.Trigger value="tasks" className={TAB_TRIGGER_CLASS}>
            Tasks
          </Tabs.Trigger>
          <Tabs.Trigger value="metrics" className={TAB_TRIGGER_CLASS}>
            Metrics
          </Tabs.Trigger>
          <Tabs.Trigger value="logs" className={TAB_TRIGGER_CLASS}>
            Event Log
          </Tabs.Trigger>
        </Tabs.List>

        {/* ── Tasks Tab ── */}
        <Tabs.Content value="tasks" className="pt-4 space-y-3">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-600" />
              <input
                type="text"
                placeholder="Filter tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 pl-7 pr-3 text-xs bg-white/[0.03] border border-white/[0.06] rounded-md text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 w-48"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="h-3 w-3 text-slate-600" />
              {STATUS_FILTER.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                    statusFilter === f.value
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  )}
                >
                  {f.label}
                  <span className="text-[10px] opacity-60">
                    {f.value === "all" ? taskCounts.all : taskCounts[f.value as TaskStatus] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Task list */}
          <GlassCard padding="none" className="overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-2.5 text-left font-medium">Task</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">Agent</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden md:table-cell">Priority</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden lg:table-cell">Duration</th>
                  <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredTasks.map((task) => (
                  <motion.tr
                    key={task._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {task.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                        {task.status === "running" && <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse shrink-0" />}
                        {task.status === "failed" && <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />}
                        {task.status === "pending" && <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />}
                        <div>
                          <p className="text-slate-200 font-medium">{task.title}</p>
                          {task.progress !== undefined && task.status === "running" && (
                            <div className="mt-1 h-0.5 w-24 rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full bg-cyan-400 transition-all"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{task.agentName ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={task.status} pulse /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-4 py-3 text-slate-500 font-mono hidden lg:table-cell">
                      {task.durationMs ? formatDuration(task.durationMs) : task.status === "running" ? "..." : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{formatRelativeTime(task.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-600">No tasks match the current filter.</p>
            )}
          </GlassCard>
        </Tabs.Content>

        {/* ── Metrics Tab ── */}
        <Tabs.Content value="metrics" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Messages chart */}
            <GlassCard padding="none" className="overflow-hidden">
              <div className="px-4 py-3">
                <h3 className="text-sm font-medium text-slate-200">Messages / hour</h3>
                <p className="text-xs text-slate-500">Across all agent threads</p>
              </div>
              <div className="h-40 pb-3 px-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" strokeOpacity={0.5} />
                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid #1e2d42", borderRadius: 8, fontSize: 11 }} />
                    <Line type="monotone" dataKey="messages" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Latency chart */}
            <GlassCard padding="none" className="overflow-hidden">
              <div className="px-4 py-3">
                <h3 className="text-sm font-medium text-slate-200">API Latency (ms)</h3>
                <p className="text-xs text-slate-500">p50 response time</p>
              </div>
              <div className="h-40 pb-3 px-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" strokeOpacity={0.5} />
                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
                    <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid #1e2d42", borderRadius: 8, fontSize: 11 }} />
                    <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Errors chart */}
            <GlassCard padding="none" className="overflow-hidden">
              <div className="px-4 py-3">
                <h3 className="text-sm font-medium text-slate-200">Error Rate</h3>
                <p className="text-xs text-slate-500">Failures per hour</p>
              </div>
              <div className="h-40 pb-3 px-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" strokeOpacity={0.5} />
                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid #1e2d42", borderRadius: 8, fontSize: 11 }} />
                    <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Token usage */}
            <GlassCard padding="none" className="overflow-hidden">
              <div className="px-4 py-3">
                <h3 className="text-sm font-medium text-slate-200">Token Throughput</h3>
                <p className="text-xs text-slate-500">Tokens processed per hour</p>
              </div>
              <div className="h-40 pb-3 px-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" strokeOpacity={0.5} />
                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid #1e2d42", borderRadius: 8, fontSize: 11 }} />
                    <Line type="monotone" dataKey="tokens" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </Tabs.Content>

        {/* ── Logs Tab ── */}
        <Tabs.Content value="logs" className="pt-4">
          <GlassCard padding="none" className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
              <CircleDot className="h-3 w-3 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Event Stream — Live</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] text-slate-600 font-mono">{MOCK_EVENTS.length} entries</span>
              </div>
            </div>
            <div className="p-4 space-y-1 font-mono max-h-96 overflow-y-auto">
              {MOCK_EVENTS.map((event) => (
                <div key={event._id} className="flex items-start gap-3 log-line group">
                  <span className="text-slate-700 shrink-0 w-20 text-right">
                    {new Date(event.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                  </span>
                  <span className={cn("shrink-0 w-16", SEVERITY_COLORS[event.severity])}>
                    {LOG_PREFIX[event.severity]}
                  </span>
                  <span className="text-slate-500 shrink-0 w-16 truncate">[{event.source}]</span>
                  <span className={cn("flex-1", SEVERITY_COLORS[event.severity], "text-slate-400 group-hover:text-slate-300 transition-colors")}>
                    {event.message}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Pipeline status */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-200 mb-3">Pipeline Status</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {["Ingest", "Validate", "Route", "Execute", "Review", "Complete"].map((stage, i, arr) => (
                <div key={stage} className="flex items-center gap-2 shrink-0">
                  <div className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium",
                    i < 4
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : i === 4
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        : "bg-white/[0.03] border-white/[0.06] text-slate-500"
                  )}>
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      i < 4 ? "bg-emerald-400" : i === 4 ? "bg-cyan-400 animate-pulse" : "bg-slate-600"
                    )} />
                    {stage}
                  </div>
                  {i < arr.length - 1 && <ChevronDown className="h-3 w-3 text-slate-700 rotate-[-90deg] shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
