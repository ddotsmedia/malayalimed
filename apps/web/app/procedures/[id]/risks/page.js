import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Risks' };
export default async function Page(props) {
  const { id } = await props.params;
  return <div className="mx-auto max-w-2xl space-y-4 px-4 py-6"><a href={`/procedures/${id}`} className="text-sm text-brand">← Procedure</a><h1 className="text-xl font-bold text-gray-900">Risks & Complications</h1><KList url={`/api/procedures/${id}/risks`} titleKey="risk" subKey="severity" empty="Risk profile is discussed during your pre-procedure consultation." /></div>;
}
