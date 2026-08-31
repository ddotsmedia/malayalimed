import { resolveLocale } from '@/lib/i18n';
import ComparisonClient from './ComparisonClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Compare Doctors' };

export default async function ComparePage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  return <div className="space-y-4"><h1 className="text-xl font-bold text-gray-900">Compare Doctors</h1><ComparisonClient locale={locale} /></div>;
}
