import { listUsers } from '@/lib/admin';
import AdminTable from '@/components/admin/AdminTable';
import { fmtDate } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function AdminUsers() {
  const users = await listUsers();
  const columns = [
    { key: 'full_name', label: 'Name', render: (r) => r.full_name || '—' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'is_verified', label: 'Verified', render: (r) => (r.is_verified ? '✓' : '—') },
    { key: 'created_at', label: 'Joined', value: (r) => fmtDate(r.created_at), render: (r) => fmtDate(r.created_at) }
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Users</h1>
      <AdminTable rows={users} columns={columns} searchKeys={['full_name', 'email', 'role']} exportName="users" empty="No users." />
    </div>
  );
}
