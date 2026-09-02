'use client';
import { use, useEffect, useState } from 'react';
export default function ProcedureDetail({ params }) {
  const { id } = use(params);
  const [p, setP] = useState(null);
  useEffect(() => { fetch(`/api/procedures/${id}`).then((r) => r.json()).then((j) => setP(j.data)); }, [id]);
  if (!p) return <p className="text-sm text-gray-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{p.procedure_name}</h1>
        <p className="text-sm text-gray-500">{p.specialty}</p>
        <p className="mt-2 text-sm text-gray-700">{p.description}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-gray-600">{p.duration_minutes && <span>⏱ {p.duration_minutes} min</span>}{p.recovery_time && <span>🛌 {p.recovery_time}</span>}{p.success_rate && <span className="font-medium text-green-600">✓ {p.success_rate}% success</span>}{p.cost_range && <span>{p.cost_range}</span>}</div>
      </div>
      {Array.isArray(p.why_done) && p.why_done.length > 0 && <div className="rounded-2xl border border-gray-200 bg-white p-4"><h2 className="mb-1 text-sm font-bold text-gray-900">Why it's done</h2><ul className="list-disc pl-5 text-sm text-gray-700">{p.why_done.map((w, i) => <li key={i}>{w}</li>)}</ul></div>}
      <div className="flex flex-wrap gap-3 text-sm"><a href={`/procedures/${id}/steps`} className="font-semibold text-brand">📋 Steps</a><a href={`/procedures/${id}/recovery`} className="font-semibold text-brand">🛌 Recovery</a><a href={`/procedures/${id}/risks`} className="font-semibold text-brand">⚠️ Risks</a></div>
    </div>
  );
}
