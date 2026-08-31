import { listDoctors } from '@/lib/admin';
import DoctorAdminTable from './DoctorAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminDoctors(props) {
  const sp = (await props.searchParams) || {};
  const status = ['pending', 'verified', 'rejected', 'all'].includes(sp.status) ? sp.status : 'pending';
  const doctors = await listDoctors(status);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Doctor verification</h1>
      <nav className="flex gap-2">
        {['pending', 'verified', 'rejected', 'all'].map((s) => (
          <a key={s} href={`/admin/doctors?status=${s}`} className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${s === status ? 'bg-brand text-white' : 'border border-slate-300 bg-white text-slate-600'}`}>{s}</a>
        ))}
      </nav>
      <DoctorAdminTable doctors={doctors} status={status} />
    </div>
  );
}
