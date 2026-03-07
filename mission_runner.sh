#!/usr/bin/env bash
set -euo pipefail
cd ~/projects/openclaw-mission-control
claude --dangerously-skip-permissions --output-format text -p 'Build a Mission Control dashboard for my OpenClaw agent using Next.js (App Router), Tailwind CSS, and TypeScript. Stack: Next.js 15 + Convex (real-time backend) + Tailwind CSS v4 + Framer Motion + ShadCN UI + Lucide icons. TypeScript throughout. Dark mode only. Ultra-premium aesthetic, think Iron Man JARVIS HUD meets Bloomberg terminal. Subtle glass effects, rounded corners, no heavy gradients. Mobile-first responsive. Create pages Home, OPS, AGENTS, CHAT, CONTENT, COMMS, KNOWLEDGE, CODE with requested widgets/tabs. Add API routes under src/app/api to read/write workspace path from env. Add Convex schema and seed. Include sticky top bar with gateway health polling and search. Include README with run/deploy commands. Run lint/typecheck/build and fix issues. Print summary of created files and startup steps.' > mission.log 2>&1
echo $? > mission.exit
