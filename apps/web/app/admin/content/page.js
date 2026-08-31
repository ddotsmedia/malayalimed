import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';
import { REGISTRY } from '@/lib/adminContent';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Content · Admin' };

export default async function ContentIndex() {
  if (!(await requireAdmin())) redirect('/ml');
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Manage content</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(REGISTRY).map(([key, def]) => (
          <Link key={key} href={`/admin/content/${key}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand">
            {def.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
