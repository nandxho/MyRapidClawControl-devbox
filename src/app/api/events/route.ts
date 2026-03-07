import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ configured: false, events: [] });
  const { data, error } = await supabase
    .from("ingest_events")
    .select("id,source,event_type,event_time,received_at,payload")
    .order("received_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ configured: true, events: data ?? [] });
}
