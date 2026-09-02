'use client';
import { use, useEffect, useState } from 'react';

export default function JobDetail({ params }) {
  const { id } = use(params);
  const [job, setJob] = useState(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch(`/api/jobs/${id}`).then((r) => r.json()).then((j) => setJob(j.data)); }, [id]);
  async function apply() {
    const r = await fetch(`/api/jobs/${id}/apply`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({}) });
    const j = await r.json();
    setMsg(r.ok ? 'Application submitted ✓' : (j.errors?.[0] === 'unauthenticated' ? 'Please log in to apply.' : j.errors?.[0] || 'Failed'));
  }
  if (!job) return <p className="text-sm text-gray-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
        <p className="text-gray-600">{job.employer}</p>
        <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-500">{job.location && <span>📍 {job.location}</span>}{job.specialty && <span>{job.specialty}</span>}{(job.salary_min || job.salary_max) && <span className="font-medium text-gray-700">₹{job.salary_min}–{job.salary_max}</span>}{job.remote_allowed && <span className="text-brand">Remote OK</span>}</div>
        <button onClick={apply} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">Apply now</button>
        {msg && <p className="mt-2 text-sm font-semibold text-brand">{msg}</p>}
      </div>
      {job.description && <div className="rounded-2xl border border-gray-200 bg-white p-6"><h2 className="mb-2 font-bold text-gray-900">Description</h2><p className="whitespace-pre-wrap text-sm text-gray-700">{job.description}</p></div>}
      {job.requirements?.length > 0 && <div className="rounded-2xl border border-gray-200 bg-white p-6"><h2 className="mb-2 font-bold text-gray-900">Requirements</h2><ul className="list-disc pl-5 text-sm text-gray-700">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul></div>}
    </div>
  );
}
