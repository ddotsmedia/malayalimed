'use client';
import { useEffect, useState, useCallback } from 'react';

export default function JobSearchResults() {
  const [filters, setFilters] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { const q = new URLSearchParams(window.location.search); setFilters(Object.fromEntries(q.entries())); }, []);
  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    const r = await fetch(`/api/jobs?${qs}`); const j = await r.json();
    setRows(j.data || []); setLoading(false);
  }, [filters]);
  useEffect(() => { load(); }, [load]);
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={filters.q || ''} onChange={(e) => set('q', e.target.value)} placeholder="Keyword" className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm" />
        <input value={filters.specialty || ''} onChange={(e) => set('specialty', e.target.value)} placeholder="Specialty" className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm" />
        <input value={filters.location || ''} onChange={(e) => set('location', e.target.value)} placeholder="Location" className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm" />
        <input value={filters.salary_min || ''} onChange={(e) => set('salary_min', e.target.value)} type="number" placeholder="Min salary" className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.remote === 'true'} onChange={(e) => set('remote', e.target.checked ? 'true' : '')} /> Remote only</label>
        <button onClick={() => setFilters({})} className="text-xs font-semibold text-brand">Clear</button>
      </aside>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">{loading ? 'Loading…' : `${rows.length} jobs`}</p>
        {rows.map((j) => (
          <a key={j.id} href={`/jobs/${j.id}`} className="block rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-900">{j.title}</h3>{j.remote_allowed && <span className="rounded-full bg-brand/10 px-2 text-[11px] font-semibold text-brand">Remote</span>}</div>
            <p className="text-sm text-gray-600">{j.employer}</p>
            <p className="mt-1 text-xs text-gray-500">{j.location || j.specialty || ''} {(j.salary_min || j.salary_max) ? `· ₹${j.salary_min}–${j.salary_max}` : ''}</p>
          </a>
        ))}
        {rows.length === 0 && !loading && <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No jobs match. Post one via the API or adjust filters.</p>}
      </div>
    </div>
  );
}
