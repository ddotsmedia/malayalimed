import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listSymptoms } from '@/lib/directories';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Symptoms' };
const U = { routine: 'bg-green-100 text-green-700', soon: 'bg-yellow-100 text-yellow-700', urgent: 'bg-orange-100 text-orange-700', emergency: 'bg-red-100 text-red-700' };

export default async function SymptomsPage(props) {
  const params = await props.params; const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listSymptoms(sp.q || '');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ലക്ഷണങ്ങൾ' : 'Symptoms'}</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/symptoms`} defaultValue={sp.q || ''} /></div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      {rows.length === 0 ? <EmptyState icon="🩺" message={t(locale, 'no_results')} /> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rows.map((s) => (
            <Link key={s.slug} href={`/${locale}/symptoms/${s.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-center hover:shadow-sm">
              <p className="font-medium text-slate-900">{ml ? (s.name_ml || s.name_en) : s.name_en}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${U[s.urgency] || U.routine}`}>{s.urgency}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
