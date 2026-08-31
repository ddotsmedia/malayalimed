import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listLabTests } from '@/lib/labTests';
import { fmtCurrency } from '@/lib/formatters';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lab Tests' };

export default async function LabTestsPage(props) {
  const params = await props.params;
  const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const tests = await listLabTests(sp.q || '');

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ലാബ് ടെസ്റ്റുകൾ' : 'Lab tests'}</h1>
      <p className="text-sm text-slate-500">{ml ? 'സാധാരണ പരിശോധനകൾ, തയ്യാറെടുപ്പ്, വിലയുടെ ഏകദേശ വിവരം.' : 'Common tests — what they check, how to prepare, and typical prices.'}</p>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/lab-tests`} defaultValue={sp.q || ''} /></div>
      {tests.length === 0 ? <EmptyState icon="🧪" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {tests.map((tst) => (
            <Link key={tst.slug} href={`/${locale}/lab-tests/${tst.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{ml ? (tst.name_ml || tst.name_en) : tst.name_en}</h3>
                {tst.typical_price_inr != null && <span className="text-sm font-medium text-slate-700">~{fmtCurrency(tst.typical_price_inr)}</span>}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
                {tst.category && <span className="rounded bg-slate-100 px-1.5">{tst.category}</span>}
                {tst.sample_type && <span>🩸 {tst.sample_type}</span>}
                {tst.fasting_required && <span className="font-semibold text-amber-600">{ml ? 'ഉപവാസം വേണം' : 'Fasting'}</span>}
                <span>⏱ {tst.report_hours}h</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
