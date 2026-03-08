"use client";
import { useMemo } from "react";
import { useLiveEvents } from "@/lib/live-events";

export default function KnowledgePage(){
 const {bySource}=useLiveEvents();
 const docs=useMemo(()=>Array.from(bySource.entries()).map(([s,ev])=>({title:`${s} knowledge`, content:ev.map(e=>e.event_type).join(', '), count:ev.length})),[bySource]);
 return <div className="p-6 space-y-3"><h1 className="text-xl text-slate-100 font-semibold">Knowledge Base</h1>{docs.map(d=><div key={d.title} className="rounded border border-white/10 p-3"><div className="text-slate-200">{d.title}</div><div className="text-xs text-slate-500">{d.count} facts</div><div className="text-sm text-slate-300 mt-1">{d.content}</div></div>)}</div>
}
