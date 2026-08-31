import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getMedicine } from '@/lib/directories';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const m = await getMedicine(p.slug); return { title: m ? m.name : 'Medicine' }; }

export default async function MedicineDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale); const ml = locale === 'ml';
  const m = await getMedicine(params.slug); if (!m) notFound();
  const Sec = ({ h, b }) => b ? <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-2 text-lg font-bold text-slate-900">{h}</h2><p className="text-slate-700">{b}</p></section> : null;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-900">{m.name}</h1>
        <p className="text-sm text-slate-500">{m.generic_name} · {m.form} · {m.category}</p>
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${m.prescription_required ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{m.prescription_required ? (ml ? 'ഡോക്ടറുടെ കുറിപ്പടി വേണം' : 'Prescription required') : (ml ? 'ഓവർ-ദ-കൗണ്ടർ' : 'Over the counter')}</span>
      </header>
      <Sec h={ml ? 'ഉപയോഗങ്ങൾ' : 'Uses'} b={m.uses_en} />
      <Sec h={ml ? 'പാർശ്വഫലങ്ങൾ' : 'Side effects'} b={m.side_effects_en} />
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')} {ml ? 'ഡോക്ടറുടെ നിർദേശപ്രകാരം മാത്രം മരുന്ന് കഴിക്കുക.' : 'Take medicines only as directed by a doctor.'}</div>
    </div>
  );
}
