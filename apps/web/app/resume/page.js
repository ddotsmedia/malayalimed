'use client';
import { useEffect, useState } from 'react';
export default function ResumeList() {
  const [rows, setRows] = useState(null);
  useEffect(() => { fetch('/api/resumes').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([])); }, []);
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-gray-900">My Resumes</h1><a href="/resume/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">+ New resume</a></div>
      {rows === null ? <p className="text-sm text-gray-500">Loading…</p> : rows.length === 0 ? <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No resumes yet (login required).</p> : (
        <div className="space-y-2">{rows.map((r) => <a key={r.id} href={`/resume/${r.id}/edit`} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand"><div><p className="font-semibold text-gray-900">{r.title}</p><p className="text-xs text-gray-500">{r.full_name} · updated {String(r.updated_at).slice(0, 10)}</p></div><span className="text-sm text-brand">Edit →</span></a>)}</div>
      )}
    </div>
  );
}
