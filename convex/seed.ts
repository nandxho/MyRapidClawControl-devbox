import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const MIN = 60_000;
    const HR = 3_600_000;

    // Seed agents
    const [ariaId, nexusId, echoId, voxId] = await Promise.all([
      ctx.db.insert("agents", {
        name: "ARIA",
        status: "active",
        model: "claude-opus-4-6",
        capabilities: ["research", "analysis", "writing", "reasoning"],
        tasksCompleted: 247,
        lastSeen: now - 12_000,
        description: "Advanced Research & Intelligence Agent",
        memoryUsage: 72,
        tokensUsed: 1_840_000,
        uptime: 99.8,
      }),
      ctx.db.insert("agents", {
        name: "NEXUS",
        status: "active",
        model: "claude-sonnet-4-6",
        capabilities: ["code", "debugging", "refactoring", "testing"],
        tasksCompleted: 183,
        lastSeen: now - 5_000,
        description: "Neural Execution & Code Unification System",
        memoryUsage: 58,
        tokensUsed: 920_000,
        uptime: 98.4,
      }),
      ctx.db.insert("agents", {
        name: "ECHO",
        status: "idle",
        model: "claude-haiku-4-5-20251001",
        capabilities: ["summarization", "translation", "classification"],
        tasksCompleted: 512,
        lastSeen: now - 8 * MIN,
        description: "Efficient Content & Knowledge Operations",
        memoryUsage: 34,
        tokensUsed: 3_100_000,
        uptime: 99.9,
      }),
      ctx.db.insert("agents", {
        name: "VOX",
        status: "idle",
        model: "claude-sonnet-4-6",
        capabilities: ["communication", "drafting", "social", "email"],
        tasksCompleted: 98,
        lastSeen: now - 22 * MIN,
        description: "Voice & Outreach Exchange Agent",
        memoryUsage: 29,
        tokensUsed: 450_000,
        uptime: 97.1,
      }),
    ]);

    // Seed tasks
    await Promise.all([
      ctx.db.insert("tasks", {
        title: "Synthesize Q4 market research report",
        description: "Aggregate competitor data and draft 12-page report",
        status: "running",
        priority: "high",
        agentId: ariaId,
        agentName: "ARIA",
        createdAt: now - 45 * MIN,
        progress: 68,
        tags: ["research", "report"],
      }),
      ctx.db.insert("tasks", {
        title: "Refactor authentication middleware",
        description: "Migrate JWT logic to new security module",
        status: "running",
        priority: "critical",
        agentId: nexusId,
        agentName: "NEXUS",
        createdAt: now - 20 * MIN,
        progress: 41,
        tags: ["code", "security"],
      }),
      ctx.db.insert("tasks", {
        title: "Classify 3,200 support tickets",
        status: "completed",
        priority: "medium",
        agentId: echoId,
        agentName: "ECHO",
        createdAt: now - 3 * HR,
        completedAt: now - 1 * HR,
        durationMs: 2 * HR,
        tags: ["classification"],
      }),
    ]);

    // Seed events
    await Promise.all([
      ctx.db.insert("events", {
        type: "task.started",
        message: "Task 'Synthesize Q4 market research report' started by ARIA",
        severity: "info",
        timestamp: now - 45 * MIN,
        source: "ARIA",
      }),
      ctx.db.insert("events", {
        type: "task.completed",
        message: "Task 'Classify 3,200 support tickets' completed in 2h 0m",
        severity: "success",
        timestamp: now - 1 * HR,
        source: "ECHO",
      }),
    ]);

    // Seed knowledge
    await ctx.db.insert("knowledge", {
      title: "Claude API Integration Guide",
      content: "Complete guide for integrating Anthropic Claude models via the API...",
      tags: ["claude", "api", "integration"],
      source: "Anthropic Docs",
      createdAt: now - 14 * 24 * HR,
      updatedAt: now - 1 * 24 * HR,
      wordCount: 6_180,
      category: "Technical",
    });

    // Seed content
    await ctx.db.insert("content", {
      title: "December Newsletter — Year in Review",
      type: "email",
      status: "draft",
      body: "Subject: 2025 — A Year of Intelligence\n\nDear [Name],\n\nWhat a year it has been...",
      agentId: voxId,
      agentName: "VOX",
      generatedAt: now - 2 * HR,
      tags: ["email", "newsletter"],
      wordCount: 412,
    });

    return {
      success: true,
      seeded: { agents: 4, tasks: 3, events: 2, knowledge: 1, content: 1 },
    };
  },
});
