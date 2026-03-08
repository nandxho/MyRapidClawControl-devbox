"use client";
import { useMemo } from "react";
import { useLiveEvents } from "@/lib/live-events";
import { formatRelativeTime } from "@/lib/utils";

const payloadMessage = (payload: Record<string, unknown> | null, fallback: string) => {
  const m = payload?.message;
  return typeof m === "string" && m.trim().length ? m : fallback;
};

export default function ChatPage(){
 const {events}=useLiveEvents();
 const msgs=useMemo(()=>events.map(e=>({id:e.id,who:e.source,text: payloadMessage(e.payload, e.event_type),ts:Date.parse(e.received_at)})),[events]);
 return <div className="p-6 space-y-3"><h1 className="text-xl text-slate-100 font-semibold">Chat</h1><div className="space-y-2">{msgs.map(m=><div key={m.id} className="rounded border border-white/10 p-3"><div className="text-xs text-cyan-400">{m.who} · {formatRelativeTime(m.ts)}</div><div className="text-sm text-slate-200">{m.text}</div></div>)}</div></div>
}
