import Link from 'next/link';

export default function ClinicList({ rows = [], locale = 'ml', basePath, icon = '🏥' }) {
  const ml = locale === 'ml';
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((f) => (
        <Link key={f.slug} href={`${basePath}/${f.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
          <div className="flex items-center gap-2"><span className="text-xl">{icon}</span><h3 className="font-semibold text-slate-900">{ml ? (f.name_ml || f.name_en) : f.name_en}</h3></div>
          <p className="mt-1 text-xs text-slate-500">📍 {ml ? (f.district_ml || f.district_en) : f.district_en}{f.address ? ` · ${f.address}` : ''}</p>
          {Array.isArray(f.services) && f.services.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{f.services.slice(0, 4).map((s) => <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{s}</span>)}</div>}
        </Link>
      ))}
    </div>
  );
}
