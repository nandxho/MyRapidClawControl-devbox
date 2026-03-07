"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Square,
  Save,
  ChevronRight,
  FileCode2,
  Terminal,
  Copy,
  Check,
  Dot,
} from "lucide-react";
import { MOCK_CODE_FILES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { CodeFile } from "@/lib/types";

const LANG_COLORS: Record<string, string> = {
  typescript: "text-blue-400",
  javascript: "text-yellow-400",
  python: "text-green-400",
  bash: "text-cyan-400",
};

const KEYWORD_COLOR = "text-violet-400";
const COMMENT_COLOR = "text-slate-500";

function syntaxHighlight(code: string): React.ReactNode[] {
  // Very simple highlighter for display purposes
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
    const isImport = line.trim().startsWith("import") || line.trim().startsWith("export");

    return (
      <div key={i} className="flex">
        <span className="select-none w-10 shrink-0 text-right pr-4 text-slate-700 font-mono text-xs leading-5">
          {i + 1}
        </span>
        <span
          className={cn(
            "flex-1 font-mono text-xs leading-5",
            isComment ? COMMENT_COLOR : isImport ? KEYWORD_COLOR : "text-slate-300"
          )}
        >
          {line || "\u00A0"}
        </span>
      </div>
    );
  });
}

type RunStatus = "idle" | "running" | "success" | "error";

const SAMPLE_OUTPUT = `[NEXUS] Executing convex/agents.ts
[INFO]  Validating schema compatibility...
[OK   ] Schema valid — 6 tables, 14 columns
[INFO]  Running type checks...
[OK   ] 0 TypeScript errors
[INFO]  Connecting to Convex dev environment...
[OK   ] Connected: https://demo.convex.cloud
[INFO]  Deploying function: agents.list
[OK   ] Deployed in 0.8s
[INFO]  Deploying function: agents.updateStatus
[OK   ] Deployed in 0.6s
[INFO]  Running integration tests...
[OK   ] 4/4 tests passed
[DONE] Execution complete — 2.4s elapsed`;

// ERROR_OUTPUT available for future use

