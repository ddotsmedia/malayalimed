import MedicineDetail from '@/components/knowledge/MedicineDetail';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Medicine' };
export default function Page(props) { return <div className="mx-auto max-w-3xl px-4 py-6"><MedicineDetail params={props.params} /></div>; }
