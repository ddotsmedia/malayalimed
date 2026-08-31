import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import { rewards, rewardTotal } from '@/lib/referrals';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Referral Rewards' };
export default async function Page(props) {
  const { locale: l } = await props.params;
  const locale = resolveLocale(l);
  const s = await getSession();
  if (!s) redirect(`/${locale}/login?next=/${locale}/patient/referral-rewards`);
  const [list, total] = await Promise.all([rewards(s.userId), rewardTotal(s.userId)]);
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Referral Rewards</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center"><p className="text-3xl font-extrabold text-brand">{total}</p><p className="text-xs text-gray-500">reward points</p></div>
      {list.length === 0 ? <p className="text-sm text-gray-400">No rewards yet — invite friends to earn points.</p> : (
        <div className="space-y-1">{list.map((r) => <div key={r.id} className="flex justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm"><span>{r.reason}</span><span className="font-semibold text-brand">+{r.reward_points}</span></div>)}</div>
      )}
    </div>
  );
}
