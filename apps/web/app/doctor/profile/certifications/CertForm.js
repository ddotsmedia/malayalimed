'use client';
import { useEffect, useState } from 'react';

export default function CertForm() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ certName: '', issuingBody: '', issueDate: '', expiryDate: '' });
  const [msg, setMsg] = useState('');
  const load = () => fetch('/api/doctor/certifications').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  async function add(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/doctor/certifications', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
    const j = await r.json();
    if (r.ok) { setF({ certName: '', issuingBody: '', issueDate: '', expiryDate: '' }); load(); } else setMsg(j.errors?.[0] || 'Failed');
  }
  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <input value={f.certName} onChange={(e) => setF({ ...f, certName: e.target.value })} placeholder="Certification name *" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={f.issuingBody} onChange={(e) => setF({ ...f, issuingBody: e.target.value })} placeholder="Issuing body" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <label className="text-xs text-slate-500">Issued<input type="date" value={f.issueDate} onChange={(e) => setF({ ...f, issueDate: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></label>
        <label className="text-xs text-slate-500">Expires<input type="date" value={f.expiryDate} onChange={(e) => setF({ ...f, expiryDate: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></label>
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white sm:col-span-2">Add certification</button>
        {msg && <span className="text-xs text-red-600 sm:col-span-2">{msg}</span>}
      </form>
      {rows.map((c) => <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><p className="font-medium text-slate-800">{c.cert_name}</p><p className="text-xs text-slate-500">{c.issuing_body} {c.issue_date ? `· ${String(c.issue_date).slice(0, 10)}` : ''}</p></div>)}
    </div>
  );
}
