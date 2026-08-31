import { resolveLocale } from '@/lib/i18n';
import CommunityFeed from './CommunityFeed';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Community' };
export default async function Page(props) {
  const { locale: l } = await props.params;
  const locale = resolveLocale(l);
  return <div className="mx-auto max-w-2xl space-y-4"><h1 className="text-xl font-bold text-gray-900">Community</h1><CommunityFeed locale={locale} /></div>;
}
