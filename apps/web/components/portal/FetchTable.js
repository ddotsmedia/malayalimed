'use client';
import { useEffect, useState } from 'react';

/** Generic read-only table. columns: [{key,label,render?}]. */
export default function FetchTable({ url, columns, empty = 'No data.' }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    fetch(url, { credentials: 'same-origin' }).then((r) => r.json())
      .then((j) => { if (j.errors) setErr(j.errors[0]); setRows(j.data || []); })
      .catch(() => setErr('Failed to load'));
  }, [url]);
  if (err) return <p className="text-sm text-red-600">{err}</p>;
  if (!rows) return <p className="text-sm text-slate-500">Loading…</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>{columns.map((c) => <th key={c.key} className="px-3 py-2">{c.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? <tr><td colSpan={columns.length} className="px-3 py-6 text-center text-slate-400">{empty}</td></tr> :
            rows.map((r, i) => (
              <tr key={r.id || i} className="hover:bg-slate-50">
                {columns.map((c) => <td key={c.key} className="px-3 py-2">{c.render ? c.render(r) : String(r[c.key] ?? '—')}</td>)}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
