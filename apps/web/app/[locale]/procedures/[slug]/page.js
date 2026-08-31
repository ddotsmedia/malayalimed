import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getProcedure } from '@/lib/directories';
import { fmtCurrency } from '@/lib/formatters';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const x = await getProcedure(p.slug); return { title: x ? x.name_en : 'Procedure' }; }

export default async function ProcedureDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const x = await getProcedure(params.slug); if (!x) notFound();
  const Sec = ({ h, b }) => b ? <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-2 text-lg font-bold text-slate-900">{h}</h2><p className="text-slate-700">{b}</p></section> : null;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-900">{ml ? (x.name_ml || x.name_en) : x.name_en}</h1>
        <p className="text-brand">{x.category}{x.typical_cost_inr != null ? ` · ${ml ? 'ഏകദേശ ചെലവ്' : 'Typical cost'} ${fmtCurrency(x.typical_cost_inr)}` : ''}</p>
      </header>
      <Sec h={ml ? 'എന്താണ്' : 'About'} b={x.about_en} />
      <Sec h={ml ? 'തയ്യാറെടുപ്പ്' : 'Preparation'} b={x.preparation_en} />
      <Sec h={ml ? 'വീണ്ടെടുപ്പ്' : 'Recovery'} b={x.recovery_en} />
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      {x.specialty_slug && <a href={`/${locale}/doctors?specialty=${x.specialty_slug}`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{t(locale, 'find_doctor')} →</a>}
    </div>
  );
}
