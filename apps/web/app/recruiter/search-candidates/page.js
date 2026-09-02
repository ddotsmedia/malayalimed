'use client';
import { useState } from 'react';
export default function CandidateSearch() {
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [rows, setRows] = useState([]);
  const [done, setDone] = useState(false);
  async function search() {
    const qs = new URLSearchParams(); if (specialty) qs.set('specialty', specialty); if (location) qs.set('location', location);
    const r = await fetch(`/api/candidates/search?${qs}`); const j = await r.json();
    setRows(j.data || []); setDone(true);
  }
  async function save(uid) { await fetch(`/api/candidates/${uid}/save`, { method: 'POST' }); }
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Search Candidates</h1>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Specialty" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button onClick={search} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Search</button>
      </div>
      {done && (rows.length === 0 ? <p className="text-sm text-gray-400">No candidates match (candidates must set a public profile).</p> : (
        <div className="space-y-2">{rows.map((c) => (
          <div key={c.user_id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
            <a href={`/recruiter/candidates/${c.user_id}`}><p className="font-semibold text-gray-900">{c.full_name}</p><p className="text-xs text-gray-500">{c.headline} · {c.experience_years || '—'} yrs · {(c.specialties || []).join(', ')}</p></a>
            <button onClick={() => save(c.user_id)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs">Save</button>
          </div>
        ))}</div>
      ))}
    </div>
  );
}
