import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Minimally Invasive' };
export default function Page() { return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Minimally Invasive Procedures</h1><KList url="/api/procedures/minimally-invasive" titleKey="procedure_name" subKey="recovery_time" hrefBase="/procedures/" /></div>; }
