import CampsClient from './CampsClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health Camps' };
export default function Page() {
  return <div className="mx-auto max-w-2xl space-y-4"><h1 className="text-xl font-bold text-gray-900">Free Health Camps</h1><CampsClient /></div>;
}
