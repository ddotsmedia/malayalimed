'use client';
import { use, useEffect, useState } from 'react';
import DTxProgressRing from '@/components/iomt/DTxProgressRing';

export default function DTxDashboard({ params }) {
  const { id } = use(params);
  const [d, setD] = useState(null);
  const load = () => fetch(`/api/dtx/${id}/dashboard`).then((r) => r.json()).then((j) => setD(j.data)).catch(() => {});
  useEffect(() => { load(); }, [id]);
  async function complete() {
    const next = (d?.completed || 0) + 1;
    await fetch(`/api/dtx/${id}/module/${next}/complete`, { method: 'POST' });
    load();
  }
  if (!d) return <p className="text-sm text-gray-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">{d.name}</h1>
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <DTxProgressRing pct={d.adherence} />
        <div><p className="text-sm text-gray-700">{d.completed}/{d.modules} modules complete</p><p className="text-xs text-gray-500">{d.description}</p>
          <button onClick={complete} disabled={d.completed >= d.modules} className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Complete next module</button></div>
      </div>
    </div>
  );
}
