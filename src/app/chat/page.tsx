"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Plus,
  Pin,
  MessageSquare,
  ChevronDown,
  Loader2,
  Cpu,
  Hash,
} from "lucide-react";
import { MOCK_THREADS, MOCK_MESSAGES, MOCK_AGENTS } from "@/lib/mock-data";
import { formatRelativeTime, cn, generateId } from "@/lib/utils";
import type { Message, Thread } from "@/lib/types";

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[11px] text-slate-600 font-mono px-2">{message.content}</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3 group", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold font-mono mt-0.5",
        isUser
          ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
          : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
      )}>
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      {/* Bubble */}
      <div className={cn("max-w-[75%] space-y-1", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-violet-500/[0.12] border border-violet-500/20 text-slate-200 rounded-tr-sm"
            : "bg-white/[0.03] border border-white/[0.08] text-slate-300 rounded-tl-sm"
        )}>
          <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{message.content}</pre>
        </div>
        <div className={cn("flex items-center gap-2 px-1", isUser ? "justify-end" : "justify-start")}>
          <span className="text-[10px] text-slate-600 font-mono">
            {formatRelativeTime(message.timestamp)}
          </span>
          {message.metadata && (
            <>
              {message.metadata.tokens && (
                <span className="flex items-center gap-0.5 text-[10px] text-slate-700">
                  <Hash className="h-2.5 w-2.5" />{message.metadata.tokens}t
                </span>
              )}
              {message.metadata.latency && (
                <span className="flex items-center gap-0.5 text-[10px] text-slate-700">
                  <Cpu className="h-2.5 w-2.5" />{message.metadata.latency}ms
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatPage() {
  const [selectedThread, setSelectedThread] = useState<Thread>(MOCK_THREADS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES[MOCK_THREADS[0].id] ?? []);
  const [input, setInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(MOCK_AGENTS[0]._id);
  const [isTyping, setIsTyping] = useState(false);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeAgent = useMemo(
    () => MOCK_AGENTS.find((a) => a._id === selectedAgent) ?? MOCK_AGENTS[0],
    [selectedAgent]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleThreadSelect = (thread: Thread) => {
    setSelectedThread(thread);
    setMessages(MOCK_MESSAGES[thread.id] ?? []);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      _id: generateId(),
      role: "user",
      content: trimmed,
      threadId: selectedThread.id,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const response: Message = {
        _id: generateId(),
        role: "assistant",
        content: `Understood. Processing your request: "${trimmed.slice(0, 80)}${trimmed.length > 80 ? "..." : ""}"\n\nI'll work on this and provide a detailed response shortly.`,
        agentId: activeAgent._id,
        threadId: selectedThread.id,
        timestamp: Date.now(),
        metadata: { model: activeAgent.model, tokens: Math.floor(Math.random() * 200) + 50, latency: Math.floor(Math.random() * 800) + 200 },
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Thread list */}
      <div className="w-56 shrink-0 border-r border-white/[0.05] flex flex-col">
        <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.05]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Threads</span>
          <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/[0.04] text-slate-500 hover:text-slate-300 transition-colors">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-1.5 space-y-0.5 px-1.5">
          {MOCK_THREADS.map((thread) => (
            <button
              key={thread.id}
              onClick={() => handleThreadSelect(thread)}
              className={cn(
                "w-full rounded-lg px-2.5 py-2 text-left transition-all",
                selectedThread.id === thread.id
                  ? "bg-cyan-500/[0.08] border border-cyan-500/[0.15]"
                  : "hover:bg-white/[0.03] border border-transparent"
              )}
            >
              <div className="flex items-start gap-2">
                {thread.pinned && <Pin className="h-2.5 w-2.5 text-cyan-500 shrink-0 mt-0.5" />}
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[12px] font-medium truncate", selectedThread.id === thread.id ? "text-cyan-300" : "text-slate-300")}>
                    {thread.title}
                  </p>
                  <p className="text-[10px] text-slate-600 truncate mt-0.5">{thread.lastMessage}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] text-slate-700 font-mono">{thread.agentName}</span>
                    <span className="text-[9px] text-slate-700">·</span>
                    <span className="text-[9px] text-slate-700">{thread.messageCount} msgs</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]">
          <MessageSquare className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-slate-200 truncate">{selectedThread.title}</h2>
            <p className="text-[10px] text-slate-500">{messages.length} messages</p>
          </div>
          {/* Agent selector */}
          <div className="relative">
            <button
              onClick={() => setShowAgentPicker(!showAgentPicker)}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/10 text-[9px] font-bold text-cyan-400 font-mono">
                {activeAgent.name.slice(0, 2)}
              </div>
              {activeAgent.name}
              <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {showAgentPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-white/[0.08] bg-[#0a1120] shadow-xl overflow-hidden"
                >
                  {MOCK_AGENTS.filter((a) => a.status !== "offline").map((agent) => (
                    <button
                      key={agent._id}
                      onClick={() => { setSelectedAgent(agent._id); setShowAgentPicker(false); }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors",
                        selectedAgent === agent._id
                          ? "bg-cyan-500/[0.08] text-cyan-300"
                          : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
                      )}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/10 text-[9px] font-bold text-cyan-400 font-mono">
                        {agent.name.slice(0, 2)}
                      </span>
                      {agent.name}
                      <span className={cn("ml-auto h-1.5 w-1.5 rounded-full", agent.status === "active" ? "bg-emerald-400" : "bg-amber-400")} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg._id} message={msg} />
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                  <Bot className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5">
                  <Loader2 className="h-3 w-3 text-cyan-400 animate-spin" />
                  <span className="text-xs text-slate-500">{activeAgent.name} is thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.05] p-4">
          <div className="flex items-end gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeAgent.name}... (Enter to send, Shift+Enter for newline)`}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none leading-relaxed max-h-32 overflow-y-auto"
              style={{ minHeight: "1.5rem" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                input.trim() && !isTyping
                  ? "bg-cyan-500 text-[#050a14] hover:bg-cyan-400"
                  : "bg-white/[0.04] text-slate-600 cursor-not-allowed"
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-700 text-center">
            Routed to <span className="text-cyan-600">{activeAgent.name}</span> ({activeAgent.model})
          </p>
        </div>
      </div>
    </div>
  );
}
