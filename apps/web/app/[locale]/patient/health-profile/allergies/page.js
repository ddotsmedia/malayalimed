import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import AllergiesClient from './AllergiesClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Allergies' };

export default async function AllergiesPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/health-profile/allergies`);
  return <div className="mx-auto max-w-2xl space-y-4"><h1 className="text-xl font-bold text-gray-900">Allergies</h1><AllergiesClient /></div>;
}
