import CarePlanClient from './CarePlanClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Care Plan' };
export default function Page(props) {
  return <div className="space-y-4"><CarePlanClient params={props.params} /></div>;
}
