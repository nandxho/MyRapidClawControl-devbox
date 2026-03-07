import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-ingest-token");
  const expected = process.env.INGEST_AUTH_TOKEN;
  if (!expected) return NextResponse.json({ error: "INGEST_AUTH_TOKEN not configured" }, { status: 500 });
  if (!token || token !== expected) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const source = body?.source;
  const type = body?.type;
  if (!source || !type) return NextResponse.json({ error: "Invalid payload: source and type are required" }, { status: 400 });

  const event = {
    source,
    event_type: type,
    payload: body?.data ?? null,
    event_time: body?.timestamp ?? new Date().toISOString(),
    received_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: true, accepted: true, persisted: false, reason: "Supabase not configured", received: event });

  const { error } = await supabase.from("ingest_events").insert(event);
  if (error) return NextResponse.json({ error: "Failed to persist ingest event", detail: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, accepted: true, persisted: true, received: event });
}
