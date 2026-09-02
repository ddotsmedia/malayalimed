'use client';
import { use, useEffect, useState } from 'react';
export default function ResumeEditor({ params }) {
  const { id } = use(params);
  const [f, setF] = useState({ title: '', fullName: '', summary: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch(`/api/resumes/${id}`).then((r) => r.json()).then((j) => { const d = j.data; if (d) setF({ title: d.title || '', fullName: d.full_name || '', summary: d.summary || '' }); }); }, [id]);
  async function save() { const r = await fetch(`/api/resumes/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) }); setMsg(r.ok ? 'Saved ✓' : 'Failed'); }
  function download() { window.print(); }
  return (
    <div className="mx-auto max-w-2xl space-y-3 px-4 py-6">
      <a href="/resume" className="text-sm text-brand">← Resumes</a>
      <h1 className="text-xl font-bold text-gray-900">Edit Resume</h1>
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} placeholder="Full name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <textarea value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} rows={6} placeholder="Professional summary…" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <div className="flex items-center gap-2"><button onClick={save} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Save</button><button onClick={download} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Download (print)</button>{msg && <span className="text-sm font-semibold text-brand">{msg}</span>}</div>
      </div>
      <p className="text-xs text-gray-400">Note: PDF export uses the browser print dialog (no server-side PDF renderer).</p>
    </div>
  );
}
