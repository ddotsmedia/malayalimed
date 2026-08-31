import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · MalayaliMed' };

const NAV = [
  ['/admin/dashboard', '📊 Dashboard'], ['/admin/users', '👥 Users'],
  ['/admin/doctors', '🩺 Doctors'], ['/admin/hospitals', '🏥 Hospitals'],
  ['/admin/appointments', '📅 Appointments'], ['/admin/analytics', '📈 Analytics'],
  ['/admin/reports', '📄 Reports'], ['/admin/settings', '⚙️ Settings']
];

export default async function AdminLayout({ children }) {
  if (!(await requireAdmin())) redirect('/ml');
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[220px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-slate-900 p-3 text-slate-300 lg:block">
        <div className="mb-4 flex items-center gap-2 px-2 py-2 font-black text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">M</span> Admin
        </div>
        <nav className="space-y-1 text-sm">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="block rounded-lg px-3 py-2 hover:bg-slate-800 hover:text-white">{label}</Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <span className="font-bold text-brand">MalayaliMed Admin</span>
          <nav className="ml-auto flex gap-3 overflow-x-auto text-xs">{NAV.map(([href, l]) => <Link key={href} href={href} className="whitespace-nowrap text-slate-500">{l}</Link>)}</nav>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
