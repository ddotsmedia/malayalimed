'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterForm({ locale = 'ml' }) {
  const ml = locale === 'ml';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    const f = new FormData(e.target);
    if (String(f.get('password')).length < 8) { setErr(ml ? 'പാസ്‌വേഡ് കുറഞ്ഞത് 8 അക്ഷരം വേണം.' : 'Password must be at least 8 characters.'); setBusy(false); return; }
    try {
      const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: f.get('full_name'), email: f.get('email'), password: f.get('password'), role: 'patient' }) });
      if (r.ok) { window.location.href = `/${locale}`; return; }
      const j = await r.json().catch(() => ({}));
      setErr(j.errors?.[0] === 'email_taken' ? (ml ? 'ഈ ഇമെയിൽ ഇതിനകം രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്.' : 'This email is already registered.') : (ml ? 'രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു.' : 'Registration failed.'));
    } catch { setErr(ml ? 'നെറ്റ്‌വർക്ക് പിശക്.' : 'Network error.'); }
    setBusy(false);
  }

  const inp = 'w-full rounded-lg border border-slate-300 px-4 py-2 text-base focus:border-brand focus:outline-none';
  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
      <input name="full_name" required placeholder={ml ? 'പൂർണ്ണ നാമം' : 'Full name'} className={inp} />
      <input name="email" type="email" required autoComplete="username" placeholder={ml ? 'ഇമെയിൽ' : 'Email'} className={inp} />
      <input name="password" type="password" required autoComplete="new-password" minLength={8} placeholder={ml ? 'പാസ്‌വേഡ് (8+ അക്ഷരം)' : 'Password (8+ chars)'} className={inp} />
      <button disabled={busy} className="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{busy ? '…' : (ml ? 'അക്കൗണ്ട് സൃഷ്ടിക്കുക' : 'Create account')}</button>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <p className="text-center text-sm text-slate-500">{ml ? 'അക്കൗണ്ട് ഉണ്ടോ?' : 'Have an account?'} <Link href={`/${locale}/login`} className="font-semibold text-brand">{ml ? 'ലോഗിൻ' : 'Login'}</Link></p>
    </form>
  );
}
