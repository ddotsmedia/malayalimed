import VitalsTimeline from './VitalsTimeline';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Vitals' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-gray-900">Vitals Timeline</h1><VitalsTimeline /></div>;
}
