import { NextResponse } from "next/server";
const START_TIME = Date.now();
export async function GET() {
  const services = {
    nextjs: "healthy",
    sourceMode: process.env.SOURCE_MODE ?? "ingest",
    supabase: process.env.SUPABASE_URL ? "configured" : "not_configured",
    ingestToken: process.env.INGEST_AUTH_TOKEN ? "configured" : "not_configured",
  };
  const uptime = Math.floor((Date.now() - START_TIME) / 1000);
  return NextResponse.json({ status: "healthy", version: "0.3.0", uptime, timestamp: new Date().toISOString(), services }, { headers: { "Cache-Control": "no-store" } });
}
