'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentManager({ resource, fields, listCols, rows: initial }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(null); // { id, values } or null

  function formToBody(form) {
    const f = new FormData(form); const body = {};
    for (const fl of fields) {
      body[fl.name] = fl.type === 'bool' ? f.get(fl.name) === 'on'
        : fl.type === 'array' ? (Array.isArray(f.get(fl.name)) ? f.get(fl.name) : f.get(fl.name)) : f.get(fl.name);
    }
    return body;
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    const body = formToBody(e.target);
    const url = editing ? `/api/admin/content/${resource}/${editing.id}` : `/api/admin/content/${resource}`;
    const r = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (r.ok) { e.target.reset(); setMsg(editing ? 'Saved ✓' : 'Added ✓'); setEditing(null); router.refresh(); }
    else setMsg(j.errors?.[0] || 'Failed');
    setBusy(false);
  }

  async function startEdit(id) {
    setBusy(true); setMsg('');
    const r = await fetch(`/api/admin/content/${resource}/${id}`);
    const j = await r.json();
    setBusy(false);
    if (r.ok) { setEditing({ id, values: j.data }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else setMsg('Load failed');
  }

  async function del(id) {
    if (!window.confirm('Delete this item?')) return;
    setBusy(true);
    const r = await fetch(`/api/admin/content/${resource}/${id}`, { method: 'DELETE' });
    if (r.ok) setRows((rs) => rs.filter((x) => x.id !== id));
    setBusy(false);
  }

  const v = editing ? editing.values : {};
  const def = (fl) => {
    const raw = v[fl.name];
    if (raw == null) return '';
    return fl.type === 'array' && Array.isArray(raw) ? raw.join(', ') : raw;
  };
  const inp = 'rounded-lg border border-slate-300 px-2 py-1.5 text-sm';

  return (
    <div className="space-y-4">
      <form key={editing ? editing.id : 'new'} onSubmit={submit} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        {editing && <div className="text-xs font-semibold text-brand sm:col-span-2">Editing: {v.slug || editing.id}</div>}
        {fields.map((fl) => fl.type === 'bool' ? (
          <label key={fl.name} className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name={fl.name} defaultChecked={!!v[fl.name]} /> {fl.name}</label>
        ) : fl.type === 'textarea' ? (
          <textarea key={fl.name} name={fl.name} rows={2} defaultValue={def(fl)} placeholder={fl.name + (fl.req ? ' *' : '')} className={`${inp} sm:col-span-2`} />
        ) : (
          <input key={fl.name} name={fl.name} type={fl.type === 'number' ? 'number' : 'text'} defaultValue={def(fl)} placeholder={fl.name + (fl.req ? ' *' : '') + (fl.type === 'array' ? ' (comma-sep)' : '')} className={inp} />
        ))}
        <div className="flex items-center gap-3 sm:col-span-2">
          <button disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{editing ? 'Save' : 'Add'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setMsg(''); }} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>}
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
                  <td className="px-3 py-2 text-right">
                    <button disabled={busy} onClick={() => startEdit(r.id)} className="mr-2 rounded bg-slate-700 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50">Edit</button>
                    <button disabled={busy} onClick={() => del(r.id)} className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
