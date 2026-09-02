import ConditionsClient from './ConditionsClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Conditions' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-gray-900">My Conditions</h1><ConditionsClient /></div>;
}
