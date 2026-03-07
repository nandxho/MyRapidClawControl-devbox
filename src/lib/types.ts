export type AgentStatus = "active" | "idle" | "error" | "offline";
export type TaskStatus = "pending" | "running" | "completed" | "failed";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type EventSeverity = "info" | "warning" | "error" | "success";
export type ContentType = "article" | "email" | "social" | "code" | "other";
export type ContentStatus = "draft" | "review" | "published";
export type MessageRole = "user" | "assistant" | "system";

export interface Agent {
  _id: string;
  name: string;
  status: AgentStatus;
  model: string;
  capabilities: string[];
  tasksCompleted: number;
  lastSeen: number;
  description?: string;
  memoryUsage?: number;
  tokensUsed?: number;
  uptime?: number;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  agentId?: string;
  agentName?: string;
  createdAt: number;
  completedAt?: number;
  durationMs?: number;
  tags?: string[];
  progress?: number;
}

export interface Message {
  _id: string;
  role: MessageRole;
  content: string;
  agentId?: string;
  threadId: string;
  timestamp: number;
  metadata?: {
    model?: string;
    tokens?: number;
    latency?: number;
  };
}

export interface Thread {
  id: string;
  title: string;
  agentId?: string;
  agentName?: string;
  lastMessage: string;
  timestamp: number;
  messageCount: number;
  pinned?: boolean;
}

export interface SystemEvent {
  _id: string;
  type: string;
  message: string;
  severity: EventSeverity;
  timestamp: number;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeDoc {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  source?: string;
  createdAt: number;
  updatedAt: number;
  wordCount?: number;
  category?: string;
}

export interface ContentItem {
  _id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  body: string;
  agentId?: string;
  agentName?: string;
  generatedAt: number;
  tags?: string[];
  wordCount?: number;
}

export interface SystemMetric {
  time: string;
  messages: number;
  tasks: number;
  latency: number;
  errors: number;
  tokens: number;
}

export interface GatewayHealth {
  status: "healthy" | "degraded" | "offline";
  latency: number;
  uptime: number;
  version: string;
}

export interface Notification {
  _id: string;
  title: string;
  body: string;
  severity: EventSeverity;
  timestamp: number;
  read: boolean;
  source?: string;
  actionUrl?: string;
}

export interface Integration {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  lastSync: number;
  icon: string;
}

export interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  path: string;
  modified: boolean;
}
