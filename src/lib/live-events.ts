"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type IngestEvent = {
  id: number;
  source: string;
  event_type: string;
  event_time: string;
  received_at: string;
  payload: Record<string, unknown> | null;
};

export function useLiveEvents() {
  const [events, setEvents] = useState<IngestEvent[]>([]);
  const [configured, setConfigured] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { configured: boolean; events: IngestEvent[] };
      setConfigured(!!data.configured);
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  const bySource = useMemo(() => {
    const m = new Map<string, IngestEvent[]>();
    for (const e of events) m.set(e.source, [...(m.get(e.source) || []), e]);
    return m;
  }, [events]);

  return { events, configured, bySource, reload: load };
}
