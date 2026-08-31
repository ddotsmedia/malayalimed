import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getFirstAid } from '@/lib/directories';
import { EMERGENCY } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const g = await getFirstAid(p.slug); return { title: g ? g.title_en : 'First aid' }; }

export default async function FirstAidDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const g = await getFirstAid(params.slug); if (!g) notFound();
  const steps = String((ml ? (g.steps_ml || g.steps_en) : g.steps_en) || '').split(/(?=\d+\.\s)/).map((s) => s.trim()).filter(Boolean);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">{ml ? (g.title_ml || g.title_en) : g.title_en}</h1>
      {g.call_help && <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-800">🚨 {ml ? 'അടിയന്തരം' : 'Call'} {EMERGENCY.national} / {EMERGENCY.ambulance}</div>}
      <ol className="space-y-2">
        {steps.map((s, i) => <li key={i} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">{s}</li>)}
      </ol>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
    </div>
  );
}
