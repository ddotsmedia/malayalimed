import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';
import { resourceDef, listContent } from '@/lib/adminContent';
import ContentManager from '../ContentManager';

export const dynamic = 'force-dynamic';

export default async function ContentResource(props) {
  if (!(await requireAdmin())) redirect('/ml');
  const params = await props.params;
  const def = resourceDef(params.resource);
  if (!def) notFound();
  const rows = await listContent(params.resource);
  return (
    <div className="space-y-4">
      <nav className="text-xs text-slate-400"><Link href="/admin/content" className="hover:text-brand">Content</Link> › {def.label}</nav>
      <h1 className="text-xl font-bold text-slate-900">{def.label} <span className="text-sm font-normal text-slate-400">({rows.length})</span></h1>
      <ContentManager resource={params.resource} fields={def.fields} listCols={def.list} rows={rows} />
    </div>
  );
}
