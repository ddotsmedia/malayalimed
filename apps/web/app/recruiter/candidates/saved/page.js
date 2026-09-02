'use client';
import { useEffect, useState } from 'react';
export default function SavedCandidates() {
  const [rows, setRows] = useState(null);
  useEffect(() => { fetch('/api/candidates/saved').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([])); }, []);
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Saved Candidates</h1>
      {rows === null ? <p className="text-sm text-gray-500">Loading…</p> : rows.length === 0 ? <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No saved candidates yet.</p> : (
        <div className="space-y-2">{rows.map((c) => <a key={c.candidate_id} href={`/recruiter/candidates/${c.candidate_id}`} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand"><div><p className="font-semibold text-gray-900">{c.full_name}</p><p className="text-xs text-gray-500">{c.headline || ''}</p></div><span className="text-sm text-brand">View →</span></a>)}</div>
      )}
    </div>
  );
}
