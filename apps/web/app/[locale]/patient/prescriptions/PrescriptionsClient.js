'use client';
import { useEffect, useState } from 'react';
import PrescriptionUpload from '@/components/prescriptions/PrescriptionUpload';
import PrescriptionList from '@/components/prescriptions/PrescriptionList';

export default function PrescriptionsClient({ locale = 'ml' }) {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const r = await fetch('/api/prescriptions', { credentials: 'same-origin' });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setRows(j.data || []);
  };
  useEffect(() => { load(); }, []);

  async function onDelete(id) {
    const r = await fetch(`/api/prescriptions/${id}`, { method: 'DELETE' });
    if (r.ok) setRows((rs) => rs.filter((x) => x.id !== id));
  }
  async function onRefill(id) {
    const r = await fetch(`/api/prescriptions/${id}/refill`, { method: 'POST' });
    setMsg(r.ok ? 'Refill requested ✓' : 'Refill failed');
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div className="space-y-4">
      <PrescriptionUpload onUploaded={load} />
      {msg && <p className="text-sm font-semibold text-brand">{msg}</p>}
      <PrescriptionList rows={rows} locale={locale} onDelete={onDelete} onRefill={onRefill} />
    </div>
  );
}
