# OpenClaw // Mission Control (devbox track)

Ultra-premium real-time dashboard for the OpenClaw agent system. Built with Next.js 15, Convex, Tailwind CSS v4, Framer Motion, and TypeScript.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Real-time backend | Convex |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| UI Primitives | Radix UI |
| Language | TypeScript (strict) |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — system overview, metrics, activity feed |
| `/ops` | Operations — task queue, system metrics, event logs |
| `/agents` | Agents — management, status, configuration |
| `/chat` | Chat — threaded conversations with agents |
| `/content` | Content — library and generation interface |
| `/comms` | Communications — notifications, integrations, alert rules |
| `/knowledge` | Knowledge Base — searchable document library |
| `/code` | Code — editor with terminal output |

---

## Prerequisites

- Node.js 18+
- npm / pnpm / bun
- A Convex account (for real-time features): https://dashboard.convex.dev

---

## Quick Start

### 1. Clone and install dependencies

```bash
cd openclaw-mission-control
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
WORKSPACE_PATH=/Users/yourname/projects/openclaw
```

### 3. Set up Convex (optional — app works with mock data without it)

```bash
npx convex dev
```

This will:
- Create a new Convex project (or connect to an existing one)
- Generate `convex/_generated/` with real typed files
- Start the local Convex dev server
- Replace the stub `convex/_generated/api.ts` with the real typed version

### 4. Seed the database (optional)

Once Convex is running, open the Convex dashboard and call:

```
seed.seedDatabase()
```

Or use the Convex CLI:

```bash
npx convex run seed:seedDatabase
```

### 5. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

---

## API Routes

### `GET /api/health`

Returns gateway health status.

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime": 3600,
  "timestamp": "2026-03-07T12:00:00.000Z",
  "services": {
    "nextjs": "healthy",
    "convex": "configured",
    "workspace": "configured"
  }
}
```

### `GET /api/workspace`

Returns the configured workspace path.

```json
{
  "path": "/Users/yourname/projects/openclaw",
  "exists": true,
  "isDirectory": true,
  "basename": "openclaw"
}
```

### `POST /api/workspace`

Validates a workspace path.

```json
// Request body
{ "path": "/absolute/path/to/workspace" }
```

---

## Convex Schema

The database has 7 tables:

- **agents** — registered AI agents with status, model, and metrics
- **tasks** — work items assigned to agents
- **messages** — chat messages organized by thread
- **events** — system event log
- **knowledge** — document knowledge base
- **content** — generated content library
- **settings** — key-value configuration store

---

## Architecture Notes

- **Mock data mode**: When `NEXT_PUBLIC_CONVEX_URL` is not set, the app uses `src/lib/mock-data.ts` for all data display. Ideal for development and demos.
- **Convex mode**: When Convex URL is set and `npx convex dev` is running, real-time data flows automatically.
- **The `convex/_generated/` stubs**: These allow TypeScript to compile without running Convex. Running `npx convex dev` replaces them with real typed versions.

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or via CLI:
vercel env add NEXT_PUBLIC_CONVEX_URL
vercel env add WORKSPACE_PATH
```

Make sure to also run `npx convex deploy` to deploy your Convex backend:

```bash
npx convex deploy
```

---

## Design System

- **Background**: `#050a14` — deep navy black
- **Primary accent**: `#06b6d4` — cyan 500 (JARVIS blue)
- **Secondary**: `#8b5cf6` — violet 500
- **Glass cards**: `bg-white/[0.02] backdrop-blur-sm border border-white/[0.06]`
- **Font**: Inter (UI) + JetBrains Mono (code/data)
- **Dark mode only**


---

## Scope Change (Cloud-Ready v2)

This project was updated for cloud deployment (Zeabur/VPS):

- Production mode now uses `SOURCE_MODE=ingest` by default.
- Filesystem-bound runtime dependencies are disabled in cloud mode.
- New authenticated ingest endpoint: `POST /api/ingest` with `X-Ingest-Token`.
- Local filesystem endpoint `/api/workspace` remains available only for `SOURCE_MODE=local` (debug/local development).

### Why

In cloud environments, `~/.openclaw/workspace` is container-local and not the same host as OpenClaw.
For reliable production data, OpenClaw should push normalized events to ingest endpoints.

### Updated Original Prompt (v2 - Cloud Scope)

> Build a Mission Control dashboard for OpenClaw using Next.js 15 + TypeScript + Tailwind + Convex.
> Cloud-first requirement: do not rely on local filesystem paths in production.
> Use authenticated ingest APIs as the primary data source (`/api/ingest`, `X-Ingest-Token`).
> Keep local file reads optional and gated behind `SOURCE_MODE=local` for development only.
> Maintain the 8-page UX (Home, OPS, AGENTS, CHAT, CONTENT, COMMS, KNOWLEDGE, CODE),
> premium dark UI, responsive layout, health polling, search, and documented deploy steps.

### Environment Variables (v2)

- `SOURCE_MODE=ingest|local`
- `INGEST_AUTH_TOKEN=<secret>`
- `NEXT_PUBLIC_CONVEX_URL=<url>`
- `WORKSPACE_PATH=<local-only path>` (used only in local mode)

---

## Scope Change (Cloud-Ready v3 - Supabase Free)

This project migrated from Convex-first to **Supabase-first** to keep production costs near zero.

### What changed
- Primary backend/storage is Supabase (free tier).
- `POST /api/ingest` persists events into `ingest_events` when Supabase is configured.
- `GET /api/events` returns recent ingested events.
- Local filesystem endpoints stay optional and gated by `SOURCE_MODE=local`.

### Updated Original Prompt (v3 - Supabase Scope)
> Build a Mission Control dashboard for OpenClaw using Next.js 15 + TypeScript + Tailwind.
> Use Supabase (free tier) as the primary backend for production data.
> Do not rely on local filesystem paths in production.
> Use authenticated ingest APIs (`/api/ingest`, `X-Ingest-Token`) as the primary data source.
> Keep local file reads optional and gated behind `SOURCE_MODE=local` for development only.
> Maintain the 8-page UX (Home, OPS, AGENTS, CHAT, CONTENT, COMMS, KNOWLEDGE, CODE), premium dark UI, responsive layout, health polling, search, and deploy documentation.

### Supabase SQL (run once)
```sql
create table if not exists public.ingest_events (
  id bigint generated always as identity primary key,
  source text not null,
  event_type text not null,
  event_time timestamptz not null,
  received_at timestamptz not null default now(),
  payload jsonb
);
create index if not exists idx_ingest_events_received_at on public.ingest_events (received_at desc);
```

### Production env vars
- `SOURCE_MODE=ingest`
- `INGEST_AUTH_TOKEN=<secret>`
- `SUPABASE_URL=<https://...supabase.co>`
- `SUPABASE_SERVICE_ROLE_KEY=<service role key>`
- `SUPABASE_ANON_KEY=<anon key>`

---

## Zeabur Docker Deploy

Use the included Dockerfile and configure:
- `SOURCE_MODE=ingest`
- `INGEST_AUTH_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
