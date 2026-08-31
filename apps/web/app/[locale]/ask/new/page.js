import { resolveLocale, t } from '@/lib/i18n';
import { listSpecialties } from '@/lib/reference';
import AskForm from './AskForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Ask a question' };

export default async function AskNew(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const specialties = await listSpecialties();
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'ചോദ്യം ചോദിക്കുക' : 'Ask a question'}</h1>
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{t(locale, 'disclaimer')}</div>
      <AskForm locale={locale} specialties={specialties} />
    </div>
  );
}
