import DTxClient from './DTxClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Digital Therapeutics' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-gray-900">Digital Therapeutics Programs</h1><DTxClient /></div>;
}
