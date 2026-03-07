"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Cpu,
  Zap,
  CheckCircle2,
  Clock,
  Activity,
  X,
  ChevronRight,
  MemoryStick,
  Hash,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_AGENTS, MOCK_TASKS } from "@/lib/mock-data";
import { formatRelativeTime, formatNumber, cn } from "@/lib/utils";
import type { Agent } from "@/lib/types";

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const agentTasks = MOCK_TASKS.filter((t) => t.agentId === agent._id);
  const running = agentTasks.filter((t) => t.status === "running");
  const recent = agentTasks.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <GlassCard padding="md">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-lg font-bold text-cyan-400 font-mono">{agent.name.slice(0, 2)}</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">{agent.name}</h2>
              <p className="text-xs text-slate-500">{agent.description}</p>
              <div className="mt-1.5">
                <StatusBadge status={agent.status} pulse dot />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Tasks Done", value: formatNumber(agent.tasksCompleted), icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Memory", value: `${agent.memoryUsage ?? 0}%`, icon: MemoryStick, color: agent.memoryUsage && agent.memoryUsage > 80 ? "text-red-400" : "text-cyan-400" },
            { label: "Uptime", value: `${agent.uptime ?? 0}%`, icon: Zap, color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-2.5 text-center">
              <stat.icon className={cn("h-3.5 w-3.5 mx-auto mb-1", stat.color)} />
              <p className={cn("text-lg font-semibold font-mono", stat.color)}>{stat.value}</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wide mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Model info */}
      <GlassCard padding="md">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Configuration</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400"><Cpu className="h-3 w-3" /> Model</span>
            <span className="font-mono text-cyan-400 text-[11px]">{agent.model}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400"><Hash className="h-3 w-3" /> Tokens Used</span>
            <span className="font-mono text-slate-300 text-[11px]">{formatNumber(agent.tokensUsed ?? 0)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400"><Clock className="h-3 w-3" /> Last Seen</span>
            <span className="font-mono text-slate-400 text-[11px]">{formatRelativeTime(agent.lastSeen)}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">Capabilities</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.capabilities.map((cap) => (
              <span key={cap} className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400">
                {cap}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Memory usage bar */}
      {agent.memoryUsage !== undefined && (
        <GlassCard padding="md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Memory Usage</h3>
            <span className={cn("text-xs font-mono", agent.memoryUsage > 80 ? "text-red-400" : "text-cyan-400")}>
              {agent.memoryUsage}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${agent.memoryUsage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn("h-full rounded-full", agent.memoryUsage > 80 ? "bg-red-400" : "bg-cyan-400")}
            />
          </div>
        </GlassCard>
      )}

      {/* Active tasks */}
      {running.length > 0 && (
        <GlassCard padding="none">
          <div className="px-4 pt-3 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Tasks</h3>
          </div>
          {running.map((task) => (
            <div key={task._id} className="border-t border-white/[0.04] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-cyan-400 animate-pulse shrink-0" />
                <p className="text-xs text-slate-300 truncate flex-1">{task.title}</p>
              </div>
              {task.progress !== undefined && (
                <div className="mt-1.5 h-0.5 w-full rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${task.progress}%` }} />
                </div>
              )}
              <p className="text-[10px] text-slate-600 mt-1">{task.progress}% complete</p>
            </div>
          ))}
        </GlassCard>
      )}

      {/* Recent tasks */}
      {recent.length > 0 && (
        <GlassCard padding="none">
          <div className="px-4 pt-3 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent Tasks</h3>
          </div>
          {recent.map((task) => (
            <div key={task._id} className="border-t border-white/[0.04] px-4 py-2 flex items-center gap-2">
              {task.status === "completed" && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />}
              {task.status === "failed" && <X className="h-3 w-3 text-red-400 shrink-0" />}
              {task.status === "pending" && <Clock className="h-3 w-3 text-slate-500 shrink-0" />}
              <p className="text-[11px] text-slate-400 flex-1 truncate">{task.title}</p>
              <span className="text-[10px] text-slate-600">{formatRelativeTime(task.createdAt)}</span>
            </div>
          ))}
        </GlassCard>
      )}
    </motion.div>
  );
}

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const agentsByStatus = useMemo(() => {
    const order: Record<string, number> = { active: 0, idle: 1, error: 2, offline: 3 };
    return [...MOCK_AGENTS].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Agents</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {MOCK_AGENTS.filter((a) => a.status === "active").length} active ·{" "}
            {MOCK_AGENTS.filter((a) => a.status === "idle").length} idle ·{" "}
            {MOCK_AGENTS.filter((a) => a.status === "error" || a.status === "offline").length} offline
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 text-xs text-cyan-400 hover:bg-cyan-500/15 transition-colors">
          <Bot className="h-3.5 w-3.5" />
          Register Agent
        </button>
      </motion.div>

      <div className={cn("grid gap-4 transition-all", selectedAgent ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
        {/* Agent list */}
        <div className="space-y-3">
          {agentsByStatus.map((agent, i) => (
            <motion.div
              key={agent._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard
                hover
                padding="md"
                onClick={() => setSelectedAgent(selectedAgent?._id === agent._id ? null : agent)}
                className={cn(
                  "cursor-pointer",
                  selectedAgent?._id === agent._id && "border-cyan-500/30 bg-cyan-500/[0.04]"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
                    agent.status === "active" ? "bg-cyan-500/10 border-cyan-500/20" :
                    agent.status === "idle" ? "bg-amber-500/10 border-amber-500/20" :
                    agent.status === "error" ? "bg-red-500/10 border-red-500/20" :
                    "bg-slate-500/10 border-slate-500/20"
                  )}>
                    <span className={cn("text-sm font-bold font-mono",
                      agent.status === "active" ? "text-cyan-400" :
                      agent.status === "idle" ? "text-amber-400" :
                      agent.status === "error" ? "text-red-400" :
                      "text-slate-500"
                    )}>
                      {agent.name.slice(0, 2)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-slate-100">{agent.name}</h3>
                      <StatusBadge status={agent.status} pulse dot />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{agent.description}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-slate-600">
                      <span className="font-mono">{agent.model}</span>
                      <span>{agent.tasksCompleted} tasks</span>
                      <span>seen {formatRelativeTime(agent.lastSeen)}</span>
                    </div>
                  </div>

                  {/* Memory bar */}
                  {agent.memoryUsage !== undefined && agent.status !== "offline" && (
                    <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0 w-20">
                      <span className={cn("text-[10px] font-mono", agent.memoryUsage > 80 ? "text-red-400" : "text-slate-500")}>
                        {agent.memoryUsage}% mem
                      </span>
                      <div className="h-1 w-20 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", agent.memoryUsage > 80 ? "bg-red-400" : "bg-cyan-400/60")}
                          style={{ width: `${agent.memoryUsage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <ChevronRight className={cn(
                    "h-4 w-4 text-slate-600 transition-transform shrink-0",
                    selectedAgent?._id === agent._id && "rotate-90 text-cyan-400"
                  )} />
                </div>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/[0.05]">
                  {agent.capabilities.map((cap) => (
                    <span key={cap} className="rounded-md bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 text-[10px] text-slate-500">
                      {cap}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedAgent && (
            <AgentDetailPanel
              agent={selectedAgent}
              onClose={() => setSelectedAgent(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
