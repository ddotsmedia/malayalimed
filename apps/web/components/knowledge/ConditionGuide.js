'use client';
import { use, useEffect, useState } from 'react';
const Section = ({ label, items }) => Array.isArray(items) && items.length ? <div className="rounded-2xl border border-gray-200 bg-white p-4"><h2 className="mb-1 text-sm font-bold text-gray-900">{label}</h2><ul className="list-disc pl-5 text-sm text-gray-700">{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div> : null;
export default function ConditionGuide({ params }) {
  const { slug } = use(params);
  const [c, setC] = useState(null);
  useEffect(() => { fetch(`/api/conditions/${slug}`).then((r) => r.json()).then((j) => setC(j.data)); }, [slug]);
  if (!c) return <p className="text-sm text-gray-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{c.condition_name}</h1>
        {c.icd10_code && <p className="text-xs text-gray-400">ICD-10 {c.icd10_code}</p>}
        <p className="mt-2 text-gray-700">{c.overview}</p>
      </div>
      <Section label="Causes" items={c.causes} />
      <Section label="Symptoms" items={c.symptoms} />
      <Section label="Risk factors" items={c.risk_factors} />
      <Section label="Diagnosis" items={c.diagnosis_tests} />
      <Section label="Treatment options" items={c.treatment_options} />
      <Section label="Lifestyle changes" items={c.lifestyle_changes} />
      <div className="flex flex-wrap gap-3 text-sm">
        <a href={`/conditions/${slug}/medicines`} className="font-semibold text-brand">💊 Medicines</a>
        <a href={`/conditions/${slug}/procedures`} className="font-semibold text-brand">🔬 Procedures</a>
        <a href={`/conditions/${slug}/doctor-chat`} className="font-semibold text-brand">🤖 Ask a doctor</a>
        <a href={`/conditions/${slug}/support-group`} className="font-semibold text-brand">👥 Support</a>
      </div>
      <p className="text-xs text-gray-400">Educational content — not a substitute for professional medical advice.</p>
    </div>
  );
}
