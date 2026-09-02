import PriorAuthClient from './PriorAuthClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Prior Authorization' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Prior Authorization</h1><p className="text-sm text-slate-500">Note: no live payer connection — requests are recorded and tracked locally.</p><PriorAuthClient /></div>;
}
