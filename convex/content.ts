import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("content").order("desc").collect();
  },
});

export const getByType = query({
  args: {
    type: v.union(
      v.literal("article"),
      v.literal("email"),
      v.literal("social"),
      v.literal("code"),
      v.literal("other")
    ),
  },
  handler: async (ctx, { type }) => {
    return await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("type"), type))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    type: v.union(
      v.literal("article"),
      v.literal("email"),
      v.literal("social"),
      v.literal("code"),
      v.literal("other")
    ),
    body: v.string(),
    agentId: v.optional(v.id("agents")),
    agentName: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    wordCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("content", {
      ...args,
      status: "draft",
      generatedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("content"),
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("published")
    ),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});
