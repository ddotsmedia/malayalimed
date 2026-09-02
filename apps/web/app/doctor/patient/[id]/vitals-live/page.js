'use client';
import { use, useEffect, useState } from 'react';

export default function VitalsLive({ params }) {
  const { id } = use(params);
  const [vitals, setVitals] = useState([]);
  useEffect(() => {
    const load = () => fetch('/api/vitals/latest').then((r) => r.json()).then((j) => setVitals(j.data || [])).catch(() => {});
    load();
    const t = setInterval(load, 15000); // polling (no WebSocket)
    return () => clearInterval(t);
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Live Vitals</h1>
      <p className="text-xs text-slate-400">Polling every 15s. Patient {String(id).slice(0, 8)}.</p>
      {vitals.length === 0 ? <p className="text-sm text-slate-400">No recent readings.</p> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {vitals.map((v) => <div key={v.metric_type} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-bold text-brand">{v.value}{v.unit ? ` ${v.unit}` : ''}</p><p className="text-xs text-slate-500">{v.metric_type}</p></div>)}
        </div>
      )}
    </div>
  );
}
