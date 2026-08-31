export default function ClinicDetail({ clinic: f, locale = 'ml', icon = '🏥', disclaimer, extra = null }) {
  const ml = locale === 'ml';
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2"><span className="text-3xl">{icon}</span><h1 className="text-2xl font-bold text-slate-900">{ml ? (f.name_ml || f.name_en) : f.name_en}</h1></div>
        <p className="mt-1 text-sm text-slate-500">📍 {ml ? (f.district_ml || f.district_en) : f.district_en}{f.address ? ` · ${f.address}` : ''}</p>
        {f.phone && <a href={`tel:${f.phone}`} className="mt-1 inline-block text-sm font-semibold text-brand">📞 {f.phone}</a>}
      </header>
      {f.about_en && <section className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-slate-700">{f.about_en}</p></section>}
      {Array.isArray(f.services) && f.services.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-bold text-slate-900">{ml ? 'സേവനങ്ങൾ' : 'Services'}</h2>
          <div className="flex flex-wrap gap-2">{f.services.map((s) => <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{s}</span>)}</div>
        </section>
      )}
      {extra}
      {disclaimer && <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{disclaimer}</div>}
    </div>
  );
}
