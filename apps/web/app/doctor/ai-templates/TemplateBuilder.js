'use client';
import { useEffect, useState } from 'react';

export default function TemplateBuilder() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [sections, setSections] = useState('Subjective, Objective, Assessment, Plan');
  const load = () => fetch('/api/scribe/templates').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  async function add(e) {
    e.preventDefault();
    await fetch('/api/scribe/templates', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ templateName: name, sectionTypes: sections.split(',').map((s) => s.trim()).filter(Boolean) }) });
    setName(''); load();
  }
  return (
    <div className="space-y-4">
      <form onSubmit={add} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name *" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={sections} onChange={(e) => setSections(e.target.value)} placeholder="Sections (comma-separated)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Create template</button>
      </form>
      {rows.map((t) => <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><p className="font-medium">{t.template_name}</p><p className="text-xs text-slate-500">{(t.section_types || []).join(' · ')}</p></div>)}
    </div>
  );
}
