import { resolveLocale, t } from '@/lib/i18n';
import { listDental } from '@/lib/facilities';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import ClinicList from '@/components/facilities/ClinicList';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dental Clinics' };

export default async function DentalPage(props) {
  const params = await props.params; const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale);
  const rows = await listDental(sp.q || '');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{locale === 'ml' ? 'ഡെന്റൽ ക്ലിനിക്കുകൾ' : 'Dental clinics'}</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/dental`} defaultValue={sp.q || ''} /></div>
      {rows.length === 0 ? <EmptyState icon="🦷" message={t(locale, 'no_results')} /> : <ClinicList rows={rows} locale={locale} basePath={`/${locale}/dental`} icon="🦷" />}
    </div>
  );
}
