import ConditionGuide from '@/components/knowledge/ConditionGuide';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Condition Guide' };
export default function Page(props) { return <div className="mx-auto max-w-3xl px-4 py-6"><ConditionGuide params={props.params} /></div>; }
