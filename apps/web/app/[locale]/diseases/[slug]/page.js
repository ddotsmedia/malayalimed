import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getDisease } from '@/lib/directories';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const d = await getDisease(p.slug); return { title: d ? d.name_en : 'Disease' }; }

export default async function DiseaseDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const d = await getDisease(params.slug); if (!d) notFound();
  const Sec = ({ h, b }) => b ? <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-2 text-lg font-bold text-slate-900">{h}</h2><p className="whitespace-pre-wrap text-slate-700">{b}</p></section> : null;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-900">{ml ? (d.name_ml || d.name_en) : d.name_en}</h1>
        {d.category && <p className="text-brand">{d.category}</p>}
      </header>
      <Sec h={ml ? 'അവലോകനം' : 'Overview'} b={ml ? (d.overview_ml || d.overview_en) : d.overview_en} />
      <Sec h={ml ? 'ലക്ഷണങ്ങൾ' : 'Symptoms'} b={d.symptoms_en} />
      <Sec h={ml ? 'പ്രതിരോധം' : 'Prevention'} b={d.prevention_en} />
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      {d.specialty_slug && <a href={`/${locale}/doctors?specialty=${d.specialty_slug}`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{t(locale, 'find_doctor')} →</a>}
    </div>
  );
}
