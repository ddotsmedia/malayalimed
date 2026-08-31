import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getArticle } from '@/lib/directories';
import { fmtDate } from '@/lib/formatters';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const a = await getArticle(p.slug); return { title: a ? a.title_en : 'Article' }; }

export default async function ArticleDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const a = await getArticle(params.slug); if (!a) notFound();
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <header>
        <span className="text-xs font-semibold text-brand">{a.category}</span>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{ml ? (a.title_ml || a.title_en) : a.title_en}</h1>
        <p className="text-xs text-slate-400">{fmtDate(a.published_at)}</p>
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="whitespace-pre-wrap leading-relaxed text-slate-700">{ml ? (a.body_ml || a.body_en) : a.body_en}</p></div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
    </article>
  );
}
