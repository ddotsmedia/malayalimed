import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listWellness } from '@/lib/directories';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Wellness' };

export default async function WellnessPage(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listWellness('');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ആരോഗ്യകരമായ ജീവിതം' : 'Wellness'}</h1>
      {rows.length === 0 ? <EmptyState icon="🌿" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((w) => (
            <Link key={w.slug} href={`/${locale}/wellness/${w.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
              <div className="text-2xl">{w.icon || '🌿'}</div>
              <h3 className="mt-1 font-semibold text-slate-900">{ml ? (w.title_ml || w.title_en) : w.title_en}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{w.body_en}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
