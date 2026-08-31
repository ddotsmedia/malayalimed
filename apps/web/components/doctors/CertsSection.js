'use client';
import { useEffect, useState } from 'react';

export default function CertsSection({ doctorId }) {
  const [d, setD] = useState(null);
  useEffect(() => { fetch(`/api/doctor/${doctorId}/certifications`).then((r) => r.json()).then((j) => setD(j.data)).catch(() => {}); }, [doctorId]);
  if (!d || (d.certifications.length === 0 && d.awards.length === 0 && d.publications.length === 0)) return null;
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="mb-2 text-lg font-bold text-gray-900">Credentials</h2>
      {d.certifications.length > 0 && <div className="mb-2"><p className="text-xs font-bold uppercase text-gray-400">Certifications</p><ul className="text-sm text-gray-700">{d.certifications.map((c) => <li key={c.id}>• {c.cert_name}{c.issuing_body ? ` — ${c.issuing_body}` : ''}</li>)}</ul></div>}
      {d.awards.length > 0 && <div className="mb-2"><p className="text-xs font-bold uppercase text-gray-400">Awards</p><ul className="text-sm text-gray-700">{d.awards.map((a) => <li key={a.id}>• {a.award_name}{a.year ? ` (${a.year})` : ''}</li>)}</ul></div>}
      {d.publications.length > 0 && <div><p className="text-xs font-bold uppercase text-gray-400">Publications</p><ul className="text-sm text-gray-700">{d.publications.map((p) => <li key={p.id}>• {p.title}{p.journal ? `, ${p.journal}` : ''}</li>)}</ul></div>}
    </section>
  );
}
