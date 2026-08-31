import AuditLogView from './AuditLogView';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Audit Logs · Admin' };

export default function AuditLogsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Audit Logs</h1>
      <p className="text-sm text-slate-500">Immutable record of admin actions (append-only).</p>
      <AuditLogView />
    </div>
  );
}
