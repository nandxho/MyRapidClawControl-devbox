"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Bell,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Check,
  Plug,
  RefreshCw,
  Settings,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_NOTIFICATIONS, MOCK_INTEGRATIONS } from "@/lib/mock-data";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { Notification, EventSeverity } from "@/lib/types";

const TAB_TRIGGER_CLASS =
  "px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 transition-all data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-cyan-500/[0.04] rounded-t-md";

const SEVERITY_ICON: Record<EventSeverity, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
};

const SEVERITY_COLOR: Record<EventSeverity, string> = {
  info: "text-blue-400",
  warning: "text-amber-400",
  error: "text-red-400",
  success: "text-emerald-400",
};

const SEVERITY_BG: Record<EventSeverity, string> = {
  info: "bg-blue-500/10 border-blue-500/20",
  warning: "bg-amber-500/10 border-amber-500/20",
  error: "bg-red-500/10 border-red-500/20",
  success: "bg-emerald-500/10 border-emerald-500/20",
};

function NotificationCard({ notif, onMarkRead }: { notif: Notification; onMarkRead: (id: string) => void }) {
  const Icon = SEVERITY_ICON[notif.severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 transition-all",
        notif.read
          ? "bg-white/[0.01] border-white/[0.04]"
          : `${SEVERITY_BG[notif.severity]} shadow-sm`
      )}
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", SEVERITY_BG[notif.severity])}>
        <Icon className={cn("h-4 w-4", SEVERITY_COLOR[notif.severity])} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn("text-[13px] font-medium leading-snug", notif.read ? "text-slate-400" : "text-slate-100")}>
            {notif.title}
          </h4>
          {!notif.read && (
            <button
              onClick={() => onMarkRead(notif._id)}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.04] text-slate-500 hover:text-slate-200 transition-colors"
            >
              <Check className="h-3 w-3" />
            </button>
          )}
        </div>
        <p className={cn("mt-1 text-xs leading-relaxed", notif.read ? "text-slate-600" : "text-slate-400")}>
          {notif.body}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] text-slate-600 font-mono">{notif.source}</span>
          <span className="text-[10px] text-slate-600">{formatRelativeTime(notif.timestamp)}</span>
          {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
        </div>
      </div>
    </motion.div>
  );
}

export default function CommsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
          <h1 className="text-xl font-semibold tracking-tight text-slate-100 flex items-center gap-2">
            Communications
            {unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30 text-[10px] font-semibold text-red-400">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {unreadCount} unread · {notifications.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Check className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </motion.div>

      <Tabs.Root defaultValue="notifications">
        <Tabs.List className="flex border-b border-white/[0.06] gap-1 -mb-px">
          <Tabs.Trigger value="notifications" className={TAB_TRIGGER_CLASS}>
            Notifications
          </Tabs.Trigger>
          <Tabs.Trigger value="integrations" className={TAB_TRIGGER_CLASS}>
            Integrations
          </Tabs.Trigger>
          <Tabs.Trigger value="alerts" className={TAB_TRIGGER_CLASS}>
            Alert Rules
          </Tabs.Trigger>
        </Tabs.List>

        {/* ── Notifications Tab ── */}
        <Tabs.Content value="notifications" className="pt-4 space-y-3">
          {/* Severity summary */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {(["error", "warning", "success", "info"] as EventSeverity[]).map((sev) => {
              const count = notifications.filter((n) => n.severity === sev).length;
              const Icon = SEVERITY_ICON[sev];
              return (
                <div key={sev} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2 shrink-0", SEVERITY_BG[sev])}>
                  <Icon className={cn("h-3.5 w-3.5", SEVERITY_COLOR[sev])} />
                  <span className={cn("text-sm font-semibold font-mono", SEVERITY_COLOR[sev])}>{count}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{sev}</span>
                </div>
              );
            })}
          </div>

          {/* Notification list */}
          <div className="space-y-2">
            {notifications.map((notif) => (
              <NotificationCard key={notif._id} notif={notif} onMarkRead={markRead} />
            ))}
          </div>
        </Tabs.Content>

        {/* ── Integrations Tab ── */}
        <Tabs.Content value="integrations" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_INTEGRATIONS.map((integration, i) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard hover padding="md" className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <h3 className="text-sm font-medium text-slate-200">{integration.name}</h3>
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          Last sync: {formatRelativeTime(integration.lastSync)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={integration.status as "connected" | "disconnected" | "error"} pulse dot />
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                    <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] py-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors">
                      <RefreshCw className="h-3 w-3" />
                      Sync
                    </button>
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-slate-500 hover:text-slate-300 transition-colors">
                      <Settings className="h-3 w-3" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            {/* Add integration */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: MOCK_INTEGRATIONS.length * 0.05 }}
            >
              <button className="w-full h-full min-h-24 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] text-slate-600 hover:border-cyan-500/30 hover:text-cyan-500 transition-all">
                <Plug className="h-5 w-5" />
                <span className="text-xs">Add Integration</span>
              </button>
            </motion.div>
          </div>
        </Tabs.Content>

        {/* ── Alert Rules Tab ── */}
        <Tabs.Content value="alerts" className="pt-4 space-y-3">
          <GlassCard padding="md">
            <h3 className="text-sm font-medium text-slate-200 mb-4">Active Alert Rules</h3>
            <div className="space-y-3">
              {[
                { condition: "Agent memory > 85%", action: "Notify + pause agent", severity: "error", enabled: true },
                { condition: "Task failure rate > 10%", action: "Notify team", severity: "warning", enabled: true },
                { condition: "Gateway latency > 2s", action: "Notify on-call", severity: "error", enabled: true },
                { condition: "Agent offline > 1h", action: "Alert + restart attempt", severity: "warning", enabled: false },
                { condition: "Token budget > 90%", action: "Throttle requests", severity: "info", enabled: true },
              ].map((rule, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border border-white/[0.05] bg-white/[0.01] px-3 py-2.5">
                  <div className={cn("h-2 w-2 rounded-full shrink-0",
                    rule.severity === "error" ? "bg-red-400" :
                    rule.severity === "warning" ? "bg-amber-400" :
                    "bg-blue-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-slate-300">{rule.condition}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">→ {rule.action}</p>
                  </div>
                  <button
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                      rule.enabled ? "bg-cyan-500" : "bg-white/[0.1]"
                    )}
                  >
                    <span className={cn(
                      "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
                      rule.enabled ? "translate-x-4" : "translate-x-0"
                    )} />
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/[0.1] py-2 text-xs text-slate-600 hover:border-cyan-500/30 hover:text-cyan-500 transition-all">
              <Bell className="h-3.5 w-3.5" />
              Add Rule
            </button>
          </GlassCard>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
