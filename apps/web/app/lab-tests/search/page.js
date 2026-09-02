import KSearch from '@/components/knowledge/KSearch';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Search Lab Tests' };
export default function Page() { return <div className="mx-auto max-w-2xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Search Lab Tests</h1><KSearch apiUrl="/api/lab-tests/search" titleKey="test_name" subKey="category" hrefBase="/lab-tests/" placeholder="HbA1c, Hemoglobin…" /></div>; }
