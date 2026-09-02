'use client';
import { use, useEffect, useState } from 'react';
export default function ApplicationDetail({ params }) {
  const { id } = use(params);
  const [d, setD] = useState(null);
  useEffect(() => { fetch(`/api/applications/${id}/pipeline`).then((r) => r.json()).then((j) => setD(j.data)).catch(() => {}); }, [id]);
  if (!d) return <p className="mx-auto max-w-2xl px-4 py-6 text-sm text-gray-500">Loading…</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <a href="/jobs/applications" className="text-sm text-brand">← Applications</a>
      <h1 className="text-xl font-bold text-gray-900">{d.application.title}</h1>
      <p className="text-sm text-gray-600">{d.application.employer} · status <b className="capitalize">{d.application.status}</b></p>
      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-bold text-gray-900">Pipeline</h2>
        <ol className="space-y-1">{d.pipeline.map((p, i) => <li key={i} className="flex justify-between border-l-2 border-brand pl-3 text-sm"><span className="capitalize">{p.stage}</span><span className="text-xs text-gray-400">{String(p.moved_at).slice(0, 10)}</span></li>)}</ol>
      </section>
      <div className="flex gap-3 text-sm"><a href={`/jobs/applications/${id}/interview`} className="font-semibold text-brand">📅 Interview</a><a href={`/jobs/applications/${id}/offer`} className="font-semibold text-brand">📄 Offer</a></div>
    </div>
  );
}
