import DrugChecker from './DrugChecker';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Drug Interactions' };
export default function Page(props) {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Drug Interaction Checker</h1><DrugChecker params={props.params} /></div>;
}
