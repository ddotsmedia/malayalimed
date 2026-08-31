import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getMental } from '@/lib/facilities';
import ClinicDetail from '@/components/facilities/ClinicDetail';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const f = await getMental(p.slug); return { title: f ? f.name_en : 'Mental health centre' }; }

export default async function MentalDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const f = await getMental(params.slug); if (!f) notFound();
  const extra = f.crisis_phone ? <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-semibold text-indigo-800">☎️ {ml ? 'ഹെൽപ്‌ലൈൻ' : 'Helpline'}: <a href={`tel:${f.crisis_phone}`} className="underline">{f.crisis_phone}</a></div> : null;
  return <ClinicDetail clinic={f} locale={locale} icon="🧘" disclaimer={t(locale, 'disclaimer')} extra={extra} />;
}
