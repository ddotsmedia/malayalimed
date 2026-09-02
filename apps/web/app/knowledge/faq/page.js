'use client';
import { useEffect, useState } from 'react';
export default function FAQList() {
  const [rows, setRows] = useState([]);
  useEffect(() => { fetch('/api/faq').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {}); }, []);
  return (
    <div className="mx-auto max-w-2xl space-y-3 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Knowledge FAQ</h1>
      {rows.map((f) => <details key={f.id} className="rounded-2xl border border-gray-200 bg-white p-4"><summary className="cursor-pointer font-semibold text-gray-900">{f.question}</summary><p className="mt-2 text-sm text-gray-600">{f.answer}</p></details>)}
      {rows.length === 0 && <p className="text-sm text-gray-400">No FAQs yet.</p>}
    </div>
  );
}
