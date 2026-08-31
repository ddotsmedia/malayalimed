'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentManager({ resource, fields, listCols, rows: initial }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function add(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    const f = new FormData(e.target); const body = {};
    for (const fl of fields) body[fl.name] = fl.type === 'bool' ? f.get(fl.name) === 'on' : f.get(fl.name);
    const r = await fetch(`/api/admin/content/${resource}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (r.ok) { e.target.reset(); setMsg('Added ✓'); router.refresh(); } else setMsg(j.errors?.[0] || 'Failed');
    setBusy(false);
  }
  async function del(id) {
    if (!window.confirm('Delete this item?')) return;
    setBusy(true);
    const r = await fetch(`/api/admin/content/${resource}/${id}`, { method: 'DELETE' });
    if (r.ok) setRows((rs) => rs.filter((x) => x.id !== id));
    setBusy(false);
  }

  const inp = 'rounded-lg border border-slate-300 px-2 py-1.5 text-sm';
  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        {fields.map((fl) => fl.type === 'bool' ? (
          <label key={fl.name} className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name={fl.name} /> {fl.name}</label>
        ) : fl.type === 'textarea' ? (
          <textarea key={fl.name} name={fl.name} rows={2} placeholder={fl.name + (fl.req ? ' *' : '')} className={`${inp} sm:col-span-2`} />
        ) : (
          <input key={fl.name} name={fl.name} type={fl.type === 'number' ? 'number' : 'text'} placeholder={fl.name + (fl.req ? ' *' : '') + (fl.type === 'array' ? ' (comma-sep)' : '')} className={inp} />
        ))}
        <div className="flex items-center gap-3 sm:col-span-2">
          <button disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Add</button>
          {msg && <span className="text-xs font-semibold text-brand">{msg}</span>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-3 py-2">slug</th>{listCols.map((c) => <th key={c} className="px-3 py-2">{c}</th>)}<th className="px-3 py-2 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? <tr><td colSpan={listCols.length + 2} className="px-3 py-6 text-center text-slate-400">No items.</td></tr> :
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.slug}</td>
                  {listCols.map((c) => <td key={c} className="px-3 py-2">{String(r[c] ?? '')}</td>)}
                  <td className="px-3 py-2 text-right"><button disabled={busy} onClick={() => del(r.id)} className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50">Delete</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
