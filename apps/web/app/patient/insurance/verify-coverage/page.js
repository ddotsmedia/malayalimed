'use client';
import { useEffect, useState } from 'react';

export default function VerifyCoverage() {
  const [v, setV] = useState(null);
  const [copay, setCopay] = useState(null);
  const [service, setService] = useState('consultation');
  useEffect(() => { fetch('/api/insurance/verify').then((r) => r.json()).then((j) => setV(j.data)); }, []);
  useEffect(() => { fetch(`/api/insurance/copay?service=${service}`).then((r) => r.json()).then((j) => setCopay(j.data)); }, [service]);
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Coverage Check</h1>
      {v && (v.eligible
        ? <div className="rounded-2xl border border-green-300 bg-green-50 p-4 text-sm text-green-800"><p className="font-bold">✓ Eligible</p><p>{v.insurer} · {v.plan}</p><p>Copay ₹{v.copay ?? '—'} · Deductible ₹{v.deductible ?? '—'}</p><p className="mt-1 text-xs">{v.note}</p></div>
        : <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">No active policy on file. Add one on the Insurance page.</div>)}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <label className="text-sm text-gray-600">Service <select value={service} onChange={(e) => setService(e.target.value)} className="ml-2 rounded-lg border border-gray-300 px-2 py-1 text-sm"><option value="consultation">Consultation</option><option value="lab">Lab</option><option value="procedure">Procedure</option></select></label>
        {copay && <p className="mt-2 text-sm text-gray-700">Estimated cost ₹{copay.estimatedCost} · You pay ₹{copay.youPay}</p>}
      </div>
    </div>
  );
}
