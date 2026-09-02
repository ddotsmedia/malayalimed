import LabTestDetail from '@/components/knowledge/LabTestDetail';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lab Test' };
export default function Page(props) { return <div className="mx-auto max-w-3xl px-4 py-6"><LabTestDetail params={props.params} /></div>; }
