'use client';
import { useState } from 'react';

const inp = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm';

export default function UploadClient() {
  const [f, setF] = useState({ orderId: '', testName: '', resultValue: '', normalRange: '' });
  const [pdf, setPdf] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  function onFile(e) {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 1_800_000) { setMsg('File too large (max 1.8MB)'); return; }
    const r = new FileReader(); r.onload = () => setPdf(r.result); r.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    const r = await fetch('/api/admin/lab-results/upload', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...f, pdfUrl: pdf }) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) { setF({ orderId: '', testName: '', resultValue: '', normalRange: '' }); setPdf(null); setMsg('Uploaded ✓ (patient notified in-app)'); }
    else setMsg(j.errors?.[0] || 'Failed');
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <input className={inp} placeholder="Lab Order ID (uuid) *" value={f.orderId} onChange={(e) => set('orderId', e.target.value)} required />
      <input className={inp} placeholder="Test name" value={f.testName} onChange={(e) => set('testName', e.target.value)} />
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={inp} placeholder="Result value" value={f.resultValue} onChange={(e) => set('resultValue', e.target.value)} />
        <input className={inp} placeholder="Normal range" value={f.normalRange} onChange={(e) => set('normalRange', e.target.value)} />
      </div>
      <input type="file" accept="application/pdf,image/*" onChange={onFile} className="text-sm" />
      <p className="text-xs text-slate-400">Note: PDF stored as data-URI (no S3). OCR text-extraction not available — enter values manually.</p>
      <div className="flex items-center gap-3">
        <button disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? '…' : 'Upload'}</button>
        {msg && <span className="text-xs font-semibold text-brand">{msg}</span>}
      </div>
    </form>
  );
}
