import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Medicine Forms' };
export default function Page() {
  return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Browse by Form</h1><KList url="/api/medicines/categories" titleKey="form" subKey="n" /></div>;
}
