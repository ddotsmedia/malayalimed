import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Trending Tests' };
export default function Page() { return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Trending Lab Tests</h1><KList url="/api/lab-tests/trending" titleKey="test_name" subKey="category" hrefBase="/lab-tests/" costKey="cost" /></div>; }
