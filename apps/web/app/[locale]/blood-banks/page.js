import { resolveLocale, t } from '@/lib/i18n';
import { listBloodBanks } from '@/lib/directories';
import { EMERGENCY } from '@/lib/constants';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blood Banks' };

export default async function BloodBanksPage(props) {
  const params = await props.params; const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listBloodBanks(sp.q || '');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ബ്ലഡ് ബാങ്കുകൾ' : 'Blood banks'}</h1>
      <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">🩸 {ml ? 'അടിയന്തര രക്തം ആവശ്യമെങ്കിൽ' : 'For emergency blood needs'}: {EMERGENCY.ambulance} / {EMERGENCY.national}</div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/blood-banks`} defaultValue={sp.q || ''} /></div>
      {rows.length === 0 ? <EmptyState icon="🩸" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((b) => (
            <div key={b.slug} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{b.name}</h3>
                {b.is_24x7 && <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">24×7</span>}
              </div>
              <p className="text-xs text-slate-500">📍 {ml ? (b.district_ml || b.district_en) : b.district_en}{b.address ? ` · ${b.address}` : ''}</p>
              {b.phone && <a href={`tel:${b.phone}`} className="text-sm font-semibold text-brand">📞 {b.phone}</a>}
              {Array.isArray(b.available_types) && b.available_types.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">{b.available_types.map((tp) => <span key={tp} className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-700">{tp}</span>)}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
