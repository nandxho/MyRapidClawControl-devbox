import type {
  Agent,
  Task,
  Message,
  Thread,
  SystemEvent,
  KnowledgeDoc,
  ContentItem,
  SystemMetric,
  Notification,
  Integration,
  CodeFile,
} from "./types";

const NOW = Date.now();
const MIN = 60_000;
const HR = 3_600_000;

// ─── Agents ────────────────────────────────────────────────
export const MOCK_AGENTS: Agent[] = [
  {
    _id: "agent_aria",
    name: "ARIA",
    status: "active",
    model: "claude-opus-4-6",
    capabilities: ["research", "analysis", "writing", "reasoning"],
    tasksCompleted: 247,
    lastSeen: NOW - 12_000,
    description: "Advanced Research & Intelligence Agent",
    memoryUsage: 72,
    tokensUsed: 1_840_000,
    uptime: 99.8,
  },
  {
    _id: "agent_nexus",
    name: "NEXUS",
    status: "active",
    model: "claude-sonnet-4-6",
    capabilities: ["code", "debugging", "refactoring", "testing"],
    tasksCompleted: 183,
    lastSeen: NOW - 5_000,
    description: "Neural Execution & Code Unification System",
    memoryUsage: 58,
    tokensUsed: 920_000,
    uptime: 98.4,
  },
  {
    _id: "agent_echo",
    name: "ECHO",
    status: "idle",
    model: "claude-haiku-4-5-20251001",
    capabilities: ["summarization", "translation", "classification"],
    tasksCompleted: 512,
    lastSeen: NOW - 8 * MIN,
    description: "Efficient Content & Knowledge Operations",
    memoryUsage: 34,
    tokensUsed: 3_100_000,
    uptime: 99.9,
  },
  {
    _id: "agent_vox",
    name: "VOX",
    status: "idle",
    model: "claude-sonnet-4-6",
    capabilities: ["communication", "drafting", "social", "email"],
    tasksCompleted: 98,
    lastSeen: NOW - 22 * MIN,
    description: "Voice & Outreach Exchange Agent",
    memoryUsage: 29,
    tokensUsed: 450_000,
    uptime: 97.1,
  },
  {
    _id: "agent_forge",
    name: "FORGE",
    status: "error",
    model: "claude-opus-4-6",
    capabilities: ["data-pipeline", "etl", "automation", "workflows"],
    tasksCompleted: 61,
    lastSeen: NOW - 2 * HR,
    description: "Flow Orchestration & Resource Generation Engine",
    memoryUsage: 91,
    tokensUsed: 230_000,
    uptime: 84.2,
  },
  {
    _id: "agent_scout",
    name: "SCOUT",
    status: "offline",
    model: "claude-haiku-4-5-20251001",
    capabilities: ["web-search", "scraping", "monitoring"],
    tasksCompleted: 34,
    lastSeen: NOW - 6 * HR,
    description: "Search, Crawl & Observation Unified Tool",
    memoryUsage: 0,
    tokensUsed: 180_000,
    uptime: 0,
  },
];

// ─── Tasks ────────────────────────────────────────────────
export const MOCK_TASKS: Task[] = [
  {
    _id: "task_01",
    title: "Synthesize Q4 market research report",
    description: "Aggregate competitor data and draft 12-page report",
    status: "running",
    priority: "high",
    agentId: "agent_aria",
    agentName: "ARIA",
    createdAt: NOW - 45 * MIN,
    progress: 68,
    tags: ["research", "report"],
  },
  {
    _id: "task_02",
    title: "Refactor authentication middleware",
    description: "Migrate JWT logic to new security module",
    status: "running",
    priority: "critical",
    agentId: "agent_nexus",
    agentName: "NEXUS",
    createdAt: NOW - 20 * MIN,
    progress: 41,
    tags: ["code", "security"],
  },
  {
    _id: "task_03",
    title: "Generate newsletter for December subscribers",
    status: "pending",
    priority: "medium",
    agentId: "agent_vox",
    agentName: "VOX",
    createdAt: NOW - 5 * MIN,
    tags: ["email", "content"],
  },
  {
    _id: "task_04",
    title: "Classify 3,200 support tickets",
    status: "completed",
    priority: "medium",
    agentId: "agent_echo",
    agentName: "ECHO",
    createdAt: NOW - 3 * HR,
    completedAt: NOW - 1 * HR,
    durationMs: 2 * HR,
    tags: ["classification"],
  },
  {
    _id: "task_05",
    title: "Deploy staging environment checks",
    status: "failed",
    priority: "high",
    agentId: "agent_forge",
    agentName: "FORGE",
    createdAt: NOW - 4 * HR,
    completedAt: NOW - 2 * HR,
    tags: ["devops", "automation"],
  },
  {
    _id: "task_06",
    title: "Translate onboarding docs to Spanish",
    status: "completed",
    priority: "low",
    agentId: "agent_echo",
    agentName: "ECHO",
    createdAt: NOW - 8 * HR,
    completedAt: NOW - 6 * HR,
    durationMs: 2 * HR,
    tags: ["translation", "docs"],
  },
  {
    _id: "task_07",
    title: "Analyze competitor pricing strategies",
    status: "pending",
    priority: "high",
    agentId: "agent_aria",
    agentName: "ARIA",
    createdAt: NOW - 2 * MIN,
    tags: ["research", "analysis"],
  },
  {
    _id: "task_08",
    title: "Write unit tests for payment module",
    status: "pending",
    priority: "critical",
    agentId: "agent_nexus",
    agentName: "NEXUS",
    createdAt: NOW - 1 * MIN,
    tags: ["testing", "code"],
  },
];

