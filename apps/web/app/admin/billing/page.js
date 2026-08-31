import BillingClient from './BillingClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Billing · Admin' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Billing</h1><BillingClient /></div>;
}
