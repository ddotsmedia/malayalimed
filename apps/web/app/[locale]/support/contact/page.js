'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [f, setF] = useState({ name: '', email: '', message: '' });
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/support/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
    const j = await r.json();
    if (r.ok) { setF({ name: '', email: '', message: '' }); setMsg('Message sent ✓ We will get back to you.'); } else setMsg(j.errors?.[0] || 'Failed');
  }
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} type="email" placeholder="Email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} rows={4} placeholder="How can we help?" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Send</button>
        {msg && <p className="text-sm font-semibold text-brand">{msg}</p>}
      </form>
    </div>
  );
}