// ─── Threads & Messages ───────────────────────────────────
export const MOCK_THREADS: Thread[] = [
  {
    id: "thread_01",
    title: "Q4 Market Research Planning",
    agentId: "agent_aria",
    agentName: "ARIA",
    lastMessage: "I've started compiling the competitor analysis. Found 3 key trends worth highlighting...",
    timestamp: NOW - 45 * MIN,
    messageCount: 14,
    pinned: true,
  },
  {
    id: "thread_02",
    title: "Auth Middleware Refactor",
    agentId: "agent_nexus",
    agentName: "NEXUS",
    lastMessage: "The new JWT validation is ready. Running security tests now.",
    timestamp: NOW - 20 * MIN,
    messageCount: 8,
  },
  {
    id: "thread_03",
    title: "December Newsletter Draft",
    agentId: "agent_vox",
    agentName: "VOX",
    lastMessage: "Here are 3 subject line options for the newsletter...",
    timestamp: NOW - 2 * HR,
    messageCount: 5,
  },
  {
    id: "thread_04",
    title: "Data Pipeline Investigation",
    agentId: "agent_forge",
    agentName: "FORGE",
    lastMessage: "Error traced to rate limiting on the external API. Recommend implementing backoff.",
    timestamp: NOW - 5 * HR,
    messageCount: 22,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  thread_01: [
    {
      _id: "msg_01",
      role: "user",
      content: "ARIA, I need a comprehensive Q4 market research report. Focus on our top 5 competitors.",
      agentId: "agent_aria",
      threadId: "thread_01",
      timestamp: NOW - 45 * MIN,
    },
    {
      _id: "msg_02",
      role: "assistant",
      content:
        "Understood. I'll structure the report around competitive positioning, pricing strategies, and feature parity analysis. I've already pulled public data from 3 of the 5 targets.\n\nShall I prioritize any specific competitors, or proceed alphabetically?",
      agentId: "agent_aria",
      threadId: "thread_01",
      timestamp: NOW - 44 * MIN,
      metadata: { model: "claude-opus-4-6", tokens: 142, latency: 890 },
    },
    {
      _id: "msg_03",
      role: "user",
      content: "Start with Acme Corp and Pinnacle Labs. They're the biggest threats.",
      agentId: "agent_aria",
      threadId: "thread_01",
      timestamp: NOW - 43 * MIN,
    },
    {
      _id: "msg_04",
      role: "assistant",
      content:
        "Confirmed. Acme Corp and Pinnacle Labs first.\n\n**Acme Corp Initial Findings:**\n- Launched 4 new features in Q3 (vs our 6)\n- Dropped enterprise pricing by ~12%\n- Strong uptick in LinkedIn engagement — 34% YoY\n\n**Pinnacle Labs:**\n- Recently acquired DataMesh Inc — integration timeline unclear\n- Their API docs updated 3 weeks ago with breaking changes\n- 2 key engineers posted about new ML capabilities on X\n\nContinuing deeper analysis. ETA: ~35 minutes for full draft.",
      agentId: "agent_aria",
      threadId: "thread_01",
      timestamp: NOW - 40 * MIN,
      metadata: { model: "claude-opus-4-6", tokens: 318, latency: 1240 },
    },
    {
      _id: "msg_05",
      role: "user",
      content: "Great start. Keep going — what's the overall trend?",
      agentId: "agent_aria",
      threadId: "thread_01",
      timestamp: NOW - 38 * MIN,
    },
    {
      _id: "msg_06",
      role: "assistant",
      content:
        "I've started compiling the competitor analysis. Found 3 key trends worth highlighting:\n\n1. **Commoditization of core features** — all major players are converging on the same baseline. Differentiation is moving to integrations and UX.\n2. **AI-first positioning** — 4 of 5 competitors rebranded at least one feature as \"AI-powered\" in Q3.\n3. **Pricing pressure** — median enterprise contract value dropped 8% industry-wide.\n\nDraft is 68% complete. Full report by end of session.",
      agentId: "agent_aria",
      threadId: "thread_01",
      timestamp: NOW - 35 * MIN,
      metadata: { model: "claude-opus-4-6", tokens: 291, latency: 1100 },
    },
  ],
};

// ─── Events ───────────────────────────────────────────────
export const MOCK_EVENTS: SystemEvent[] = [
  {
    _id: "evt_01",
    type: "task.started",
    message: "Task 'Synthesize Q4 market research report' started by ARIA",
    severity: "info",
    timestamp: NOW - 45 * MIN,
    source: "ARIA",
  },
  {
    _id: "evt_02",
    type: "task.started",
    message: "Task 'Refactor authentication middleware' started by NEXUS",
    severity: "info",
    timestamp: NOW - 20 * MIN,
    source: "NEXUS",
  },
  {
    _id: "evt_03",
    type: "agent.error",
    message: "FORGE exceeded memory threshold (91%). Task execution paused.",
    severity: "error",
    timestamp: NOW - 2 * HR,
    source: "FORGE",
  },
  {
    _id: "evt_04",
    type: "task.completed",
    message: "Task 'Classify 3,200 support tickets' completed in 2h 0m",
    severity: "success",
    timestamp: NOW - 1 * HR,
    source: "ECHO",
  },
  {
    _id: "evt_05",
    type: "task.failed",
    message: "Task 'Deploy staging environment checks' failed: API rate limit exceeded",
    severity: "error",
    timestamp: NOW - 2 * HR,
    source: "FORGE",
  },
  {
    _id: "evt_06",
    type: "agent.offline",
    message: "SCOUT went offline — last heartbeat 6h ago",
    severity: "warning",
    timestamp: NOW - 6 * HR,
    source: "SCOUT",
  },
  {
    _id: "evt_07",
    type: "system.update",
    message: "Gateway model registry updated to claude-opus-4-6",
    severity: "info",
    timestamp: NOW - 8 * HR,
    source: "SYSTEM",
  },
  {
    _id: "evt_08",
    type: "task.completed",
    message: "Task 'Translate onboarding docs to Spanish' completed in 2h 0m",
    severity: "success",
    timestamp: NOW - 6 * HR,
    source: "ECHO",
  },
  {
    _id: "evt_09",
    type: "security.alert",
    message: "Unusual API call pattern detected from agent FORGE — under review",
    severity: "warning",
    timestamp: NOW - 3 * HR,
    source: "SYSTEM",
  },
  {
    _id: "evt_10",
    type: "system.health",
    message: "All systems nominal. Gateway latency: 42ms",
    severity: "success",
    timestamp: NOW - 30 * MIN,
    source: "SYSTEM",
  },
];

// ─── Knowledge Base ───────────────────────────────────────
export const MOCK_KNOWLEDGE: KnowledgeDoc[] = [
  {
    _id: "kb_01",
    title: "Agent Interaction Protocols v2.1",
    content:
      "Defines standard communication patterns between OpenClaw agents, including handoff procedures, context passing, and error escalation paths...",
    tags: ["protocols", "agents", "internal"],
    source: "Internal Wiki",
    createdAt: NOW - 7 * 24 * HR,
    updatedAt: NOW - 2 * 24 * HR,
    wordCount: 3_420,
    category: "Operations",
  },
  {
    _id: "kb_02",
    title: "Claude API Integration Guide",
    content:
      "Complete guide for integrating Anthropic Claude models via the API. Covers authentication, streaming, tool use, and rate limiting strategies...",
    tags: ["claude", "api", "integration", "anthropic"],
    source: "Anthropic Docs",
    createdAt: NOW - 14 * 24 * HR,
    updatedAt: NOW - 1 * 24 * HR,
    wordCount: 6_180,
    category: "Technical",
  },
  {
    _id: "kb_03",
    title: "Q3 2025 Competitive Intelligence Report",
    content:
      "Comprehensive analysis of competitor landscape for Q3 2025. Covers market positioning, feature comparison, and strategic opportunities...",
    tags: ["research", "competitive", "strategy", "q3"],
    createdAt: NOW - 30 * 24 * HR,
    updatedAt: NOW - 20 * 24 * HR,
    wordCount: 8_900,
    category: "Research",
  },
  {
    _id: "kb_04",
    title: "Prompt Engineering Best Practices",
    content:
      "Curated guide on writing effective prompts for Claude models. Includes system prompts, chain-of-thought, few-shot examples, and output formatting...",
    tags: ["prompting", "claude", "best-practices"],
    source: "Internal Research",
    createdAt: NOW - 5 * 24 * HR,
    updatedAt: NOW - 5 * 24 * HR,
    wordCount: 4_250,
    category: "Technical",
  },
  {
    _id: "kb_05",
    title: "Data Handling & Privacy Policy",
    content:
      "Outlines procedures for handling sensitive customer data within the OpenClaw system. Covers PII, retention periods, and agent access controls...",
    tags: ["privacy", "compliance", "security", "data"],
    source: "Legal",
    createdAt: NOW - 60 * 24 * HR,
    updatedAt: NOW - 10 * 24 * HR,
    wordCount: 2_800,
    category: "Compliance",
  },
  {
    _id: "kb_06",
    title: "Deployment & Infrastructure Runbook",
    content:
      "Step-by-step runbook for deploying and managing OpenClaw infrastructure on AWS. Covers ECS, RDS, Convex, and monitoring stack...",
    tags: ["devops", "deployment", "aws", "infrastructure"],
    source: "Engineering",
    createdAt: NOW - 45 * 24 * HR,
    updatedAt: NOW - 3 * 24 * HR,
    wordCount: 5_600,
    category: "Operations",
  },
];

// ─── Content ──────────────────────────────────────────────
export const MOCK_CONTENT: ContentItem[] = [
  {
    _id: "cnt_01",
    title: "December Newsletter — Year in Review",
    type: "email",
    status: "draft",
    body: "Subject: 2025 — A Year of Intelligence\n\nDear [Name],\n\nWhat a year it has been...",
    agentId: "agent_vox",
    agentName: "VOX",
    generatedAt: NOW - 2 * HR,
    tags: ["email", "newsletter", "december"],
    wordCount: 412,
  },
  {
    _id: "cnt_02",
    title: "Blog: Why AI Agents Are the Future of Work",
    type: "article",
    status: "review",
    body: "The future of knowledge work isn't about replacing humans — it's about augmenting them...",
    agentId: "agent_aria",
    agentName: "ARIA",
    generatedAt: NOW - 24 * HR,
    tags: ["blog", "ai", "thought-leadership"],
    wordCount: 1_840,
  },
  {
    _id: "cnt_03",
    title: "LinkedIn: Q4 Product Milestone Announcement",
    type: "social",
    status: "published",
    body: "Exciting news from the OpenClaw team! We just hit 1M tasks processed — a milestone we couldn't have...",
    agentId: "agent_vox",
    agentName: "VOX",
    generatedAt: NOW - 3 * 24 * HR,
    tags: ["social", "linkedin", "milestone"],
    wordCount: 220,
  },
  {
    _id: "cnt_04",
    title: "API Documentation — Agents Endpoint",
    type: "code",
    status: "published",
    body: "## GET /api/v1/agents\n\nReturns a list of all registered agents...",
    agentId: "agent_nexus",
    agentName: "NEXUS",
    generatedAt: NOW - 5 * 24 * HR,
    tags: ["docs", "api", "technical"],
    wordCount: 980,
  },
  {
    _id: "cnt_05",
    title: "Sales Email: Enterprise Tier Outreach",
    type: "email",
    status: "draft",
    body: "Hi [Name],\n\nI noticed your team has been scaling rapidly and wanted to reach out about...",
    agentId: "agent_vox",
    agentName: "VOX",
    generatedAt: NOW - 6 * HR,
    tags: ["email", "sales", "enterprise"],
    wordCount: 310,
  },
  {
    _id: "cnt_06",
    title: "Twitter/X Thread: AI Automation Tips",
    type: "social",
    status: "review",
    body: "🧵 10 ways AI agents will change your workflow in 2026:\n\n1/ Automated research pipelines...",
    agentId: "agent_vox",
    agentName: "VOX",
    generatedAt: NOW - 12 * HR,
    tags: ["social", "twitter", "tips"],
    wordCount: 580,
  },
];

// ─── Notifications ────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    _id: "notif_01",
    title: "FORGE memory threshold exceeded",
    body: "Agent FORGE is using 91% of allocated memory. Consider restarting the agent.",
    severity: "error",
    timestamp: NOW - 2 * HR,
    read: false,
    source: "FORGE",
  },
  {
    _id: "notif_02",
    title: "Task completed: Support ticket classification",
    body: "ECHO successfully classified 3,200 tickets in 2 hours.",
    severity: "success",
    timestamp: NOW - 1 * HR,
    read: false,
    source: "ECHO",
  },
  {
    _id: "notif_03",
    title: "SCOUT went offline",
    body: "Agent SCOUT has not sent a heartbeat in 6 hours. Check connectivity.",
    severity: "warning",
    timestamp: NOW - 6 * HR,
    read: true,
    source: "SCOUT",
  },
  {
    _id: "notif_04",
    title: "Security pattern alert",
    body: "Unusual API call volume detected from FORGE — 3x normal rate.",
    severity: "warning",
    timestamp: NOW - 3 * HR,
    read: true,
    source: "SYSTEM",
  },
  {
    _id: "notif_05",
    title: "Gateway model registry updated",
    body: "All agents upgraded to claude-opus-4-6 as default model.",
    severity: "info",
    timestamp: NOW - 8 * HR,
    read: true,
    source: "SYSTEM",
  },
];

