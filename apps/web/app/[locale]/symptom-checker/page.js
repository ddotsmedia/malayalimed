import { resolveLocale } from '@/lib/i18n';
import SymptomCheckerClient from './SymptomCheckerClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Symptom Checker' };

export default async function SymptomCheckerPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Symptom Checker</h1>
      <p className="text-sm text-gray-500">Select your symptoms for educational guidance. This is not a diagnosis.</p>
      <SymptomCheckerClient locale={locale} />
    </div>
  );
}
