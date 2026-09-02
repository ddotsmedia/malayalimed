import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Alternatives' };
export default async function Page(props) {
  const { id } = await props.params;
  return <div className="mx-auto max-w-3xl space-y-4 px-4 py-6"><a href={`/medicines/${id}`} className="text-sm text-brand">← Medicine</a><h1 className="text-xl font-bold text-gray-900">Alternatives</h1><KList url={`/api/medicines/${id}/alternatives`} titleKey="generic_name" subKey="reason" hrefBase="/medicines/" empty="No alternatives recorded. Ask your pharmacist about equivalents." /></div>;
}
