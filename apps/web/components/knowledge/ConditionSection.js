'use client';
import { useEffect, useState } from 'react';
export default function ConditionSection({ slug, field, label }) {
  const [c, setC] = useState(null);
  useEffect(() => { fetch(`/api/conditions/${slug}`).then((r) => r.json()).then((j) => setC(j.data)); }, [slug]);
  if (!c) return <p className="text-sm text-gray-500">Loading…</p>;
  const items = c[field];
  return (
    <div className="space-y-3">
      <a href={`/conditions/${slug}`} className="text-sm text-brand">← {c.condition_name}</a>
      <h1 className="text-xl font-bold text-gray-900">{label}</h1>
      {Array.isArray(items) && items.length ? <ul className="space-y-1">{items.map((x, i) => <li key={i} className="rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700">{x}</li>)}</ul> : <p className="text-sm text-gray-400">No details recorded.</p>}
      <p className="text-xs text-gray-400">Educational content — consult a doctor for personal advice.</p>
    </div>
  );
}
