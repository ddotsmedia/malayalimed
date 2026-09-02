'use client';
import { useEffect, useState } from 'react';
export default function RecruiterJobsList() {
  const [rows, setRows] = useState(null);
  const [f, setF] = useState({ title: '', specialty: '', location: '', salaryMin: '', salaryMax: '', description: '' });
  const load = () => fetch('/api/recruiter/analytics').then(() => fetch('/api/jobs?limit=0')).then(() => {}).catch(() => {});
  const loadMine = () => fetch('/api/recruiter/analytics').then((r) => r.json()).then(() => {}).catch(() => {});
  useEffect(() => { fetchMine(); }, []);
  function fetchMine() { fetch('/api/recruiter/analytics').then((r) => r.json()).then((j) => setRows(j.data)); }
  async function post(e) {
    e.preventDefault();
    await fetch('/api/jobs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
    setF({ title: '', specialty: '', location: '', salaryMin: '', salaryMax: '', description: '' });
    fetchMine();
  }
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Recruiter · Post a Job</h1>
      <form onSubmit={post} className="grid gap-2 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-2">
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Job title *" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2" />
        <input value={f.specialty} onChange={(e) => setF({ ...f, specialty: e.target.value })} placeholder="Specialty" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="Location" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.salaryMin} onChange={(e) => setF({ ...f, salaryMin: e.target.value })} type="number" placeholder="Salary min" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.salaryMax} onChange={(e) => setF({ ...f, salaryMax: e.target.value })} type="number" placeholder="Salary max" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={3} placeholder="Description" className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white sm:col-span-2">Post job</button>
      </form>
      {rows && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Jobs', rows.jobs_posted], ['Views', rows.total_views], ['Applications', rows.total_applications], ['Hires', rows.hires]].map(([l, v]) => <div key={l} className="rounded-2xl border border-gray-200 bg-white p-4"><p className="text-2xl font-extrabold text-brand">{v}</p><p className="text-xs text-gray-500">{l}</p></div>)}</div>}
      <div className="flex gap-3 text-sm"><a href="/recruiter/search-candidates" className="font-semibold text-brand">🔎 Find candidates</a><a href="/recruiter/candidates/saved" className="font-semibold text-brand">⭐ Saved candidates</a><a href="/profile/recruiter" className="font-semibold text-brand">🏢 Company profile</a></div>
    </div>
  );
}
