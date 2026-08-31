'use client';
import { useState } from 'react';

const MAX = 1_500_000;

export default function PrescriptionUpload({ onUploaded }) {
  const [text, setText] = useState('');
  const [medicines, setMedicines] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  function readFile(f) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(f);
    });
  }

  async function submit(e) {
    e.preventDefault(); setMsg('');
    if (file && file.size > MAX) { setMsg('File too large (max 1.5MB)'); return; }
    setBusy(true);
    const body = {
      prescriptionText: text || null,
      medicines: medicines ? medicines.split(',').map((s) => s.trim()).filter(Boolean) : null,
      fileName: file?.name || null,
      fileDataUrl: file ? await readFile(file) : null,
    };
    const res = await fetch('/api/prescriptions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    setBusy(false);
    if (res.ok) { setText(''); setMedicines(''); setFile(null); e.target.reset(); setMsg('Uploaded ✓'); onUploaded && onUploaded(); }
    else { const j = await res.json().catch(() => ({})); setMsg(j.errors?.[0] || 'Failed'); }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="Prescription text (optional)" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      <input value={medicines} onChange={(e) => setMedicines(e.target.value)} placeholder="Medicines (comma-separated)" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      <div className="flex items-center gap-3">
        <button disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? '…' : 'Upload'}</button>
        {msg && <span className="text-xs font-semibold text-brand">{msg}</span>}
      </div>
    </form>
  );
}
