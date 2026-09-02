'use client';
import { useEffect, useState } from 'react';

// Generic knowledge list. Serializable props only (no functions across the boundary).
export default function KList({ url, titleKey, subKey, hrefBase, idKey = 'id', costKey, empty = 'Nothing here yet.' }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { fetch(url).then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([])); }, [url]);
  if (rows === null) return <p className="text-sm text-gray-500">Loading…</p>;
  if (rows.length === 0) return <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">{empty}</p>;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((r, i) => {
        const title = r[titleKey] ?? '—';
        const sub = subKey ? r[subKey] : null;
        const cost = costKey && r[costKey] != null ? `₹${r[costKey]}` : null;
        const inner = (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-900">{Array.isArray(title) ? title.join(', ') : title}</h3>{cost && <span className="text-sm font-semibold text-brand">{cost}</span>}</div>
            {sub != null && <p className="text-xs text-gray-500">{Array.isArray(sub) ? sub.join(', ') : sub}</p>}
          </div>
        );
        return hrefBase && r[idKey] ? <a key={r[idKey] || i} href={hrefBase + r[idKey]}>{inner}</a> : <div key={i}>{inner}</div>;
      })}
    </div>
  );
}
