'use client';
import { useEffect, useState, useCallback } from 'react';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/JobCard';

const EMPTY_OPTS = { specialties: [], districts: [], experience_levels: [], work_modes: [], employment_types: [] };

export default function JobSearchClient() {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('recent');
  const [options, setOptions] = useState(EMPTY_OPTS);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs/filters').then((r) => r.json()).then((j) => j.data && setOptions(j.data)).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ ...filters, sort });
    const r = await fetch(`/api/jobs/search?${qs}`);
    const j = await r.json().catch(() => ({}));
    setJobs(j.data || []); setLoading(false);
  }, [filters, sort]);
  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const clear = () => setFilters({});

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside><JobFilters filters={filters} options={options} set={set} clear={clear} /></aside>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{loading ? 'Loading…' : `${jobs.length} job(s)`}</p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-gray-300 px-2 py-1 text-sm">
            <option value="recent">Most recent</option><option value="salary">Highest salary</option>
          </select>
        </div>
        {jobs.length === 0 && !loading ? <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No jobs match your filters.</p> : (
          <div className="grid gap-3 sm:grid-cols-2">{jobs.map((j) => <JobCard key={j.id} job={j} />)}</div>
        )}
      </div>
    </div>
  );
}
