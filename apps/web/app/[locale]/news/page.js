import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listArticles } from '@/lib/directories';
import { fmtDate } from '@/lib/formatters';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health News' };

export default async function NewsPage(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listArticles('');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ആരോഗ്യ വാർത്തകൾ' : 'Health news'}</h1>
      {rows.length === 0 ? <EmptyState icon="📰" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((a) => (
            <Link key={a.slug} href={`/${locale}/news/${a.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
              <span className="text-xs font-semibold text-brand">{a.category}</span>
              <h3 className="mt-0.5 font-semibold text-slate-900">{ml ? (a.title_ml || a.title_en) : a.title_en}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.excerpt_en}</p>
              <p className="mt-1 text-xs text-slate-400">{fmtDate(a.published_at)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
