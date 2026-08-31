'use client';
import { useEffect, useState } from 'react';

export default function SymptomInput({ selected, onToggle }) {
  const [options, setOptions] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/symptom-checker/options').then((r) => r.json()).then((j) => setOptions(j.data || [])).catch(() => {});
  }, []);

  const filtered = options.filter((o) => o.name_en.toLowerCase().includes(q.toLowerCase()));
  const custom = q.trim() && !options.some((o) => o.name_en.toLowerCase() === q.toLowerCase());

  return (
    <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search symptoms…" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      {custom && <button onClick={() => { onToggle(q.trim()); setQ(''); }} className="text-xs font-semibold text-brand">+ Add “{q.trim()}”</button>}
      <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto">
        {filtered.slice(0, 60).map((o) => {
          const on = selected.includes(o.name_en);
          return (
            <button key={o.slug} onClick={() => onToggle(o.name_en)} className={`rounded-full border px-3 py-1 text-sm ${on ? 'border-brand bg-brand text-white' : 'border-gray-300 text-gray-700'}`}>
              {o.name_en}
            </button>
          );
        })}
        {filtered.length === 0 && !custom && <p className="text-sm text-gray-400">No matches.</p>}
      </div>
    </div>
  );
}
