'use client';
import { use, useEffect, useState } from 'react';
export default function Recovery({ params }) {
  const { id } = use(params);
  const [p, setP] = useState(null);
  useEffect(() => { fetch(`/api/procedures/${id}`).then((r) => r.json()).then((j) => setP(j.data)); }, [id]);
  if (!p) return <p className="mx-auto max-w-2xl px-4 py-6 text-sm text-gray-500">Loading…</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <a href={`/procedures/${id}`} className="text-sm text-brand">← {p.procedure_name}</a>
      <h1 className="text-xl font-bold text-gray-900">Recovery Guide</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-5"><p className="text-lg font-bold text-brand">{p.recovery_time || '—'}</p><p className="text-sm text-gray-600">Typical recovery time</p></div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700"><p>Follow your surgeon's post-procedure instructions, attend follow-ups, and watch for warning signs (fever, bleeding, severe pain). Contact your care team or emergency services if concerned.</p></div>
    </div>
  );
}
