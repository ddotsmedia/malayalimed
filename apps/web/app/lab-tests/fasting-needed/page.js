import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Fasting Tests' };
export default function Page() { return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Tests Requiring Fasting</h1><KList url="/api/lab-tests/at-home?mode=fasting" titleKey="test_name" subKey="preparation_needed" hrefBase="/lab-tests/" /></div>; }
