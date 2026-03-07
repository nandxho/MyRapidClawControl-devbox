import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("status"), status))
      .order("desc")
      .collect();
  },
});

export const getByAgent = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("agentId"), agentId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    agentId: v.optional(v.id("agents")),
    agentName: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const updateProgress = mutation({
  args: {
    id: v.id("tasks"),
    progress: v.number(),
  },
  handler: async (ctx, { id, progress }) => {
    await ctx.db.patch(id, { progress });
  },
});

export const complete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get(id);
    if (!task) return;
    const now = Date.now();
    await ctx.db.patch(id, {
      status: "completed",
      completedAt: now,
      durationMs: now - task.createdAt,
      progress: 100,
    });
    if (task.agentId) {
      const agent = await ctx.db.get(task.agentId);
      if (agent) {
        await ctx.db.patch(task.agentId, {
          tasksCompleted: agent.tasksCompleted + 1,
        });
      }
    }
  },
});

export const fail = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, {
      status: "failed",
      completedAt: Date.now(),
    });
  },
});
