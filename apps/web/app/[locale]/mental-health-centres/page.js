import { resolveLocale, t } from '@/lib/i18n';
import { listMental } from '@/lib/facilities';
import { EMERGENCY } from '@/lib/constants';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import ClinicList from '@/components/facilities/ClinicList';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mental Health Centres' };

export default async function MentalPage(props) {
  const params = await props.params; const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listMental(sp.q || '');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'മാനസികാരോഗ്യ കേന്ദ്രങ്ങൾ' : 'Mental health centres'}</h1>
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-3 text-sm font-semibold text-indigo-800">🧘 {ml ? 'പ്രതിസന്ധി സഹായം' : 'Crisis support'}: 1056 · {EMERGENCY.national}</div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/mental-health-centres`} defaultValue={sp.q || ''} /></div>
      {rows.length === 0 ? <EmptyState icon="🧘" message={t(locale, 'no_results')} /> : <ClinicList rows={rows} locale={locale} basePath={`/${locale}/mental-health-centres`} icon="🧘" />}
    </div>
  );
}
