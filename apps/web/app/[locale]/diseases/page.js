import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listDiseases } from '@/lib/directories';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Diseases' };

export default async function DiseasesPage(props) {
  const params = await props.params; const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listDiseases(sp.q || '');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'രോഗങ്ങൾ' : 'Diseases'}</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/diseases`} defaultValue={sp.q || ''} /></div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      {rows.length === 0 ? <EmptyState icon="📋" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((d) => (
            <Link key={d.slug} href={`/${locale}/diseases/${d.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
              <h3 className="font-semibold text-slate-900">{ml ? (d.name_ml || d.name_en) : d.name_en}</h3>
              {d.category && <span className="text-xs text-brand">{d.category}</span>}
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{d.overview_en}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
