'use client';
import { useState } from 'react';
import AdminChart from '@/components/admin/AdminChart';
export default function SalaryBenchmark() {
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('Kochi');
  const [rows, setRows] = useState([]);
  const [done, setDone] = useState(false);
  async function check() {
    const qs = new URLSearchParams({ specialty, location });
    const r = await fetch(`/api/salary/benchmark?${qs}`); const j = await r.json();
    setRows(j.data || []); setDone(true);
  }
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Salary Benchmark</h1>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Specialty (e.g. Cardiology)" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button onClick={check} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Check</button>
      </div>
      {done && (rows.length === 0 ? <p className="text-sm text-gray-400">No salary data for that query. Try "Cardiology" or "Nursing" in "Kochi".</p> : (
        <>
          <AdminChart type="bar" title="Median salary by experience" series={[{ name: 'Median ₹', data: rows.map((r) => Number(r.salary_median)) }]} categories={rows.map((r) => `${r.role} ${r.experience_level}`)} />
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="min-w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Role</th><th className="px-3 py-2">Exp</th><th className="px-3 py-2">Min</th><th className="px-3 py-2">Median</th><th className="px-3 py-2">Max</th><th className="px-3 py-2">n</th></tr></thead>
              <tbody className="divide-y divide-gray-100">{rows.map((r) => <tr key={r.id || r.role + r.experience_level}><td className="px-3 py-2">{r.role}</td><td className="px-3 py-2">{r.experience_level}</td><td className="px-3 py-2">₹{r.salary_min}</td><td className="px-3 py-2 font-semibold">₹{r.salary_median}</td><td className="px-3 py-2">₹{r.salary_max}</td><td className="px-3 py-2 text-gray-400">{r.data_points}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ))}
    </div>
  );
}
