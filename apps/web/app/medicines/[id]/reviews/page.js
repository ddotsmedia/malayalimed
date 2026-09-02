'use client';
import { use, useEffect, useState } from 'react';
export default function Reviews({ params }) {
  const { id } = use(params);
  const [rows, setRows] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const load = () => fetch(`/api/medicines/${id}/reviews`).then((r) => r.json()).then((j) => setRows(j.data || []));
  useEffect(() => { load(); }, [id]);
  async function submit(e) { e.preventDefault(); const r = await fetch(`/api/medicines/${id}/reviews`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ rating, reviewText: text }) }); const j = await r.json(); if (r.ok) { setText(''); load(); } else setMsg(j.errors?.[0] === 'unauthenticated' ? 'Log in to review' : j.errors?.[0]); }
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <a href={`/medicines/${id}`} className="text-sm text-brand">← Medicine</a>
      <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
      <form onSubmit={submit} className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-lg border border-gray-300 px-2 py-1 text-sm">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}</select>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="Your experience…" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Post review</button>{msg && <span className="ml-2 text-sm text-red-600">{msg}</span>}
      </form>
      {rows.map((r) => <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-3 text-sm"><p className="text-amber-500">{'★'.repeat(r.rating)}</p><p className="text-gray-700">{r.review_text}</p><p className="text-xs text-gray-400">{r.full_name || 'User'} · {String(r.created_at).slice(0, 10)}</p></div>)}
      {rows.length === 0 && <p className="text-sm text-gray-400">No reviews yet.</p>}
    </div>
  );
}
