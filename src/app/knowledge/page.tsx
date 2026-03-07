"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Tag,
  Clock,
  FileText,
  X,
  ChevronRight,
  Plus,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { MOCK_KNOWLEDGE } from "@/lib/mock-data";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { KnowledgeDoc } from "@/lib/types";

const ALL_CATEGORIES = ["All", "Technical", "Operations", "Research", "Compliance"];
const ALL_TAGS = Array.from(new Set(MOCK_KNOWLEDGE.flatMap((d) => d.tags)));

function DocCard({ doc, selected, onClick }: { doc: KnowledgeDoc; selected: boolean; onClick: () => void }) {
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
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <FileText className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[13px] font-medium text-slate-200 leading-snug">{doc.title}</h3>
              <ChevronRight className={cn("h-3.5 w-3.5 text-slate-600 shrink-0 mt-0.5 transition-transform", selected && "rotate-90 text-cyan-400")} />
            </div>
            <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {doc.content.slice(0, 120)}...
            </p>
            <div className="flex items-center gap-3 mt-2">
              {doc.category && (
                <span className="text-[10px] text-cyan-500 font-medium">{doc.category}</span>
              )}
              <span className="flex items-center gap-1 text-[10px] text-slate-600">
                <Clock className="h-2.5 w-2.5" />
                {formatRelativeTime(doc.updatedAt)}
              </span>
              {doc.wordCount && (
                <span className="text-[10px] text-slate-600">{doc.wordCount.toLocaleString()}w</span>
              )}
              {doc.source && (
                <span className="flex items-center gap-0.5 text-[10px] text-slate-600">
                  <ExternalLink className="h-2.5 w-2.5" />
                  {doc.source}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/[0.05]">
          {doc.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 text-[10px] text-slate-500">
              <Tag className="h-2 w-2" />
              {tag}
            </span>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function DocViewer({ doc, onClose }: { doc: KnowledgeDoc; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className="h-full"
    >
      <GlassCard padding="none" className="h-full flex flex-col">
        <div className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-slate-200 leading-snug">{doc.title}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              {doc.category && <span className="text-[10px] text-cyan-500">{doc.category}</span>}
              <span className="text-[10px] text-slate-600">{doc.wordCount?.toLocaleString()} words</span>
              <span className="text-[10px] text-slate-600">Updated {formatRelativeTime(doc.updatedAt)}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 px-4 py-2.5 border-b border-white/[0.06]">
          {doc.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-0.5 rounded-md bg-cyan-500/[0.06] border border-cyan-500/15 px-2 py-0.5 text-[10px] text-cyan-500">
              <Tag className="h-2 w-2" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[13px] leading-relaxed text-slate-300">
            {doc.content}
          </p>
          <div className="mt-6 rounded-lg border border-white/[0.06] bg-cyan-500/[0.02] p-4">
            <p className="text-[11px] text-slate-500 italic">
              This is a preview of the document. The full document contains {doc.wordCount?.toLocaleString()} words
              covering detailed procedures, examples, and reference material.
              {doc.source && ` Source: ${doc.source}.`}
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <span className="text-[10px] text-slate-600">
            Created {formatRelativeTime(doc.createdAt)} · Updated {formatRelativeTime(doc.updatedAt)}
          </span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-white/[0.06] px-3 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">Edit</button>
            <button className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs text-cyan-400 hover:bg-cyan-500/15 transition-colors">
              Export
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function KnowledgePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null);

  const filtered = useMemo(() => {
    return MOCK_KNOWLEDGE.filter((doc) => {
      if (selectedCategory !== "All" && doc.category !== selectedCategory) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => doc.tags.includes(t))) return false;
      if (search) {
        const q = search.toLowerCase();
        return doc.title.toLowerCase().includes(q) || doc.tags.some((t) => t.includes(q));
      }
      return true;
    });
  }, [search, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
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
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Knowledge Base</h1>
          <p className="text-xs text-slate-500 mt-0.5">{MOCK_KNOWLEDGE.length} documents indexed</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 text-xs text-cyan-400 hover:bg-cyan-500/15 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Add Document
        </button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-4 text-sm bg-white/[0.03] border border-white/[0.06] rounded-lg text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 transition-colors"
        />
      </div>

      <div className="flex gap-5">
        {/* Filters sidebar */}
        <div className="w-40 shrink-0 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">Category</p>
            <div className="space-y-0.5">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-all",
                    selectedCategory === cat
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] border border-transparent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">Tags</p>
            <div className="flex flex-col gap-0.5">
              {ALL_TAGS.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-left text-[11px] transition-all",
                    selectedTags.includes(tag)
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  )}
                >
                  <Tag className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{tag}</span>
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-2 text-[10px] text-slate-600 hover:text-slate-400 flex items-center gap-1"
              >
                <X className="h-2.5 w-2.5" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Doc grid */}
        <div className={cn("flex-1 min-w-0 grid gap-3", selectedDoc ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
          <div className={cn("space-y-3", selectedDoc && "xl:col-span-1")}>
            {filtered.map((doc) => (
              <DocCard
                key={doc._id}
                doc={doc}
                selected={selectedDoc?._id === doc._id}
                onClick={() => setSelectedDoc(selectedDoc?._id === doc._id ? null : doc)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="h-8 w-8 text-slate-700 mb-3" />
                <p className="text-sm text-slate-600">No documents found</p>
                <p className="text-xs text-slate-700 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          <AnimatePresence>
            {selectedDoc && (
              <div className="xl:col-span-1 h-[600px]">
                <DocViewer doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
