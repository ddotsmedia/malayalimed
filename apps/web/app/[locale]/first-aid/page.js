import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listFirstAid } from '@/lib/directories';
import { EMERGENCY } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'First Aid' };

export default async function FirstAidPage(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listFirstAid();
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'പ്രഥമ ശുശ്രൂഷ' : 'First aid'}</h1>
      <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">🚨 {ml ? 'അടിയന്തരം' : 'Emergency'}: {EMERGENCY.national} / {ml ? 'ആംബുലൻസ്' : 'Ambulance'} {EMERGENCY.ambulance}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((g) => (
          <Link key={g.slug} href={`/${locale}/first-aid/${g.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-slate-900">{ml ? (g.title_ml || g.title_en) : g.title_en}</h3>{g.call_help && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{ml ? 'സഹായം വിളിക്കൂ' : 'Call help'}</span>}</div>
          </Link>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
    </div>
  );
}
