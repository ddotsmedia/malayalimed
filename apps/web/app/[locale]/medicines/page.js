import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listMedicines } from '@/lib/directories';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Medicines' };

export default async function MedicinesPage(props) {
  const params = await props.params; const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const rows = await listMedicines(sp.q || '');
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'മരുന്നുകൾ' : 'Medicines'}</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><SearchBar locale={locale} action={`/${locale}/medicines`} defaultValue={sp.q || ''} /></div>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      {rows.length === 0 ? <EmptyState icon="💊" message={t(locale, 'no_results')} /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((m) => (
            <Link key={m.slug} href={`/${locale}/medicines/${m.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm">
              <h3 className="font-semibold text-slate-900">{m.name}</h3>
              <p className="text-xs text-slate-500">{m.generic_name} · {m.form} · {m.category}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${m.prescription_required ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{m.prescription_required ? (ml ? 'കുറിപ്പടി വേണം' : 'Rx only') : (ml ? 'ഒടിസി' : 'OTC')}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
