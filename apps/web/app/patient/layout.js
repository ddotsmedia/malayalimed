import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Patient · MalayaliMed' };

export default async function PatientLayout({ children }) {
  if (!(await getSession())) redirect('/ml/login?next=/patient/devices');
  return <div className="mx-auto max-w-4xl px-4 py-6">{children}</div>;
}
