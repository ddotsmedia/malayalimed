'use client';
import { useState } from 'react';

export default function KSearch({ apiUrl, titleKey, subKey, hrefBase, idKey = 'id', placeholder = 'Search…' }) {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [done, setDone] = useState(false);
  async function go(e) {
    e?.preventDefault();
    if (!q.trim()) return;
    const r = await fetch(`${apiUrl}?q=${encodeURIComponent(q)}`); const j = await r.json();
    setRows(j.data || []); setDone(true);
  }
  return (
    <div className="space-y-3">
      <form onSubmit={go} className="flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" /><button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Search</button></form>
      {done && (rows.length === 0 ? <p className="text-sm text-gray-400">No results.</p> : (
        <div className="space-y-2">{rows.map((r, i) => {
          const title = r[titleKey]; const sub = subKey ? r[subKey] : null;
          const inner = <div className="rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand"><p className="font-semibold text-gray-900">{Array.isArray(title) ? title.join(', ') : title}</p>{sub != null && <p className="text-xs text-gray-500">{Array.isArray(sub) ? sub.join(', ') : sub}</p>}</div>;
          return hrefBase && r[idKey] ? <a key={r[idKey] || i} href={hrefBase + r[idKey]}>{inner}</a> : <div key={i}>{inner}</div>;
        })}</div>
      ))}
    </div>
  );
}
