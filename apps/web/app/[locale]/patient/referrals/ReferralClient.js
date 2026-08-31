'use client';
import { useEffect, useState } from 'react';
import ShareButton from '@/components/common/ShareButton';

export default function ReferralClient() {
  const [rows, setRows] = useState([]);
  const [link, setLink] = useState('');
  const load = () => fetch('/api/referrals').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  async function gen() {
    const r = await fetch('/api/referrals/share', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({}) });
    const j = await r.json();
    if (r.ok) { setLink(j.data.link); load(); }
  }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">Invite friends and earn rewards.</p>
        <button onClick={gen} className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Generate referral link</button>
        {link && <div className="mt-2 flex items-center gap-2"><input readOnly value={link} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs" /><ShareButton url={link} text="Join me on MalayaliMed" /></div>}
      </div>
      {rows.length > 0 && (
        <div className="space-y-1">
          {rows.map((r) => <div key={r.id} className="flex justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm"><span className="font-mono text-xs">{r.code}</span><span className="text-gray-500">{r.status}</span></div>)}
        </div>
      )}
    </div>
  );
}
