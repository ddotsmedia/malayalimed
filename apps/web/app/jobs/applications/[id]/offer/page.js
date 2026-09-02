'use client';
import { use, useEffect, useState } from 'react';
export default function OfferLetter({ params }) {
  const { id } = use(params);
  const [offer, setOffer] = useState(null);
  const [msg, setMsg] = useState('');
  const load = () => fetch(`/api/applications/${id}/send-offer`).then((r) => r.json()).then((j) => setOffer(j.data)).catch(() => {});
  useEffect(() => { load(); }, [id]);
  async function respond(status) { const r = await fetch(`/api/offers/${offer.id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) }); setMsg(r.ok ? `Offer ${status} ✓` : 'Failed'); load(); }
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <a href={`/jobs/applications/${id}`} className="text-sm text-brand">← Application</a>
      <h1 className="text-xl font-bold text-gray-900">Offer Letter</h1>
      {!offer ? <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No offer yet. When the recruiter sends one, it appears here.</p> : (
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Status: <b className="capitalize">{offer.status}</b> · Salary ₹{offer.salary_offered ?? '—'}</p>
          <p className="whitespace-pre-wrap text-sm text-gray-800">{offer.offer_text || 'We are pleased to extend an offer.'}</p>
          {offer.status === 'sent' && <div className="flex gap-2"><button onClick={() => respond('accepted')} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">Accept</button><button onClick={() => respond('rejected')} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Decline</button></div>}
          {msg && <p className="text-sm font-semibold text-brand">{msg}</p>}
        </div>
      )}
    </div>
  );
}
