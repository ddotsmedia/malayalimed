import ProcedureDetail from '@/components/knowledge/ProcedureDetail';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Procedure' };
export default function Page(props) { return <div className="mx-auto max-w-3xl px-4 py-6"><ProcedureDetail params={props.params} /></div>; }
