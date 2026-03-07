import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function isLocalMode() {
  return (process.env.SOURCE_MODE ?? "ingest") === "local";
}

export async function GET() {
  if (!isLocalMode()) {
    return NextResponse.json(
      {
        mode: process.env.SOURCE_MODE ?? "ingest",
        disabled: true,
        note: "Workspace filesystem access is disabled in cloud mode. Use /api/ingest.",
      },
      { status: 200 }
    );
  }

  const workspacePath = process.env.WORKSPACE_PATH ?? "";

  if (!workspacePath) {
    return NextResponse.json({ error: "WORKSPACE_PATH not configured" }, { status: 404 });
  }

  const exists = fs.existsSync(workspacePath);

  return NextResponse.json({
    path: workspacePath,
    exists,
    isDirectory: exists ? fs.statSync(workspacePath).isDirectory() : false,
    basename: path.basename(workspacePath),
  });
}

export async function POST(request: NextRequest) {
  if (!isLocalMode()) {
    return NextResponse.json(
      { error: "Workspace write endpoint disabled in cloud mode." },
      { status: 403 }
    );
  }

  const body = (await request.json()) as { path?: string };

  if (!body.path || typeof body.path !== "string") {
    return NextResponse.json({ error: "Missing or invalid 'path' field" }, { status: 400 });
  }

  if (!path.isAbsolute(body.path)) {
    return NextResponse.json({ error: "Path must be absolute" }, { status: 400 });
  }

  const exists = fs.existsSync(body.path);

  return NextResponse.json({
    path: body.path,
    exists,
    isDirectory: exists ? fs.statSync(body.path).isDirectory() : false,
    basename: path.basename(body.path),
    note: "To persist, set WORKSPACE_PATH in your .env.local file.",
  });
}
