'use client';
import { useEffect, useState } from 'react';

export default function MedicalHistoryClient() {
  const [d, setD] = useState(null);
  useEffect(() => { fetch('/api/patient/medical-history').then((r) => r.json()).then((j) => setD(j.data)).catch(() => {}); }, []);
  if (!d) return <p className="text-sm text-gray-500">Loading…</p>;

  const Section = ({ title, items, render }) => (
    <section className="rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="mb-2 text-sm font-bold text-gray-900">{title}</h2>
      {items.length === 0 ? <p className="text-sm text-gray-400">None recorded.</p> : <ul className="space-y-1 text-sm text-gray-700">{items.map(render)}</ul>}
    </section>
  );

  return (
    <div className="space-y-4">
      <Section title="Chronic conditions" items={d.chronic} render={(c) => <li key={c.id} className="flex justify-between border-b border-gray-100 pb-1"><span>{c.condition}</span><span className="text-xs text-gray-400">{c.status}</span></li>} />
      <Section title="Allergies" items={d.allergies} render={(a) => <li key={a.id} className="flex justify-between border-b border-gray-100 pb-1"><span>{a.allergen} — {a.reaction || ''}</span><span className="text-xs text-gray-400">{a.severity}</span></li>} />
      <Section title="Medical records" items={d.history} render={(h) => <li key={h.id} className="flex justify-between border-b border-gray-100 pb-1"><span>{h.title || h.record_type}</span><span className="text-xs text-gray-400">{String(h.created_at).slice(0, 10)}</span></li>} />
    </div>
  );
}
