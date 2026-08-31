'use client';
import { useEffect, useState } from 'react';

export default function ModerationClient() {
  const [rows, setRows] = useState(null);
  const load = () => fetch('/api/admin/moderation').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  async function decide(item, approve) {
    await fetch(`/api/admin/moderation/${item.id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contentType: item.content_type, approve }) });
    setRows((rs) => rs.filter((x) => x.id !== item.id));
  }

  if (!rows) return <p className="text-sm text-slate-500">Loading…</p>;
  if (rows.length === 0) return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400">Queue is clear.</p>;
  return (
    <div className="space-y-3">
      {rows.map((it) => (
        <div key={it.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-600">{it.content_type}</span>
            <span className="text-xs text-slate-400">{it.author} · {String(it.created_at).slice(0, 10)}</span>
          </div>
          <p className="mt-2 text-sm text-slate-800">{it.preview}{it.rating ? ` (★${it.rating})` : ''}</p>
          <div className="mt-2 flex justify-end gap-2">
            <button onClick={() => decide(it, false)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Reject</button>
            <button onClick={() => decide(it, true)} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
          </div>
        </div>
      ))}
    </div>
  );
}
