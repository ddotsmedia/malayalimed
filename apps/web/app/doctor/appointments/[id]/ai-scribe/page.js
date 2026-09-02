import ScribeSession from './ScribeSession';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'AI Scribe' };
export default function Page(props) {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">AI Scribe Session</h1><ScribeSession params={props.params} /></div>;
}
