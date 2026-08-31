'use client';
import { use, useState } from 'react';

export default function NewPostPage({ params }) {
  const { locale } = use(params);
  const [f, setF] = useState({ title: '', content: '', category: 'general' });
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/community/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
    const j = await r.json();
    if (r.ok) window.location.href = `/${locale}/community/${j.data.id}`;
    else setMsg(j.errors?.[0] || 'Login required to post');
  }
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-gray-900">New Post</h1>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="general">General</option><option value="wellness">Wellness</option><option value="experience">Experience</option><option value="question">Question</option></select>
        <textarea value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} rows={5} placeholder="Share your thoughts…" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Post</button>
        {msg && <span className="ml-2 text-sm text-red-600">{msg}</span>}
      </form>
    </div>
  );
}
