import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';
import AdminProviders from './providers';
import NotificationBell from '@/components/admin/NotificationBell';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · MalayaliMed' };

const NAV = [
  ['/admin/dashboard', '📊 Dashboard'], ['/admin/users', '👥 Users'],
  ['/admin/doctors', '🩺 Doctors'], ['/admin/hospitals', '🏥 Hospitals'],
  ['/admin/appointments', '📅 Appointments'], ['/admin/reviews', '⭐ Reviews'],
  ['/admin/doctor-registrations', '📝 Registrations'], ['/admin/bulk-import', '⬆️ Bulk Import'],
  ['/admin/content', '📚 Content'], ['/admin/analytics', '📈 Analytics'],
  ['/admin/audit-logs', '🧾 Audit Logs'], ['/admin/reports', '📄 Reports'], ['/admin/settings', '⚙️ Settings'],
];

export default async function AdminLayout({ children }) {
  if (!(await requireAdmin())) redirect('/ml');
  return (
    <AdminProviders>
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
          <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
            <span className="font-bold text-brand lg:hidden">MalayaliMed Admin</span>
            <nav className="ml-auto flex items-center gap-3 overflow-x-auto text-xs lg:hidden">{NAV.map(([href, l]) => <Link key={href} href={href} className="whitespace-nowrap text-slate-500">{l}</Link>)}</nav>
            <div className="ml-auto hidden lg:block" />
            <NotificationBell />
            <a href="/api/auth/logout" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Logout</a>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminProviders>
  );
}
