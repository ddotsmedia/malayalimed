import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import MessageThread from '@/components/messaging/MessageThread';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Conversation' };

export default async function Page(props) {
  const { locale: l, peer } = await props.params;
  const locale = resolveLocale(l);
  if (!(await getSession())) redirect(`/${locale}/login?next=/${locale}/patient/messages`);
  return <div className="mx-auto max-w-2xl space-y-3"><a href={`/${locale}/patient/messages`} className="text-sm text-brand">← Inbox</a><MessageThread peer={peer} locale={locale} /></div>;
}
