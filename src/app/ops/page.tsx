"use client";
import { useMemo } from "react";
import { useLiveEvents } from "@/lib/live-events";
import { formatRelativeTime } from "@/lib/utils";

export default function OpsPage(){
  const {events, reload} = useLiveEvents();
  const counts = useMemo(()=>({
    running: events.filter(e=>/run|process|start/i.test(e.event_type)).length,
    failed: events.filter(e=>/fail|error/i.test(e.event_type)).length,
    completed: events.filter(e=>/complete|success/i.test(e.event_type)).length,
    pending: events.filter(e=>/pending|queue/i.test(e.event_type)).length,
  }),[events]);
  return <div className="p-6 space-y-4">
    <div className="flex justify-between items-center"><h1 className="text-xl text-slate-100 font-semibold">Operations</h1><button onClick={reload} className="text-xs text-cyan-400">Refresh</button></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Object.entries(counts).map(([k,v])=><div key={k} className="rounded border border-white/10 p-3"><div className="text-xl text-slate-100">{v}</div><div className="text-xs text-slate-500 uppercase">{k}</div></div>)}</div>
    <div className="rounded border border-white/10 overflow-hidden"><table className="w-full text-xs"><thead className="text-slate-500"><tr><th className="p-2 text-left">Type</th><th className="p-2 text-left">Source</th><th className="p-2 text-left">When</th></tr></thead><tbody>{events.map(e=><tr key={e.id} className="border-t border-white/5"><td className="p-2 text-slate-300">{e.event_type}</td><td className="p-2 text-slate-400">{e.source}</td><td className="p-2 text-slate-500">{formatRelativeTime(Date.parse(e.received_at))}</td></tr>)}</tbody></table></div>
  </div>
}
