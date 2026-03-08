"use client";
import { useState, useMemo } from "react";
import { useLiveEvents } from "@/lib/live-events";
import { formatRelativeTime } from "@/lib/utils";

const payloadMessage = (payload: Record<string, unknown> | null, fallback: string) => {
  const m = payload?.message;
  return typeof m === "string" && m.trim().length ? m : fallback;
};

export default function CommsPage(){
 const {events}=useLiveEvents();
 const [read,setRead]=useState<number[]>([]);
 const notifications=useMemo(()=>events.map(e=>({id:e.id,title:e.event_type,body:payloadMessage(e.payload, e.event_type),source:e.source,ts:Date.parse(e.received_at)})),[events]);
 const unread=notifications.filter(n=>!read.includes(n.id)).length;
 return <div className="p-6 space-y-3"><h1 className="text-xl text-slate-100 font-semibold">Communications ({unread} unread)</h1>{notifications.map(n=><div key={n.id} className="rounded border border-white/10 p-3"><div className="flex justify-between"><div className="text-xs text-slate-500">{n.source} · {formatRelativeTime(n.ts)}</div><button onClick={()=>setRead(r=>[...r,n.id])} className="text-xs text-cyan-400">mark</button></div><div className="text-slate-200">{n.body}</div></div>)}</div>
}
