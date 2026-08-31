import { resolveLocale, t } from '@/lib/i18n';
import { listPharmacies } from '@/lib/facilities';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Pharmacies' };

export default async function PharmaciesPage(props) {
  const params = await props.params; const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listPharmacies(sp.q || '');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ഫാർമസികൾ' : 'Pharmacies'}</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/pharmacies`} defaultValue={sp.q || ''} /></div>
      {rows.length === 0 ? <EmptyState icon="💊" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((p) => (
            <div key={p.slug} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between"><h3 className="font-semibold text-slate-900">{p.name}</h3>{p.is_24x7 && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">24×7</span>}</div>
              <p className="text-xs text-slate-500">📍 {ml ? (p.district_ml || p.district_en) : p.district_en}{p.address ? ` · ${p.address}` : ''}</p>
              <div className="mt-1 flex gap-3 text-sm">{p.phone && <a href={`tel:${p.phone}`} className="font-semibold text-brand">📞 {p.phone}</a>}{p.home_delivery && <span className="text-xs text-slate-500">🚚 {ml ? 'ഹോം ഡെലിവറി' : 'Home delivery'}</span>}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
