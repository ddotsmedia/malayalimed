'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ entityType, entityId, authed, locale = 'ml' }) {
  const ml = locale === 'ml';
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!authed) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
        <a href={`/${locale}/login`} className="font-semibold text-brand">{ml ? 'ലോഗിൻ ചെയ്യുക' : 'Log in'}</a>{' '}
        {ml ? 'റിവ്യൂ എഴുതാൻ' : 'to write a review'}
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!(rating >= 1)) { setErr(ml ? 'റേറ്റിംഗ് തിരഞ്ഞെടുക്കുക' : 'Select a rating'); return; }
    setBusy(true);
    const key = entityType === 'doctor' ? 'doctorId' : 'hospitalId';
    const res = await fetch('/api/reviews', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ [key]: entityId, rating, title, text }),
    });
    setBusy(false);
    if (res.ok) { setRating(0); setTitle(''); setText(''); router.refresh(); }
    else { const j = await res.json().catch(() => ({})); setErr((j.errors && j.errors[0]) || 'Error'); }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex gap-1 text-2xl">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
            className={(hover || rating) >= s ? 'text-amber-500' : 'text-gray-300'} aria-label={`${s} star`}>★</button>
        ))}
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
        placeholder={ml ? 'തലക്കെട്ട് (ഐച്ഛികം)' : 'Title (optional)'}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} rows={3}
        placeholder={ml ? 'നിങ്ങളുടെ അനുഭവം...' : 'Your experience...'}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {busy ? '…' : (ml ? 'റിവ്യൂ സമർപ്പിക്കുക' : 'Submit review')}
      </button>
    </form>
  );
}
