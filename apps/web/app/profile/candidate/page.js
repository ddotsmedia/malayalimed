'use client';
import { useEffect, useState } from 'react';
export default function CandidateProfileForm() {
  const [f, setF] = useState({ headline: '', summary: '', specialties: '', experienceYears: '', currentRole: '', skills: '', visibility: 'public' });
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch('/api/profile/candidate').then((r) => r.json()).then((j) => { const d = j.data; if (d) setF({ headline: d.headline || '', summary: d.summary || '', specialties: (d.specialties || []).join(', '), experienceYears: d.experience_years || '', currentRole: d.current_role_title || '', skills: (d.skills || []).join(', '), visibility: d.visibility || 'public' }); }); }, []);
  async function save(e) {
    e.preventDefault();
    const body = { ...f, specialties: f.specialties.split(',').map((s) => s.trim()).filter(Boolean), skills: f.skills.split(',').map((s) => s.trim()).filter(Boolean) };
    const r = await fetch('/api/profile/candidate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    setMsg(r.ok ? 'Saved ✓' : 'Login required');
  }
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Candidate Profile</h1>
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={f.headline} onChange={(e) => setF({ ...f, headline: e.target.value })} placeholder="Headline (e.g. ICU Nurse, 5 yrs)" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <textarea value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} rows={3} placeholder="Summary" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={f.specialties} onChange={(e) => setF({ ...f, specialties: e.target.value })} placeholder="Specialties (comma-sep)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} placeholder="Skills (comma-sep)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input value={f.experienceYears} onChange={(e) => setF({ ...f, experienceYears: e.target.value })} type="number" placeholder="Years experience" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input value={f.currentRole} onChange={(e) => setF({ ...f, currentRole: e.target.value })} placeholder="Current role" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <select value={f.visibility} onChange={(e) => setF({ ...f, visibility: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="public">Public</option><option value="recruiters">Recruiters only</option><option value="private">Private</option></select>
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Save profile</button>
        {msg && <span className="ml-2 text-sm font-semibold text-brand">{msg}</span>}
      </form>
    </div>
  );
}
