"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Activity,
  Bot,
  MessageSquare,
  FileText,
  Bell,
  BookOpen,
  Code2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiveEvents } from "@/lib/live-events";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    description: "System overview",
  },
  {
    href: "/ops",
    label: "OPS",
    icon: Activity,
    badge: undefined,
    description: "Tasks & logs",
  },
  {
    href: "/agents",
    label: "Agents",
    icon: Bot,
    description: "Agent management",
  },
  {
    href: "/chat",
    label: "Chat",
    icon: MessageSquare,
    description: "Conversations",
  },
  {
    href: "/content",
    label: "Content",
    icon: FileText,
    description: "Generated content",
  },
  {
    href: "/comms",
    label: "Comms",
    icon: Bell,
    badge: undefined,
    description: "Notifications",
  },
  {
    href: "/knowledge",
    label: "Knowledge",
    icon: BookOpen,
    description: "Knowledge base",
  },
  {
    href: "/code",
    label: "Code",
    icon: Code2,
    description: "Code editor",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { events } = useLiveEvents();
  const opsBadge = events.length;
  const commsBadge = events.filter((e)=>/(error|warn|alert)/i.test(e.event_type)).length;

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-white/[0.05] bg-[#050a14]">
      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const dynamicBadge = item.href === "/ops" ? opsBadge : item.href === "/comms" ? commsBadge : item.badge;
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2",
                  "text-sm transition-all duration-150",
                  isActive
                    ? "bg-cyan-500/[0.08] text-cyan-300 border border-cyan-500/[0.15]"
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-cyan-400"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />

                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-[13px] leading-none">{item.label}</span>
                  <span className={cn(
                    "text-[10px] mt-0.5 truncate",
                    isActive ? "text-cyan-500/70" : "text-slate-600"
                  )}>
                    {item.description}
                  </span>
                </div>

                {dynamicBadge !== undefined && (
                  <span className={cn(
                    "ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-white/[0.06] text-slate-400"
                  )}>
                    {dynamicBadge}
                  </span>
                )}

                {dynamicBadge === undefined && (
                  <ChevronRight className={cn(
                    "ml-auto h-3 w-3 shrink-0 transition-opacity",
                    isActive ? "opacity-60 text-cyan-400" : "opacity-0 group-hover:opacity-30"
                  )} />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.05] p-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400">
            OC
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-300">OpenClaw</span>
            <span className="text-[10px] text-slate-600">v0.1.0</span>
          </div>
          <div className="ml-auto">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </aside>
  );
}
