import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getThread = query({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("threadId"), threadId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    agentId: v.optional(v.id("agents")),
    threadId: v.string(),
    metadata: v.optional(
      v.object({
        model: v.optional(v.string()),
        tokens: v.optional(v.number()),
        latency: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
