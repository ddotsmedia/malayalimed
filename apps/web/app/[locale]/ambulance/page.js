import { resolveLocale, t } from '@/lib/i18n';
import { listAmbulance } from '@/lib/facilities';
import { EMERGENCY } from '@/lib/constants';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Ambulance' };

export default async function AmbulancePage(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listAmbulance('');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ആംബുലൻസ്' : 'Ambulance'}</h1>
      <a href={`tel:${EMERGENCY.ambulance}`} className="block rounded-2xl border border-red-300 bg-red-50 p-4 text-center text-lg font-bold text-red-800">🚑 {ml ? 'സൗജന്യ ആംബുലൻസ്' : 'Free Ambulance'} — {EMERGENCY.ambulance}</a>
      {rows.length === 0 ? <EmptyState icon="🚑" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((a) => (
            <div key={a.slug} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between"><h3 className="font-semibold text-slate-900">{a.name}</h3><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] capitalize text-slate-600">{a.service_type}</span></div>
              <p className="text-xs text-slate-500">📍 {ml ? (a.district_ml || a.district_en) : a.district_en}</p>
              <a href={`tel:${a.phone}`} className="mt-1 inline-block text-sm font-semibold text-brand">📞 {a.phone}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
