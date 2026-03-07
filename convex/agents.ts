import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("agents").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    model: v.string(),
    capabilities: v.array(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      ...args,
      status: "idle",
      tasksCompleted: 0,
      lastSeen: Date.now(),
    });
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
});

export const update = mutation({
  args: {
    id: v.id("agents"),
    name: v.optional(v.string()),
    model: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    memoryUsage: v.optional(v.number()),
    tokensUsed: v.optional(v.number()),
    uptime: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, { ...updates, lastSeen: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
