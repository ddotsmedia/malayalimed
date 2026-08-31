import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireHospital } from '@/lib/hospitalAuth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Hospital · MalayaliMed' };

export default async function HospitalLayout({ children }) {
  if (!(await requireHospital())) redirect('/ml');
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <span className="font-bold text-brand">Hospital Ops</span>
        <Link href="/hospital/beds" className="text-sm text-slate-500">🛏 Beds</Link>
        <a href="/api/auth/logout" className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">Logout</a>
      </header>
      <main className="mx-auto max-w-5xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
