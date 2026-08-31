import { resolveLocale } from '@/lib/i18n';
import DoctorSearchClient from './DoctorSearchClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Find a Doctor' };

export default async function DoctorSearchPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  return <div className="space-y-4"><h1 className="text-xl font-bold text-gray-900">Advanced Doctor Search</h1><DoctorSearchClient locale={locale} /></div>;
}
