'use client';

// AdminTable — client table with search, CSV export, and optional row actions
// that call an async handler then remove/refresh the row.

import { useMemo, useState } from 'react';

export default function AdminTable({ rows: initial = [], columns = [], getId = (r) => r.id, rowActions = () => [], searchKeys = [], exportName = 'export', empty = 'No rows.' }) {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? rows.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(t))) : rows;
  }, [rows, q, searchKeys]);

  async function run(action, row) {
    setBusy(true); setMsg('');
    try {
      const ok = await action.run(getId(row), row);
      if (ok !== false) { if (action.removes !== false) setRows((rs) => rs.filter((r) => getId(r) !== getId(row))); setMsg(`${action.label} ✓`); }
      else setMsg(`${action.label} failed`);
    } catch { setMsg(`${action.label} failed`); }
    setBusy(false);
  }

  function csv() {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const head = columns.map((c) => esc(c.label)).join(',');
    const body = filtered.map((r) => columns.map((c) => esc(c.value ? c.value(r) : r[c.key])).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([`${head}\n${body}`], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `${exportName}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-48 rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
        <span className="text-xs text-slate-500">{filtered.length} row(s)</span>
        {msg && <span className="text-xs font-semibold text-brand">{msg}</span>}
        <button onClick={csv} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand">⬇ CSV</button>
      </div>
      {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">{empty}</div> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>{columns.map((c) => <th key={c.key} className="px-3 py-2 font-semibold">{c.label}</th>)}<th className="px-3 py-2 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={getId(r)} className="hover:bg-slate-50">
                  {columns.map((c) => <td key={c.key} className="px-3 py-2">{c.render ? c.render(r) : r[c.key]}</td>)}
                  <td className="px-3 py-2"><div className="flex justify-end gap-1.5">
                    {rowActions(r).map((a) => <button key={a.label} disabled={busy} onClick={() => run(a, r)} className={`rounded px-2 py-1 text-xs font-semibold disabled:opacity-50 ${a.tone === 'red' ? 'bg-red-600 text-white' : a.tone === 'green' ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-slate-700'}`}>{a.label}</button>)}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
