import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getWellness } from '@/lib/directories';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const w = await getWellness(p.slug); return { title: w ? w.title_en : 'Wellness' }; }

export default async function WellnessDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const w = await getWellness(params.slug); if (!w) notFound();
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="text-3xl">{w.icon || '🌿'}</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{ml ? (w.title_ml || w.title_en) : w.title_en}</h1>
        {w.category && <p className="text-brand">{w.category}</p>}
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="leading-relaxed text-slate-700">{ml ? (w.body_ml || w.body_en) : w.body_en}</p></div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
    </div>
  );
}
