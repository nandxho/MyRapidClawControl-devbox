"use client";
import { useMemo } from "react";
import { useLiveEvents } from "@/lib/live-events";

export default function CodePage(){
 const {events}=useLiveEvents();
 const files=useMemo(()=>{
   const set=new Map<string,string>();
   for(const e of events){set.set(`${e.source}-${e.event_type}.log`, JSON.stringify(e.payload ?? {}, null, 2));}
   return Array.from(set.entries());
 },[events]);
 return <div className="p-6 space-y-3"><h1 className="text-xl text-slate-100 font-semibold">Code</h1>{files.map(([n,c])=><div key={n} className="rounded border border-white/10 p-3"><div className="text-cyan-400 text-sm">{n}</div><pre className="text-xs text-slate-300 overflow-auto">{c}</pre></div>)}</div>
}
