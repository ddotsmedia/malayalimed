'use client';
import { use, useEffect, useState } from 'react';

export default function TelehealthVitals({ params }) {
  const { id } = use(params);
  const [vitals, setVitals] = useState([]);
  useEffect(() => {
    const load = () => fetch('/api/vitals/latest').then((r) => r.json()).then((j) => setVitals(j.data || [])).catch(() => {});
    load(); const t = setInterval(load, 15000); return () => clearInterval(t);
  }, []);
  return (
    <div className="mx-auto max-w-sm space-y-3 p-4">
      <h1 className="text-lg font-bold text-gray-900">Vitals · session {String(id).slice(0, 6)}</h1>
      {vitals.length === 0 ? <p className="text-sm text-gray-400">Awaiting readings…</p> : vitals.map((v) => (
        <div key={v.metric_type} className="flex justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm"><span className="text-gray-600">{v.metric_type}</span><b>{v.value}{v.unit ? ` ${v.unit}` : ''}</b></div>
      ))}
      <p className="text-[10px] text-gray-400">Polling every 15s (no WebSocket).</p>
    </div>
  );
}
