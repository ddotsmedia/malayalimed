'use client';
import { useEffect, useState } from 'react';

export default function ComparisonClient({ locale = 'ml' }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const ids = new URLSearchParams(window.location.search).get('ids') || '';
    fetch(`/api/doctors/search?ids=${encodeURIComponent(ids)}`).then((r) => r.json()).then((j) => { setDocs(j.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;
  if (docs.length === 0) return <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Add doctors to compare via <code>?ids=uuid1,uuid2</code>.</p>;

  const rows = [
    ['Specialty', (d) => d.specialty_en || '—'],
    ['District', (d) => d.district_en || '—'],
    ['Fee', (d) => d.consultation_fee ? `₹${d.consultation_fee}` : '—'],
    ['Rating', (d) => `★ ${d.rating_avg} (${d.rating_count})`],
    ['Experience', (d) => d.years_experience ? `${d.years_experience} yrs` : '—'],
    ['Languages', (d) => Array.isArray(d.languages) ? d.languages.join(', ') : '—'],
  ];
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead><tr><th className="px-3 py-2"></th>{docs.map((d) => <th key={d.id} className="px-3 py-2"><a href={`/${locale}/doctors/${d.slug}`} className="font-bold text-brand">{d.display_name}</a></th>)}</tr></thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(([label, fn]) => <tr key={label}><td className="px-3 py-2 text-xs font-semibold uppercase text-gray-400">{label}</td>{docs.map((d) => <td key={d.id} className="px-3 py-2">{fn(d)}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
