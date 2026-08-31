'use client';
import { useEffect, useState, useCallback } from 'react';

const LANGS = ['Malayalam', 'English', 'Hindi', 'Tamil'];
const INSURANCE = ['Aetna', 'Star Health', 'ICICI Lombard', 'HDFC Ergo', 'New India'];

export default function DoctorSearchClient({ locale = 'ml' }) {
  const [filters, setFilters] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: f[k] === v ? '' : v }));

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    const r = await fetch(`/api/doctors/search?${qs}`);
    const j = await r.json().catch(() => ({}));
    setRows(j.data || []); setLoading(false);
  }, [filters]);
  useEffect(() => { load(); }, [load]);

  const Chip = ({ group, value }) => (
    <button onClick={() => set(group, value)} className={`rounded-full border px-3 py-1 text-xs ${filters[group] === value ? 'border-brand bg-brand text-white' : 'border-gray-300 text-gray-700'}`}>{value}</button>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <div><p className="mb-1 text-xs font-bold uppercase text-gray-400">Language</p><div className="flex flex-wrap gap-1">{LANGS.map((l) => <Chip key={l} group="language" value={l} />)}</div></div>
        <div><p className="mb-1 text-xs font-bold uppercase text-gray-400">Insurance</p><div className="flex flex-wrap gap-1">{INSURANCE.map((i) => <Chip key={i} group="insurance" value={i} />)}</div></div>
        <div><p className="mb-1 text-xs font-bold uppercase text-gray-400">Min rating</p><div className="flex gap-1">{[3, 4, 4.5].map((r) => <Chip key={r} group="minRating" value={String(r)} />)}</div></div>
        <div><p className="mb-1 text-xs font-bold uppercase text-gray-400">Sort</p>
          <select value={filters.sort || ''} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm"><option value="">Rating</option><option value="fee">Lowest fee</option></select>
        </div>
        <button onClick={() => setFilters({})} className="text-xs font-semibold text-brand">Clear filters</button>
      </aside>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">{loading ? 'Loading…' : `${rows.length} doctor(s)`}</p>
        {rows.map((d) => (
          <a key={d.id} href={`/${locale}/doctors/${d.slug}`} className="block rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
            <div className="flex items-center justify-between">
              <div><p className="font-semibold text-gray-900">{d.display_name}</p><p className="text-xs text-gray-500">{d.specialty_en} · {d.district_en}</p></div>
              <div className="text-right"><p className="text-sm font-semibold text-brand">{d.consultation_fee ? `₹${d.consultation_fee}` : '—'}</p><p className="text-xs text-amber-500">★ {d.rating_avg} ({d.rating_count})</p></div>
            </div>
            {Array.isArray(d.languages) && d.languages.length > 0 && <p className="mt-1 text-xs text-gray-400">Speaks: {d.languages.join(', ')}</p>}
          </a>
        ))}
        {rows.length === 0 && !loading && <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No doctors match. Note: filters need doctors with published profiles + language/insurance data.</p>}
      </div>
    </div>
  );
}
