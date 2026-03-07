"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#050a14]">
      {/* Top bar */}
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <motion.div
          initial={{ x: -256 }}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="fixed left-0 top-12 bottom-0 z-50 md:hidden"
        >
          <Sidebar />
        </motion.div>

        {/* Main content */}
        <main className="relative flex-1 overflow-y-auto">
          {/* Subtle grid background */}
          <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "absolute left-4 top-3 z-10 flex h-7 w-7 items-center justify-center",
              "rounded-md border border-white/[0.06] bg-white/[0.03] md:hidden",
              "text-slate-400 hover:text-slate-200 transition-colors"
            )}
          >
            {sidebarOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          </button>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative min-h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
