'use client';
import { use, useEffect, useState } from 'react';
export default function Steps({ params }) {
  const { id } = use(params);
  const [p, setP] = useState(null);
  useEffect(() => { fetch(`/api/procedures/${id}`).then((r) => r.json()).then((j) => setP(j.data)); }, [id]);
  if (!p) return <p className="mx-auto max-w-2xl px-4 py-6 text-sm text-gray-500">Loading…</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <a href={`/procedures/${id}`} className="text-sm text-brand">← {p.procedure_name}</a>
      <h1 className="text-xl font-bold text-gray-900">Step-by-Step</h1>
      {(!p.steps || p.steps.length === 0) ? <p className="text-sm text-gray-400">Detailed steps are prepared by the care team before your procedure.</p> : (
        <ol className="space-y-2">{p.steps.map((s) => <li key={s.step_num} className="rounded-2xl border border-gray-200 bg-white p-4"><p className="font-semibold text-gray-900">Step {s.step_num}</p><p className="text-sm text-gray-700">{s.step_description}</p></li>)}</ol>
      )}
    </div>
  );
}
