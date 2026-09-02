'use client';
import { useEffect, useState } from 'react';
export default function ResumeBuilder() {
  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState('');
  useEffect(() => { fetch('/api/resume-templates').then((r) => r.json()).then((j) => setTemplates(j.data || [])); }, []);
  async function create(e) {
    e.preventDefault();
    const r = await fetch('/api/resumes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, templateId: templateId || null }) });
    const j = await r.json();
    if (r.ok) window.location.href = `/resume/${j.data.id}/edit`;
  }
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">New Resume</h1>
      <form onSubmit={create} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resume title *" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <div className="grid gap-2 sm:grid-cols-3">{templates.map((t) => (
          <button type="button" key={t.id} onClick={() => setTemplateId(t.id)} className={`rounded-2xl border p-3 text-left text-sm ${templateId === t.id ? 'border-brand bg-brand/5' : 'border-gray-200'}`}><p className="font-semibold text-gray-900">{t.name}</p><p className="text-xs text-gray-500">{(t.sections || []).join(', ')}</p></button>
        ))}</div>
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Create resume</button>
      </form>
    </div>
  );
}
