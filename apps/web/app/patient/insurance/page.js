import InsuranceClient from './InsuranceClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Insurance' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-gray-900">Insurance</h1><InsuranceClient /></div>;
}
