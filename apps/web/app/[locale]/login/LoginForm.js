'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginForm({ locale = 'ml' }) {
  const ml = locale === 'ml';
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    const f = new FormData(e.target);
    try {
      const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: f.get('email'), password: f.get('password') }) });
      if (r.ok) { window.location.href = `/${locale}`; return; }
      const j = await r.json().catch(() => ({}));
      setErr(j.errors?.[0] === 'invalid_credentials' ? (ml ? 'ഇമെയിലോ പാസ്‌വേഡോ തെറ്റാണ്.' : 'Incorrect email or password.') : (ml ? 'ലോഗിൻ പരാജയപ്പെട്ടു.' : 'Login failed.'));
    } catch { setErr(ml ? 'നെറ്റ്‌വർക്ക് പിശക്.' : 'Network error.'); }
    setBusy(false);
  }

  const inp = 'w-full rounded-lg border border-slate-300 px-4 py-2 text-base focus:border-brand focus:outline-none';
  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
      <input name="email" type="email" required autoComplete="username" placeholder={ml ? 'ഇമെയിൽ' : 'Email'} className={inp} />
      <div className="relative">
        <input name="password" type={showPw ? 'text' : 'password'} required autoComplete="current-password" placeholder={ml ? 'പാസ്‌വേഡ്' : 'Password'} className={`${inp} pr-16`} />
        <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-slate-500">{showPw ? (ml ? 'മറയ്ക്കൂ' : 'Hide') : (ml ? 'കാണിക്കൂ' : 'Show')}</button>
      </div>
      <button disabled={busy} className="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{busy ? '…' : (ml ? 'ലോഗിൻ' : 'Login')}</button>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <p className="text-center text-sm text-slate-500">{ml ? 'അക്കൗണ്ട് ഇല്ലേ?' : 'No account?'} <Link href={`/${locale}/register`} className="font-semibold text-brand">{ml ? 'രജിസ്റ്റർ ചെയ്യുക' : 'Register'}</Link></p>
    </form>
  );
}
