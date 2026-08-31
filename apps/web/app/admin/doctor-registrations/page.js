import RegistrationsClient from './RegistrationsClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Doctor Registrations · Admin' };

export default function DoctorRegistrationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Doctor Registrations</h1>
      <RegistrationsClient />
    </div>
  );
}
