import LabOrdersClient from './LabOrdersClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lab Orders · Admin' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Lab Orders</h1><LabOrdersClient /></div>;
}
