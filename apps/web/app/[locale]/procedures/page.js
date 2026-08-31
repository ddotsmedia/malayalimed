import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listProcedures } from '@/lib/directories';
import { fmtCurrency } from '@/lib/formatters';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Procedures' };

export default async function ProceduresPage(props) {
  const params = await props.params; const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listProcedures(sp.q || '');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ചികിത്സാ നടപടികൾ' : 'Procedures'}</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/procedures`} defaultValue={sp.q || ''} /></div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      {rows.length === 0 ? <EmptyState icon="🩺" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((p) => (
            <Link key={p.slug} href={`/${locale}/procedures/${p.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
              <div className="flex items-center justify-between"><h3 className="font-semibold text-slate-900">{ml ? (p.name_ml || p.name_en) : p.name_en}</h3>{p.typical_cost_inr != null && <span className="text-sm font-medium text-slate-700">~{fmtCurrency(p.typical_cost_inr)}</span>}</div>
              {p.category && <span className="text-xs text-brand">{p.category}</span>}
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.about_en}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
