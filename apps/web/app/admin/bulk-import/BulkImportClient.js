'use client';
import { useEffect, useState } from 'react';

const ENTITIES = ['doctors', 'hospitals', 'pharmacies'];
const COLUMNS = {
  doctors: 'display_name, reg_no, specialty_name, district_name, experience, consultation_fee, about_en',
  hospitals: 'name_en, name_ml, district_name, bed_count, phone, address_en',
  pharmacies: 'name, district_name, phone, address, 24x7_flag, delivery_flag',
};

function parsePreview(text) {
  const lines = String(text).split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return { header: [], rows: [] };
  const header = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1, 6).map((l) => l.split(','));
  return { header, rows };
}

export default function BulkImportClient() {
  const [entityType, setEntity] = useState('doctors');
  const [csvText, setCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState({ header: [], rows: [] });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const loadHistory = () => fetch('/api/admin/bulk-import').then((r) => r.json()).then((j) => setHistory(j.data || [])).catch(() => {});
  useEffect(() => { loadHistory(); }, []);

  function onFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    setFileName(f.name);
    const r = new FileReader();
    r.onload = () => { setCsv(r.result); setPreview(parsePreview(r.result)); };
    r.readAsText(f);
  }

  async function submit() {
    if (!csvText) return;
    setBusy(true); setResult(null);
    const r = await fetch('/api/admin/bulk-import', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ entityType, fileName, csvText }) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) { setResult(j.data); loadHistory(); } else setResult({ error: j.errors?.[0] || 'Failed' });
  }

  function downloadErrors(errors) {
    const blob = new Blob([JSON.stringify(errors, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'import-errors.json'; a.click();
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select value={entityType} onChange={(e) => setEntity(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {ENTITIES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <input type="file" accept=".csv,text/csv" onChange={onFile} className="text-sm" />
          <button onClick={submit} disabled={busy || !csvText} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Importing…' : 'Import'}</button>
        </div>
        <p className="text-xs text-slate-500">Expected columns: <span className="font-mono">{COLUMNS[entityType]}</span></p>

        {preview.header.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500"><tr>{preview.header.map((h) => <th key={h} className="px-2 py-1">{h}</th>)}</tr></thead>
              <tbody>{preview.rows.map((r, i) => <tr key={i} className="border-t border-slate-100">{r.map((c, k) => <td key={k} className="px-2 py-1">{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}

        {result && (result.error
          ? <p className="text-sm text-red-600">{result.error}</p>
          : <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p><b className="text-green-600">{result.rowsSuccess}</b> imported · <b className="text-red-500">{result.rowsFailed}</b> failed · {result.rowsTotal} total</p>
              {result.errors?.length > 0 && <button onClick={() => downloadErrors(result.errors)} className="mt-1 text-xs font-semibold text-brand">Download error log</button>}
            </div>)}
      </div>

      <div>
        <h2 className="mb-2 text-lg font-bold text-slate-900">Import history</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-3 py-2">Date</th><th className="px-3 py-2">Entity</th><th className="px-3 py-2">Total</th><th className="px-3 py-2">Success</th><th className="px-3 py-2">Failed</th><th className="px-3 py-2">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">No imports yet.</td></tr> :
                history.map((h) => (
                  <tr key={h.id}><td className="px-3 py-2 text-slate-500">{String(h.created_at).slice(0, 10)}</td><td className="px-3 py-2">{h.entity_type}</td><td className="px-3 py-2">{h.rows_total}</td><td className="px-3 py-2 text-green-600">{h.rows_success}</td><td className="px-3 py-2 text-red-500">{h.rows_failed}</td><td className="px-3 py-2">{h.status}</td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
