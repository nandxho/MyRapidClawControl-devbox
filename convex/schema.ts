import { defineSchema, defineTable } from "convex/server";
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
    memoryUsage: v.optional(v.number()),
    tokensUsed: v.optional(v.number()),
    uptime: v.optional(v.number()),
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
    agentName: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    progress: v.optional(v.number()),
  }),

  messages: defineTable({
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    content: v.string(),
    agentId: v.optional(v.id("agents")),
    threadId: v.string(),
    timestamp: v.number(),
    metadata: v.optional(
      v.object({
        model: v.optional(v.string()),
        tokens: v.optional(v.number()),
        latency: v.optional(v.number()),
      })
    ),
  }),

  events: defineTable({
    type: v.string(),
    message: v.string(),
    severity: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("error"),
      v.literal("success")
    ),
    timestamp: v.number(),
    source: v.optional(v.string()),
    metadata: v.optional(v.any()),
  }),

  knowledge: defineTable({
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    source: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    wordCount: v.optional(v.number()),
    category: v.optional(v.string()),
  }),

  content: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("article"),
      v.literal("email"),
      v.literal("social"),
      v.literal("code"),
      v.literal("other")
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("published")
    ),
    body: v.string(),
    agentId: v.optional(v.id("agents")),
    agentName: v.optional(v.string()),
    generatedAt: v.number(),
    tags: v.optional(v.array(v.string())),
    wordCount: v.optional(v.number()),
  }),

  settings: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
  }),
});
