'use client';
import { useEffect, useState } from 'react';
export default function ApplicationsList() {
  const [rows, setRows] = useState(null);
  useEffect(() => { fetch('/api/applications').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([])); }, []);
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
      {rows === null ? <p className="text-sm text-gray-500">Loading…</p> : rows.length === 0 ? <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No applications. <a href="/jobs/search" className="text-brand">Find jobs</a></p> : (
        <div className="space-y-2">{rows.map((a) => (
          <a key={a.id} href={`/jobs/applications/${a.id}`} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand"><div><p className="font-semibold text-gray-900">{a.title}</p><p className="text-xs text-gray-500">{a.employer} · {String(a.applied_at).slice(0, 10)}</p></div><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize">{a.status}</span></a>
        ))}</div>
      )}
    </div>
  );
}
