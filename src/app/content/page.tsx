"use client";
import { useMemo } from "react";
import { useLiveEvents } from "@/lib/live-events";
import { formatRelativeTime } from "@/lib/utils";

const payloadMessage = (payload: Record<string, unknown> | null, fallback: string) => {
  const m = payload?.message;
  return typeof m === "string" && m.trim().length ? m : fallback;
};

export default function ContentPage(){
 const {events}=useLiveEvents();
 const items=useMemo(()=>events.filter(e=>typeof e.payload?.message==="string").map(e=>({id:e.id,title:e.event_type,body:payloadMessage(e.payload, e.event_type),source:e.source,ts:Date.parse(e.received_at)})),[events]);
 return <div className="p-6 space-y-3"><h1 className="text-xl text-slate-100 font-semibold">Content</h1>{items.map(i=><div key={i.id} className="rounded border border-white/10 p-3"><div className="text-xs text-slate-500">{i.source} · {formatRelativeTime(i.ts)}</div><div className="text-slate-200">{i.body}</div></div>)}</div>
}