// ─── Integrations ──────────────────────────────────────────
export const MOCK_INTEGRATIONS: Integration[] = [
  { id: "int_01", name: "Anthropic API", status: "connected", lastSync: NOW - 5 * MIN, icon: "🤖" },
  { id: "int_02", name: "Convex Database", status: "connected", lastSync: NOW - 1 * MIN, icon: "⚡" },
  { id: "int_03", name: "GitHub", status: "connected", lastSync: NOW - 15 * MIN, icon: "🐙" },
  { id: "int_04", name: "Slack", status: "disconnected", lastSync: NOW - 24 * HR, icon: "💬" },
  { id: "int_05", name: "Linear", status: "error", lastSync: NOW - 3 * HR, icon: "📐" },
  { id: "int_06", name: "Notion", status: "connected", lastSync: NOW - 30 * MIN, icon: "📄" },
];

// ─── System Metrics ───────────────────────────────────────
export function generateMetrics(points: number = 24): SystemMetric[] {
  return Array.from({ length: points }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    messages: Math.floor(Math.random() * 120) + 30,
    tasks: Math.floor(Math.random() * 40) + 5,
    latency: Math.floor(Math.random() * 180) + 40,
    errors: Math.floor(Math.random() * 8),
    tokens: Math.floor(Math.random() * 50_000) + 10_000,
  }));
}