export default function CodePage() {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(MOCK_CODE_FILES[0]);
  const [code, setCode] = useState(MOCK_CODE_FILES[0].content);
  const [runStatus, setRunStatus] = useState<RunStatus>("idle");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (file: CodeFile) => {
    setSelectedFile(file);
    setCode(file.content);
    setOutput("");
    setRunStatus("idle");
  };

  const handleRun = () => {
    setRunStatus("running");
    setShowOutput(true);
    setOutput("");

    const chars = SAMPLE_OUTPUT.split("");
    let i = 0;
    const interval = setInterval(() => {
      setOutput(SAMPLE_OUTPUT.slice(0, i));
      i += 3;
      if (i >= chars.length) {
        clearInterval(interval);
        setOutput(SAMPLE_OUTPUT);
        setRunStatus("success");
      }
    }, 20);
  };

  const handleStop = () => {
    setRunStatus("idle");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* File tree */}
      <div className="w-48 shrink-0 border-r border-white/[0.05] flex flex-col">
        <div className="flex items-center px-3 py-3 border-b border-white/[0.05]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Explorer</span>
        </div>
        <div className="flex-1 overflow-y-auto py-1.5">
          <div className="px-2 mb-1">
            <div className="flex items-center gap-1 px-1 py-0.5">
              <ChevronRight className="h-3 w-3 text-slate-600 rotate-90" />
              <span className="text-[11px] text-slate-500 font-medium">convex</span>
            </div>
          </div>
          <div className="space-y-0.5 px-2">
            {MOCK_CODE_FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => handleFileSelect(file)}
                className={cn(
                  "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-all",
                  selectedFile.id === file.id
                    ? "bg-cyan-500/[0.08] border border-cyan-500/[0.15]"
                    : "hover:bg-white/[0.03] border border-transparent"
                )}
              >
                <FileCode2 className={cn("h-3.5 w-3.5 shrink-0", LANG_COLORS[file.language] ?? "text-slate-500")} />
                <span className={cn("text-[12px] truncate", selectedFile.id === file.id ? "text-cyan-300" : "text-slate-400")}>
                  {file.name}
                </span>
                {file.modified && (
                  <Dot className="h-3 w-3 text-amber-400 shrink-0 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Editor toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.05] bg-[#050a14]/80">
          {/* File tabs */}
          <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-1 shrink-0">
              <FileCode2 className={cn("h-3 w-3", LANG_COLORS[selectedFile.language] ?? "text-slate-500")} />
              <span className="text-[12px] text-slate-300 font-mono">{selectedFile.path}</span>
              {selectedFile.modified && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors">
              <Save className="h-3 w-3" />
              Save
            </button>
            {runStatus === "running" ? (
              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[11px] text-red-400 hover:bg-red-500/15 transition-colors"
              >
                <Square className="h-3 w-3" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleRun}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/15 transition-colors"
              >
                <Play className="h-3 w-3" />
                Run
              </button>
            )}
          </div>
        </div>

        {/* Code editor */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 flex flex-col">
            {/* Editor */}
            <div className={cn("relative overflow-hidden transition-all", showOutput ? "flex-1" : "flex-1")}>
              <div className="absolute inset-0 overflow-auto">
                {/* Line numbers + editor overlay */}
                <div className="min-h-full relative">
                  {/* Syntax preview (rendered lines) */}
                  <div className="absolute inset-0 pointer-events-none select-none p-4 pl-0">
                    <div>{syntaxHighlight(code)}</div>
                  </div>
                  {/* Actual textarea (transparent, captures input) */}
                  <textarea
                    ref={editorRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    className="relative w-full h-full min-h-[200px] bg-transparent text-transparent caret-cyan-400 font-mono text-xs leading-5 resize-none focus:outline-none pl-14 pr-4 pt-4 pb-4"
                    style={{ caretColor: "#06b6d4" }}
                  />
                </div>
              </div>
            </div>

            {/* Terminal output */}
            <AnimatePresence>
              {showOutput && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 200 }}
                  exit={{ height: 0 }}
                  className="border-t border-white/[0.05] bg-[#030710] overflow-hidden flex flex-col"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.05]">
                    <Terminal className="h-3 w-3 text-cyan-400" />
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Output</span>
                    <div className="ml-auto flex items-center gap-2">
                      {runStatus === "running" && (
                        <span className="flex items-center gap-1.5 text-[10px] text-amber-400">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                          </span>
                          Running...
                        </span>
                      )}
                      {runStatus === "success" && (
                        <span className="text-[10px] text-emerald-400">✓ Done</span>
                      )}
                      {runStatus === "error" && (
                        <span className="text-[10px] text-red-400">✗ Failed</span>
                      )}
                      <button
                        onClick={() => setShowOutput(false)}
                        className="text-slate-600 hover:text-slate-400"
                      >
                        <Square className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-5">
                    <pre className={cn(
                      runStatus === "error" ? "text-red-400" : "text-emerald-400/90",
                      "whitespace-pre-wrap"
                    )}>
                      {output}
                      {runStatus === "running" && (
                        <span className="inline-block w-2 h-3.5 bg-cyan-400 animate-pulse ml-0.5 align-middle" />
                      )}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 px-4 py-1.5 border-t border-white/[0.05] bg-[#050a14]/80">
          <span className={cn("text-[10px] font-mono", LANG_COLORS[selectedFile.language] ?? "text-slate-500")}>
            {selectedFile.language}
          </span>
          <span className="text-[10px] text-slate-600 font-mono">
            {code.split("\n").length} lines
          </span>
          <span className="text-[10px] text-slate-600 font-mono">
            {code.length} chars
          </span>
          <div className="flex-1" />
          <span className="text-[10px] text-slate-600 font-mono">UTF-8</span>
          <span className="text-[10px] text-slate-600 font-mono">LF</span>
        </div>
      </div>
    </div>
  );
}
