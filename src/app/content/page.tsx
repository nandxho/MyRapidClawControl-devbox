"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import {
  FileText,
  Mail,
  Twitter,
  Code2,
  File,
  Search,
  Wand2,
  X,
  ChevronRight,
  Clock,
  Bot,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_CONTENT, MOCK_AGENTS } from "@/lib/mock-data";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { ContentItem, ContentType } from "@/lib/types";

const TAB_TRIGGER_CLASS =
  "px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 transition-all data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-cyan-500/[0.04] rounded-t-md";

const TYPE_ICONS: Record<ContentType, React.ElementType> = {
  article: FileText,
  email: Mail,
  social: Twitter,
  code: Code2,
  other: File,
};

const TYPE_COLORS: Record<ContentType, string> = {
  article: "text-blue-400",
  email: "text-violet-400",
  social: "text-cyan-400",
  code: "text-emerald-400",
  other: "text-slate-400",
};

const TYPE_BG: Record<ContentType, string> = {
  article: "bg-blue-500/10 border-blue-500/20",
  email: "bg-violet-500/10 border-violet-500/20",
  social: "bg-cyan-500/10 border-cyan-500/20",
  code: "bg-emerald-500/10 border-emerald-500/20",
  other: "bg-slate-500/10 border-slate-500/20",
};

const CONTENT_TYPES: Array<{ value: ContentType | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "article", label: "Articles" },
  { value: "email", label: "Email" },
  { value: "social", label: "Social" },
  { value: "code", label: "Code" },
];

function ContentCard({ item, selected, onClick }: { item: ContentItem; selected: boolean; onClick: () => void }) {
  const Icon = TYPE_ICONS[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
    >
      <GlassCard
        hover
        padding="md"
        onClick={onClick}
        className={cn(selected && "border-cyan-500/30 bg-cyan-500/[0.04]")}
      >
        <div className="flex items-start gap-3">
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", TYPE_BG[item.type])}>
            <Icon className={cn("h-4 w-4", TYPE_COLORS[item.type])} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[13px] font-medium text-slate-200 leading-snug">{item.title}</h3>
              <ChevronRight className={cn("h-3.5 w-3.5 text-slate-600 shrink-0 transition-transform mt-0.5", selected && "rotate-90 text-cyan-400")} />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {item.body.slice(0, 120)}...
            </p>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={item.status} />
              <span className="flex items-center gap-1 text-[10px] text-slate-600">
                <Bot className="h-2.5 w-2.5" />{item.agentName}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-600">
                <Clock className="h-2.5 w-2.5" />{formatRelativeTime(item.generatedAt)}
              </span>
              {item.wordCount && (
                <span className="text-[10px] text-slate-600">{item.wordCount}w</span>
              )}
            </div>
          </div>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/[0.05]">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 text-[10px] text-slate-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

function ContentDetail({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const Icon = TYPE_ICONS[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className="h-full"
    >
      <GlassCard padding="none" className="h-full flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg border", TYPE_BG[item.type])}>
            <Icon className={cn("h-3.5 w-3.5", TYPE_COLORS[item.type])} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-slate-200 truncate">{item.title}</h2>
            <p className="text-[10px] text-slate-500 capitalize">{item.type} · {item.wordCount}w</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-300 font-sans">
            {item.body}
          </pre>
        </div>
        <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-600">Generated by <span className="text-cyan-500">{item.agentName}</span> · {formatRelativeTime(item.generatedAt)}</span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-white/[0.06] px-3 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">Edit</button>
            <button className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs text-cyan-400 hover:bg-cyan-500/15 transition-colors">Publish</button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function GenerateTab() {
  const [contentType, setContentType] = useState<ContentType>("article");
  const [prompt, setPrompt] = useState("");
  const [agentId, setAgentId] = useState(MOCK_AGENTS[0]._id);

  return (
    <div className="max-w-2xl space-y-4">
      <GlassCard padding="md">
        <h3 className="text-sm font-medium text-slate-200 mb-4">Generate New Content</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 block">Content Type</label>
            <div className="flex flex-wrap gap-2">
              {(["article", "email", "social", "code"] as ContentType[]).map((type) => {
                const Icon = TYPE_ICONS[type];
                return (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                      contentType === type
                        ? `${TYPE_BG[type]} ${TYPE_COLORS[type]}`
                        : "border-white/[0.06] text-slate-500 hover:text-slate-300 bg-white/[0.02]"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 block">Assigned Agent</label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/30"
            >
              {MOCK_AGENTS.filter((a) => a.status !== "offline").map((a) => (
                <option key={a._id} value={a._id}>{a.name} ({a.model})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 block">Prompt / Brief</label>
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              className="w-full rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 resize-none leading-relaxed"
            />
          </div>

          <button
            disabled={!prompt.trim()}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
              prompt.trim()
                ? "bg-cyan-500 text-[#050a14] hover:bg-cyan-400"
                : "bg-white/[0.04] text-slate-600 cursor-not-allowed"
            )}
          >
            <Wand2 className="h-4 w-4" />
            Generate Content
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

export default function ContentPage() {
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContentItem | null>(null);

  const filtered = useMemo(() => {
    return MOCK_CONTENT.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [typeFilter, search]);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Content</h1>
          <p className="text-xs text-slate-500 mt-0.5">{MOCK_CONTENT.length} pieces generated</p>
        </div>
      </motion.div>

      <Tabs.Root defaultValue="library">
        <Tabs.List className="flex border-b border-white/[0.06] gap-1 -mb-px">
          <Tabs.Trigger value="library" className={TAB_TRIGGER_CLASS}>Library</Tabs.Trigger>
          <Tabs.Trigger value="generate" className={TAB_TRIGGER_CLASS}>Generate</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="library" className="pt-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-600" />
              <input
                type="text"
                placeholder="Search content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 pl-7 pr-3 text-xs bg-white/[0.03] border border-white/[0.06] rounded-md text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 w-44"
              />
            </div>
            <div className="flex gap-1.5">
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTypeFilter(t.value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                    typeFilter === t.value
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className={cn("grid gap-4", selected ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
            <div className={cn("space-y-3", selected && "lg:col-span-1")}>
              {filtered.map((item) => (
                <ContentCard
                  key={item._id}
                  item={item}
                  selected={selected?._id === item._id}
                  onClick={() => setSelected(selected?._id === item._id ? null : item)}
                />
              ))}
              {filtered.length === 0 && (
                <p className="py-12 text-center text-sm text-slate-600">No content matches the filter.</p>
              )}
            </div>

            <AnimatePresence>
              {selected && (
                <div className="lg:col-span-1 h-[600px]">
                  <ContentDetail item={selected} onClose={() => setSelected(null)} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </Tabs.Content>

        <Tabs.Content value="generate" className="pt-4">
          <GenerateTab />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
