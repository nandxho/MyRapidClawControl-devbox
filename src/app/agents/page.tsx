"use client";
import { useMemo } from "react";
import { useLiveEvents } from "@/lib/live-events";
import { formatRelativeTime } from "@/lib/utils";

export default function AgentsPage(){
 const {bySource}=useLiveEvents();
 const agents=useMemo(()=>Array.from(bySource.entries()).map(([name,ev])=>({name,last:ev[0],count:ev.length})),[bySource]);
 return <div className="p-6 space-y-4"><h1 className="text-xl text-slate-100 font-semibold">Agents</h1><div className="grid md:grid-cols-2 gap-3">{agents.map(a=><div key={a.name} className="rounded border border-white/10 p-3"><div className="text-slate-200 font-medium">{a.name}</div><div className="text-xs text-slate-500">{a.count} events</div><div className="text-xs text-cyan-400 mt-1">last {formatRelativeTime(Date.parse(a.last.received_at))}</div></div>)}</div></div>
}
