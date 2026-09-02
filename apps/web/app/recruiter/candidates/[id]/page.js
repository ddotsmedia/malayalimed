'use client';
import { use, useEffect, useState } from 'react';
export default function CandidateProfile({ params }) {
  const { id } = use(params);
  const [c, setC] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetch(`/api/candidates/${id}`).then((r) => r.json()).then((j) => setC(j.data)); }, [id]);
  async function save() { await fetch(`/api/candidates/${id}/save`, { method: 'POST' }); setSaved(true); }
  if (!c) return <p className="mx-auto max-w-2xl px-4 py-6 text-sm text-gray-500">Loading… (candidate may be private)</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{c.full_name}</h1>
        <p className="text-gray-600">{c.headline}</p>
        <p className="mt-1 text-sm text-gray-500">{c.experience_years ? `${c.experience_years} yrs` : ''} {c.current_role_title || ''}</p>
        {Array.isArray(c.specialties) && <p className="mt-1 text-xs text-brand">{c.specialties.join(', ')}</p>}
        {Array.isArray(c.skills) && c.skills.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{c.skills.map((s) => <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{s}</span>)}</div>}
        <button onClick={save} className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{saved ? 'Saved ✓' : 'Save candidate'}</button>
      </div>
      {c.summary && <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">{c.summary}</div>}
    </div>
  );
}
