import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    return await ctx.db
      .query("events")
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    message: v.string(),
    severity: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("error"),
      v.literal("success")
    ),
    source: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
