import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getLabTestBySlug } from '@/lib/labTests';
import { fmtCurrency } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props) {
  const params = await props.params;
  const x = await getLabTestBySlug(params.slug);
  return { title: x ? x.name_en : 'Lab test' };
}

export default async function LabTestDetail(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const x = await getLabTestBySlug(params.slug);
  if (!x) notFound();
  const fact = (label, value) => value != null && value !== '' ? <div><dt className="text-xs text-slate-400">{label}</dt><dd className="text-sm font-semibold text-slate-800">{value}</dd></div> : null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-900">{ml ? (x.name_ml || x.name_en) : x.name_en}</h1>
        {x.category && <p className="text-brand">{x.category}</p>}
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fact(ml ? 'സാമ്പിൾ' : 'Sample', x.sample_type)}
          {fact(ml ? 'ഉപവാസം' : 'Fasting', x.fasting_required ? (ml ? 'വേണം' : 'Required') : (ml ? 'വേണ്ട' : 'Not needed'))}
          {fact(ml ? 'റിപ്പോർട്ട്' : 'Report', `${x.report_hours}h`)}
          {fact(ml ? 'ഏകദേശ വില' : 'Typical price', x.typical_price_inr != null ? fmtCurrency(x.typical_price_inr) : null)}
        </dl>
      </header>
      {x.about_en && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-bold text-slate-900">{ml ? 'എന്താണ് ഈ പരിശോധന' : 'About this test'}</h2>
          <p className="text-slate-700">{ml ? (x.about_ml || x.about_en) : x.about_en}</p>
        </section>
      )}
      {x.preparation_en && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-bold text-slate-900">{ml ? 'തയ്യാറെടുപ്പ്' : 'Preparation'}</h2>
          <p className="text-slate-700">{x.preparation_en}</p>
        </section>
      )}
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
    </div>
  );
}