// ─── Code Files ───────────────────────────────────────────
export const MOCK_CODE_FILES: CodeFile[] = [
  {
    id: "file_01",
    name: "agents.ts",
    language: "typescript",
    path: "convex/agents.ts",
    modified: false,
    content: `import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("agents")
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("error"),
      v.literal("offline")
    ),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status, lastSeen: Date.now() });
  },
});`,
  },
  {
    id: "file_02",
    name: "schema.ts",
    language: "typescript",
    path: "convex/schema.ts",
    modified: true,
    content: `import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agents: defineTable({
    name: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("error"),
      v.literal("offline")
    ),
    model: v.string(),
    capabilities: v.array(v.string()),
    tasksCompleted: v.number(),
    lastSeen: v.number(),
    description: v.optional(v.string()),
  }),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    agentId: v.optional(v.id("agents")),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    progress: v.optional(v.number()),
  }),
});`,
  },
  {
    id: "file_03",
    name: "seed.ts",
    language: "typescript",
    path: "convex/seed.ts",
    modified: false,
    content: `import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    const agentIds = await Promise.all([
      ctx.db.insert("agents", {
        name: "ARIA",
        status: "active",
        model: "claude-opus-4-6",
        capabilities: ["research", "analysis", "writing"],
        tasksCompleted: 247,
        lastSeen: Date.now(),
        description: "Advanced Research & Intelligence Agent",
      }),
      ctx.db.insert("agents", {
        name: "NEXUS",
        status: "active",
        model: "claude-sonnet-4-6",
        capabilities: ["code", "debugging", "testing"],
        tasksCompleted: 183,
        lastSeen: Date.now(),
        description: "Neural Execution & Code Unification System",
      }),
    ]);

    console.log("Seeded agents:", agentIds);
    return { success: true, agentCount: agentIds.length };
  },
});`,
  },
];
