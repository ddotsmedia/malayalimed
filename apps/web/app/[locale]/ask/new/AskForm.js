'use client';

import { useState } from 'react';

export default function AskForm({ locale = 'ml', specialties = [] }) {
  const ml = locale === 'ml';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    const f = new FormData(e.target);
    try {
      const r = await fetch('/api/qa/questions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: f.get('title'), body: f.get('body'), specialty_id: f.get('specialty_id') || null, is_anonymous: f.get('is_anonymous') === 'on' })
      });
      const j = await r.json();
      if (r.ok && j.data?.slug) { window.location.href = `/${locale}/ask/${j.data.slug}`; return; }
      setErr(r.status === 401 ? (ml ? 'ചോദിക്കാൻ ലോഗിൻ ചെയ്യുക.' : 'Please log in to ask.') : (j.errors?.[0] || 'Could not submit.'));
    } catch { setErr('Network error.'); }
    setBusy(false);
  }

  const inp = 'w-full rounded-lg border border-slate-300 px-4 py-2 text-base focus:border-brand focus:outline-none';
  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <input name="title" required maxLength={200} placeholder={ml ? 'നിങ്ങളുടെ ചോദ്യം (ഹ്രസ്വമായി)' : 'Your question (short)'} className={inp} />
      <textarea name="body" required rows={5} maxLength={4000} placeholder={ml ? 'വിശദമായി എഴുതുക…' : 'Describe in detail…'} className={inp} />
      <select name="specialty_id" className={inp}>
        <option value="">{ml ? 'സ്പെഷ്യാലിറ്റി (ഓപ്ഷണൽ)' : 'Specialty (optional)'}</option>
        {specialties.map((s) => <option key={s.id} value={s.id}>{ml ? s.name_ml : s.name_en}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name="is_anonymous" /> {ml ? 'അജ്ഞാതമായി പോസ്റ്റ് ചെയ്യുക' : 'Post anonymously'}</label>
      <button disabled={busy} className="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{busy ? '…' : (ml ? 'ചോദ്യം സമർപ്പിക്കുക' : 'Submit question')}</button>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
