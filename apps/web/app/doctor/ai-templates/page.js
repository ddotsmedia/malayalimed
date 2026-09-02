import TemplateBuilder from './TemplateBuilder';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'AI Templates' };
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Note Templates</h1><TemplateBuilder /></div>;
}
