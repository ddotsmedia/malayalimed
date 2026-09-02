import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireDoctor } from '@/lib/doctorAuth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Doctor · MalayaliMed' };

const NAV = [['/doctor/dashboard', '📊 Dashboard'], ['/doctor/patients', '👥 Patients'], ['/doctor/patient-messages', '💬 Messages'], ['/doctor/encounters/create', '📝 New Encounter'], ['/doctor/scribe-settings', '🎙️ AI Scribe'], ['/doctor/prior-auth', '📋 Prior Auth'], ['/doctor/profile/certifications', '🎓 Certifications']];

export default async function DoctorLayout({ children }) {
  if (!(await requireDoctor())) redirect('/ml');
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[200px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white p-3 lg:block">
        <div className="mb-4 px-2 py-2 font-black text-brand">Doctor</div>
        <nav className="space-y-1 text-sm">{NAV.map(([h, l]) => <Link key={h} href={h} className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">{l}</Link>)}</nav>
      </aside>
      <div className="flex flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <span className="font-bold text-brand">Doctor Portal</span>
          <nav className="ml-auto flex gap-3 overflow-x-auto text-xs lg:hidden">{NAV.map(([h, l]) => <Link key={h} href={h} className="whitespace-nowrap text-slate-500">{l}</Link>)}</nav>
          <a href="/api/auth/logout" className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 lg:ml-0">Logout</a>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
