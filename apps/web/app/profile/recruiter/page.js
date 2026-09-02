'use client';
import { useEffect, useState } from 'react';
export default function RecruiterProfileForm() {
  const [f, setF] = useState({ companyName: '', companySize: '', industry: '', description: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch('/api/profile/recruiter').then((r) => r.json()).then((j) => { const d = j.data; if (d) setF({ companyName: d.company_name || '', companySize: d.company_size || '', industry: d.industry || '', description: d.description || '' }); }); }, []);
  async function save(e) { e.preventDefault(); const r = await fetch('/api/profile/recruiter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) }); setMsg(r.ok ? 'Saved ✓' : 'Login required'); }
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Recruiter / Company Profile</h1>
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={f.companyName} onChange={(e) => setF({ ...f, companyName: e.target.value })} placeholder="Company name *" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={f.companySize} onChange={(e) => setF({ ...f, companySize: e.target.value })} placeholder="Company size" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input value={f.industry} onChange={(e) => setF({ ...f, industry: e.target.value })} placeholder="Industry" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={3} placeholder="About the company" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Save</button>
        {msg && <span className="ml-2 text-sm font-semibold text-brand">{msg}</span>}
      </form>
      <a href="/recruiter/jobs" className="text-sm font-semibold text-brand">Post a job →</a>
    </div>
  );
}
