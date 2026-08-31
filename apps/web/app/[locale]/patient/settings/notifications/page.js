import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import NotificationSettingsClient from './NotificationSettingsClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Notification Settings' };

export default async function NotificationSettingsPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/settings/notifications`);
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Reminder & Notification Settings</h1>
      <NotificationSettingsClient />
    </div>
  );
}
