import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Compare Tests' };
export default function Page() { return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Compare Lab Tests</h1><p className="text-sm text-gray-500">Browse tests side by side — open two in new tabs to compare ranges and cost.</p><KList url="/api/lab-tests" titleKey="test_name" subKey="category" hrefBase="/lab-tests/" costKey="cost" /></div>; }
