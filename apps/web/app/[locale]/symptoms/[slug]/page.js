import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getSymptom } from '@/lib/directories';
import { EMERGENCY } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const s = await getSymptom(p.slug); return { title: s ? s.name_en : 'Symptom' }; }

export default async function SymptomDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const s = await getSymptom(params.slug); if (!s) notFound();
  const emergency = s.urgency === 'emergency' || s.urgency === 'urgent';
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-900">{ml ? (s.name_ml || s.name_en) : s.name_en}</h1>
      </header>
      {emergency && <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-800">🚨 {ml ? 'അടിയന്തരം' : 'Emergency'} — {EMERGENCY.national} / {EMERGENCY.ambulance}</div>}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-lg font-bold text-slate-900">{ml ? 'ഉപദേശം' : 'What to do'}</h2>
        <p className="text-slate-700">{ml ? (s.advice_ml || s.advice_en) : s.advice_en}</p>
      </section>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      <a href={`/${locale}/doctors`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{t(locale, 'find_doctor')} →</a>
    </div>
  );
}
